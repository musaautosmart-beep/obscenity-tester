const {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const words = process.argv.slice(2).join(" ");

if (!words) {
  console.log("Usage: node index.js <words>");
  process.exit(1);
}

const isBanned = matcher.hasMatch(words);

if (isBanned) {
  console.log("❌ BANNED / PROFANITY DETECTED");

  const matches = matcher.getAllMatches(words, true);

  for (const match of matches) {
    const { phraseMetadata } =
      englishDataset.getPayloadWithPhraseMetadata(match);

    console.log(`Matched: ${phraseMetadata.originalWord}`);
  }
} else {
  console.log("✅ CLEAN");
}
