const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newStyle = `      <style>{\`
        @media print {
          @page {
            size: A4 landscape;
            margin: 5mm 8mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print-container {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            height: 100vh !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          table {
            width: 100% !important;
            table-layout: fixed !important;
          }
          .print-table-a4 th, .print-table-a4 td {
            padding: 2px 1px !important;
            font-size: 10px !important;
          }
        }
      \`}</style>`;

content = content.replace(/<style>\{`[\s\S]*?`\}<\/style>/, newStyle);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched styles");
