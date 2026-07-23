const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace fixedDays with dynamicDays
app = app.replace(
  'const fixedDays = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);',
  'const daysInMonth = useMemo(() => new Date(selectedYear, selectedMonth, 0).getDate(), [selectedYear, selectedMonth]);\n  const dynamicDays = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);'
);

app = app.replace(/fixedDays\.slice\(0, 16\)/g, 'dynamicDays.slice(0, 16)');
app = app.replace(/fixedDays\.slice\(16, 31\)/g, 'dynamicDays.slice(16)');
app = app.replace(/fixedDays/g, 'dynamicDays');

app = app.replace(
  'selectedFactory={selectedFactory}\n          isLoadingData={isLoadingData}\n          sheetData={sheetData}',
  'selectedFactory={selectedFactory}\n          isLoadingData={isLoadingData}\n          sheetData={sheetData}\n          daysInMonth={daysInMonth}'
);

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx dynamic days modified");
