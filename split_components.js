const fs = require('fs');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// We will use regex or string methods to extract the exact components.

const summaryStart = `        {/* 1. 요약 대시보드 카드 뷰 Section */}`;
const summaryEnd = `        </section>\n        \n{/* 2. 월간 그래프 Section */}`;
let summaryJsx = appTsx.substring(appTsx.indexOf(summaryStart), appTsx.indexOf(summaryEnd) + 18);

const chartStart = `{/* 2. 월간 그래프 Section */}`;
const chartEnd = `        </section>\n\n        {/* 3. 월간 데이터 표 Section */}`;
let chartJsx = appTsx.substring(appTsx.indexOf(chartStart), appTsx.indexOf(chartEnd) + 18);

const renderTableStart = `const renderTable = (daysToRender: number[], isPrint: boolean) => (\n`;
const renderTableEnd = `  );\n  return (\n    <div className="min-h-screen`;
let renderTableBody = appTsx.substring(appTsx.indexOf(renderTableStart) + renderTableStart.length, appTsx.indexOf(renderTableEnd));

const entryModalStart = `{/* New Data Registration Modal with Animation */}`;
const entryModalEnd = `      </AnimatePresence>\n    </div>\n  );\n}\n`;
let entryModalJsx = appTsx.substring(appTsx.indexOf(entryModalStart), appTsx.indexOf(entryModalEnd) + 24);

fs.writeFileSync('summary.txt', summaryJsx);
fs.writeFileSync('chart.txt', chartJsx);
fs.writeFileSync('rendertable.txt', renderTableBody);
fs.writeFileSync('entrymodal.txt', entryModalJsx);
console.log("Extracted templates");
