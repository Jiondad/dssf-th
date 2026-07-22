const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const monthlyStatsCode = `
  const monthlyStats = useMemo(() => {
    let safeCount = 0;
    let cautionCount = 0;
    let dangerCount = 0;

    sheetData.forEach(r => {
      if (r.am.dewIndex === null && r.pm.dewIndex === null) return;
      const amDew = r.am.dewIndex !== null ? r.am.dewIndex : -1;
      const pmDew = r.pm.dewIndex !== null ? r.pm.dewIndex : -1;
      const maxIndex = Math.max(amDew, pmDew);
      if (maxIndex < 0) return;
      if (maxIndex <= 60) safeCount++;
      else if (maxIndex <= 80) cautionCount++;
      else dangerCount++;
    });

    return { safeCount, cautionCount, dangerCount };
  }, [sheetData]);

`;

app = app.replace('  return (\n    <div className="min-h-screen', monthlyStatsCode + '  return (\n    <div className="min-h-screen');

// 1 & 2. Title change
const oldTitle = '<h2 className="text-[22px] font-bold text-center text-slate-900 tracking-tight mt-[50px]">{selectedMonth}월 온습도 및 결로지수 관리 대장 - {selectedFactory}</h2>';
const newTitle = '<h2 className="text-[22px] font-bold text-center text-slate-900 tracking-tight mt-[30px] underline underline-offset-8">온습도 및 결로지수 관리대장 ({selectedYear}년 {selectedMonth}월 {selectedFactory})</h2>';
app = app.replace(oldTitle, newTitle);

// 3. Insert stats and legend
const insertStr = `
        <div className="flex justify-between items-end mb-1 px-1 mt-[20px]">
          <div className="text-[11px] font-bold text-slate-700">
            {selectedMonth}월 종합 지표: 안전 {monthlyStats.safeCount}일 | 주의 {monthlyStats.cautionCount}일 | 위험 {monthlyStats.dangerCount}일
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold">
            <span className="text-slate-500">결로지수 범례:</span>
            <span className="flex items-center gap-1 bg-[#d1fae5] text-[#065f46] px-1.5 py-0.5 rounded border border-[#a7f3d0]">
              0~60 안전
            </span>
            <span className="flex items-center gap-1 bg-[#fef3c7] text-[#92400e] px-1.5 py-0.5 rounded border border-[#fde68a]">
              61~80 주의
            </span>
            <span className="flex items-center gap-1 bg-[#ffe4e6] text-[#9f1239] px-1.5 py-0.5 rounded border border-[#fecdd3]">
              81~100 위험
            </span>
          </div>
        </div>`;

app = app.replace('<div className="mt-[70px]">', insertStr + '\n        <div className="mt-0">');

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx modified");
