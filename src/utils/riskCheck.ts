export type RiskLevel = 'none' | 'elevated' | 'immediate';

/*
 * HOW TO EDIT THESE LISTS
 *
 * Each line is one pattern, with an example of what it catches.
 * Before matching, the text is lowercased, apostrophes are removed
 * ("can't" -> "cant", "I'm" -> "im") and other symbols become spaces
 * ("self-harm" -> "self harm"). Write patterns in that form.
 *
 * Text is also split into clauses at . ! ? , ; new lines and the words
 * "and", "but", "so". A pattern ending in \s*$ must reach the end of a
 * clause, e.g. "i give up" matches but "i gave up coffee" does not.
 *
 * Pattern syntax: (a|b) = a or b, (x )? = optional, \b = word boundary,
 * (?!...) = "not followed by".
 */

export const IMMEDIATE_PATTERNS: RegExp[] = [
  // "i want to die", "i just wanna die", "i dey wan die" (not "die of laughter")
  /\b(want|wanna|wan|wish|ready|plan|planning|trying|need) (to )?die\b(?! (of|laughing|lol|lmao|haha))/,
  // "i should just die", "let me die", "make i just die"
  /\b(i should|let me|make i) (just )?die\b/,
  // "i wish i was dead", "i wish i was never born", "i wish i could die"
  /\bwish i (was|were|could be|could|would) (dead|die|never born|not born|not alive|not here)\b/,
  // "better off dead", "everyone would be better off without me"
  /\bbetter off (dead|without me)\b/,
  // "kill myself", "i go kill myself", "kms"
  /\bkill(ing)? my ?self\b/,
  /\bkms\b/,
  // "end my life", "take my own life", "end it all"
  /\b(end|ending|take|taking) (my|my own) life\b/,
  /\bend(ing)? (it all|everything)\b/,
  // "suicide", "suicidal" (not "suicide squad")
  /\bsuicid(e|al)\b(?! squad)/,
  // "self harm", "i want to cut myself"
  /\bself ?harm(ing)?\b/,
  /\b(want|wanna|wan|going|gonna|go) (to )?(hurt|harm|cut) my ?self\b/,
  // "i want to sleep forever", "sleep and never wake up", "i hope i never wake up"
  /\b(sleep|rest) forever\b/,
  /\bsleep and (never|not) wake up\b/,
  /\b(hope|wish|want|pray)( that)? i (never|dont|do not|no go|will not|wont) wake up\b/,
  /\bnever wake up again\b/,
  // "disappear forever", "vanish for good", "leave this world", "comot for this world"
  /\b(disappear|vanish) (forever|for good|permanently)\b/,
  /\b(leave|comot|comot for|exit) this world\b/,
  // "no reason to live", "nothing to live for", "no point in living"
  /\bno (more )?reasons? (to|for) (live|living|be alive|stay alive)\b/,
  /\bnothing (left )?to live for\b/,
  /\bno point (in )?(living|life|being alive|going on)\b/,
  // "i dont want to live anymore", "i no wan live again" (not "live in lagos")
  /\b(dont|do not|no longer|no) (want|wan|wish) (to )?(live|be alive|exist)\b(?! (in|with|at|near|there|here|on|like))/,
  // "tired of living", "i don tire for this life"
  /\btired of (living|being alive|life|this life|existing)\b/,
  /\b(don|done) tire (for|of) (this )?life\b/,
  // "give up on life"
  /\bgiv(e|ing) up on (life|living)\b/,
  // "i cant go on", "i cant go on like this" (not "cant go on the trip")
  /\b(cant|cannot|can not|no fit) go on( (like this|living|anymore|any more|again|with (life|my life|this life)))*\s*$/,
  // "i no fit continue", "i cant continue anymore" (not "cant continue the meeting")
  /\b(cant|cannot|can not|no fit) continue( (like this|living|anymore|any more|again|with (life|my life|this life)))*\s*$/,
  // "take all my pills", "swallow the whole bottle"
  /\b(take|swallow|taking|swallowing) (all|all of) (my|the) (pills|tablets|medicine)\b/,
  /\b(take|swallow|taking|swallowing) the whole bottle\b/,
];

export const ELEVATED_PATTERNS: RegExp[] = [
  // "i feel worthless", "im useless", "im a burden", "i feel like a failure"
  /\b(i am|im|i feel|i feel like|feeling|feel) (so |just |completely |totally |such )*(worthless|useless|a burden|like a burden|a failure|like a failure|a disappointment|nothing|a nobody)\b/,
  // "i hate myself", "i hate my life"
  /\bi (hate|cant stand) (my ?self|my life)\b/,
  // "nobody cares about me", "no one cares", "nobody loves me", "nobody send me"
  /\b(nobody|no one|noone|no body) (really )?(cares?|gives a damn) (about|for) me\b/,
  /\b(nobody|no one|noone|no body) (really )?cares( anymore)?\s*$/,
  /\b(nobody|no one|noone|no body) (loves|understands|would miss|will miss|go miss|notices) me\b/,
  /\bnobody send me\s*$/,
  // "i feel completely alone", "im all alone", "i have no one", "i no get anybody"
  /\b(i am|im|i feel|feeling|feel) (so |completely |totally |all |very |just )*alone\b/,
  /\bi have (no one|nobody|no body)\s*$/,
  /\balone in (this|the) world\b/,
  /\bi no get (anybody|anyone|person|nobody)\b/,
  // "i cant take it anymore", "i cant do this anymore", "i no fit again"
  /\b(cant|cannot|can not|no fit) (take|bear|handle|cope with|do|carry) (it|this|am|everything|all this)( anymore| any more| again)\b/,
  /\b(cant|cannot|can not) cope\b/,
  /\bno fit again\s*$/,
  // "e don do me", "i don tire"
  /\be don do me\b/,
  /\bi (don|done) tire\b/,
  // "i give up", "im giving up", "i want to give up" (not "i gave up coffee")
  /\b(i|im|i am|i just|im just|i will|ill)( just)? (give|giving|gave) up\s*$/,
  /\b(want|wanna|wan|about|ready) (to )?give up\s*$/,
  /\bgiv(e|ing) up on (everything|my ?self|it all|trying|my dreams|me)\b/,
  // "i have no hope", "i lost all hope", "i feel hopeless"
  /\b(i have|ive got|i got|there is|theres|i see) no hope\b/,
  /\b(lost|losing) (all )?hope\b/,
  /\bno hope (left|anymore|at all)?\s*$/,
  /\b(i am|im|i feel|feeling|feel) (so |completely |totally )*hopeless\b/,
  // "life no sweet again", "life no get meaning"
  /\blife no (sweet|get meaning)\b/,
];

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/'/g, '')
    .replace(/[^a-z0-9.!?,;\n\s]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function toClauses(normalised: string): string[] {
  return normalised
    .split(/[.!?,;\n]+|\b(?:and|but|so)\b/)
    .map((clause) => clause.trim())
    .filter(Boolean);
}

function matchesAny(patterns: RegExp[], full: string, clauses: string[]): boolean {
  return patterns.some(
    (pattern) => pattern.test(full) || clauses.some((clause) => pattern.test(clause))
  );
}

// Runs entirely on device. Never log `text`.
export function checkRisk(text: string): RiskLevel {
  const full = normalise(text);
  if (!full) return 'none';

  const clauses = toClauses(full);
  if (matchesAny(IMMEDIATE_PATTERNS, full, clauses)) return 'immediate';
  if (matchesAny(ELEVATED_PATTERNS, full, clauses)) return 'elevated';
  return 'none';
}
