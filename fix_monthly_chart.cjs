const fs = require('fs');
let content = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

content = content.replace(
  'fixedDays: number[];',
  'dynamicDays: number[];'
);

content = content.replace(
  '{ selectedMonth, sheetData, fixedDays, selectedDay, setSelectedDay }',
  '{ selectedMonth, sheetData, dynamicDays, selectedDay, setSelectedDay }'
);

content = content.replace(/fixedDays/g, 'dynamicDays');

fs.writeFileSync('src/components/MonthlyChart.tsx', content);
console.log("MonthlyChart.tsx modified");
