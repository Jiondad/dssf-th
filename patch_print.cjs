const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Root wrapper
const oldRootTop = `<div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12 print:bg-white print:pb-0 print:min-h-0" id="app_root">`;
const newRootTop = `<div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-slate-800 font-sans antialiased overflow-hidden print:block print:bg-white print:h-auto print:overflow-visible" id="app_root">
      
      {/* 16:9 Aspect Ratio Wrapper */}
      <div 
        className="relative bg-slate-50 flex flex-col shadow-2xl overflow-hidden print:hidden" 
        style={{ 
          width: '100vw', 
          maxWidth: 'calc(100vh * 16 / 9)', 
          height: '100vh', 
          maxHeight: 'calc(100vw * 9 / 16)',
          aspectRatio: '16/9' 
        }}
      >`;
content = content.replace(oldRootTop, newRootTop);

// 2. Header
const oldHeader = `<header className="bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden" id="header_section">`;
const newHeader = `<header className="bg-slate-900 text-white shadow-md border-b border-slate-800 shrink-0 print:hidden" id="header_section">`;
content = content.replace(oldHeader, newHeader);

// 3. Main container
const oldMain = `<main className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 mt-4 space-y-4 relative print:hidden">`;
const newMain = `<main className="flex-1 flex flex-col min-h-0 w-full px-3 py-3 md:px-4 md:py-4 space-y-3 relative print:hidden">`;
content = content.replace(oldMain, newMain);

// 4. summary_cards_section
const oldSummary = `<section className={\`transition-opacity duration-300 \${isLoadingData ? 'opacity-30' : 'opacity-100'} print:hidden\`} id="summary_cards_section">`;
const newSummary = `<section className={\`transition-opacity duration-300 shrink-0 \${isLoadingData ? 'opacity-30' : 'opacity-100'} print:hidden\`} id="summary_cards_section">`;
content = content.replace(oldSummary, newSummary);

// 5. monthly_chart_section
const oldChartSection = `<section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs print:hidden" id="monthly_chart_section">`;
const newChartSection = `<section className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs print:hidden flex-1 flex flex-col min-h-0" id="monthly_chart_section">`;
content = content.replace(oldChartSection, newChartSection);

// 6. chart_container
const oldChartContainer = `<div className="h-[410px] md:h-[490px] w-full" id="chart_container">`;
const newChartContainer = `<div className="flex-1 w-full min-h-0" id="chart_container">`;
content = content.replace(oldChartContainer, newChartContainer);

// 7. monthly_table_section
const oldTableSection = `<section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs overflow-hidden" id="monthly_table_section">`;
const newTableSection = `<section className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs overflow-hidden flex-1 flex flex-col min-h-0" id="monthly_table_section">`;
content = content.replace(oldTableSection, newTableSection);

// 8. ledger_table_wrapper
const oldLedgerWrapper = `<div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner print:hidden" id="ledger_table_wrapper">`;
const newLedgerWrapper = `<div className="overflow-auto flex-1 rounded-xl border border-slate-200 shadow-inner print:hidden" id="ledger_table_wrapper">`;
content = content.replace(oldLedgerWrapper, newLedgerWrapper);

// 9. Close the 16:9 wrapper
const oldMainEnd = `      </main>`;
const newMainEnd = `      </main>
      </div> {/* End 16:9 Wrapper */}`;
content = content.replace(oldMainEnd, newMainEnd);

fs.writeFileSync('src/App.tsx', content);
console.log("Layout patched!");
