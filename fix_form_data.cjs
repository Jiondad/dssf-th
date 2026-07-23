const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [formData, setFormData] = useState({
    date: \`\${today.getFullYear()}-\${String(today.getMonth() + 1).padStart(2, '0')}-\${String(today.getDate()).padStart(2, '0')}\`,
    amAirTemp: "23.5",
    amSurfaceTemp: "21.2",
    amHumidity: "72",
    pmAirTemp: "31.2",
    pmSurfaceTemp: "28.5",
    pmHumidity: "48",
  });`;

const replacement1 = `  const [formData, setFormData] = useState({
    date: \`\${today.getFullYear()}-\${String(today.getMonth() + 1).padStart(2, '0')}-\${String(today.getDate()).padStart(2, '0')}\`,
    amAirTemp: "",
    amSurfaceTemp: "",
    amHumidity: "",
    pmAirTemp: "",
    pmSurfaceTemp: "",
    pmHumidity: "",
  });`;

app = app.replace(target1, replacement1);

const target2 = `      if (existing) {
        return {
          ...updated,
          amAirTemp: existing.am.airTemp !== null ? existing.am.airTemp.toString() : "",
          amSurfaceTemp: existing.am.surfaceTemp !== null ? existing.am.surfaceTemp.toString() : "",
          amHumidity: existing.am.humidity !== null ? existing.am.humidity.toString() : "",
          pmAirTemp: existing.pm.airTemp !== null ? existing.pm.airTemp.toString() : "",
          pmSurfaceTemp: existing.pm.surfaceTemp !== null ? existing.pm.surfaceTemp.toString() : "",
          pmHumidity: existing.pm.humidity !== null ? existing.pm.humidity.toString() : "",
         };
      }
      return updated;`;

const replacement2 = `      if (existing) {
        return {
          ...updated,
          amAirTemp: existing.am.airTemp !== null ? existing.am.airTemp.toString() : "",
          amSurfaceTemp: existing.am.surfaceTemp !== null ? existing.am.surfaceTemp.toString() : "",
          amHumidity: existing.am.humidity !== null ? existing.am.humidity.toString() : "",
          pmAirTemp: existing.pm.airTemp !== null ? existing.pm.airTemp.toString() : "",
          pmSurfaceTemp: existing.pm.surfaceTemp !== null ? existing.pm.surfaceTemp.toString() : "",
          pmHumidity: existing.pm.humidity !== null ? existing.pm.humidity.toString() : "",
         };
      }
      return {
        ...updated,
        amAirTemp: "",
        amSurfaceTemp: "",
        amHumidity: "",
        pmAirTemp: "",
        pmSurfaceTemp: "",
        pmHumidity: "",
      };`;

app = app.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', app);
