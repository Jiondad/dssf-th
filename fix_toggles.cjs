const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

// Use precise replacements for each button ID

// AM Air
code = code.replace(/id="toggle_am_air"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_am_air"
                >
                  <span className="w-3 h-0.5 rounded-sm bg-[#fb923c] shrink-0"></span>`);

// PM Air
code = code.replace(/id="toggle_pm_air"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_pm_air"
                >
                  <span className="w-3 h-0 border-b-[2px] border-dashed border-[#ea580c] shrink-0"></span>`);

// AM Surface
code = code.replace(/id="toggle_am_surface"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_am_surface"
                >
                  <span className="w-3 h-0.5 rounded-sm bg-[#38bdf8] shrink-0"></span>`);

// PM Surface
code = code.replace(/id="toggle_pm_surface"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_pm_surface"
                >
                  <span className="w-3 h-0 border-b-[2px] border-dashed border-[#2563eb] shrink-0"></span>`);


// AM Humidity
code = code.replace(/id="toggle_am_humidity"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_am_humidity"
                >
                  <span className="w-3 h-0.5 rounded-sm bg-[#a78bfa] shrink-0"></span>`);

// PM Humidity
code = code.replace(/id="toggle_pm_humidity"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_pm_humidity"
                >
                  <span className="w-3 h-0 border-b-[2px] border-dashed border-[#7c3aed] shrink-0"></span>`);

// AM Dew
code = code.replace(/id="toggle_am_dew"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_am_dew"
                >
                  <span className="w-3 h-0.5 rounded-sm bg-[#ef4444] shrink-0"></span>`);

// PM Dew
code = code.replace(/id="toggle_pm_dew"[\s\S]*?<span className="[^"]*"><\/span>/, 
  `id="toggle_pm_dew"
                >
                  <span className="w-3 h-0 border-b-[2px] border-dashed border-[#b91c1c] shrink-0"></span>`);

fs.writeFileSync('src/components/MonthlyChart.tsx', code);
