const fs = require("fs");

let navContent = fs.readFileSync("src/components/NavBar.tsx", "utf8");
navContent = navContent.replace('import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";', 'import { SignInButton, UserButton } from "@clerk/nextjs";\nimport { auth } from "@clerk/nextjs/server";');

const replacement = `{userId ? (
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold">Dashboard</Link>
          <UserButton />
        </div>
      ) : (
        <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg transition-all font-bold cursor-pointer">
          <SignInButton mode="modal">Sign In</SignInButton>
        </div>
      )}`;

navContent = navContent.replace(/<SignedIn>[\s\S]*?<\/SignedOut>/, replacement);
navContent = navContent.replace("export default function NavBar() {", "export default async function NavBar() {\n  const { userId } = await auth();");

fs.writeFileSync("src/components/NavBar.tsx", navContent, "utf8");
