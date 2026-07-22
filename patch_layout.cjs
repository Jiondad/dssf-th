const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Root container
content = content.replace(
  '<div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12 print:bg-white print:pb-0 print:min-h-0" id="app_root">',
  '<div className="h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-800 font-sans antialiased print:bg-white print:h-auto print:overflow-visible print:block" id="app_root">'
);

// 2. Main container
content = content.replace(
  '<main className="max-w-full mx-auto px-4 md:px-6 lg:px-8 mt-4 space-y-4 relative print:hidden">',
  '<main className="flex-1 min-h-0 flex flex-col max-w-full w-full mx-auto px-4 md:px-6 lg:px-8 mt-4 pb-4 space-y-4 relative print:hidden">'
);

// 3. Summary Cards Section
content = content.replace(
  '<section className={`transition-opacity duration-300 ${isLoadingData ? \'opacity-30\' : \'opacity-100\'} print:hidden`} id="summary_cards_section">',
  '<section className={`shrink-0 transition-opacity duration-300 ${isLoadingData ? \'opacity-30\' : \'opacity-100\'} print:hidden`} id="summary_cards_section">'
);

// 4. Monthly Chart Section
content = content.replace(
  '<section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs print:hidden" id="monthly_chart_section">',
  '<section className="flex-[1.2] min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs print:hidden" id="monthly_chart_section">'
);

// 5. Chart Container Height
content = content.replace(
  '<div className="h-[410px] md:h-[490px] w-full" id="chart_container">',
  '<div className="flex-1 min-h-0 w-full" id="chart_container">'
);

// 6. Monthly Table Section
content = content.replace(
  '<section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs overflow-hidden" id="monthly_table_section">',
  '<section className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs overflow-hidden" id="monthly_table_section">'
);

// 7. Table Header/Title div should be shrink-0
content = content.replace(
  '<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-3 mb-3">',
  '<div className="shrink-0 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-3 mb-3">'
);

// 8. Ledger Table Wrapper
content = content.replace(
  '<div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner print:hidden" id="ledger_table_wrapper">',
  '<div className="flex-1 overflow-auto rounded-xl border border-slate-200 shadow-inner print:hidden" id="ledger_table_wrapper">'
);

// 9. Copyright footer in table section should be shrink-0
content = content.replace(
  '<div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono print:hidden">',
  '<div className="shrink-0 mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono print:hidden">'
);


fs.writeFileSync('src/App.tsx', content);
console.log("Layout patched successfully!");
