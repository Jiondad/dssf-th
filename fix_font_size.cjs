const fs = require('fs');
let content = fs.readFileSync('src/components/SummaryCards.tsx', 'utf8');

// Replace measurement values
content = content.replace(/text-lg font-bold font-mono/g, 'text-4xl font-bold font-mono');
content = content.replace(/text-lg font-black font-mono/g, 'text-4xl font-black font-mono');

// Replace AM/PM labels
content = content.replace(/text-\[10px\] text-slate-400 font-semibold block uppercase/g, 'text-xs text-slate-400 font-semibold block uppercase');
content = content.replace(/text-\[10px\] font-semibold block uppercase/g, 'text-xs font-semibold block uppercase');

// Replace unit labels
content = content.replace(/text-\[10px\] text-slate-500 font-bold/g, 'text-sm text-slate-500 font-bold');
content = content.replace(/text-\[10px\] font-bold \$/g, 'text-sm font-bold $');

// Replace gaps
content = content.replace(/flex items-baseline gap-0\.5 mt-0\.5/g, 'flex items-baseline gap-1 mt-1');

fs.writeFileSync('src/components/SummaryCards.tsx', content);
console.log("SummaryCards.tsx font size updated");
