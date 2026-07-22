const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Find table start and end
const tableStartIdx = lines.findIndex(l => l.includes('<table className="w-full text-[10px] xl:text-xs text-center border-collapse table-fixed min-w-[800px]">'));
const tableEndIdx = lines.findIndex((l, idx) => idx > tableStartIdx && l.includes('</table>'));

if (tableStartIdx === -1 || tableEndIdx === -1) {
  console.log("Could not find table");
  process.exit(1);
}

const tableContent = lines.slice(tableStartIdx, tableEndIdx + 1).join('\n');

// We will replace fixedDays with daysToRender
let newTableContent = tableContent.replace(/fixedDays/g, 'daysToRender');

// We will add print-specific styles to the table if isPrint is true
// For instance, min-w-[800px] might be removed or altered, but we can leave it or remove it conditionally
newTableContent = newTableContent.replace('<table className="w-full text-[10px] xl:text-xs text-center border-collapse table-fixed min-w-[800px]">',
'<table className={`w-full text-center border-collapse table-fixed ${isPrint ? "text-[11px] print-table-a4" : "text-[10px] xl:text-xs min-w-[800px]"}`}>');

// We need to inject the renderTable function before the return statement of App
// The return statement is `  return (`
const returnIdx = lines.findIndex(l => l.trim() === 'return (');
if (returnIdx === -1) {
  console.log("Could not find return statement");
  process.exit(1);
}

const renderTableFunc = `
  const renderTable = (daysToRender: number[], isPrint: boolean) => (
    ${newTableContent}
  );
`;

lines.splice(returnIdx, 0, renderTableFunc);

// Now replace the original table and wrapper with the renderTable calls
const wrapperStartIdx = lines.findIndex(l => l.includes('<div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner" id="ledger_table_wrapper">'));
const wrapperEndIdx = lines.findIndex((l, idx) => idx > wrapperStartIdx && l.includes('</div>') && lines[idx - 1].includes('</table>'));

const newWrapperContent = `
          {/* Scrollable Ledger Wrapper */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner print:hidden" id="ledger_table_wrapper">
            {renderTable(fixedDays, false)}
          </div>
          <div className="hidden print:block space-y-8 print:w-full print:m-0 print:p-0 print:overflow-visible" id="print_ledger_wrapper">
            <h3 className="text-xl font-bold mb-4 text-center">{selectedMonth}월 온습도 및 결로지수 대장 (1일 ~ 16일) - {selectedFactory}</h3>
            {renderTable(fixedDays.slice(0, 16), true)}
            <h3 className="text-xl font-bold mb-4 mt-12 text-center" style={{ pageBreakBefore: 'always' }}>{selectedMonth}월 온습도 및 결로지수 대장 (17일 ~ 31일) - {selectedFactory}</h3>
            {renderTable(fixedDays.slice(16, 31), true)}
          </div>
`;

lines.splice(wrapperStartIdx, wrapperEndIdx - wrapperStartIdx + 1, newWrapperContent);

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Table refactored successfully");
