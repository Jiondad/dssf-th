const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexMap = /\{mockData\.map\(\(item\) => \(\s*<td([\s\S]*?)>([\s\S]*?)<\/td>\s*\)\)\}/g;
content = content.replace(regexMap, (match, attrs, inner) => {
  const isAmAir = inner.includes('item.am.airTemp');
  const isAmSurf = inner.includes('item.am.surfaceTemp');
  const isAmHum = inner.includes('item.am.humidity');
  
  const isPmAir = inner.includes('item.pm.airTemp');
  const isPmSurf = inner.includes('item.pm.surfaceTemp');
  const isPmHum = inner.includes('item.pm.humidity');
  
  let valStr = '';
  if (isAmAir) valStr = 'item.am.airTemp.toFixed(1)';
  else if (isAmSurf) valStr = 'item.am.surfaceTemp.toFixed(1)';
  else if (isAmHum) valStr = 'item.am.humidity';
  else if (isPmAir) valStr = 'item.pm.airTemp.toFixed(1)';
  else if (isPmSurf) valStr = 'item.pm.surfaceTemp.toFixed(1)';
  else if (isPmHum) valStr = 'item.pm.humidity';

  return `{fixedDays.map((day) => {
                    const item = mockData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={\`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors \${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }\`}
                    >
                      {item ? ${valStr} : '-'}
                    </td>
                  )
})}`;
});

const regexDewMap = /\{mockData\.map\(\(item\) => \{[\s\S]*?const indexVal = item\.(am|pm)\.dewIndex;[\s\S]*?return \([\s\S]*?<td([\s\S]*?)>[\s\S]*?\{indexVal\}[\s\S]*?<\/td>\s*\);\s*\}\)\}/g;
content = content.replace(regexDewMap, (match, amPm) => {
  return `{fixedDays.map((day) => {
                    const item = mockData.find(r => r.day === day);
                    if (!item) {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={\`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all \${day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}\`}>
                          -
                        </td>
                      );
                    }
                    const indexVal = item.${amPm}.dewIndex;
                    let cellColor = "bg-[#d1fae5] text-[#065f46]"; // Safe
                    if (indexVal > 80) cellColor = "bg-[#ffe4e6] text-[#9f1239] font-black animate-pulse"; // Danger
                    else if (indexVal > 60) cellColor = "bg-[#fef3c7] text-[#92400e] font-bold"; // Caution
                    return (
                      <td 
                        key={day} 
                        onClick={() => setSelectedDay(day)}
                        className={\`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer font-semibold transition-all hover:opacity-80 \${cellColor} \${
                          day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
                        }\`}
                        title={\`\${day}일 ${amPm === 'am' ? '오전' : '오후'} 결로지수: \${indexVal} Pt\`}
                      >
                        {indexVal}
                      </td>
                    );
                  })}`;
});

fs.writeFileSync('src/App.tsx', content);
