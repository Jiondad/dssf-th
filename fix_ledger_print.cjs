const fs = require('fs');

let ledger = fs.readFileSync('src/components/LedgerTable.tsx', 'utf8');

ledger = ledger.replace(/day === selectedDay/g, "(day === selectedDay && !isPrint)");

fs.writeFileSync('src/components/LedgerTable.tsx', ledger);
console.log("Ledger modified");
