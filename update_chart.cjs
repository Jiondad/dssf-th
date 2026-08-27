const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

// 1. Remove getDewColor, CustomDewDot, CustomDewActiveDot
code = code.replace(/const getDewColor =[\s\S]*?const CustomDewActiveDot =[\s\S]*?<\/circle>;\n};\n/g, '');

// 2. Remove dewOffsets useMemo
code = code.replace(/const dewOffsets = useMemo\(\(\) => \{[\s\S]*?\}, \[chartData\]\);\n/g, '');

// 3. Update lines and their colors + strokeDasharray + strokeWidth
code = code.replace(/<Line\s+yAxisId="left"\s+type="monotone"\s+dataKey="오전 대기온도"\s+stroke="[^"]+"\s+strokeWidth=\{[^}]+\}/,
  '<Line \n                  yAxisId="left"\n                  type="monotone" \n                  dataKey="오전 대기온도" \n                  stroke="#fb923c" \n                  strokeWidth={2}');

code = code.replace(/<Line\s+yAxisId="left"\s+type="monotone"\s+dataKey="오후 대기온도"\s+stroke="[^"]+"\s+strokeWidth=\{[^}]+\}/,
  '<Line \n                  yAxisId="left"\n                  type="monotone" \n                  dataKey="오후 대기온도" \n                  stroke="#ea580c" \n                  strokeWidth={2}\n                  strokeDasharray="5 5"');

code = code.replace(/<Line\s+yAxisId="left"\s+type="monotone"\s+dataKey="오전 표면온도"\s+stroke="[^"]+"\s+strokeWidth=\{[^}]+\}/,
  '<Line \n                  yAxisId="left"\n                  type="monotone" \n                  dataKey="오전 표면온도" \n                  stroke="#38bdf8" \n                  strokeWidth={2}');

code = code.replace(/<Line\s+yAxisId="left"\s+type="monotone"\s+dataKey="오후 표면온도"\s+stroke="[^"]+"\s+strokeWidth=\{[^}]+\}/,
  '<Line \n                  yAxisId="left"\n                  type="monotone" \n                  dataKey="오후 표면온도" \n                  stroke="#2563eb" \n                  strokeWidth={2}\n                  strokeDasharray="5 5"');

code = code.replace(/<Line\s+yAxisId="right"\s+type="monotone"\s+dataKey="오전 상대습도"\s+stroke="[^"]+"\s+strokeWidth=\{[^}]+\}/,
  '<Line \n                  yAxisId="right"\n                  type="monotone" \n                  dataKey="오전 상대습도" \n                  stroke="#a78bfa" \n                  strokeWidth={2}');

code = code.replace(/<Line\s+yAxisId="right"\s+type="monotone"\s+dataKey="오후 상대습도"\s+stroke="[^"]+"\s+strokeWidth=\{[^}]+\}/,
  '<Line \n                  yAxisId="right"\n                  type="monotone" \n                  dataKey="오후 상대습도" \n                  stroke="#7c3aed" \n                  strokeWidth={2}\n                  strokeDasharray="5 5"');

code = code.replace(/<Line\s+yAxisId="left"\s+type="monotone"\s+dataKey="오전 결로지수"\s+stroke="url\(#amDewGradient\)"\s+strokeWidth=\{[^}]+\}\s+dot=\{[^\}]+\}\s+activeDot=\{[^\}]+\}/,
  '<Line \n                  yAxisId="left"\n                  type="monotone" \n                  dataKey="오전 결로지수" \n                  stroke="#ef4444" \n                  strokeWidth={4}\n                  dot={{ r: 2 }}\n                  activeDot={{ r: 6 }}');

code = code.replace(/<Line\s+yAxisId="left"\s+type="monotone"\s+dataKey="오후 결로지수"\s+stroke="url\(#pmDewGradient\)"\s+strokeWidth=\{[^}]+\}\s+dot=\{[^\}]+\}\s+activeDot=\{[^\}]+\}/,
  '<Line \n                  yAxisId="left"\n                  type="monotone" \n                  dataKey="오후 결로지수" \n                  stroke="#b91c1c" \n                  strokeWidth={4}\n                  strokeDasharray="5 5"\n                  dot={{ r: 2 }}\n                  activeDot={{ r: 6 }}');


// 4. Update legend colors
// AM Air
code = code.replace(/bg-\[#60a5fa\]/, 'bg-[#fb923c]');
code = code.replace(/border-blue-400/, 'border-orange-400');

// PM Air
code = code.replace(/bg-\[#2563eb\]/, 'bg-[#ea580c]');
code = code.replace(/border-blue-600/, 'border-orange-600');

// AM Surface
code = code.replace(/bg-\[#2dd4bf\]/, 'bg-[#38bdf8]');
code = code.replace(/border-teal-400/, 'border-sky-400');

// PM Surface
code = code.replace(/bg-\[#0f766e\]/, 'bg-[#2563eb]');
code = code.replace(/border-teal-700/, 'border-blue-600');

// AM Humidity
// bg-[#a78bfa] is already correct for AM Humidity, border is violet-400

// PM Humidity
// bg-[#7c3aed] is already correct for PM Humidity, border is violet-600

// AM Dew
code = code.replace(/bg-\[#fb923c\]/, 'bg-[#ef4444]');
code = code.replace(/border-amber-400/, 'border-red-500');

// PM Dew
code = code.replace(/bg-\[#e11d48\]/, 'bg-[#b91c1c]');
code = code.replace(/border-rose-600/, 'border-red-700');


// 5. Remove <defs> for gradients
code = code.replace(/<defs>[\s\S]*?<\/defs>/, '');

fs.writeFileSync('src/components/MonthlyChart.tsx', code);
