const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/reports/page.tsx", "utf8");

// Fix the header row
content = content.replace(
  '<th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Keyword</th>',
  `<th className="p-4 w-12">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                          checked={reports.length > 0 && selectedIds.length === reports.length}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Keyword</th>`
);

// Fix the body checkbox centering
content = content.replace(
  /<td className="p-4">\s*<input\s*type="checkbox"\s*className="w-4 h-4 rounded border-slate-700 bg-slate-800 checked:bg-emerald-500 cursor-pointer"\s*checked=\{selectedIds.includes\(report\.id\)\}\s*onChange=\{\(\) => toggleSelect\(report\.id\)\}\s*\/>\s*<\/td>/,
  `<td className="p-4">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                              checked={selectedIds.includes(report.id)}
                              onChange={() => toggleSelect(report.id)}
                            />
                          </div>
                        </td>`
);

// We need to use global replace for the body checkbox because it's inside a map()
content = content.replace(
  /<td className="p-4">\s*<input\s*type="checkbox"\s*className="w-4 h-4 rounded border-slate-700 bg-slate-800 checked:bg-emerald-500 cursor-pointer"[\s\S]*?<\/td>/g,
  `<td className="p-4">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                              checked={selectedIds.includes(report.id)}
                              onChange={() => toggleSelect(report.id)}
                            />
                          </div>
                        </td>`
);

// Fix the "15 DA-99" badge wrapping by adding whitespace-nowrap
content = content.replace(
  'className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20"',
  'className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 whitespace-nowrap inline-block"'
);

// Action buttons formatting
content = content.replace(
  '<div className="flex items-center gap-2">',
  '<div className="flex items-center gap-2 justify-end">'
);

content = content.replace(
  '<th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>',
  '<th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>'
);

fs.writeFileSync("src/app/dashboard/reports/page.tsx", content, "utf8");
console.log("Fixed table layout");
