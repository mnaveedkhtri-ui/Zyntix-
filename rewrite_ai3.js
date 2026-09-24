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
    
    let globalAiIntro = "";
    let globalAiBullets = "";
    try {
      setProgressMsg("Writing highly-niche SEO content using Premium AI... (Takes ~15 seconds)");
      
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      
      if (res.ok) {
        const data = await res.json();
        globalAiIntro = data.aiIntro || "";
        globalAiBullets = data.aiBullets || "";
      }
    } catch (e) {
      console.warn("Server AI timeout, using robust backend Spintax fallback");
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
