const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('{/* Upper Info Alert or Quick Stats */}');
const endIndex = content.indexOf('{/* 2. 월간 그래프 Section */}');

if (startIndex !== -1 && endIndex !== -1) {
  fs.writeFileSync('chunk_to_replace.txt', content.substring(startIndex, endIndex));
  console.log("Chunk written.");
} else {
  console.log("Not found.");
}
