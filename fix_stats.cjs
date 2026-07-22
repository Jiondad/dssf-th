const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const maxIndex = Math\.max\(r\.am\.dewIndex, r\.pm\.dewIndex\);\s*if \(maxIndex <= 60\) safeCount\+\+;\s*else if \(maxIndex <= 80\) cautionCount\+\+;\s*else dangerCount\+\+;/g,
  `if (r.am.dewIndex === null && r.pm.dewIndex === null) return;
      const amDew = r.am.dewIndex !== null ? r.am.dewIndex : -1;
      const pmDew = r.pm.dewIndex !== null ? r.pm.dewIndex : -1;
      const maxIndex = Math.max(amDew, pmDew);
      if (maxIndex < 0) return;
      if (maxIndex <= 60) safeCount++;
      else if (maxIndex <= 80) cautionCount++;
      else dangerCount++;`
);

fs.writeFileSync('src/App.tsx', content);
