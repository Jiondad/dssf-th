const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `                  <div className="mt-2 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px]">
                    <span className={\`font-bold flex items-center gap-1 \${maxDewIndexToday > 80 ? 'text-white' : condensationStatus.textColor} whitespace-nowrap\`}>
                      {condensationStatus.icon}
                      {condensationStatus.text} 상태
                    </span>
                    <span className={\`font-mono px-1 py-0.5 rounded whitespace-nowrap \${maxDewIndexToday > 80 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}\`}>
                      Target: &lt;60Pt
                    </span>
                  </div>`;

const newStr = `                  <div className="mt-2 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px]">
                    <span className={\`font-bold flex items-center gap-1 \${maxDewIndexToday > 80 ? 'text-white' : condensationStatus.textColor} whitespace-nowrap\`}>
                      {condensationStatus.icon}
                      {maxDewIndexToday <= 60 ? "환기 및 코일 상태 양호 (정상 관리)" : maxDewIndexToday <= 80 ? "통풍 실시 및 온습도 주의 관찰" : "즉시 환기 및 히터 가동 (결로 주의)"}
                    </span>
                    <span className={\`font-mono px-1 py-0.5 rounded whitespace-nowrap \${maxDewIndexToday > 80 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}\`}>
                      Target: &lt;60Pt
                    </span>
                  </div>`;

content = content.replace(oldStr, newStr);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched text successfully!");
