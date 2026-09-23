const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf-8");
const start = content.indexOf("const handlePublish = async () => {");
const end = content.indexOf("return (", start);
const newHandlePublish = `
  const handlePublish = async () => {
    setIsProcessing(true);
    setProgressMsg(\`Starting robust generation of \${bulkCount} docs...\`);
    
    const appsScriptUrl = localStorage.getItem("apps_script_url");
    if (!appsScriptUrl || !appsScriptUrl.includes("script.google.com")) {
      setIsProcessing(false);
      setProgressMsg('');
      return;
    }

    // Pre-generate AI Content ONCE to avoid API rate limits during bulk generation
    let baseIntro = '';
    let baseBullets = '';
    try {
      setProgressMsg('Generating Premium AI Content Blueprint...');
      const p1 = encodeURIComponent(\`Write a highly professional, 150-word SEO introduction paragraph explaining the services and importance of \${keyword}. Make it sound like an expert industry report. Do not use quotes or markdown.\`);
      const p2 = encodeURIComponent(\`Write 5 highly actionable bullet points (key takeaways) regarding \${keyword}. Keep it professional and short. Do not include numbers, just the text. No markdown.\`);
      const [res1, res2] = await Promise.all([
        fetch(\`https://text.pollinations.ai/prompt/\${p1}\`).catch(() => null),
        fetch(\`https://text.pollinations.ai/prompt/\${p2}\`).catch(() => null)
      ]);
      if (res1 && res1.ok) baseIntro = await res1.text();
      if (res2 && res2.ok) baseBullets = await res2.text();
    } catch (e) {
      console.error('Failed to pre-generate AI blueprint', e);
    }

    const maxDocs = Math.min(bulkCount, 500); 
    let successCount = 0;
    const generatedUrls = [];
    const newReportData = [];

    for (let i = 1; i <= maxDocs; i++) {
      setProgressMsg(\`Generating document \${i} of \${maxDocs}...\`);
      
      const result = await generateDocWithRetry(appsScriptUrl, targetUrl, \`\${keyword} (Variation \${i})\`, baseIntro, baseBullets, 3);
      
      if (result && result.success) {
         newReportData.push(...result.data);
         generatedUrls.push(...result.data.map(d => d.url));
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

    setProgressMsg(\`Task Complete! Successfully generated \${successCount} out of \${maxDocs} documents.\`);
    
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
