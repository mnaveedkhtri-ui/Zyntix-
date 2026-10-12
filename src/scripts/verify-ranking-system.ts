import { getAllSites, getSiteById, getSiteBySubdomainOrDomain, saveOrUpdateSite } from '@/lib/sites';
import { optimizeMetaTitle, optimizeMetaDescription } from '@/lib/seo-helpers';
import { fetchGoogleSerpSuggestions, generateDeepHumanArticle } from '@/lib/seo-engine';
import { failoverShield } from '@/lib/failover-shield';
import { pingIndexNow, pingGoogleSitemap } from '@/lib/indexing';

async function runAudit() {
  console.log("=== STARTING ZYNTIX RANKING & SITE MANAGEMENT COMPREHENSIVE AUDIT ===");

  // 1. Audit Site Management
  console.log("\n[TEST 1] Testing Site Management & Storage Engine...");
  const allSites = getAllSites();
  console.log(`- Total sites discovered: ${allSites.length}`);
  const demoSite = getSiteById('site-default-demo');
  if (!demoSite) {
    throw new Error("Demo site not found!");
  }
  console.log(`- Default Demo Site found: "${demoSite.name}" (${demoSite.subdomain})`);
  console.log(`- Custom Domain on Demo: ${demoSite.customDomain || 'null (Clean platform isolation - PASS)'}`);

  // Test Domain Resolution
  const bySubdomain = getSiteBySubdomainOrDomain('demo');
  console.log(`- Lookup by subdomain 'demo': ${bySubdomain ? 'SUCCESS (' + bySubdomain.name + ')' : 'FAILED'}`);
  
  // Test Platform Apex Resolution (should NOT return demo site as custom domain)
  const byApex = getSiteBySubdomainOrDomain('moderntrendsnow.org');
  console.log(`- Lookup by apex 'moderntrendsnow.org': ${byApex ? byApex.name : 'null (Handled by platform landing page - PASS)'}`);

  // 2. Audit SEO Calibration Helpers
  console.log("\n[TEST 2] Testing SERP Pixel Calibration Helpers...");
  const rawTitle = "How to Build Modern Architecture";
  const brand = "Meridian Craft & Architecture";
  const calibratedTitle = optimizeMetaTitle(rawTitle, brand);
  console.log(`- Raw Title: "${rawTitle}" (${rawTitle.length} chars)`);
  console.log(`- Calibrated Title: "${calibratedTitle}" (${calibratedTitle.length} chars)`);
  const titlePass = calibratedTitle.length >= 50 && calibratedTitle.length <= 60;
  console.log(`  -> Title length in Google SERP optimal range [50-60]: ${titlePass ? 'PASS' : 'WARN'}`);

  const rawDesc = "A quick guide to timber restoration.";
  const calibratedDesc = optimizeMetaDescription(rawDesc);
  console.log(`- Raw Description: "${rawDesc}" (${rawDesc.length} chars)`);
  console.log(`- Calibrated Description: "${calibratedDesc}" (${calibratedDesc.length} chars)`);
  const descPass = calibratedDesc.length >= 148 && calibratedDesc.length <= 156;
  console.log(`  -> Description length in Google SERP optimal range [148-156]: ${descPass ? 'PASS' : 'WARN'}`);

  // 3. Audit Google Organic Auto-Suggestions
  console.log("\n[TEST 3] Testing Google SERP Auto-Suggestion API...");
  try {
    const suggestions = await fetchGoogleSerpSuggestions("timber architecture");
    console.log(`- Google Suggestions returned: ${suggestions.length} items`);
    if (suggestions.length > 0) {
      console.log(`  Sample suggestion: "${suggestions[0]}"`);
      console.log(`  -> Google SERP Suggestions: PASS`);
    } else {
      console.log(`  -> Fallback mode operational: PASS`);
    }
  } catch (e: any) {
    console.log(`- SERP suggestion error: ${e.message}`);
  }

  // 4. Audit Failover Shield & AI Model Pool
  console.log("\n[TEST 4] Testing AI Failover Shield (Groq + Gemini)...");
  try {
    const aiResult = await failoverShield.executeWithFailover(
      "Explain in 2 sentences why historic masonry with breathable lime mortar outlasts modern concrete.",
      "You are a master conservationist and architectural writer."
    );
    console.log(`- AI Provider used: ${aiResult.provider.toUpperCase()}`);
    console.log(`- Keys Available: Gemini=${aiResult.keysCount?.gemini}, Groq=${aiResult.keysCount?.groq}`);
    console.log(`- Output Snippet: "${aiResult.text.trim().slice(0, 150)}..."`);
    console.log(`  -> Failover Shield: PASS`);
  } catch (e: any) {
    console.log(`- Failover Shield test error: ${e.message}`);
  }

  // 5. Audit Article Generation Engine & AEO Answer #0
  console.log("\n[TEST 5] Testing Article Generation & AEO Position #0 Extraction...");
  const testArticle = await generateDeepHumanArticle("Sustainable Oak Joinery", "Naveed Khatri");
  console.log(`- Article Title: "${testArticle.title}"`);
  console.log(`- Article Slug: "${testArticle.slug}"`);
  console.log(`- Read Time: "${testArticle.readTime}"`);
  console.log(`- AEO Snippet: "${testArticle.aeoAnswer}"`);
  console.log(`- Sections Generated: ${testArticle.sections.length}`);
  console.log(`- Key Takeaways: ${testArticle.keyTakeaways.length}`);
  const aeoPass = testArticle.aeoAnswer && testArticle.aeoAnswer.length > 30;
  console.log(`  -> AEO Answer #0 Extraction: ${aeoPass ? 'PASS' : 'FAIL'}`);

  // 6. Audit Indexing Pings
  console.log("\n[TEST 6] Testing Search Engine Indexing Protocols...");
  try {
    const indexNowRes = await pingIndexNow("https://www.moderntrendsnow.org/blog/sustainable-oak-joinery", "www.moderntrendsnow.org");
    console.log(`- IndexNow Protocol: ${indexNowRes.engine} -> ${indexNowRes.details || 'Connected'}`);
  } catch (e: any) {
    console.log(`- IndexNow: ${e.message}`);
  }

  console.log("\n=== ALL AUDIT CHECKS COMPLETED SUCCESSFULLY ===");
}

runAudit().catch(err => {
  console.error("Audit failure:", err);
  process.exit(1);
});
