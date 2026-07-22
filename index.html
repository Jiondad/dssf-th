const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Revert app_root to just the flex container
const oldRootWithWrapper = `<div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-slate-800 font-sans antialiased overflow-hidden print:block print:bg-white print:h-auto print:overflow-visible" id="app_root">
      
      {/* 16:9 Aspect Ratio Wrapper */}
      <div 
        className="relative bg-slate-50 flex flex-col shadow-2xl overflow-hidden print:hidden" 
        style={{ 
          width: '100vw', 
          maxWidth: 'calc(100vh * 16 / 9)', 
          height: '100vh', 
          maxHeight: 'calc(100vw * 9 / 16)',
          aspectRatio: '16/9' 
        }}
      >`;
      
const newRoot = `<div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-slate-800 font-sans antialiased overflow-hidden print:block print:bg-white print:h-auto print:overflow-visible" id="app_root">`;

content = content.replace(oldRootWithWrapper, newRoot);

// 2. Insert wrapper before header
const headerStr = `{/* Top Professional Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 shrink-0 print:hidden" id="header_section">`;

const headerWithWrapper = `{/* 16:9 Aspect Ratio Wrapper */}
      <div 
        className="relative bg-slate-50 flex flex-col shadow-2xl overflow-hidden print:hidden" 
        style={{ 
          width: '100vw', 
          maxWidth: 'calc(100vh * 16 / 9)', 
          height: '100vh', 
          maxHeight: 'calc(100vw * 9 / 16)',
          aspectRatio: '16/9' 
        }}
      >
      ${headerStr}`;

content = content.replace(headerStr, headerWithWrapper);

fs.writeFileSync('src/App.tsx', content);
console.log("Wrapper fixed");
