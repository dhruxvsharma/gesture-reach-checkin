import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = path.join(__dirname, "src/routes");

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (file.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      
      // Specifically replace font-light with font-bold inside <h1 className="..."
      const h1Regex = /(<h1[^>]*?className="[^"]*?)font-light([^"]*?"[^>]*>)/g;
      
      if (h1Regex.test(content)) {
        content = content.replace(h1Regex, "$1font-bold$2");
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
      }
    }
  }
}

traverse(routesDir);
console.log("Done");
