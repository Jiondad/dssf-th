const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace getDewColor
content = content.replace(
  `const getDewColor = (value: number, isAm: boolean) => {
  if (value <= 60) return isAm ? '#10b981' : '#6ee7b7'; // Safe (Green / Light Green)
  if (value <= 80) return isAm ? '#f59e0b' : '#fcd34d'; // Caution (Orange / Light Orange)
  return isAm ? '#ef4444' : '#fda4af'; // Danger (Red / Light Red)
};`,
  `const getDewColor = (value: number) => {
  if (value <= 60) return '#10b981'; // Safe (Green)
  if (value <= 80) return '#f59e0b'; // Caution (Orange)
  return '#ef4444'; // Danger (Red)
};`
);

content = content.replace(
  `const CustomDewDot = (props: any) => {
  const { cx, cy, value, isAm } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value, isAm);`,
  `const CustomDewDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);`
);

content = content.replace(
  `const CustomDewActiveDot = (props: any) => {
  const { cx, cy, value, isAm } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value, isAm);`,
  `const CustomDewActiveDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched colors");
