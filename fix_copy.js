const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");

content = content.replace(
  `  const handleCopyLinks = (campaign: any) => {
    if (!campaign.urls) return;
    const links = campaign.urls.join("\\n");
    navigator.clipboard.writeText(links);
    setCopiedId(campaign.id);
    setTimeout(() => setCopiedId(null), 2000);
  };`,
  `  const handleCopyLinks = (campaign: any) => {
    const flatUrls = flattenUrls(campaign.urls);
    if (flatUrls.length === 0) return;
    const links = flatUrls.join("\\n");
    navigator.clipboard.writeText(links);
    setCopiedId(campaign.id);
    setTimeout(() => setCopiedId(null), 2000);
  };`
);

fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
console.log("Fixed handleCopyLinks");
