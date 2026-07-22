const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. handleDateChange
content = content.replace(
  /amAirTemp: existing\.am\.airTemp\.toString\(\),\s*amSurfaceTemp: existing\.am\.surfaceTemp\.toString\(\),\s*amHumidity: existing\.am\.humidity\.toString\(\),\s*pmAirTemp: existing\.pm\.airTemp\.toString\(\),\s*pmSurfaceTemp: existing\.pm\.surfaceTemp\.toString\(\),\s*pmHumidity: existing\.pm\.humidity\.toString\(\),/g,
  `amAirTemp: existing.am.airTemp !== null ? existing.am.airTemp.toString() : "",
          amSurfaceTemp: existing.am.surfaceTemp !== null ? existing.am.surfaceTemp.toString() : "",
          amHumidity: existing.am.humidity !== null ? existing.am.humidity.toString() : "",
          pmAirTemp: existing.pm.airTemp !== null ? existing.pm.airTemp.toString() : "",
          pmSurfaceTemp: existing.pm.surfaceTemp !== null ? existing.pm.surfaceTemp.toString() : "",
          pmHumidity: existing.pm.humidity !== null ? existing.pm.humidity.toString() : "",`
);

// 2. handleFormSubmit: calculateLocalDewIndex
content = content.replace(
  /const calculateLocalDewIndex = \(air: number, surf: number, hum: number\) => \{/,
  `const calculateLocalDewIndex = (air: number | null, surf: number | null, hum: number | null) => {
        if (air === null || surf === null || hum === null) return null;`
);

// 3. handleFormSubmit: payload values
content = content.replace(
  /const amAirTemp = Number\(formData\.amAirTemp\);\s*const amSurfaceTemp = Number\(formData\.amSurfaceTemp\);\s*const amHumidity = Number\(formData\.amHumidity\);\s*const pmAirTemp = Number\(formData\.pmAirTemp\);\s*const pmSurfaceTemp = Number\(formData\.pmSurfaceTemp\);\s*const pmHumidity = Number\(formData\.pmHumidity\);/,
  `const amAirTemp = formData.amAirTemp === "" ? null : Number(formData.amAirTemp);
      const amSurfaceTemp = formData.amSurfaceTemp === "" ? null : Number(formData.amSurfaceTemp);
      const amHumidity = formData.amHumidity === "" ? null : Number(formData.amHumidity);
      const pmAirTemp = formData.pmAirTemp === "" ? null : Number(formData.pmAirTemp);
      const pmSurfaceTemp = formData.pmSurfaceTemp === "" ? null : Number(formData.pmSurfaceTemp);
      const pmHumidity = formData.pmHumidity === "" ? null : Number(formData.pmHumidity);`
);

// 4. form inputs - remove required
content = content.replace(/<input\s+type="number"\s+required/g, '<input type="number"');
content = content.replace(/<input\n\s*type="number"\n\s*required/g, '<input\n                    type="number"');

fs.writeFileSync('src/App.tsx', content);
