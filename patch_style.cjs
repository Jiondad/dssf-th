const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const offsetsLogic = `
  const dewOffsets = useMemo(() => {
    let amDewMin = 100, amDewMax = 0;
    let pmDewMin = 100, pmDewMax = 0;
    chartData.forEach(d => {
      const am = d['오전 결로지수'];
      const pm = d['오후 결로지수'];
      if (am !== null) {
        if (am < amDewMin) amDewMin = am;
        if (am > amDewMax) amDewMax = am;
      }
      if (pm !== null) {
        if (pm < pmDewMin) pmDewMin = pm;
        if (pm > pmDewMax) pmDewMax = pm;
      }
    });
    
    if (amDewMin >= amDewMax) { amDewMin = 0; amDewMax = 100; }
    if (pmDewMin >= pmDewMax) { pmDewMin = 0; pmDewMax = 100; }

    const getOffset = (val, min, max) => {
      return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    };

    return {
      am60: getOffset(60, amDewMin, amDewMax),
      am80: getOffset(80, amDewMin, amDewMax),
      pm60: getOffset(60, pmDewMin, pmDewMax),
      pm80: getOffset(80, pmDewMin, pmDewMax),
    };
  }, [chartData]);
`;

// Insert after chartData
content = content.replace(
  `  }, [sheetData, fixedDays]);`,
  `  }, [sheetData, fixedDays]);\n${offsetsLogic}`
);

// Update gradients
content = content.replace(
  /<linearGradient id="amDewGradient" x1="0" y1="1" x2="0" y2="0">[\s\S]*?<\/linearGradient>/,
  `<linearGradient id="amDewGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset={\`\${dewOffsets.am60}%\`} stopColor="#10b981" />
                    <stop offset={\`\${dewOffsets.am60}%\`} stopColor="#f59e0b" />
                    <stop offset={\`\${dewOffsets.am80}%\`} stopColor="#f59e0b" />
                    <stop offset={\`\${dewOffsets.am80}%\`} stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>`
);

content = content.replace(
  /<linearGradient id="pmDewGradient" x1="0" y1="1" x2="0" y2="0">[\s\S]*?<\/linearGradient>/,
  `<linearGradient id="pmDewGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset={\`\${dewOffsets.pm60}%\`} stopColor="#10b981" />
                    <stop offset={\`\${dewOffsets.pm60}%\`} stopColor="#f59e0b" />
                    <stop offset={\`\${dewOffsets.pm80}%\`} stopColor="#f59e0b" />
                    <stop offset={\`\${dewOffsets.pm80}%\`} stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched offsets");
