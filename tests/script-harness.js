"use strict";

const fs = require("node:fs");
const path = require("node:path");

const scriptPath = path.join(__dirname, "..", "script.js");
const scriptSource = fs.readFileSync(scriptPath, "utf8");

function extractFunction(name) {
    const marker = `function ${name}`;
    const start = scriptSource.indexOf(marker);
    if (start === -1) throw new Error(`Função não encontrada em script.js: ${name}`);

    const bodyStart = scriptSource.indexOf("{", start);
    let depth = 0;
    let quote = null;
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (let index = bodyStart; index < scriptSource.length; index++) {
        const char = scriptSource[index];
        const next = scriptSource[index + 1];

        if (lineComment) {
            if (char === "\n") lineComment = false;
            continue;
        }
        if (blockComment) {
            if (char === "*" && next === "/") {
                blockComment = false;
                index++;
            }
            continue;
        }
        if (quote) {
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === quote) quote = null;
            continue;
        }
        if (char === "/" && next === "/") {
            lineComment = true;
            index++;
            continue;
        }
        if (char === "/" && next === "*") {
            blockComment = true;
            index++;
            continue;
        }
        if (char === '"' || char === "'" || char === "`") {
            quote = char;
            continue;
        }
        if (char === "{") depth++;
        if (char === "}") {
            depth--;
            if (depth === 0) return scriptSource.slice(start, index + 1);
        }
    }

    throw new Error(`Função incompleta em script.js: ${name}`);
}

function compileFunctions(names, scope = {}) {
    const scopeNames = Object.keys(scope);
    const source = names.map(extractFunction).join("\n\n");
    const exportsSource = names.map(name => `${name}: ${name}`).join(",");
    const factory = new Function(...scopeNames, `"use strict";\n${source}\nreturn {${exportsSource}};`);
    return factory(...scopeNames.map(name => scope[name]));
}

module.exports = { scriptSource, extractFunction, compileFunctions };
