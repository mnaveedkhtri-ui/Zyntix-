const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");
const start = content.indexOf("const handlePublish = async () => {");
const end = content.indexOf("return (", start);
const newHandlePublish = `
  const handlePublish = async () => {
    setIsProcessing(true);
    setProgressMsg(\`Initializing AI Blueprint for \${keyword}...\`);
    
    const appsScriptUrl = localStorage.getItem("apps_script_url");
    if (!appsScriptUrl || !appsScriptUrl.includes("script.google.com")) {
      setIsProcessing(false);
      setProgressMsg('');
      return;
    }

    const maxDocs = Math.min(bulkCount, 500); 
    
    // PRE-GENERATE AI CONTENT ONCE TO SAVE TIME AND API LIMITS
    let globalAiIntro = "";
    let globalAiBullets = "";
    try {
      const p1 = encodeURIComponent(\`IMPORTANT: DO NOT USE REASONING. DO NOT THINK OUT LOUD. DIRECTLY OUTPUT THE TEXT. Write a highly professional, 100-word SEO introduction paragraph for \${keyword}. Make it specific to this exact niche. Do not use quotes or markdown.\`);
      const p2 = encodeURIComponent(\`IMPORTANT: DO NOT USE REASONING. DO NOT THINK OUT LOUD. DIRECTLY OUTPUT THE TEXT. Write 4 highly actionable bullet points regarding \${keyword}. Keep it specific to the niche. Do not include numbers, just the text. No markdown.\`);
      
      const controller = new AbortController();
      // Increase timeout to 45 seconds for slow AI!
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      
      setProgressMsg("Writing highly-niche SEO content using Premium AI... (Takes ~15 seconds)");
      
      const [res1, res2] = await Promise.all([
        fetch(\`https://text.pollinations.ai/prompt/\${p1}\`, { signal: controller.signal }).catch(() => null),
        fetch(\`https://text.pollinations.ai/prompt/\${p2}\`, { signal: controller.signal }).catch(() => null)
      ]);
      
      clearTimeout(timeoutId);
      
      if (res1 && res1.ok) globalAiIntro = await res1.text();
      if (res2 && res2.ok) globalAiBullets = await res2.text();
      
    } catch (e) {
      console.warn("AI timeout, using robust backend Spintax fallback");
    }

    let successCount = 0;
    const generatedUrls = [];
    const newReportData = [];

    for (let i = 1; i <= maxDocs; i++) {
      setProgressMsg(\`Publishing document \${i} of \${maxDocs} to Google Drive...\`);
      const result = await generateDocWithRetry(appsScriptUrl, targetUrl, \`\${keyword} (Variation \${i})\`, globalAiIntro, globalAiBullets, 3);
      
      if (result && result.success) {
         newReportData.push(...result.data);
         generatedUrls.push(...result.data.map((d: any) => d.url));
         successCount++;
         setReportData(prev => [...result.data, ...prev]);
      } else {
         console.error(\`Doc \${i} failed permanently after 3 retries.\`);
         setProgressMsg(\`Warning: Document \${i} failed due to Google limits. Continuing...\`);
      }
      
      if (i < maxDocs) {
        setProgressMsg(\`Document \${i} complete. Cooling down API for 3 seconds...\`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setProgressMsg(\`? Task Complete! Successfully generated \${successCount} out of \${maxDocs} documents.\`);
    
    if (successCount > 0) {
      const newCampaign = {
        id: \`CMP-\${Date.now().toString().slice(-6)}\`,
        type: 'Google Entity Stack',
        client: targetUrl || "Unknown Client",
        links: successCount,
        date: new Date().toLocaleDateString(),
        status: successCount === maxDocs ? 'Completed' : 'Partial Success',
        urls: generatedUrls
      };
      const existingReports = JSON.parse(localStorage.getItem("zyntix_reports") || "[]");
      localStorage.setItem("zyntix_reports", JSON.stringify([newCampaign, ...existingReports]));
    }

    setIsProcessing(false);
  }

  `;
content = content.substring(0, start) + newHandlePublish + content.substring(end);
fs.writeFileSync("src/app/dashboard/google/page.tsx", content);
