const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const isDangerStr = "${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-800'}";
const isDangerMutedStr = "${maxDewIndexToday > 80 ? 'text-white/80' : 'text-slate-500'}";
const isDanger600Str = "${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}";
const isDanger900Str = "${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-900'}";

// Replace animate
content = content.replace(
  `animate={{ backgroundColor: condensationStatus.bgColor.includes('emerald') ? '#d1fae5' : condensationStatus.bgColor.includes('amber') ? '#fef3c7' : '#ffe4e6' }}`,
  `animate={{ backgroundColor: condensationStatus.bgColor.includes('emerald') ? '#d1fae5' : condensationStatus.bgColor.includes('amber') ? '#fef3c7' : '#ef4444' }}`
);

// Replace className of wrapper
content = content.replace(
  `className={\`rounded-xl border p-3 shadow-xs hover:shadow-md transition-all relative z-10 overflow-visible flex flex-col justify-between \${condensationStatus.borderColor} \${maxDewIndexToday > 80 ? 'animate-pulse' : ''}\`}`,
  `className={\`rounded-xl border p-3 shadow-xs hover:shadow-md transition-all relative z-10 overflow-visible flex flex-col justify-between \${maxDewIndexToday > 80 ? 'border-red-600 bg-red-500 text-white animate-pulse' : condensationStatus.borderColor}\`}`
);

// Replace text-slate-800
content = content.replace(
  `<span className="text-sm text-slate-800 font-extrabold tracking-tight block">결로 위험 지수</span>`,
  `<span className={\`text-sm font-extrabold tracking-tight block \${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-800'}\`}>결로 위험 지수</span>`
);

content = content.replace(
  `<h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Condensation</h3>`,
  `<h3 className={\`text-[10px] font-medium uppercase tracking-wide \${maxDewIndexToday > 80 ? 'text-white/80' : 'text-slate-500'}\`}>Condensation</h3>`
);

content = content.replace(
  `<span className="text-[10px] text-slate-600 font-semibold block uppercase">오전(AM)</span>`,
  `<span className={\`text-[10px] font-semibold block uppercase \${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}\`}>오전(AM)</span>`
);

content = content.replace(
  `<span className="text-lg font-black font-mono text-slate-900">{currentRecord.am.dewIndex !== null ? currentRecord.am.dewIndex : "-"}</span>`,
  `<span className={\`text-lg font-black font-mono \${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-900'}\`}>{currentRecord.am.dewIndex !== null ? currentRecord.am.dewIndex : "-"}</span>`
);

content = content.replace(
  `<span className="text-[10px] text-slate-600 font-bold">Pt</span>`,
  `<span className={\`text-[10px] font-bold \${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}\`}>Pt</span>`
);

content = content.replace(
  `<span className="text-[10px] text-slate-600 font-semibold block uppercase">오후(PM)</span>`,
  `<span className={\`text-[10px] font-semibold block uppercase \${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}\`}>오후(PM)</span>`
);

content = content.replace(
  `<span className="text-lg font-black font-mono text-slate-900">{currentRecord.pm.dewIndex !== null ? currentRecord.pm.dewIndex : "-"}</span>`,
  `<span className={\`text-lg font-black font-mono \${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-900'}\`}>{currentRecord.pm.dewIndex !== null ? currentRecord.pm.dewIndex : "-"}</span>`
);

// Target needs replacing too
content = content.replace(
  `<span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded whitespace-nowrap">`,
  `<span className={\`font-mono px-1 py-0.5 rounded whitespace-nowrap \${maxDewIndexToday > 80 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}\`}>`
);

// And the status text
content = content.replace(
  `<span className={\`font-bold flex items-center gap-1 \${condensationStatus.textColor} whitespace-nowrap\`}>`,
  `<span className={\`font-bold flex items-center gap-1 \${maxDewIndexToday > 80 ? 'text-white' : condensationStatus.textColor} whitespace-nowrap\`}>`
);

// and Pt again
content = content.replace(
  `<span className="text-[10px] text-slate-600 font-bold">Pt</span>`,
  `<span className={\`text-[10px] font-bold \${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}\`}>Pt</span>`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched card");
