const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /<header className="bg-slate-900 text-white shadow-md border-b border-slate-800"/,
  '<header className="bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden"'
);

content = content.replace(
  /<section className="space-y-4" id="summary_cards_section">/,
  '<section className="space-y-4 print:hidden" id="summary_cards_section">'
);

content = content.replace(
  /<section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs" id="monthly_chart_section">/,
  '<section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs print:hidden" id="monthly_chart_section">'
);

content = content.replace(
  /<section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs overflow-hidden" id="monthly_table_section">/,
  '<section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none" id="monthly_table_section">'
);

content = content.replace(
  /<main className="max-w-\[1920px\] mx-auto px-4 md:px-6 lg:px-8 mt-6 space-y-6 relative">/,
  '<main className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 mt-6 space-y-6 relative print:p-0 print:m-0 print:space-y-0">'
);

fs.writeFileSync('src/App.tsx', content);
