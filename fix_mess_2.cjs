const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const indexVal = item\.am\.dewIndex;\s*if \(indexVal === null\) \{/,
  'const indexVal = item.am.dewIndex;\n                    if (indexVal === null || indexVal === undefined || indexVal === "") {'
);

content = content.replace(
  /const indexVal = item\.pm\.dewIndex;\s*if \(indexVal === null\) \{/,
  'const indexVal = item.pm.dewIndex;\n                    if (indexVal === null || indexVal === undefined || indexVal === "") {'
);

fs.writeFileSync('src/App.tsx', content);
