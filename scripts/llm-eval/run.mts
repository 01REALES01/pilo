/**
 * L1.0 - how well a model classifies the chat messages the strict parser
 * rejects, measured before anything is built on it (P6: n, method, baseline).
 *
 *   npx tsx scripts/llm-eval/run.mts [model ...]
 *
 * Sends only the authored phrases in cases.json - no user data. Sequential on
 * purpose: latency is one of the things being measured, and parallel calls
 * would measure the queue instead.
 */
import { readFileSync } from 'node:fs';

import { buildIntentSystemPrompt, INTENT_JSON_SCHEMA, validateIntent, type ChatIntent } from '../../src/core/chat-intent';
import { parseQuickEntry } from '../../src/core/quick-entry';
import { generateJson } from '../../src/infrastructure/ai/gemini';

process.loadEnvFile(new URL('../../.env.local', import.meta.url).pathname);

interface Expected {
  readonly kind: ChatIntent['kind'];
  readonly date?: string;
  readonly monthOffset?: number;
  readonly category?: string | null;
  readonly amountMinor?: string;
  readonly merchant?: string;
  readonly type?: 'expense' | 'income';
  readonly topic?: string;
  /** Asks for something the app has no tool for yet; 'unclear' is also fine. */
  readonly lenient?: boolean;
}

const { today, cases } = JSON.parse(
  readFileSync(new URL('./cases.json', import.meta.url), 'utf8'),
) as { today: string; cases: { text: string; expect: Expected }[] };

const models = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

/** Field by field, so a miss says what was missed. */
function score(intent: ChatIntent, e: Expected): string[] {
  if (e.lenient && (intent.kind === 'unclear' || intent.kind === e.kind)) return [];
  if (intent.kind !== e.kind) return [`kind ${intent.kind} != ${e.kind}`];
  const misses: string[] = [];
  if (intent.kind === 'record_spend') {
    if (e.amountMinor && intent.amountMinor !== BigInt(e.amountMinor)) misses.push(`amount ${intent.amountMinor}`);
    if (e.date && intent.date !== e.date) misses.push(`date ${intent.date}`);
    if (e.type && intent.type !== e.type) misses.push(`type ${intent.type}`);
    if (e.merchant && !intent.merchant.toLowerCase().includes(e.merchant.toLowerCase())) {
      misses.push(`merchant "${intent.merchant}"`);
    }
  }
  if (intent.kind === 'spending_on_day' && e.date && intent.date !== e.date) misses.push(`date ${intent.date}`);
  if (intent.kind === 'spending_in_month') {
    if (e.monthOffset !== undefined && intent.monthOffset !== e.monthOffset) misses.push(`offset ${intent.monthOffset}`);
    if (e.category !== undefined && (intent.category?.toLowerCase() ?? null) !== e.category) {
      misses.push(`category ${intent.category}`);
    }
  }
  if (intent.kind === 'unsupported' && e.topic && intent.topic !== e.topic) misses.push(`topic ${intent.topic}`);
  return misses;
}

const pct = (n: number, d: number) => `${((100 * n) / d).toFixed(0)}%`;
const quantile = (xs: number[], q: number) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))] ?? 0;
};

const parserTakes = cases.filter((c) => parseQuickEntry(c.text, 'COP').ok);
if (parserTakes.length) {
  console.log('Note - the parser already handles these, the model would never see them:');
  for (const c of parserTakes) console.log(`  "${c.text}"`);
}
const evaluated = cases.filter((c) => !parseQuickEntry(c.text, 'COP').ok);
const system = buildIntentSystemPrompt(today);

for (const model of models) {
  const latencies: number[] = [];
  let promptTokens = 0;
  let outputTokens = 0;
  let correct = 0;
  let failedCalls = 0;
  const byKind = new Map<string, { n: number; ok: number }>();
  const misses: string[] = [];

  for (const c of evaluated) {
    const result = await generateJson({ system, prompt: c.text, schema: INTENT_JSON_SCHEMA, model, timeoutMs: 30_000 });
    const bucket = byKind.get(c.expect.kind) ?? { n: 0, ok: 0 };
    bucket.n++;
    byKind.set(c.expect.kind, bucket);
    if (!result.ok) {
      failedCalls++;
      misses.push(`  ✗ "${c.text}" - call failed: ${result.reason} ${result.detail ?? ''}`);
      continue;
    }
    latencies.push(result.latencyMs);
    promptTokens += result.usage.promptTokens;
    outputTokens += result.usage.outputTokens;
    const intent = validateIntent(result.json, today, 'COP');
    const wrong = score(intent, c.expect);
    if (wrong.length === 0) {
      correct++;
      bucket.ok++;
    } else {
      misses.push(`  ✗ "${c.text}" - ${wrong.join(', ')}   raw=${JSON.stringify(result.json)}`);
    }
  }

  const calls = evaluated.length - failedCalls;
  console.log(`\n=== ${model} (n=${evaluated.length}, today=${today}) ===`);
  console.log(`correct: ${correct}/${evaluated.length} (${pct(correct, evaluated.length)}), failed calls: ${failedCalls}`);
  for (const [kind, b] of byKind) console.log(`  ${kind.padEnd(18)} ${b.ok}/${b.n}`);
  console.log(`latency ms: p50 ${quantile(latencies, 0.5)}, p95 ${quantile(latencies, 0.95)}, max ${Math.max(...latencies)}`);
  console.log(`tokens per call: ${Math.round(promptTokens / Math.max(1, calls))} in, ${Math.round(outputTokens / Math.max(1, calls))} out`);
  if (misses.length) console.log(misses.join('\n'));
}
