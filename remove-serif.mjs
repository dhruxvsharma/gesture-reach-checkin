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
      if (content.includes("font-serif")) {
        // Replace "font-serif " and "font-serif" with "font-sans " and "font-sans" respectively.
        content = content.replace(/font-serif /g, "font-sans ");
        content = content.replace(/font-serif/g, "font-sans");
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
      }
    }
  }
}

traverse(routesDir);
console.log("Done");
