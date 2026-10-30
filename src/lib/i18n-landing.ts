/**
 * Copy of the public landing page: its own catalog, with its own lookup.
 *
 * Not spread into DICTIONARY on purpose. `t()` looks keys up by name, so the
 * whole of DICTIONARY ships with every client component that imports i18n.ts -
 * and <Money> does, so that is the dashboard too. Spread in, the landing's
 * 220-odd strings in two languages (~10 KB gzipped) would ride along on every
 * dashboard screen that never shows them (P7). Kept apart, only the landing
 * imports them.
 *
 * It keeps the catalog's guarantees: `satisfies` below makes a key missing from
 * the English half a type error, and LandingKey makes a mistyped key one.
 *
 * Sentences with inline markup (a <strong>, a <br />, a highlighted <span>)
 * are split into one key per text run; the markup stays in JSX so no value
 * ever carries HTML. The spaces at each join live in JSX too, so a value never
 * starts or ends with one.
 */

import { DEFAULT_LOCALE, type Locale } from './i18n';

export const LANDING_ES = {
  // Metadata and JSON-LD (app/page.tsx)
  landing_meta_title: 'Pilo — Tus gastos se registran solos',
  landing_meta_description:
    'Pagas como siempre y Pilo anota el gasto, lo clasifica y te dice cómo vas. Sin abrir ninguna pantalla y sin escribir montos. Gratis, sin tarjeta.',
  landing_meta_og_image_alt: 'Pilo',

  // Calls to action, shared by every section
  landing_cta_sign_up: 'Crear cuenta',
  landing_cta_sign_up_email: 'Crear cuenta con tu correo',

  // Top bar, mobile dock and drawer
  landing_nav_how_it_works: 'Cómo funciona',
  landing_nav_banks: 'Tus bancos',
  landing_nav_privacy: 'Privacidad',
  landing_nav_faq: 'Preguntas',
  landing_nav_main_label: 'Navegación principal',
  landing_nav_mobile_dock_label: 'Navegación móvil inferior',
  landing_nav_menu_close_label: 'Cerrar menú',
  landing_nav_menu_open_label: 'Abrir menú de navegación',
  landing_nav_menu_close: 'Cerrar',
  landing_nav_menu_open: 'Menú',
  landing_nav_drawer_title: 'Navegación',
  landing_nav_drawer_close_label: 'Cerrar navegación',
  landing_nav_mobile_label: 'Navegación móvil',
  landing_nav_trust_no_bank_key: 'Sin la clave de tu banco',
  landing_nav_trust_no_ads: 'Sin publicidad',

  // 01 — Hero
  landing_hero_section_label: '01 Enter',
  landing_hero_flank_left: 'YOUR',
  landing_hero_flank_right: 'MONEY',
  landing_hero_title: 'Tus gastos se registran solos.',
  landing_hero_subtitle:
    'Pagas como siempre — tarjeta, Apple Pay, efectivo — y Pilo los anota, los clasifica y te dice cómo vas. Sin abrir ninguna pantalla, sin escribir un solo monto.',
  landing_hero_fact_free: 'Gratis, sin tarjeta',
  landing_hero_fact_code: 'Un código al correo · un minuto',
  landing_hero_fact_no_bank_key: 'Nunca pedimos tu clave del banco',
  landing_hero_caveat:
    'La captura automática de compras con tarjeta necesita un iPhone. El efectivo, las transferencias y los QR entran por Telegram o a mano, desde cualquier teléfono.',

  // 02 — Observe
  landing_observe_section_label: '02 Observe',
  landing_observe_title_lead: 'Tu dinero tiene un',
  landing_observe_title_accent: 'ritmo propio.',
  landing_observe_caption:
    'Pilo observa ese ritmo: agrupa tus gastos por periodo y te muestra cuándo se aceleran, antes de que el mes cierre.',

  // 03 — Understand. The statement is split on spaces for the word reveal.
  landing_understand_section_label: '03 Understand',
  landing_understand_statement: 'El dinero no es estático. Tu claridad tampoco.',
  landing_understand_subtitle:
    'Pilo aprende tus comercios: la segunda vez, ya no pregunta. Una interfaz pensada para darte dirección, no culpa.',

  // 04 — Trust
  landing_trust_section_label: '04 Trust',
  landing_trust_title_lead: 'Comprende exactamente',
  landing_trust_title_accent: 'dónde estás.',
  landing_trust_subtitle:
    'Sin pantallas saturadas de números. Solo cuánto llevas este mes, sin tener que buscarlo.',

  // Showcase — section hero
  landing_showcase_section_label: 'Cómo funciona Pilo',
  landing_showcase_title_lead: 'Registrar gastos a mano',
  landing_showcase_title_accent: 'casi siempre se abandona.',
  landing_showcase_subtitle_lead:
    'Las apps tradicionales te exigen abrir una pantalla decenas de veces al mes para anotar cada café. A los pocos días da pereza y el balance no cuadra. Pilo fue diseñado para que registrar tus gastos cueste lo más cerca de',
  landing_showcase_subtitle_strong: 'cero esfuerzo posible',
  landing_showcase_subtitle_tail: '.',

  // Showcase — the two-column contrast. Both lists must keep the same length.
  landing_shift_manual_title: 'Hasta hoy: anotar cada compra a mano',
  landing_shift_manual_step_1: 'Terminas de pagar y vuelves a sacar el celular',
  landing_shift_manual_step_2: 'Desbloqueas y buscas la app entre las demás',
  landing_shift_manual_step_3: 'Esperas a que cargue y pulsas «+»',
  landing_shift_manual_step_4: 'Escribes el monto a mano, dígito por dígito',
  landing_shift_manual_step_5: 'Eliges la cuenta o la tarjeta con que pagaste',
  landing_shift_manual_step_6: 'Buscas la categoría en una lista larga',
  landing_shift_manual_step_7: 'Guardas, y repites decenas de veces al mes',
  landing_shift_manual_step_8: 'A los pocos días lo dejas, y el mes ya no cuadra',
  landing_shift_pilo_title: 'Con Pilo: lo mismo, sin que hagas nada',
  landing_shift_pilo_step_1: 'Pagas normal, con tu tarjeta o con Apple Pay',
  landing_shift_pilo_step_2: 'Un atajo en tu iPhone lo registra en segundo plano',
  landing_shift_pilo_step_3: 'El motor de reglas reconoce tus comercios de siempre',
  landing_shift_pilo_step_4: 'Solo te pregunta la categoría cuando de verdad duda',
  landing_shift_pilo_step_5: 'Respondes con dos toques en Telegram',
  landing_shift_pilo_step_6: 'El efectivo y los QR entran por un mensaje de Telegram',
  landing_shift_pilo_step_7: 'Escribes /hoy o /mes y ves cómo vas',
  landing_shift_pilo_step_8: 'Nunca abriste un formulario, y el mes cuadra',

  // Showcase — the facts strip
  landing_facts_steps_value: '8→0',
  landing_facts_steps_label: 'pasos por gasto',
  landing_facts_steps_note: 'Los ocho de arriba desaparecen. No quedan dos: quedan cero',
  landing_facts_always_value: '24/7',
  landing_facts_always_label: 'capturando',
  landing_facts_always_note: 'Con el teléfono bloqueado y en el bolsillo',
  landing_facts_export_value: '100%',
  landing_facts_export_label: 'tuyo y exportable',
  landing_facts_export_note: 'Todo tu historial en CSV, cuando quieras, sin pedir permiso',
  landing_facts_free_value: '$0',
  landing_facts_free_label: 'para siempre gratis',
  landing_facts_free_note: 'Sin tarjeta, sin publicidad, sin vender tus datos',

  // Showcase — the phone banner and its live mockup
  landing_phone_title: 'Diseñada para vivir en reposo.',
  landing_phone_subtitle:
    'Con la estética de un reloj de lujo y la precisión de un libro contable. Pulsa el botón para simular una compra y ver cómo Pilo reacciona en tiempo real.',
  landing_phone_stat_screens: 'Pantallas que abrir',
  landing_phone_stat_forms: 'Formularios manuales',
  landing_phone_stat_encrypted_value: 'Cifrado',
  landing_phone_stat_encrypted_label: 'En reposo y en tránsito',
  landing_phone_greeting: 'Hola, Camila',
  landing_phone_pace_label: 'Ritmo de gasto ·',
  landing_phone_pace_unit: '/ día',
  landing_phone_auto_badge: 'Auto',
  landing_phone_ledger_time_ago: 'hace 2h',
  landing_phone_sim_time_now: 'hace segundos',
  landing_phone_sim_cat_cafe: 'Cafetería',
  landing_phone_sim_cat_grocery: 'Supermercado',
  landing_phone_sim_cat_transport: 'Transporte',
  landing_phone_sim_cat_health: 'Salud',
  landing_phone_sim_button: 'Simular compra con Apple Pay',
  landing_phone_toast_idle: 'Toca el botón para registrar un pago en vivo',
  // Followed by the merchant name, after a space.
  landing_phone_toast_detected: 'Pago detectado y registrado:',

  // Showcase — FAQ
  landing_faq_title_lead: 'Lo que preguntarías',
  landing_faq_title_accent: 'si me tuvieras enfrente.',
  landing_faq_iphone_q: '¿Necesito un iPhone?',
  landing_faq_iphone_a:
    'Para la captura automática de compras con tarjeta, sí: depende de un Atajo de iOS que lee la alerta de tu banco. Desde cualquier otro teléfono puedes registrar por Telegram escribiendo «12000 almuerzo», o a mano en la app, y todo lo demás funciona igual.',
  landing_faq_bank_key_q: '¿Tengo que darte la clave de mi banco?',
  landing_faq_bank_key_a:
    'No, y no hay forma de dárnosla aunque quisieras: no existe ese campo. El Atajo corre en tu teléfono y solo nos manda el monto y el nombre del comercio que venían en la alerta. Nunca tocamos tu cuenta.',
  landing_faq_trap_q: '¿Gratis de verdad? ¿Dónde está la trampa?',
  landing_faq_trap_a:
    'Es un proyecto personal que uso a diario, no una empresa con inversionistas que recuperar. No hay publicidad, no vendemos datos y no hay pasarela de pago en ninguna parte. Si algún día hay un plan pago, lo que ya tengas seguirá siendo tuyo y exportable.',
  landing_faq_cash_q: '¿Qué pasa con el efectivo, Nequi y los QR?',
  landing_faq_cash_a:
    'Ningún SMS los anuncia, así que no entran solos. Le escribes al bot de Telegram —«12000 almuerzo»— y queda registrado y categorizado en el momento. Es el mismo gesto que mandar un mensaje.',
  landing_faq_export_q: '¿Puedo sacar mis datos si me quiero ir?',
  landing_faq_export_a:
    'Cuando quieras y sin pedir permiso: un CSV con todo tu historial, once columnas, listo para Excel o para otra app. Está en tu perfil.',
  landing_faq_invest_q: '¿Pilo me va a decir en qué invertir?',
  landing_faq_invest_a:
    'No. Te muestra tu propio comportamiento —en qué se te va el mes, qué se está acelerando— y ahí para. Asesoría financiera es otra cosa, con otra regulación, y no es lo que esto es.',

  // Showcase — insight examples (not built; the subtitle says so)
  landing_insight_title_lead: 'Capturar es la mitad.',
  landing_insight_title_accent: 'La otra es entender.',
  landing_insight_subtitle:
    'Todavía no está construido. Son ejemplos del tipo de observación que el sistema podrá generar a partir de tus propios datos. No son cifras reales ni promesas de resultado: son la forma que tendría lo que te diría.',
  landing_insight_habit_quote:
    '«Tus pedidos de comida a domicilio de noche vienen subiendo estas últimas semanas.»',
  landing_insight_habit_desc:
    'Detectará cuándo un hábito se acelera, mientras todavía queda mes por delante.',
  landing_insight_recurring_quote:
    '«Hay cobros que se repiten todos los meses y quizá ya no estés usando.»',
  landing_insight_recurring_desc:
    'Identificará cargos recurrentes que se camuflan bajo nombres poco claros en el extracto.',
  landing_insight_projection_quote:
    '«A este ritmo, terminas el mes por encima de lo que gastaste el anterior.»',
  landing_insight_projection_desc:
    'Proyectará hacia dónde va tu comportamiento y te lo dirá mientras aún puedes ajustarlo.',

  // Day journey — intro
  landing_journey_intro_title_lead: 'Un martes cualquiera,',
  landing_journey_intro_title_accent: 'de principio a fin.',
  landing_journey_intro_hint: 'Sigue bajando',
  landing_journey_intro_text:
    'Tres gastos, una pregunta y una consulta. Junto a cada hora, lo que te costó.',

  // Day journey — the bot's category keyboard
  landing_journey_cat_restaurant: 'Restaurante',
  landing_journey_cat_cafe: 'Café',
  landing_journey_cat_market: 'Mercado',
  landing_journey_cat_transport: 'Transporte',

  // Day journey — 9:41, the coffee
  landing_journey_coffee_cost: '0 toques',
  landing_journey_coffee_title: 'Pagas el café con Apple Pay y sigues caminando.',
  landing_journey_coffee_text_lead: 'El Atajo lee la alerta del banco y lo guarda',
  landing_journey_coffee_text_strong: 'antes',
  landing_journey_coffee_text_tail:
    'de clasificarlo: perder un gasto es peor que tenerlo sin etiqueta.',
  landing_journey_coffee_receipt_ok: 'Cafetería, por una regla que ya conocía',

  // Day journey — 13:05, the question. The bubble follows the amount.
  landing_journey_ask_cost: 'te pregunta',
  landing_journey_ask_title: 'Un sitio nuevo: no adivina, te pregunta por Telegram.',
  landing_journey_ask_bubble: 'en La Puerta Falsa. ¿En qué categoría va?',

  // Day journey — 13:06, the rule. The chosen category goes between lead and tail.
  landing_journey_rule_cost: '2 toques',
  landing_journey_rule_title_lead: 'Tocas «',
  landing_journey_rule_title_tail: '» y queda como regla.',
  landing_journey_rule_text: 'La próxima compra ahí entra sola, por el Atajo o por el chat.',
  landing_journey_rules_label: 'Reglas aprendidas',
  landing_journey_rules_new: 'nueva',

  // Day journey — 19:30, the taxi
  landing_journey_taxi_cost: '1 mensaje',
  landing_journey_taxi_title: 'Pagas el taxi en efectivo y escribes «12000 taxi».',
  landing_journey_taxi_text:
    'Ni el efectivo, ni Nequi, ni los QR mandan alerta: una línea de chat los cubre.',
  landing_journey_taxi_message: '12000 taxi',
  landing_journey_taxi_saved: 'Guardado · Transporte',
  // Follows the amount.
  landing_journey_taxi_known: '· ya conocía «taxi»',

  // Day journey — 22:10, /hoy
  landing_journey_today_cost: '1 consulta',
  landing_journey_today_title: 'Antes de dormir, escribes /hoy.',
  landing_journey_today_text: 'Las mismas cifras que la app, sumadas en tu zona horaria.',
  landing_journey_today_head: 'Hoy · 3 movimientos',

  // Day journey — end of month, the statement (not built)
  landing_journey_statement_hour: 'Fin de mes',
  landing_journey_statement_cost: 'En camino',
  landing_journey_statement_title: 'El extracto recupera lo que se escapó.',
  landing_journey_statement_not_built: 'Todavía no está construido',
  landing_journey_statement_rest: ': hoy ese hueco lo cubre el chat.',
  landing_journey_statement_tag: 'Retiro en cajero · recuperada',

  // Day journey — the closing tally. The note wraps two computed numbers.
  landing_journey_end_title: 'El martes, completo.',
  landing_journey_end_expenses: 'gastos',
  landing_journey_end_taps: 'toques',
  landing_journey_end_message: 'mensaje',
  landing_journey_end_forms: 'formularios',
  landing_journey_end_note_lead: 'A mano habrían sido',
  landing_journey_end_note_mid: 'pasos: los',
  landing_journey_end_note_tail: 'de arriba, una vez por gasto.',

  // Banks
  landing_banks_title_lead: 'Captura automática con tus',
  landing_banks_title_accent: 'bancos que envían SMS.',
  landing_banks_subtitle:
    'Si tu banco te avisa por SMS cada compra, el Atajo de iOS lo procesa en segundo plano. Sin contraseñas bancarias ni intermediarios.',
  landing_banks_bancolombia_text:
    'Los SMS de compras y de pagos con Apple Pay. Entran solos, clasificados, sin que abras nada.',
  landing_banks_bogota_text:
    'Las alertas SMS de débito y de crédito. Mismo Atajo, mismo resultado: el gasto aparece registrado.',
  landing_banks_manual_title: '¿Nu o Nequi?',
  landing_banks_manual_text:
    'No mandan SMS por compras y iOS no deja leer sus notificaciones. Entran por Telegram, con una línea.',
  landing_banks_manual_sender: 'Tú, en Telegram',
  landing_banks_manual_message: '12000 almuerzo',
  landing_banks_manual_merchant: 'Almuerzo',
  landing_banks_chip_auto: '0 toques',
  landing_banks_chip_manual: '1 mensaje',
  landing_banks_kind_sms: 'SMS',
  landing_banks_kind_message: 'mensaje',
  landing_banks_cat_cafe: 'Cafetería',
  landing_banks_cat_restaurant: 'Restaurante',
  landing_banks_pending: 'Davivienda, Scotiabank Colpatria y Falabella: en camino.',
  landing_banks_note:
    'Tus credenciales nunca salen de tu teléfono: el Atajo corre en tu iPhone y solo envía el monto y el comercio del SMS.',

  // Privacy bento
  landing_vault_title_lead: 'Tu privacidad no es una opción',
  landing_vault_title_accent: 'de configuración.',
  landing_vault_subtitle:
    'Es la arquitectura del sistema. Esto es lo que eso significa, en concreto.',
  landing_vault_zero_label: 'datos vendidos',
  landing_vault_zero_text: 'Ni publicidad, ni perfiles, ni terceros.',
  landing_vault_bank_key_title: 'Sin la clave de tu banco',
  landing_vault_bank_key_text:
    'No existe ese campo. El Atajo lee el SMS en tu iPhone y solo nos manda el monto y el comercio.',
  landing_vault_export_file: 'historial.csv',
  landing_vault_export_meta: '11 columnas',
  landing_vault_export_title: 'Tus datos se van contigo',
  landing_vault_export_text: 'Todo tu historial en CSV, cuando quieras y sin pedir permiso.',
  landing_vault_isolation_title: 'Aislada por usuario',
  landing_vault_isolation_text:
    'Cada consulta a la base lleva tu usuario como primer dato, y un test rompe el build si alguien se lo salta. Encima, seguridad por fila en la propia base.',
  landing_vault_isolation_row_you: 'tú',
  landing_vault_who_title: 'Solo tú los ves',
  landing_vault_who_text:
    'Tus movimientos no se comparten ni se venden. Viajan cifrados y se guardan cifrados.',
  landing_vault_who_label: 'Quién ve tus movimientos',
  landing_vault_who_you: 'Tú',
  landing_vault_who_advertisers: 'Anunciantes',
  landing_vault_who_third_parties: 'Terceros',
  landing_vault_who_sees: 'los ve',
  landing_vault_who_not_sees: 'no los ve',

  // Footer
  landing_footer_label: 'Cierre y pie de página',
  landing_footer_title_lead: 'Que registrar un gasto',
  landing_footer_title_accent: 'deje de ser una tarea.',
  landing_footer_subtitle:
    'Empieza a registrar tus gastos con casi cero esfuerzo y deja que el sistema te diga lo que importa, sin que tengas que buscarlo.',
  landing_footer_how_heading: 'Cómo funciona',
  landing_footer_how_zero_touch: 'Registro sin esfuerzo',
  landing_footer_how_telegram: 'Notificaciones en Telegram',
  landing_footer_how_faq: 'Preguntas frecuentes',
  landing_footer_privacy_heading: 'Privacidad',
  landing_footer_privacy_isolation: 'Aislamiento por usuario',
  landing_footer_privacy_no_sale: 'Sin venta ni cesión de datos',
  landing_footer_privacy_encrypted: 'Cifrado en reposo',
  landing_footer_privacy_no_bank: 'Sin acceso a tu banco',
  landing_footer_access_heading: 'Acceso',
  landing_footer_access_sign_in: 'Crear cuenta / iniciar sesión',
  landing_footer_access_dashboard: 'Entrar al panel',
  landing_footer_rights: 'Todos los derechos reservados.',
  landing_footer_made_by: 'Hecho por Jean Paul Reales.',
} as const;

export const LANDING_EN = {
  // Metadata and JSON-LD (app/page.tsx)
  landing_meta_title: 'Pilo — Your expenses log themselves',
  landing_meta_description:
    'Pay the way you always do and Pilo logs the expense, sorts it and tells you how you are doing. No screens to open, no amounts to type. Free, no card required.',
  landing_meta_og_image_alt: 'Pilo',

  // Calls to action, shared by every section
  landing_cta_sign_up: 'Sign up',
  landing_cta_sign_up_email: 'Sign up with your email',

  // Top bar, mobile dock and drawer
  landing_nav_how_it_works: 'How it works',
  landing_nav_banks: 'Your banks',
  landing_nav_privacy: 'Privacy',
  landing_nav_faq: 'FAQ',
  landing_nav_main_label: 'Main navigation',
  landing_nav_mobile_dock_label: 'Bottom mobile navigation',
  landing_nav_menu_close_label: 'Close menu',
  landing_nav_menu_open_label: 'Open navigation menu',
  landing_nav_menu_close: 'Close',
  landing_nav_menu_open: 'Menu',
  landing_nav_drawer_title: 'Navigation',
  landing_nav_drawer_close_label: 'Close navigation',
  landing_nav_mobile_label: 'Mobile navigation',
  landing_nav_trust_no_bank_key: 'No bank password',
  landing_nav_trust_no_ads: 'No ads',

  // 01 — Hero
  landing_hero_section_label: '01 Enter',
  landing_hero_flank_left: 'YOUR',
  landing_hero_flank_right: 'MONEY',
  landing_hero_title: 'Your expenses log themselves.',
  landing_hero_subtitle:
    'Pay the way you always do — card, Apple Pay, cash — and Pilo writes them down, sorts them and tells you how you are doing. Without opening a single screen, without typing a single amount.',
  landing_hero_fact_free: 'Free, no card required',
  landing_hero_fact_code: 'A code to your email · one minute',
  landing_hero_fact_no_bank_key: 'We never ask for your bank password',
  landing_hero_caveat:
    'Automatic capture of card purchases needs an iPhone. Cash, transfers and QR payments come in through Telegram or by hand, from any phone.',

  // 02 — Observe
  landing_observe_section_label: '02 Observe',
  landing_observe_title_lead: 'Your money has a',
  landing_observe_title_accent: 'rhythm of its own.',
  landing_observe_caption:
    'Pilo watches that rhythm: it groups your expenses by period and shows you when they speed up, before the month closes.',

  // 03 — Understand. The statement is split on spaces for the word reveal.
  landing_understand_section_label: '03 Understand',
  landing_understand_statement: 'Money is not static. Neither is your clarity.',
  landing_understand_subtitle:
    'Pilo learns your merchants: the second time, it no longer asks. An interface designed to give you direction, not guilt.',

  // 04 — Trust
  landing_trust_section_label: '04 Trust',
  landing_trust_title_lead: 'Understand exactly',
  landing_trust_title_accent: 'where you stand.',
  landing_trust_subtitle:
    'No screens crammed with numbers. Just how much you have spent this month, without having to look for it.',

  // Showcase — section hero
  landing_showcase_section_label: 'How Pilo works',
  landing_showcase_title_lead: 'Logging expenses by hand',
  landing_showcase_title_accent: 'almost always gets abandoned.',
  landing_showcase_subtitle_lead:
    'Traditional apps make you open a screen dozens of times a month to write down every coffee. After a few days it gets tedious and the balance stops adding up. Pilo was designed so that logging your expenses takes as close to',
  landing_showcase_subtitle_strong: 'zero effort as possible',
  landing_showcase_subtitle_tail: '.',

  // Showcase — the two-column contrast. Both lists must keep the same length.
  landing_shift_manual_title: 'Until now: writing down every purchase by hand',
  landing_shift_manual_step_1: 'You finish paying and take your phone out again',
  landing_shift_manual_step_2: 'You unlock it and hunt for the app among the rest',
  landing_shift_manual_step_3: 'You wait for it to load and tap “+”',
  landing_shift_manual_step_4: 'You type the amount by hand, digit by digit',
  landing_shift_manual_step_5: 'You pick the account or card you paid with',
  landing_shift_manual_step_6: 'You look for the category in a long list',
  landing_shift_manual_step_7: 'You save, and repeat it dozens of times a month',
  landing_shift_manual_step_8: 'A few days later you give up, and the month no longer adds up',
  landing_shift_pilo_title: 'With Pilo: the same, without you doing anything',
  landing_shift_pilo_step_1: 'You pay as usual, with your card or Apple Pay',
  landing_shift_pilo_step_2: 'A Shortcut on your iPhone logs it in the background',
  landing_shift_pilo_step_3: 'The rules engine recognizes your usual merchants',
  landing_shift_pilo_step_4: 'It only asks for the category when it is truly unsure',
  landing_shift_pilo_step_5: 'You answer with two taps in Telegram',
  landing_shift_pilo_step_6: 'Cash and QR payments come in through a Telegram message',
  landing_shift_pilo_step_7: 'You type /hoy or /mes and see how you are doing',
  landing_shift_pilo_step_8: 'You never opened a form, and the month adds up',

  // Showcase — the facts strip
  landing_facts_steps_value: '8→0',
  landing_facts_steps_label: 'steps per expense',
  landing_facts_steps_note: 'The eight above disappear. Not down to two: down to zero',
  landing_facts_always_value: '24/7',
  landing_facts_always_label: 'capturing',
  landing_facts_always_note: 'With your phone locked and in your pocket',
  landing_facts_export_value: '100%',
  landing_facts_export_label: 'yours and exportable',
  landing_facts_export_note: 'Your whole history in CSV, whenever you want, without asking permission',
  landing_facts_free_value: '$0',
  landing_facts_free_label: 'free forever',
  landing_facts_free_note: 'No card, no ads, no selling your data',

  // Showcase — the phone banner and its live mockup
  landing_phone_title: 'Designed to stay at rest.',
  landing_phone_subtitle:
    'The looks of a luxury watch and the precision of an accounting ledger. Tap the button to simulate a purchase and watch Pilo react in real time.',
  landing_phone_stat_screens: 'Screens to open',
  landing_phone_stat_forms: 'Manual forms',
  landing_phone_stat_encrypted_value: 'Encrypted',
  landing_phone_stat_encrypted_label: 'At rest and in transit',
  landing_phone_greeting: 'Hi, Camila',
  landing_phone_pace_label: 'Spending pace ·',
  landing_phone_pace_unit: '/ day',
  landing_phone_auto_badge: 'Auto',
  landing_phone_ledger_time_ago: '2h ago',
  landing_phone_sim_time_now: 'seconds ago',
  landing_phone_sim_cat_cafe: 'Coffee shop',
  landing_phone_sim_cat_grocery: 'Groceries',
  landing_phone_sim_cat_transport: 'Transport',
  landing_phone_sim_cat_health: 'Health',
  landing_phone_sim_button: 'Simulate an Apple Pay purchase',
  landing_phone_toast_idle: 'Tap the button to log a payment live',
  // Followed by the merchant name, after a space.
  landing_phone_toast_detected: 'Payment detected and logged:',

  // Showcase — FAQ
  landing_faq_title_lead: 'What you would ask',
  landing_faq_title_accent: 'if I were sitting across from you.',
  landing_faq_iphone_q: 'Do I need an iPhone?',
  landing_faq_iphone_a:
    "For automatic capture of card purchases, yes: it relies on an iOS Shortcut that reads your bank's alert. From any other phone you can log through Telegram by typing “12000 lunch”, or by hand in the app, and everything else works the same.",
  landing_faq_bank_key_q: 'Do I have to give you my bank password?',
  landing_faq_bank_key_a:
    'No, and there is no way to give it to us even if you wanted to: that field does not exist. The Shortcut runs on your phone and only sends us the amount and the merchant name that came in the alert. We never touch your account.',
  landing_faq_trap_q: 'Free for real? What is the catch?',
  landing_faq_trap_a:
    'It is a personal project I use every day, not a company with investors to pay back. There are no ads, we do not sell data and there is no payment gateway anywhere. If there is ever a paid plan, what you already have will stay yours and exportable.',
  landing_faq_cash_q: 'What about cash, Nequi and QR payments?',
  landing_faq_cash_a:
    'No SMS announces them, so they do not come in on their own. You write to the Telegram bot — “12000 lunch” — and it is logged and categorized on the spot. It is the same gesture as sending a message.',
  landing_faq_export_q: 'Can I take my data with me if I want to leave?',
  landing_faq_export_a:
    'Whenever you want and without asking permission: a CSV with your whole history, eleven columns, ready for Excel or another app. It is in your profile.',
  landing_faq_invest_q: 'Is Pilo going to tell me what to invest in?',
  landing_faq_invest_a:
    'No. It shows you your own behavior — where your month goes, what is speeding up — and stops there. Financial advice is something else, with its own regulation, and that is not what this is.',

  // Showcase — insight examples (not built; the subtitle says so)
  landing_insight_title_lead: 'Capturing is half of it.',
  landing_insight_title_accent: 'The other half is understanding.',
  landing_insight_subtitle:
    'It is not built yet. These are examples of the kind of observation the system will be able to make from your own data. They are not real figures or promised results: they are the shape of what it would tell you.',
  landing_insight_habit_quote:
    '“Your late-night food delivery orders have been climbing these last few weeks.”',
  landing_insight_habit_desc:
    'It will detect when a habit speeds up, while there is still month left ahead.',
  landing_insight_recurring_quote:
    '“There are charges that repeat every month that you may no longer be using.”',
  landing_insight_recurring_desc:
    'It will spot recurring charges hiding under unclear names on the statement.',
  landing_insight_projection_quote:
    '“At this pace, you will end the month above what you spent the previous one.”',
  landing_insight_projection_desc:
    'It will project where your behavior is heading and tell you while you can still adjust it.',

  // Day journey — intro
  landing_journey_intro_title_lead: 'Any given Tuesday,',
  landing_journey_intro_title_accent: 'from start to finish.',
  landing_journey_intro_hint: 'Keep scrolling',
  landing_journey_intro_text:
    'Three expenses, one question and one query. Next to each time, what it cost you.',

  // Day journey — the bot's category keyboard
  landing_journey_cat_restaurant: 'Restaurant',
  landing_journey_cat_cafe: 'Coffee',
  landing_journey_cat_market: 'Groceries',
  landing_journey_cat_transport: 'Transport',

  // Day journey — 9:41, the coffee
  landing_journey_coffee_cost: '0 taps',
  landing_journey_coffee_title: 'You pay for coffee with Apple Pay and keep walking.',
  landing_journey_coffee_text_lead: 'The Shortcut reads the bank alert and saves it',
  landing_journey_coffee_text_strong: 'before',
  landing_journey_coffee_text_tail:
    'categorizing it: losing an expense is worse than having it unlabeled.',
  landing_journey_coffee_receipt_ok: 'Coffee shop, by a rule it already knew',

  // Day journey — 13:05, the question. The bubble follows the amount.
  landing_journey_ask_cost: 'it asks you',
  landing_journey_ask_title: 'A new place: it does not guess, it asks you on Telegram.',
  landing_journey_ask_bubble: 'at La Puerta Falsa. Which category does it go in?',

  // Day journey — 13:06, the rule. The chosen category goes between lead and tail.
  landing_journey_rule_cost: '2 taps',
  landing_journey_rule_title_lead: 'You tap “',
  landing_journey_rule_title_tail: '” and it becomes a rule.',
  landing_journey_rule_text:
    'The next purchase there comes in on its own, through the Shortcut or the chat.',
  landing_journey_rules_label: 'Learned rules',
  landing_journey_rules_new: 'new',

  // Day journey — 19:30, the taxi
  landing_journey_taxi_cost: '1 message',
  landing_journey_taxi_title: 'You pay the taxi in cash and type “12000 taxi”.',
  landing_journey_taxi_text:
    'Cash, Nequi and QR payments send no alert: one line of chat covers them.',
  landing_journey_taxi_message: '12000 taxi',
  landing_journey_taxi_saved: 'Saved · Transport',
  // Follows the amount.
  landing_journey_taxi_known: '· already knew “taxi”',

  // Day journey — 22:10, /hoy
  landing_journey_today_cost: '1 query',
  landing_journey_today_title: 'Before bed, you type /hoy.',
  landing_journey_today_text: 'The same figures as the app, added up in your time zone.',
  landing_journey_today_head: 'Today · 3 movements',

  // Day journey — end of month, the statement (not built)
  landing_journey_statement_hour: 'End of month',
  landing_journey_statement_cost: 'Coming soon',
  landing_journey_statement_title: 'The statement recovers what slipped through.',
  landing_journey_statement_not_built: 'It is not built yet',
  landing_journey_statement_rest: ': for now the chat covers that gap.',
  landing_journey_statement_tag: 'ATM withdrawal · recovered',

  // Day journey — the closing tally. The note wraps two computed numbers.
  landing_journey_end_title: 'Tuesday, complete.',
  landing_journey_end_expenses: 'expenses',
  landing_journey_end_taps: 'taps',
  landing_journey_end_message: 'message',
  landing_journey_end_forms: 'forms',
  landing_journey_end_note_lead: 'By hand it would have been',
  landing_journey_end_note_mid: 'steps: the',
  landing_journey_end_note_tail: 'above, once per expense.',

  // Banks
  landing_banks_title_lead: 'Automatic capture with your',
  landing_banks_title_accent: 'banks that send SMS.',
  landing_banks_subtitle:
    'If your bank texts you about every purchase, the iOS Shortcut processes it in the background. No bank passwords, no middlemen.',
  landing_banks_bancolombia_text:
    'Purchase and Apple Pay payment SMS. They come in on their own, categorized, without you opening anything.',
  landing_banks_bogota_text:
    'Debit and credit SMS alerts. Same Shortcut, same result: the expense shows up logged.',
  landing_banks_manual_title: 'Nu or Nequi?',
  landing_banks_manual_text:
    'They send no SMS for purchases and iOS does not let anything read their notifications. They come in through Telegram, with one line.',
  landing_banks_manual_sender: 'You, on Telegram',
  landing_banks_manual_message: '12000 lunch',
  landing_banks_manual_merchant: 'Lunch',
  landing_banks_chip_auto: '0 taps',
  landing_banks_chip_manual: '1 message',
  landing_banks_kind_sms: 'SMS',
  landing_banks_kind_message: 'message',
  landing_banks_cat_cafe: 'Coffee shop',
  landing_banks_cat_restaurant: 'Restaurant',
  landing_banks_pending: 'Davivienda, Scotiabank Colpatria and Falabella: on the way.',
  landing_banks_note:
    'Your credentials never leave your phone: the Shortcut runs on your iPhone and only sends the amount and the merchant from the SMS.',

  // Privacy bento
  landing_vault_title_lead: 'Your privacy is not an option',
  landing_vault_title_accent: 'in your settings.',
  landing_vault_subtitle: 'It is how the system is built. Here is what that means, concretely.',
  landing_vault_zero_label: 'data sold',
  landing_vault_zero_text: 'No ads, no profiles, no third parties.',
  landing_vault_bank_key_title: 'No bank password',
  landing_vault_bank_key_text:
    'That field does not exist. The Shortcut reads the SMS on your iPhone and only sends us the amount and the merchant.',
  landing_vault_export_file: 'history.csv',
  landing_vault_export_meta: '11 columns',
  landing_vault_export_title: 'Your data leaves with you',
  landing_vault_export_text: 'Your whole history in CSV, whenever you want and without asking permission.',
  landing_vault_isolation_title: 'Isolated per user',
  landing_vault_isolation_text:
    'Every database query carries your user as its first piece of data, and a test breaks the build if anyone skips it. On top of that, row-level security in the database itself.',
  landing_vault_isolation_row_you: 'you',
  landing_vault_who_title: 'Only you see them',
  landing_vault_who_text:
    'Your transactions are not shared or sold. They travel encrypted and are stored encrypted.',
  landing_vault_who_label: 'Who sees your transactions',
  landing_vault_who_you: 'You',
  landing_vault_who_advertisers: 'Advertisers',
  landing_vault_who_third_parties: 'Third parties',
  landing_vault_who_sees: 'sees them',
  landing_vault_who_not_sees: 'does not see them',

  // Footer
  landing_footer_label: 'Closing and footer',
  landing_footer_title_lead: 'Make logging an expense',
  landing_footer_title_accent: 'stop being a chore.',
  landing_footer_subtitle:
    'Start logging your expenses with almost zero effort and let the system tell you what matters, without you having to look for it.',
  landing_footer_how_heading: 'How it works',
  landing_footer_how_zero_touch: 'Effortless logging',
  landing_footer_how_telegram: 'Telegram notifications',
  landing_footer_how_faq: 'Frequently asked questions',
  landing_footer_privacy_heading: 'Privacy',
  landing_footer_privacy_isolation: 'Per-user isolation',
  landing_footer_privacy_no_sale: 'No selling or sharing of data',
  landing_footer_privacy_encrypted: 'Encrypted at rest',
  landing_footer_privacy_no_bank: 'No access to your bank',
  landing_footer_access_heading: 'Access',
  landing_footer_access_sign_in: 'Sign up / sign in',
  landing_footer_access_dashboard: 'Go to the dashboard',
  landing_footer_rights: 'All rights reserved.',
  landing_footer_made_by: 'Made by Jean Paul Reales.',
} as const satisfies Record<keyof typeof LANDING_ES, string>;

export type LandingKey = keyof typeof LANDING_ES;

const LANDING_DICTIONARY = { es: LANDING_ES, en: LANDING_EN } as const;

/** `t()` for the landing. Same locale guard, for the same reason (see i18n.ts). */
export function tl(key: LandingKey, locale: Locale = DEFAULT_LOCALE): string {
  return (LANDING_DICTIONARY[locale] ?? LANDING_DICTIONARY[DEFAULT_LOCALE])[key];
}
