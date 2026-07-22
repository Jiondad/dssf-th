const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
const oldChunk = fs.readFileSync('chunk_to_replace.txt', 'utf8');
const newChunk = fs.readFileSync('new_chunk.txt', 'utf8');

if (content.includes(oldChunk)) {
  content = content.replace(oldChunk, newChunk);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced successfully");
} else {
  console.log("Could not find old chunk to replace");
}
