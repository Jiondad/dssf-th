const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Find renderTable start
const renderStartIdx = lines.findIndex(l => l.includes('const renderTable = (daysToRender: number[], isPrint: boolean) => ('));

// Find renderTable end - since it's a function that returns JSX wrapped in parentheses, we find the matching `);`
let renderEndIdx = -1;
for (let i = renderStartIdx + 1; i < lines.length; i++) {
  if (lines[i].trim() === ');') {
    renderEndIdx = i;
    break;
  }
}

if (renderStartIdx === -1 || renderEndIdx === -1) {
  console.log("Could not find renderTable bounds");
  process.exit(1);
}

// Extract renderTable
const renderTableLines = lines.slice(renderStartIdx, renderEndIdx + 1);

// Remove renderTable from its current position
lines.splice(renderStartIdx, renderEndIdx - renderStartIdx + 1);

// Find the main return statement of App
const returnIdx = lines.findIndex((l, idx) => l.trim() === 'return (' && idx > renderStartIdx && lines[idx - 1].includes('}, [sheetData]);'));

if (returnIdx === -1) {
  console.log("Could not find App return statement");
  process.exit(1);
}

// Insert renderTable right before the return statement
lines.splice(returnIdx, 0, ...renderTableLines);

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Fixed renderTable position");
