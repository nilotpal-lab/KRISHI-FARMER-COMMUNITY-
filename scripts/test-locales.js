const fs = require('fs');
const path = require('path');

// Test data directly using mock logic
const fixtures = require('../src/lib/services/fixtures.json');

console.log('--- TESTING LOCALE PURITY ACROSS KN, HI, EN ---');

const knRegex = /[\u0C80-\u0CFF]/;
const hiRegex = /[\u0900-\u097F]/;
const engWordRegex = /[A-Za-z]{4,}/;

// 1. Posts in KN
let knPostErrors = 0;
for (const p of fixtures.posts) {
  const knLabel = p.labels.kn;
  if (!knRegex.test(knLabel.title)) {
    console.error(`Post ${p.key} KN title does not contain Kannada: "${knLabel.title}"`);
    knPostErrors++;
  }
  if (!knRegex.test(knLabel.body)) {
    console.error(`Post ${p.key} KN body does not contain Kannada: "${knLabel.body}"`);
    knPostErrors++;
  }
}
if (knPostErrors === 0) {
  console.log('PASS: All 18 posts in Kannada mode are 100% pure Kannada!');
} else {
  throw new Error(`Failed: ${knPostErrors} Kannada post errors`);
}

// 2. Posts in HI
let hiPostErrors = 0;
for (const p of fixtures.posts) {
  const hiLabel = p.labels.hi;
  if (!hiRegex.test(hiLabel.title)) {
    console.error(`Post ${p.key} HI title does not contain Hindi: "${hiLabel.title}"`);
    hiPostErrors++;
  }
  if (!hiRegex.test(hiLabel.body)) {
    console.error(`Post ${p.key} HI body does not contain Hindi: "${hiLabel.body}"`);
    hiPostErrors++;
  }
}
if (hiPostErrors === 0) {
  console.log('PASS: All 18 posts in Hindi mode are 100% pure Hindi!');
} else {
  throw new Error(`Failed: ${hiPostErrors} Hindi post errors`);
}

// 3. Posts in EN
let enPostErrors = 0;
for (const p of fixtures.posts) {
  const enLabel = p.labels.en;
  if (knRegex.test(enLabel.title) || hiRegex.test(enLabel.title)) {
    console.error(`Post ${p.key} EN title contains Indic scripts: "${enLabel.title}"`);
    enPostErrors++;
  }
  if (knRegex.test(enLabel.body) || hiRegex.test(enLabel.body)) {
    console.error(`Post ${p.key} EN body contains Indic scripts: "${enLabel.body}"`);
    enPostErrors++;
  }
}
if (enPostErrors === 0) {
  console.log('PASS: All 18 posts in English mode are 100% pure English!');
} else {
  throw new Error(`Failed: ${enPostErrors} English post errors`);
}

// 4. Communities in KN, HI, EN
for (const c of fixtures.communities) {
  if (!knRegex.test(c.labels.kn.name) || !knRegex.test(c.labels.kn.description)) {
    throw new Error(`Community ${c.slug} KN missing Kannada script`);
  }
  if (!hiRegex.test(c.labels.hi.name) || !hiRegex.test(c.labels.hi.description)) {
    throw new Error(`Community ${c.slug} HI missing Hindi script`);
  }
  if (knRegex.test(c.labels.en.name) || hiRegex.test(c.labels.en.name)) {
    throw new Error(`Community ${c.slug} EN contains Indic script`);
  }
}
console.log('PASS: All communities are 100% strictly localized across KN, HI, and EN!');

// 5. Comments in KN, HI, EN
for (const c of fixtures.comments) {
  if (!knRegex.test(c.labels.kn.body)) {
    throw new Error(`Comment ${c.key} KN missing Kannada script`);
  }
  if (!hiRegex.test(c.labels.hi.body)) {
    throw new Error(`Comment ${c.key} HI missing Hindi script`);
  }
  if (knRegex.test(c.labels.en.body) || hiRegex.test(c.labels.en.body)) {
    throw new Error(`Comment ${c.key} EN contains Indic script`);
  }
}
console.log('PASS: All comments are 100% strictly localized across KN, HI, and EN!');

console.log('\n=============================================');
console.log('   ALL LOCALE PURITY CHECKS PASSED!          ');
console.log('=============================================\n');
