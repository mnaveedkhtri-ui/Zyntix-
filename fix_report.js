const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");

const helperFunc = `
  const flattenUrls = (urlsArray: any[]) => {
    if (!urlsArray) return [];
    let flat: string[] = [];
    urlsArray.forEach(item => {
      if (typeof item === 'string') {
        flat.push(item);
      } else if (typeof item === 'object' && item !== null) {
        if (item.doc) flat.push(item.doc);
        if (item.slides) flat.push(item.slides);
        if (item.form) flat.push(item.form);
      }
    });
    return flat;
  };
`;

content = content.replace("const handleDownloadTXT =", helperFunc + "\n  const handleDownloadTXT =");

content = content.replace(
  `    if (campaign.urls) {
      campaign.urls.forEach((url: string, index: number) => {
        txtContent += \`\${index + 1}. \${url}\\n\`;
      });
    }`,
  `    const flatUrls = flattenUrls(campaign.urls);
    flatUrls.forEach((url: string, index: number) => {
      txtContent += \`\${index + 1}. \${url}\\n\`;
    });`
);

content = content.replace(
  `  const handleCopyLinks = (campaign: any) => {
    if (campaign.urls) {
      const text = campaign.urls.join("\\n");`,
  `  const handleCopyLinks = (campaign: any) => {
    const flatUrls = flattenUrls(campaign.urls);
    if (flatUrls.length > 0) {
      const text = flatUrls.join("\\n");`
);

content = content.replace(
  `{reports.find(r => r.id === expandedId)?.urls?.map((url: string, i: number) => (`,
  `{flattenUrls(reports.find(r => r.id === expandedId)?.urls || []).map((url: string, i: number) => (`
);

fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
console.log("Fixed report URL flattening");
