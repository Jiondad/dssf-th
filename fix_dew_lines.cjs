const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

// AM Dew Line
const amDewRegex = /<Line\s*yAxisId="left"\s*type="monotone"\s*dataKey="오전 결로지수"[\s\S]*?hide=\{!visibleLines\['오전 결로지수'\]\}\s*\/>/;
code = code.replace(amDewRegex, `<Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오전 결로지수" 
                  stroke="#ef4444" 
                  strokeWidth={4}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                  hide={!visibleLines['오전 결로지수']}
                />`);

// PM Dew Line
const pmDewRegex = /<Line\s*yAxisId="left"\s*type="monotone"\s*dataKey="오후 결로지수"[\s\S]*?hide=\{!visibleLines\['오후 결로지수'\]\}\s*\/>/;
code = code.replace(pmDewRegex, `<Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오후 결로지수" 
                  stroke="#b91c1c" 
                  strokeWidth={4}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                  hide={!visibleLines['오후 결로지수']}
                />`);

// AM Dew Toggle bg fix if failed
code = code.replace(/bg-\[#fb923c\]/, 'bg-[#ef4444]');
code = code.replace(/border-amber-400/, 'border-red-500');

// AM Air Toggle bg fix since the previous replace might have affected am air
code = code.replace(/bg-\[#60a5fa\]/, 'bg-[#fb923c]');

fs.writeFileSync('src/components/MonthlyChart.tsx', code);
