const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. main tag - less spacing
content = content.replace(
  '<main className="flex-1 min-h-0 flex flex-col max-w-full w-full mx-auto px-4 md:px-6 lg:px-8 mt-4 pb-4 space-y-4 relative print:hidden">',
  '<main className="flex-1 min-h-0 flex flex-col max-w-full w-full mx-auto px-4 md:px-6 lg:px-8 mt-2 pb-2 space-y-2 relative print:hidden">'
);

// 2. chart section - shrink-0 to follow contents
content = content.replace(
  '<section className="flex-[1.2] min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs print:hidden" id="monthly_chart_section">',
  '<section className="shrink-0 flex flex-col bg-white rounded-2xl border border-slate-200 p-2 md:p-3 shadow-xs print:hidden" id="monthly_chart_section">'
);

// 3. chart container - explicit compact height
content = content.replace(
  '<div className="flex-1 min-h-0 w-full" id="chart_container">',
  '<div className="h-[280px] md:h-[340px] w-full" id="chart_container">'
);

// 4. Monthly Table Section - padding reduced
content = content.replace(
  '<section className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs overflow-hidden" id="monthly_table_section">',
  '<section className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200 p-2 md:p-3 shadow-xs overflow-hidden" id="monthly_table_section">'
);

// 5. Table Header - padding/margin reduced
content = content.replace(
  '<div className="shrink-0 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-3 mb-3">',
  '<div className="shrink-0 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 border-b border-slate-100 pb-2 mb-2">'
);

// 6. Header
content = content.replace(
  '<div className="max-w-full mx-auto px-4 py-2.5 md:py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">',
  '<div className="max-w-full mx-auto px-4 py-1.5 md:py-2 flex flex-col md:flex-row justify-between items-center gap-2">'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched layout to be compact successfully!");
