const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

// Remove all occurrences of getDewColor to CustomDewActiveDot completely up to interface MonthlyChartProps
code = code.replace(/const getDewColor[\s\S]*?interface MonthlyChartProps/g, 'interface MonthlyChartProps');

// Inject exactly once
const functionsToAdd = `const getDewColor = (value: number) => {
  if (value <= 60) return '#10b981'; 
  if (value <= 80) return '#f59e0b'; 
  return '#ef4444'; 
};

const CustomDewDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={1} />;
};

const CustomDewActiveDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);
  return <circle cx={cx} cy={cy} r={8} fill={color} stroke="#fff" strokeWidth={2} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />;
};

`;

code = code.replace(/interface MonthlyChartProps/, functionsToAdd + 'interface MonthlyChartProps');
fs.writeFileSync('src/components/MonthlyChart.tsx', code);
