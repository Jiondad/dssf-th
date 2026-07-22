const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

const chunk1Start = lines.findIndex(l => l.includes('const renderTable = (daysToRender: number[], isPrint: boolean) => ('));
let chunk1End = chunk1Start;
while (chunk1End < lines.length) {
  if (lines[chunk1End].trim() === ');' && lines[chunk1End+1].includes('return (') && lines[chunk1End+2].includes('<div className="min-h-screen')) {
    break;
  }
  chunk1End++;
}

console.log("Chunk 1:", chunk1Start, chunk1End);

let chunk2Start = -1;
let chunk2End = -1;

for (let i = 0; i < chunk1Start; i++) {
  if (lines[i].includes('const color = getDewColor(value, isAm);')) {
    chunk2Start = i + 2;
    break;
  }
}

for (let i = chunk2Start; i < chunk1Start; i++) {
  if (lines[i].trim() === ');') {
     // Search forward for return (
     let j = i + 1;
     while (j < lines.length && lines[j].trim() === '') j++;
     if (lines[j].includes('return (') && lines[j+1].includes('<circle')) {
        chunk2End = i;
        break;
     }
  }
}

console.log("Chunk 2:", chunk2Start, chunk2End);

if (chunk1Start === -1 || chunk1End === -1 || chunk2Start === -1 || chunk2End === -1) {
  console.log("Failed to find chunks");
  process.exit(1);
}

const chunk1 = lines.slice(chunk1Start, chunk1End + 1);
const chunk2 = lines.slice(chunk2Start, chunk2End + 1);

const fullRenderTable = [...chunk1, ...chunk2];

lines.splice(chunk1Start, chunk1End - chunk1Start + 1);
lines.splice(chunk2Start, chunk2End - chunk2Start + 1);

let returnIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === 'return (') {
     if (lines[i+1] && lines[i+1].includes('<div className="min-h-screen')) {
       returnIdx = i;
       break;
     }
  }
}

console.log("Return Idx:", returnIdx);

if (returnIdx !== -1) {
  lines.splice(returnIdx, 0, ...fullRenderTable);
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Fixed!");
