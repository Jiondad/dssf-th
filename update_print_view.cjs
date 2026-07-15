const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the old print_ledger_wrapper
const oldPrintWrapperRegex = /<div className="hidden print:block space-y-4 print:w-full print:m-0 print:p-0 print:overflow-visible" id="print_ledger_wrapper">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(oldPrintWrapperRegex, '');

// 2. Change main className to add print:hidden and remove old print styles
content = content.replace(
  /<main className="max-w-\[1920px\] mx-auto px-4 md:px-6 lg:px-8 mt-6 space-y-6 relative print:p-0 print:m-0 print:space-y-0">/,
  '<main className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 mt-6 space-y-6 relative print:hidden">'
);

// 3. Inject the style block and new print-container at the top of app_root
const appRootMatch = '<div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12" id="app_root">';
const replacement = `<div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12 print:bg-white print:pb-0 print:min-h-0" id="app_root">
      <style>{\`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print\\\\:hidden {
            display: none !important;
          }
          .print-container {
            display: block !important;
            width: 100% !important;
          }
          table {
            width: 100% !important;
            table-layout: fixed !important;
          }
        }
      \`}</style>
      
      {/* Print Only View */}
      <div className="hidden print:block print-container">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
        {renderTable(fixedDays.slice(0, 16), true)}
        <div style={{ pageBreakBefore: 'always' }} className="pt-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
          {renderTable(fixedDays.slice(16, 31), true)}
        </div>
      </div>
`;
content = content.replace(appRootMatch, replacement);

fs.writeFileSync('src/App.tsx', content);
