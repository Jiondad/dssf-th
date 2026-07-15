const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/, Printer \}\n\} from "lucide-react";/g, ', Printer } from "lucide-react";');
fs.writeFileSync('src/App.tsx', content);
