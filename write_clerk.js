const fs = require("fs");

const signInContent = `import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <SignIn />
    </div>
  );
}`;

fs.writeFileSync("src/app/sign-in/[[...sign-in]]/page.tsx", signInContent, "utf8");

const signUpContent = `import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 -translate-y-12 -translate-x-1/3 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-[400px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <SignUp />
    </div>
  );
}`;

fs.writeFileSync("src/app/sign-up/[[...sign-up]]/page.tsx", signUpContent, "utf8");
