const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Title section fixes
content = content.replace(
  /<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-5 mb-5">/,
  '<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-5 mb-5 print:border-none print:pb-2 print:mb-2 print:block">'
);

content = content.replace(
  /<FileSpreadsheet className="w-5\.5 h-5\.5 text-blue-600" \/>/,
  '<FileSpreadsheet className="w-5.5 h-5.5 text-blue-600 print:hidden" />'
);

content = content.replace(
  /<p className="text-xs text-slate-500 mt-0\.5">/,
  '<p className="text-xs text-slate-500 mt-0.5 print:hidden">'
);

content = content.replace(
  /<div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between sm:justify-end">/,
  '<div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between sm:justify-end print:hidden">'
);

// 2. Hide instruction block inside table footer
content = content.replace(
  /<div className="mt-4 flex items-center justify-between text-\[11px\] text-slate-400 font-mono">/,
  '<div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono print:hidden">'
);

// 3. Remove subtitles from print_ledger_wrapper
const printLedgerOld = `<div className="hidden print:block space-y-8 print:w-full print:m-0 print:p-0 print:overflow-visible" id="print_ledger_wrapper">
            <h3 className="text-xl font-bold mb-4 text-center">{selectedMonth}월 온습도 및 결로지수 대장 (1일 ~ 16일) - {selectedFactory}</h3>
            {renderTable(fixedDays.slice(0, 16), true)}
            <h3 className="text-xl font-bold mb-4 mt-12 text-center" style={{ pageBreakBefore: 'always' }}>{selectedMonth}월 온습도 및 결로지수 대장 (17일 ~ 31일) - {selectedFactory}</h3>
            {renderTable(fixedDays.slice(16, 31), true)}
          </div>`;

const printLedgerNew = `<div className="hidden print:block space-y-4 print:w-full print:m-0 print:p-0 print:overflow-visible" id="print_ledger_wrapper">
            {renderTable(fixedDays.slice(0, 16), true)}
            <div style={{ pageBreakBefore: 'always' }} className="pt-2">
              {renderTable(fixedDays.slice(16, 31), true)}
            </div>
          </div>`;

content = content.replace(printLedgerOld, printLedgerNew);

fs.writeFileSync('src/App.tsx', content);
