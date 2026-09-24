const fs = require("fs");
let content = fs.readFileSync("src/components/NavBar.tsx", "utf8");

content = content.replace('import { Database } from "lucide-react";', 'import { Database } from "lucide-react";\nimport { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";');

content = content.replace(
  '<Link href="/dashboard" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold">Access Dashboard</Link>',
  `<SignedIn>
          <Link href="/dashboard" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold">Dashboard</Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold cursor-pointer">
            <SignInButton mode="modal">Sign In</SignInButton>
          </div>
        </SignedOut>`
);

fs.writeFileSync("src/components/NavBar.tsx", content, "utf8");
