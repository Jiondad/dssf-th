const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/max-w-\[1920px\]/g, 'max-w-full');

const oldGrid = `<div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
             {/* Cards Section */}
             <div className="xl:col-span-9 flex flex-col gap-3">`;
const newGrid = `<div className="grid grid-cols-1 xl:grid-cols-12 2xl:grid-cols-10 gap-4">
             {/* Cards Section */}
             <div className="xl:col-span-9 2xl:col-span-8 flex flex-col gap-3">`;

content = content.replace(oldGrid, newGrid);

const oldStats = `{/* Monthly Stats Section */}
             <div className="xl:col-span-3 flex flex-col gap-3">`;
const newStats = `{/* Monthly Stats Section */}
             <div className="xl:col-span-3 2xl:col-span-2 flex flex-col gap-3">`;

content = content.replace(oldStats, newStats);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched layout successfully!");
