const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Find renderTable start
const renderStartIdx = lines.findIndex(l => l.includes('const renderTable = (daysToRender: number[], isPrint: boolean) => ('));

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

const renderTableLines = lines.slice(renderStartIdx, renderEndIdx + 1);
lines.splice(renderStartIdx, renderEndIdx - renderStartIdx + 1);

// Find the App definition
const appStartIdx = lines.findIndex(l => l.includes('export default function App() {'));

// Find the `  return (` that starts the JSX tree for App
let returnIdx = -1;
for (let i = appStartIdx; i < lines.length; i++) {
  if (lines[i].includes('return (') && lines[i].includes('    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12" id="app_root">') === false) {
    if (lines[i+1] && lines[i+1].includes('    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12" id="app_root">')) {
       returnIdx = i;
       break;
    }
  }
}

if (returnIdx === -1) {
  console.log("Could not find App return statement");
  process.exit(1);
}

lines.splice(returnIdx, 0, ...renderTableLines);

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Fixed renderTable position");
