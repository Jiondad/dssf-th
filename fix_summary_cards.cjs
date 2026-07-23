const fs = require('fs');
let content = fs.readFileSync('src/components/SummaryCards.tsx', 'utf8');

content = content.replace(
  'sheetData: DailyRecord[];\n}',
  'sheetData: DailyRecord[];\n  daysInMonth: number;\n}'
);

content = content.replace(
  'selectedMonth, selectedDay, setSelectedDay, selectedFactory, isLoadingData, sheetData\n}) => {',
  'selectedMonth, selectedDay, setSelectedDay, selectedFactory, isLoadingData, sheetData, daysInMonth\n}) => {'
);

content = content.replace(
  'type="range" min={1} max={31} value={selectedDay}',
  'type="range" min={1} max={daysInMonth} value={selectedDay}'
);

fs.writeFileSync('src/components/SummaryCards.tsx', content);
console.log("SummaryCards.tsx modified");
