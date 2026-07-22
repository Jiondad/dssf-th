const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newPrintView = `      {/* Print Only View */}
      <div className="hidden print:flex print:flex-col print-container h-screen py-2">
        <h2 className="text-[22px] font-bold text-center mb-5 text-slate-900 tracking-tight">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
        
        <div>
          {renderTable(fixedDays.slice(0, 16), true)}
        </div>
        <div className="pt-3">
          {renderTable(fixedDays.slice(16, 31), true)}
        </div>
        
        {/* Print Layout: Condensation Formula and Status */}
        <div className="mt-auto pt-4 pb-2 border-t border-slate-200">
          <h4 className="font-bold text-[13px] mb-2 text-slate-800">결로지수 산출 및 환산 원리</h4>
          <div className="grid grid-cols-3 gap-3 text-[11px]">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-center">
              <p className="font-bold text-slate-700 mb-1">1단계 (이슬점 약식 계산)</p>
              <p className="font-mono text-[10.5px] text-slate-600 bg-white p-1 rounded border border-slate-100">T_dew ≈ T_air - ((100 - H) / 5)</p>
            </div>
            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-center">
              <p className="font-bold text-slate-700 mb-1">2단계 (마진 산출)</p>
              <p className="font-mono text-[10.5px] text-slate-600 bg-white p-1 rounded border border-slate-100">Margin = T_surface - T_dew</p>
            </div>
            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
              <p className="font-bold text-slate-700 mb-1.5">3단계 (지수 환산 기준)</p>
              <ul className="space-y-1 text-[10px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 
                  <span className="font-semibold text-emerald-700">0~60 (안전)</span> 
                  <span className="ml-auto">Margin &gt; 5℃</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 
                  <span className="font-semibold text-amber-700">61~80 (주의)</span> 
                  <span className="ml-auto">0 &lt; Margin ≤ 5℃</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> 
                  <span className="font-semibold text-rose-700">81~100 (위험)</span> 
                  <span className="ml-auto">Margin ≤ 0℃</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>`;

content = content.replace(
  /\{\/\* Print Only View \*\/\}[\s\S]*?<\/div>\s*\{\/\* Top Professional Header \*\/\}/,
  newPrintView + "\n\n      {/* Top Professional Header */}"
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched print layout");
