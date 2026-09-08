/**
 * Accentify Username Moderation Test
 *
 * Install:
 *   npm install obscenity
 *
 * Run:
 *   node username-moderation-obscenity-test.js
 */

const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

// ============================================================
// 1. RESERVED NAMES
// Exact match only after normalization
// ============================================================

const reservedNames = [
  "accentify",
  "tify",
  "admin",
  "administrator",
  "moderator",
  "support",
  "official",
  "staff",
  "system",
  "security",
  "root",
  "sysadmin",
  "superadmin",
  "helpdesk",
  "verified",
  "officialaccount",
  "supportteam",
  "securityteam",
  "trustandsafety",
];

// ============================================================
// 2. PROHIBITED NAMES
// Substring roots
// ============================================================

const prohibitedNames = [
  // Strong profanity
  "fuck",
  "cunt",
  "shit",
  "bitch",
  "bastard",
  "wank",
  "twat",
  "whore",
  "slut",
  "skank",

  // Explicit sexual
  "porn",
  "penis",
  "vagina",
  "pussy",
  "dildo",
  "blowjob",
  "handjob",
  "gangbang",
  "incest",
  "bestiality",
  "necrophil",
  "zoophil",
  "rapist",
  "molest",
  "pedophile",
  "paedophile",
  "pedo",
  "paedo",
  "breast",
  "cock",
  "dick",
  "sex",
  "rape",
  "boob",

  // Racial / ethnic / religious slurs
  "nigger",
  "nigga",
  "chink",
  "gook",
  "kike",
  "paki",
  "raghead",
  "towelhead",
  "sandnigger",
  "coon",
  "wetback",
  "beaner",
  "zipperhead",

  // Homophobic / transphobic slurs
  "faggot",
  "tranny",
  "shemale",

  // Disability slurs
  "retard",
  "mongoloid",
  "spaz",
  "windowlicker",

  // Non-English profanity
  "mierda",
  "joder",
  "pendej",
  "gilipollas",
  "maricon",
  "cabron",
  "merde",
  "putain",
  "salope",
  "encule",
  "scheiss",
  "fotze",
  "hurensohn",
  "cazzo",
  "merda",
  "puttana",
  "caralho",

  // Extremist / hate slogans
  "whitepower",
  "aryanpower",
  "siegheil",
  "heilhitler",
  "bloodandsoil",
  "racewar",
  "racialholywar",
  "1488",
];

// ============================================================
// 3. EXACT PROHIBITED NAMES
// ============================================================

const prohibitedExactNames = [
  // Add exact-only names here if needed.
  // Example:
  // "someexactname",
];

// ============================================================
// 4. ALLOWED NAME EXCEPTIONS
// These prevent collision false positives.
// ============================================================

const allowedNameExceptions = {
  sex: [
    "essex",
    "sussex",
    "middlesex",
    "sexton",
  ],

  cunt: [
    "scunthorpe",
  ],

  penis: [
    "penistone",
  ],

  rape: [
    "grape",
    "grapes",
    "grapefruit",
    "scrape",
    "scraper",
    "drape",
    "draper",
  ],

  rapist: [
    "therapist",
    "therapists",
  ],

  cock: [
    "cocktail",
    "cocktails",
    "cockatoo",
    "cockatoos",
    "cockerel",
    "cockpit",
    "cockpits",
    "peacock",
    "peacocks",
    "woodcock",
    "hancock",
  ],

  dick: [
    "dickinson",
    "dickson",
    "dickenson",
    "dickie",
  ],

  breast: [
    "breastfeeding",
    "breastfeed",
    "breastfed",
    "breaststroke",
    "breaststrokes",
    "breastplate",
  ],

  paki: [
    "pakistan",
    "pakistani",
    "pakistanis",
  ],

  coon: [
    "raccoon",
    "raccoons",
  ],

  retard: [
    "retardant",
    "retardants",
  ],
};

// ============================================================
// 5. HATE PREFIXES
// ============================================================

const hatePrefixes = [
  "ihate",
  "hate",
  "kill",
  "gas",
  "lynch",
  "hang",
  "burn",
  "shoot",
  "bomb",
  "exterminate",
  "eradicate",
  "wipeout",
  "deathto",
  "death2",
];

// ============================================================
// 6. PROTECTED GROUP TERMS
// ============================================================

const protectedGroupTerms = [
  "asian",
  "asians",

  "arab",
  "arabs",

  "black",
  "blacks",

  "white",
  "whites",

  "african",
  "africans",

  "indian",
  "indians",

  "pakistani",
  "pakistanis",

  "chinese",
  "japanese",

  "korean",
  "koreans",

  "latino",
  "latinos",

  "mexican",
  "mexicans",

  "afghan",
  "afghans",

  "jew",
  "jews",
  "jewish",

  "muslim",
  "muslims",

  "christian",
  "christians",

  "hindu",
  "hindus",

  "sikh",
  "sikhs",

  "buddhist",
  "buddhists",

  "gay",
  "gays",

  "lesbian",
  "lesbians",

  "trans",
  "transgender",

  "queer",

  "disabled",
  "autistic",

  "women",
  "men",

  "refugee",
  "refugees",
];

// ============================================================
// 7. PROHIBITED PHRASES
// ============================================================

const prohibitedPhrases = [
  "killall",
  "killthe",
  "killthem",
  "deathto",
  "death2",
  "gasall",
  "lynchall",
  "hangall",
  "burnall",
  "shootall",
  "bomball",
  "exterminateall",
  "eradicateall",
  "wipeoutall",

  // Child / predatory usernames
  "ilovekids",
  "ilovechildren",
  "kidlover",
  "childlover",
  "minorlover",
  "sexykids",
  "sexychildren",
  "hotkids",
  "hotchildren",
];

// ============================================================
// NORMALIZATION
// ============================================================

const ZERO_WIDTH_RE =
  /[\u200B-\u200D\u2060\uFEFF\u180E]/g;

const LEET_MAP = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  "$": "s",
};

function normalizeForModeration(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(ZERO_WIDTH_RE, "")
    .replace(/_/g, "")
    .replace(/[015347@$]/g, (char) => {
      return LEET_MAP[char] ?? char;
    })
    .replace(/[^a-z0-9]/g, "");
}

// ============================================================
// EXCEPTION CHECK
// ============================================================

function isAllowedException(normalized, root) {
  const exceptions = allowedNameExceptions[root] ?? [];

  return exceptions.some(
    (exception) =>
      normalizeForModeration(exception) === normalized
  );
}

// ============================================================
// RESERVED CHECK
// ============================================================

function hasReservedName(normalized) {
  return reservedNames.some(
    (name) =>
      normalizeForModeration(name) === normalized
  );
}

// ============================================================
// EXACT PROHIBITED CHECK
// ============================================================

function hasProhibitedExactName(normalized) {
  return prohibitedExactNames.some(
    (name) =>
      normalizeForModeration(name) === normalized
  );
}

// ============================================================
// PROHIBITED ROOT CHECK
// ============================================================

function hasProhibitedRoot(normalized) {
  return prohibitedNames.some((root) => {
    if (isAllowedException(normalized, root)) {
      return false;
    }

    return normalized.includes(
      normalizeForModeration(root)
    );
  });
}

// ============================================================
// HATE / INCITEMENT CHECK
// ============================================================

function hasHateOrIncitement(normalized) {
  const hasViolentPrefix = hatePrefixes.some((prefix) =>
    normalized.startsWith(
      normalizeForModeration(prefix)
    )
  );

  if (!hasViolentPrefix) {
    return false;
  }

  return protectedGroupTerms.some((group) =>
    normalized.includes(
      normalizeForModeration(group)
    )
  );
}

// ============================================================
// PROHIBITED PHRASE CHECK
// ============================================================

function hasProhibitedPhrase(normalized) {
  return prohibitedPhrases.some((phrase) =>
    normalized.includes(
      normalizeForModeration(phrase)
    )
  );
}

// ============================================================
// COMPLETE CUSTOM MODERATION CHECK
// ============================================================

function customModerationCheck(username) {
  const normalized =
    normalizeForModeration(username);

  if (hasReservedName(normalized)) {
    return {
      allowed: false,
      reason: "reserved",
    };
  }

  if (hasProhibitedExactName(normalized)) {
    return {
      allowed: false,
      reason: "prohibitedExactName",
    };
  }

  if (hasProhibitedRoot(normalized)) {
    return {
      allowed: false,
      reason: "prohibitedRoot",
    };
  }

  if (hasHateOrIncitement(normalized)) {
    return {
      allowed: false,
      reason: "hateOrIncitement",
    };
  }

  if (hasProhibitedPhrase(normalized)) {
    return {
      allowed: false,
      reason: "prohibitedPhrase",
    };
  }

  return {
    allowed: true,
    reason: null,
  };
}

// ============================================================
// OBSCENITY PACKAGE
// ============================================================

const obscenityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

function obscenityCheck(username) {
  return obscenityMatcher.hasMatch(username);
}

// ============================================================
// ACCEPTANCE TESTS
// ============================================================

const acceptanceTests = [
  // ----------------------------------------------------------
  // MUST PASS
  // ----------------------------------------------------------

  {
    value: "asianboxer98",
    expected: true,
  },

  {
    value: "arabicteacher",
    expected: true,
  },

  {
    value: "pakistanivoice",
    expected: true,
  },

  {
    value: "essexactor",
    expected: true,
  },

  {
    value: "sussexspeaker",
    expected: true,
  },

  {
    value: "scunthorpeaccent",
    expected: true,
  },

  {
    value: "cocktailfan",
    expected: true,
  },

  {
    value: "peacockvoice",
    expected: true,
  },

  {
    value: "dickinson",
    expected: true,
  },

  {
    value: "breastfeedingcoach",
    expected: true,
  },

  {
    value: "therapist",
    expected: true,
  },

  {
    value: "grapefruit",
    expected: true,
  },

  {
    value: "ihatemondays",
    expected: true,
  },

  // ----------------------------------------------------------
  // MUST FAIL
  // ----------------------------------------------------------

  {
    value: "fuck",
    expected: false,
  },

  {
    value: "fuckers",
    expected: false,
  },

  {
    value: "f_u_c_k",
    expected: false,
  },

  {
    value: "cunt",
    expected: false,
  },

  {
    value: "whore",
    expected: false,
  },

  {
    value: "slut",
    expected: false,
  },

  {
    value: "nigger",
    expected: false,
  },

  {
    value: "n1gger",
    expected: false,
  },

  {
    value: "mierda",
    expected: false,
  },

  {
    value: "cock",
    expected: false,
  },

  {
    value: "ilovekids",
    expected: false,
  },

  {
    value: "ihateasians",
    expected: false,
  },

  {
    value: "ihateallasians",
    expected: false,
  },

  {
    value: "killallarabs",
    expected: false,
  },

  {
    value: "deathtomuslims",
    expected: false,
  },

  {
    value: "gasjews",
    expected: false,
  },

  {
    value: "whitepower88",
    expected: false,
  },

  {
    value: "heilhitler",
    expected: false,
  },

  {
    value: "essexfuck",
    expected: false,
  },
];

// ============================================================
// WORDS SPECIFICALLY TO TEST AGAINST OBSCENITY
// ============================================================

const obscenityOnlyTests = [
  "hello",
  "developer",

  // Your requested tests
  "tcoik",
  "crsos",

  // Profanity
  "fuck",
  "f_u_c_k",
  "fuuuuuck",

  // Leetspeak
  "n1gger",

  // Unicode / obfuscation
  "ʃṳ𝒸𝗄",

  // Collision words
  "cocktail",
  "peacock",
  "scunthorpe",
  "therapist",
  "grapefruit",
  "essex",
  "sussex",
  "pakistan",
  "pakistani",
];

// ============================================================
// PRINT ACCEPTANCE RESULTS
// ============================================================

console.log(
  "\n=============================================="
);

console.log(
  " ACCENTIFY ACCEPTANCE TESTS"
);

console.log(
  "==============================================\n"
);

let acceptancePassed = 0;

for (const test of acceptanceTests) {
  const result =
    customModerationCheck(test.value);

  const actual = result.allowed;

  const passed =
    actual === test.expected;

  if (passed) {
    acceptancePassed++;
  }

  console.log(
    `${passed ? "PASS" : "FAIL"} | ` +
      `${test.value.padEnd(25)} | ` +
      `expected=${test.expected ? "ALLOW" : "BLOCK"} | ` +
      `actual=${actual ? "ALLOW" : "BLOCK"} | ` +
      `reason=${result.reason ?? "none"}`
  );
}

console.log(
  `\nAcceptance result: ` +
    `${acceptancePassed}/${acceptanceTests.length} passed.\n`
);

// ============================================================
// OBSCENITY RESULTS
// ============================================================

console.log(
  "=============================================="
);

console.log(
  " OBSCENITY PACKAGE RESULTS"
);

console.log(
  "==============================================\n"
);

for (const value of obscenityOnlyTests) {
  const matched =
    obscenityCheck(value);

  let matches = [];

  if (matched) {
    const rawMatches =
      obscenityMatcher.getAllMatches(
        value,
        true
      );

    matches = rawMatches.map((match) => {
      const {
        phraseMetadata,
      } =
        englishDataset.getPayloadWithPhraseMetadata(
          match
        );

      return phraseMetadata.originalWord;
    });
  }

  console.log(
    `${matched ? "BLOCKED" : "ALLOWED"} | ` +
      `${value}` +
      `${
        matches.length
          ? ` | matches=[${matches.join(", ")}]`
          : ""
      }`
  );
}

// ============================================================
// CUSTOM VS OBSCENITY
// ============================================================

console.log(
  "\n=============================================="
);

console.log(
  " CUSTOM MODERATION vs OBSCENITY"
);

console.log(
  "==============================================\n"
);

for (const test of acceptanceTests) {
  const custom =
    customModerationCheck(test.value);

  const obscenity =
    obscenityCheck(test.value);

  console.log(
    `${test.value.padEnd(25)} ` +
      `custom=${custom.allowed ? "ALLOW" : "BLOCK"} | ` +
      `obscenity=${obscenity ? "BLOCK" : "ALLOW"}`
  );
}

// ============================================================
// FINAL NOTES
// ============================================================

console.log(
  "\n=============================================="
);

console.log(" NOTES");

console.log(
  "==============================================\n"
);

console.log(
  "Obscenity is being tested as an additional " +
    "profanity signal."
);

console.log(
  "Accentify's custom moderation rules remain " +
    "the source of truth for the requested policy."
);

console.log(
  "tcoik and crsos are explicitly included above " +
    "so you can see the package's actual result."
);