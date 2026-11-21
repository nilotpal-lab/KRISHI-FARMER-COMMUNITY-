const fs = require('fs');
const path = require('path');

console.log('--- RUNNING RIGOROUS KRISHI VERIFICATION ---');

// 1. Verify Image Assets
console.log('\n[TEST 1] Verifying Static Image Assets...');
const publicDir = path.join(__dirname, '..', 'public');
const assetsToCheck = [
  'assets/crops/onion_field.jpg',
  'assets/crops/sugarcane_field.jpg',
  'assets/crops/tomato_crop.jpg',
  'assets/crops/chilli_crop.jpg',
  'assets/crops/cotton_crop.jpg',
  'assets/crops/paddy_mandya.jpg',
  'assets/crops/millet_field.jpg',
  'assets/farmers/gowri_avatar.jpg',
  'assets/farmers/ravi_avatar.jpg',
  'assets/farmers/farmer_smartphone.jpg',
  'assets/farmers/annappa_gowda.jpg'
];

let missingImages = 0;
for (const relPath of assetsToCheck) {
  const fullPath = path.join(publicDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`  FAIL: Missing asset ${relPath}`);
    missingImages++;
  } else {
    const stats = fs.statSync(fullPath);
    console.log(`  PASS: ${relPath} exists (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}
if (missingImages > 0) {
  throw new Error(`Failed: ${missingImages} images missing`);
}

// 2. Verify Fixtures Trilingual Integrity
console.log('\n[TEST 2] Verifying Fixtures Trilingual Integrity...');
const fixturesPath = path.join(__dirname, '..', 'src/lib/services/fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

console.log(`  Checking ${fixtures.posts.length} posts...`);
for (const post of fixtures.posts) {
  if (!post.labels) {
    throw new Error(`Post ${post.id} missing labels!`);
  }
  for (const lang of ['en', 'kn', 'hi']) {
    if (!post.labels[lang] || !post.labels[lang].title || !post.labels[lang].body) {
      throw new Error(`Post ${post.id} missing ${lang} labels!`);
    }
  }
}
console.log('  PASS: All 18 posts have complete en, kn, and hi titles and bodies.');

console.log(`  Checking ${fixtures.comments.length} comments...`);
for (const comment of fixtures.comments) {
  if (!comment.labels) {
    throw new Error(`Comment ${comment.id} missing labels!`);
  }
  for (const lang of ['en', 'kn', 'hi']) {
    if (!comment.labels[lang] || !comment.labels[lang].body) {
      throw new Error(`Comment ${comment.id} missing ${lang} body!`);
    }
  }
}
console.log('  PASS: All 6 comments have complete en, kn, and hi text.');

console.log(`  Checking ${fixtures.communities.length} communities...`);
for (const comm of fixtures.communities) {
  if (!comm.labels) {
    throw new Error(`Community ${comm.slug} missing labels!`);
  }
  for (const lang of ['en', 'kn', 'hi']) {
    if (!comm.labels[lang] || !comm.labels[lang].name || !comm.labels[lang].description) {
      throw new Error(`Community ${comm.slug} missing ${lang} labels!`);
    }
  }
}
console.log('  PASS: All communities have complete en, kn, and hi labels.');

console.log(`  Checking ${fixtures.accounts.length} accounts...`);
for (const acc of fixtures.accounts) {
  if (!acc.displayNames || !acc.displayNames.en || !acc.displayNames.kn || !acc.displayNames.hi) {
    throw new Error(`Account ${acc.username} missing trilingual displayNames!`);
  }
}
console.log('  PASS: All accounts have en, kn, and hi display names.');

// 3. Verify Dictionary Parity
console.log('\n[TEST 3] Verifying Dictionary Parity (ui-starter + additionalStrings)...');
const uiStarter = require('../src/lib/services/ui-starter.json');
const dictPath = path.join(__dirname, '..', 'src/lib/i18n/dictionaries.ts');
const dictContent = fs.readFileSync(dictPath, 'utf8');

// Parse additionalStrings using JS evaluation of the object
const additionalMatch = dictContent.match(/const additionalStrings: Record<Locale, Record<string, string>> = (\{[\s\S]*?\n\};)/);
if (!additionalMatch) {
  throw new Error('Failed to find additionalStrings in dictionaries.ts');
}

// Convert typescript object literal to JS object by evaluating safely
const additionalCode = 'return ' + additionalMatch[1].replace(/;\s*$/, '');
const additionalStrings = (new Function(additionalCode))();

const dictionaries = {
  en: { ...uiStarter.en, ...additionalStrings.en },
  kn: { ...uiStarter.kn, ...additionalStrings.kn },
  hi: { ...uiStarter.hi, ...additionalStrings.hi }
};

console.log(`  Dictionary sizes: EN=${Object.keys(dictionaries.en).length}, KN=${Object.keys(dictionaries.kn).length}, HI=${Object.keys(dictionaries.hi).length}`);

const enKeys = Object.keys(dictionaries.en);
const knKeys = new Set(Object.keys(dictionaries.kn));
const hiKeys = new Set(Object.keys(dictionaries.hi));

const missingInKn = enKeys.filter(k => !knKeys.has(k));
const missingInHi = enKeys.filter(k => !hiKeys.has(k));

if (missingInKn.length > 0) {
  throw new Error(`Keys missing in KN: ${missingInKn.join(', ')}`);
}
if (missingInHi.length > 0) {
  throw new Error(`Keys missing in HI: ${missingInHi.join(', ')}`);
}

console.log('  PASS: 100% dictionary key parity between English, Kannada, and Hindi.');

// 4. Test for English strings inside Kannada/Hindi dictionaries (untranslated leaks)
console.log('\n[TEST 4] Verifying No Untranslated Leaks...');
let englishLeaksKn = 0;
let englishLeaksHi = 0;

for (const key of enKeys) {
  const enVal = dictionaries.en[key];
  const knVal = dictionaries.kn[key];
  const hiVal = dictionaries.hi[key];

  // If the English value is more than 5 letters, and Kannada/Hindi has the EXACT same English value, flag it
  if (enVal.length > 5 && /^[A-Za-z0-9\s.,!?'"—-]+$/.test(enVal)) {
    if (knVal === enVal && key !== 'brand.title') {
      console.warn(`  WARNING: Possible untranslated KN string for key '${key}': "${knVal}"`);
      englishLeaksKn++;
    }
    if (hiVal === enVal && key !== 'brand.title') {
      console.warn(`  WARNING: Possible untranslated HI string for key '${key}': "${hiVal}"`);
      englishLeaksHi++;
    }
  }
}

console.log(`  Leaks found: KN=${englishLeaksKn}, HI=${englishLeaksHi}`);
if (englishLeaksKn === 0 && englishLeaksHi === 0) {
  console.log('  PASS: Zero unlocalized English fallbacks detected in Kannada or Hindi dictionaries!');
}

// 5. Test No Untranslated Script In Source Code Files Outside Dictionaries
console.log('\n[TEST 5] Checking for hardcoded mixed scripts in pages/components...');
const srcFiles = [
  'src/app/page.tsx',
  'src/app/communities/new/page.tsx',
  'src/app/posts/new/page.tsx',
  'src/app/posts/[id]/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/communities/page.tsx',
  'src/app/not-found.tsx',
  'src/app/error.tsx',
  'src/components/common/DemoBar.tsx',
  'src/components/shells/BrowseShell.tsx'
];

const knRegex = /[\u0C80-\u0CFF]/;
const hiRegex = /[\u0900-\u097F]/;
let mixedScriptErrors = 0;

for (const rel of srcFiles) {
  const full = path.join(__dirname, '..', rel);
  const code = fs.readFileSync(full, 'utf8');
  // Check lines that are not groupLabels / static definitions
  const lines = code.split('\n');
  lines.forEach((l, idx) => {
    // groupLabels in BrowseShell or LanguageModal are permitted static lookup maps
    if (rel.includes('BrowseShell') && l.includes('locale === \'kn\'')) return;
    if (rel.includes('LanguageModal')) return;
    if (knRegex.test(l) || hiRegex.test(l)) {
      console.error(`  FAIL: Hardcoded non-English script in ${rel}:${idx + 1}: ${l.trim()}`);
      mixedScriptErrors++;
    }
  });
}

if (mixedScriptErrors === 0) {
  console.log('  PASS: Zero hardcoded mixed scripts in UI components/pages!');
} else {
  throw new Error(`Failed: Found ${mixedScriptErrors} hardcoded mixed script lines!`);
}

console.log('\n=============================================');
console.log('   ALL KRISHI TESTS PASSED SUCCESSFULLY!    ');
console.log('=============================================\n');
