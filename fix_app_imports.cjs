const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  'ChevronRight, Loader2\n} from "lucide-react";',
  'ChevronRight, Loader2, CheckCircle2, AlertTriangle\n} from "lucide-react";'
);

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx imports modified");
