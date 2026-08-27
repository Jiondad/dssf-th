const fs = require('fs');
let code = fs.readFileSync('src/components/SummaryCards.tsx', 'utf8');

// Title fonts
code = code.replace(/text-base font-extrabold/g, 'text-2xl font-extrabold');

// Background colors
code = code.replace(/bg-blue-50\/50/g, 'bg-blue-100/70');
code = code.replace(/bg-teal-50\/50/g, 'bg-teal-100/70');
code = code.replace(/bg-violet-50\/50/g, 'bg-violet-100/70');

fs.writeFileSync('src/components/SummaryCards.tsx', code);
