const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

// AM Dew Toggle
code = code.replace(/border-red-500 shadow-xs/g, 'border-emerald-400 shadow-xs');
code = code.replace(/<span className="w-3 h-0\.5 rounded-sm bg-\[#ef4444\] shrink-0"><\/span>/, '<span className="w-3 h-0.5 rounded-sm bg-[#10b981] shrink-0"></span>');

// PM Dew Toggle
code = code.replace(/border-red-700 shadow-xs/g, 'border-emerald-600 shadow-xs');
code = code.replace(/<span className="w-3 h-0 border-b-\[2px\] border-dashed border-\[#b91c1c\] shrink-0"><\/span>/, '<span className="w-3 h-0 border-b-[2px] border-dashed border-[#10b981] shrink-0"></span>');

// Reference line
code = code.replace(/<ReferenceLine \s*y=\{80\} /g, '<ReferenceLine \n                  y={81} ');
code = code.replace(/value: '위험 기준선 \(80 Pt\)'/g, "value: '위험 기준선 (81 Pt)'");

fs.writeFileSync('src/components/MonthlyChart.tsx', code);
