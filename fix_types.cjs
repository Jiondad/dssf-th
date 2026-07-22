const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/\{mockData\.map\(\(item\) => \(\s*<th([^>]*)>([^<]*)<\/th>\s*\)\)\}/g, 
`{fixedDays.map((day) => (
                    <th 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={\`border border-slate-700 p-1 xl:p-1.5 font-bold font-mono cursor-pointer transition-all hover:bg-blue-800 \${
                        day === selectedDay ? "bg-blue-600 text-white" : "bg-slate-800/85"
                      }\`}
                      title={\`\${day}일 정밀조회\`}
                    >
                      {day}일
                    </th>
                  ))}`);

fs.writeFileSync('src/App.tsx', content);
