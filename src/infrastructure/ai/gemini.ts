/**
 * Gemini over REST - the one adapter for text (L1) and, later, statements (F2).
 *
 * No SDK: one endpoint, one request shape, and a dependency fewer to keep in
 * step with Zod v4. Paid tier only (CLAUDE.md): the key's project has billing
 * on, so what users write is not used to train Google's models.
 *
 * It returns a result instead of throwing. Every caller has a fallback - the
 * bot asks for the short format - and a timeout or an outage is an ordinary
 * day for a network call, not an exception.
 */

export interface GeminiJsonRequest {
  readonly system: string;
  readonly prompt: string;
  /** JSON Schema the model's answer must follow (Gemini structured output). */
  readonly schema: Record<string, unknown>;
  readonly model?: string | undefined;
  /** Measured 0.8-35 s on the standard tier; the chat cannot wait for the tail. */
  readonly timeoutMs?: number | undefined;
}

export interface GeminiUsage {
  readonly promptTokens: number;
  readonly outputTokens: number;
}

export type GeminiJsonResult =
  | {
      readonly ok: true;
      readonly json: unknown;
      readonly latencyMs: number;
      readonly usage: GeminiUsage;
      readonly model: string;
    }
  | {
      readonly ok: false;
      readonly reason: 'not_configured' | 'timeout' | 'http_error' | 'invalid_response';
      readonly latencyMs: number;
      readonly detail?: string;
    };

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_TIMEOUT_MS = 10_000;

export async function generateJson(request: GeminiJsonRequest): Promise<GeminiJsonResult> {
  const started = Date.now();
  const key = process.env.GEMINI_API_KEY;
  const model = request.model ?? process.env.GEMINI_MODEL;
  if (!key || !model) {
    return { ok: false, reason: 'not_configured', latencyMs: 0 };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), request.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: 'POST',
      // The key in a header, not in the URL: URLs end up in logs.
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.system }] },
        contents: [{ role: 'user', parts: [{ text: request.prompt }] }],
        generationConfig: {
          // Classification, not prose: the most likely answer every time.
          temperature: 0,
          responseMimeType: 'application/json',
          responseJsonSchema: request.schema,
        },
      }),
    });
    const latencyMs = Date.now() - started;

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      return { ok: false, reason: 'http_error', latencyMs, detail: `${response.status} ${body.slice(0, 300)}` };
    }

    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return { ok: false, reason: 'invalid_response', latencyMs, detail: 'no text in candidate' };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { ok: false, reason: 'invalid_response', latencyMs, detail: 'not JSON' };
    }

    return {
      ok: true,
      json,
      latencyMs,
      model,
      usage: {
        promptTokens: payload.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: payload.usageMetadata?.candidatesTokenCount ?? 0,
      },
    };
  } catch (error) {
    const latencyMs = Date.now() - started;
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, reason: 'timeout', latencyMs };
    }
    return { ok: false, reason: 'http_error', latencyMs, detail: String(error).slice(0, 300) };
  } finally {
    clearTimeout(timer);
  }
}
