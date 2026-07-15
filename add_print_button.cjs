const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const printButtonHTML = `
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer print:hidden"
                id="btn_print_ledger"
              >
                <Printer className="w-4 h-4" />
                대장 인쇄
              </button>
              <button`;

content = content.replace(/<button\s+onClick=\{\(\) => \{\s+const dayStr = selectedDay < 10 \? `0\$\{selectedDay\}` : `\$\{selectedDay\}`;/g, printButtonHTML + `\n                onClick={() => {\n                  const dayStr = selectedDay < 10 ? \`0\${selectedDay}\` : \`\${selectedDay}\`;`);

fs.writeFileSync('src/App.tsx', content);
