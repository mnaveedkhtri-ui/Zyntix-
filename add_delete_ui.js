const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");

// Import Trash2
content = content.replace(
  'import { FileText, Download, Copy, CheckCircle2, Loader2, ExternalLink } from "lucide-react";',
  'import { FileText, Download, Copy, CheckCircle2, Loader2, ExternalLink, Trash2 } from "lucide-react";'
);

// Add handleDelete function
const deleteFunc = `
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(\`/api/reports?id=\${id}\`, { method: 'DELETE' });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
`;

content = content.replace(
  'const handleCopyLinks = (campaign: any) => {',
  deleteFunc + '\n  const handleCopyLinks = (campaign: any) => {'
);

// Add Delete Button in Action Column
const deleteBtn = `
                            <button 
                              onClick={() => handleDelete(report.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-2 py-1.5 rounded-lg transition-colors font-medium flex items-center justify-center"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
`;

content = content.replace(
  '</div>\n                        </td>',
  deleteBtn
);

fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
console.log("Added UI delete button");
