import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "scripts";
const files = [];

function collect(dir) {
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            collect(fullPath);
        } else if (entry.endsWith(".js") || entry.endsWith(".mjs")) {
            files.push(fullPath);
        }
    }
}

collect(root);

let failed = false;
for (const file of files.sort()) {
    const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
    if (result.status !== 0) failed = true;
}

if (failed) {
    process.exitCode = 1;
} else {
    console.log(`Checked ${files.length} JavaScript files in ${relative(process.cwd(), root) || root}.`);
}
