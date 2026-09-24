const fs = require("fs");
let content = fs.readFileSync("src/app/dashboard/google/page.tsx", "utf8");

// We need to inject a useEffect for the init
content = content.replace('const [keyword, setKeyword] = useState("");', 'const [keyword, setKeyword] = useState("");\n  const [displayCredits, setDisplayCredits] = useState<number>(0);');

const initEffect = `
  useEffect(() => {
    if (user) {
      const mdCredits = user.publicMetadata.credits;
      if (mdCredits === undefined) {
        fetch("/api/credits/init", { method: "POST" }).then(() => {
          user.reload();
        });
      } else {
        setDisplayCredits(mdCredits as number);
      }
    }
  }, [user]);
`;

content = content.replace('const credits = (user?.publicMetadata?.credits as number) || 0;', initEffect);

// Fix the UI display to use displayCredits
content = content.replace(/\{credits\}/g, '{displayCredits}');

// Fix the button check to use displayCredits and count
content = content.replace(/displayCredits === 0/g, 'displayCredits < count');
content = content.replace(/Out of Credits - Recharge Now/g, 'Not Enough Credits - Recharge');

// Update the fetch call to deduct `count` credits
content = content.replace(
  'const creditRes = await fetch("/api/credits/deduct", { method: "POST" });',
  'const creditRes = await fetch("/api/credits/deduct", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: count }) });'
);

// Reload user after generation so credits update on screen
content = content.replace(
  'setIsGenerating(false);\n  };',
  'await user?.reload();\n    setIsGenerating(false);\n  };'
);

// We need to change the count label to clarify 1 credit = 1 link
content = content.replace(
  'value={count}',
  'value={count}'
);
content = content.replace(
  '<label className="block text-sm font-bold text-slate-400 mb-2">Number of Links in Wheel</label>',
  '<label className="block text-sm font-bold text-slate-400 mb-2">Number of Links (1 Link = 1 Credit)</label>'
);

fs.writeFileSync("src/app/dashboard/google/page.tsx", content, "utf8");
