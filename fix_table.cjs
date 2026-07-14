const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Table tag
code = code.replace(
  '<table className="w-full text-xs text-left border-collapse min-w-[1500px]">',
  '<table className="w-full text-[10px] xl:text-xs text-center border-collapse table-fixed min-w-[800px]">'
);

// 2. Table Headers
code = code.replace(
  '<th className="sticky left-0 bg-slate-900 border border-slate-700 p-2.5 z-20 font-bold min-w-[70px]">구분</th>',
  '<th className="sticky left-0 bg-slate-900 border border-slate-700 p-1 xl:p-1.5 z-20 font-bold w-[40px] xl:w-[60px] break-keep">구분</th>'
);
code = code.replace(
  '<th className="sticky left-[70px] bg-slate-900 border border-slate-700 p-2.5 z-20 font-bold min-w-[130px]">측정 항목</th>',
  '<th className="sticky left-[40px] xl:left-[60px] bg-slate-900 border border-slate-700 p-1 xl:p-1.5 z-20 font-bold w-[75px] xl:w-[100px] break-keep">측정 항목</th>'
);

code = code.replace(
  /className=\{`border border-slate-700 p-2.5 font-bold font-mono cursor-pointer transition-all hover:bg-blue-800 \$\{/g,
  'className={`border border-slate-700 p-1 xl:p-1.5 font-bold font-mono cursor-pointer transition-all hover:bg-blue-800 ${'
);

// 3. Tbody replacements
// The rows have `p-2.5`. Let's replace all `p-2.5` that are in classNames of `td` elements.
code = code.replace(/<td([^>]*)p-2\.5([^>]*)>/g, '<td$1p-1 xl:p-1.5$2>');

// Change left-[70px] to left-[40px] xl:left-[60px]
code = code.replace(/left-\[70px\]/g, 'left-[40px] xl:left-[60px]');

fs.writeFileSync('src/App.tsx', code);
console.log("Replaced successfully!");
