const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. In @page styles, change margin to 5mm
content = content.replace(/margin: 8mm;/g, 'margin: 5mm;');

// 2. Add whitespace-nowrap and adjust width for "측정 항목" th
content = content.replace(
  /w-\[80px\] xl:w-\[115px\] break-keep">측정 항목<\/th>/g,
  'w-[95px] xl:w-[125px] print:w-[115px] whitespace-nowrap">측정 항목</th>'
);

// 3. Add whitespace-nowrap to the "측정 항목" td elements (the sticky ones)
content = content.replace(
  /className="sticky left-\[35px\] xl:left-\[45px\] bg-slate-50 border border-slate-200 p-1 xl:p-1\.5 font-semibold text-slate-700 text-left z-10 shadow-xs"/g,
  'className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap"'
);

// Same for the '결로지수 (Pt)' which might have 'font-bold text-slate-800' instead of 'font-semibold text-slate-700'
content = content.replace(
  /className="sticky left-\[35px\] xl:left-\[45px\] bg-slate-50 border border-slate-200 p-1 xl:p-1\.5 font-bold text-slate-800 text-left z-10 shadow-xs"/g,
  'className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-bold text-slate-800 text-left z-10 shadow-xs whitespace-nowrap"'
);

// Remove the vertical padding / margin inside print-container between the two tables
// Old: <div style={{ pageBreakBefore: 'always' }} className="pt-6">
// New: <div className="pt-2"> (or remove completely)
content = content.replace(
  /<div style={{ pageBreakBefore: 'always' }} className="pt-6">/g,
  '<div className="pt-4">'
);

fs.writeFileSync('src/App.tsx', content);
