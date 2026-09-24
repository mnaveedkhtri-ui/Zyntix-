const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");

// 1. Add selectedIds state
if (!content.includes('const [selectedIds, setSelectedIds]')) {
  content = content.replace(
    'const [copiedId, setCopiedId] = useState<string | null>(null);',
    'const [copiedId, setCopiedId] = useState<string | null>(null);\n  const [selectedIds, setSelectedIds] = useState<string[]>([]);'
  );
}

// 2. Add handleBulkDelete
const bulkFunc = `
  const handleBulkDelete = async () => {
    if (!confirm(\`Are you sure you want to delete \${selectedIds.length} reports?\`)) return;
    try {
      const res = await fetch(\`/api/reports?ids=\${selectedIds.join(",")}\`, { method: 'DELETE' });
      if (res.ok) {
        setReports(reports.filter(r => !selectedIds.includes(r.id)));
        setSelectedIds([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === reports.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reports.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
`;

if (!content.includes('handleBulkDelete')) {
  content = content.replace(
    'const handleDelete = async (id: string) => {',
    bulkFunc + '\n  const handleDelete = async (id: string) => {'
  );
}

// 3. Add Bulk Delete Button near title
if (!content.includes('handleBulkDelete()')) {
  content = content.replace(
    '<p className="text-slate-400 mt-2 text-lg">View, copy, and download Cloud TXT reports for your clients.</p>',
    `<p className="text-slate-400 mt-2 text-lg">View, copy, and download Cloud TXT reports for your clients.</p>
          </div>
          {selectedIds.length > 0 && (
            <div className="mb-4 flex items-center gap-4 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl w-fit">
              <span className="text-red-400 font-bold">{selectedIds.length} reports selected</span>
              <button 
                onClick={handleBulkDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected
              </button>
            </div>
          )}
          <div className="hidden">`
  );
  content = content.replace('<div className="hidden">', ''); // Clean up the hacky marker
}

// 4. Update Table Header with Checkbox
if (!content.includes('toggleSelectAll')) {
  content = content.replace(
    '<th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Keyword</th>',
    `<th className="p-4 w-12">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 checked:bg-emerald-500 cursor-pointer"
                        checked={reports.length > 0 && selectedIds.length === reports.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Keyword</th>`
  );
}
// update colspans for empty states
content = content.replace(/colSpan=\{5\}/g, 'colSpan={6}');

// 5. Update Table Row with Checkbox
if (!content.includes('toggleSelect(report.id)')) {
  content = content.replace(
    '<td className="p-4 font-bold text-sm text-emerald-400">{report.keyword}</td>',
    `<td className="p-4">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800 checked:bg-emerald-500 cursor-pointer"
                            checked={selectedIds.includes(report.id)}
                            onChange={() => toggleSelect(report.id)}
                          />
                        </td>
                        <td className="p-4 font-bold text-sm text-emerald-400">{report.keyword}</td>`
  );
}

fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
console.log("Added bulk delete UI");
