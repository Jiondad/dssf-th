const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const printViewOld = `<div className="hidden print:block print-container">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
        {renderTable(fixedDays.slice(0, 16), true)}
        <div style={{ pageBreakBefore: 'always' }} className="pt-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
          {renderTable(fixedDays.slice(16, 31), true)}
        </div>
      </div>`;

const printViewNew = `<div className="hidden print:block print-container">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
        {renderTable(fixedDays.slice(0, 16), true)}
        <div style={{ pageBreakBefore: 'always' }} className="pt-6">
          {renderTable(fixedDays.slice(16, 31), true)}
        </div>
      </div>`;

content = content.replace(printViewOld, printViewNew);
fs.writeFileSync('src/App.tsx', content);
