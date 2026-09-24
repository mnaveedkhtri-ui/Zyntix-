const fs = require("fs");
let content = fs.readFileSync("src/app/pricing/page.tsx", "utf8");

content = content.replace(
  '<a href="mailto:naveedkhtri7@gmail.com" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all">\n              <Mail className="w-5 h-5" /> Email Us\n            </a>',
  '<a href="https://wa.me/923323219981" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#25D366]/20">\n              <MessageCircle className="w-5 h-5" /> Buy Enterprise\n            </a>'
);

fs.writeFileSync("src/app/pricing/page.tsx", content, "utf8");
