"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { viewports } = require("./frontend-contract.js");

const root = path.join(__dirname, "..");
const browserCandidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);
const browserPath = browserCandidates.find(candidate => fs.existsSync(candidate));

if (!browserPath) {
    console.log("viewport-smoke.js: SKIP — Chrome/Edge headless não encontrado.");
    process.exit(0);
}

function contentType(file) {
    return ({
        ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
        ".png": "image/png", ".jpg": "image/jpeg"
    })[path.extname(file).toLowerCase()] || "application/octet-stream";
}

const probeScript = `<script>
try { localStorage.setItem("timaodle_username", "Baseline v2.7"); } catch {}
addEventListener("load", () => setTimeout(() => {
    const visibleOverflow = [...document.querySelectorAll("body *")].filter(element => {
        const style = getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 1 && (rect.left < -1 || rect.right > innerWidth + 1);
    }).slice(0, 12).map(element => ({
        tag: element.tagName, id: element.id, className: String(element.className).slice(0, 100),
        left: Math.round(element.getBoundingClientRect().left),
        right: Math.round(element.getBoundingClientRect().right)
    }));
    const result = {
        innerWidth, innerHeight,
        documentScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        visibleOverflow
    };
    document.body.innerHTML = "<pre id=baseline-result>" +
        JSON.stringify(result).replaceAll("&", "&amp;").replaceAll("<", "&lt;") + "</pre>";
}, 500));
</script>`;

function startServer() {
    const server = http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const relative = pathname === "/" || pathname === "/__baseline" ? "index.html" : pathname.replace(/^\/+/, "");
        const file = path.resolve(root, relative);
        if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) {
            response.writeHead(403).end("Forbidden");
            return;
        }
        fs.readFile(file, (error, data) => {
            if (error) {
                response.writeHead(404).end("Not found");
                return;
            }
            let body = data;
            if (pathname === "/__baseline") {
                body = data.toString("utf8").replace("</body>", `${probeScript}</body>`);
            }
            response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
            response.end(body);
        });
    });
    return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve(server)));
}

function runBrowser(url, viewport) {
    return new Promise((resolve, reject) => {
        const profile = fs.mkdtempSync(path.join(os.tmpdir(), "timaodle-viewport-"));
        const child = spawn(browserPath, [
            "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
            "--disable-background-networking", "--virtual-time-budget=2500", "--dump-dom",
            `--user-data-dir=${profile}`, `--window-size=${viewport.width},${viewport.height}`, url
        ], { windowsHide: true });
        let stdout = "";
        let stderr = "";
        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error(`${viewport.name}: navegador excedeu 15 s`));
        }, 15000);
        child.stdout.on("data", chunk => { stdout += chunk; });
        child.stderr.on("data", chunk => { stderr += chunk; });
        child.on("error", reject);
        child.on("close", code => {
            clearTimeout(timeout);
            try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
            if (code !== 0 && /GPU process isn't usable/i.test(stderr)) {
                const error = new Error("Chrome/Edge headless indisponível neste ambiente (processo GPU)");
                error.code = "BROWSER_ENV_UNAVAILABLE";
                reject(error);
            } else if (code !== 0) reject(new Error(`${viewport.name}: navegador saiu com ${code}: ${stderr.slice(-300)}`));
            else resolve(stdout);
        });
    });
}

async function main() {
    const server = await startServer();
    try {
        const address = server.address();
        const url = `http://127.0.0.1:${address.port}/__baseline`;
        for (const viewport of viewports) {
            const dom = await runBrowser(url, viewport);
            const encoded = dom.match(/<pre id="baseline-result">([^<]+)<\/pre>/)?.[1];
            assert.ok(encoded, `${viewport.name}: resultado da sonda não encontrado`);
            const result = JSON.parse(encoded.replaceAll("&lt;", "<").replaceAll("&amp;", "&"));
            assert.equal(result.innerWidth, viewport.width, viewport.name);
            assert.ok(result.documentScrollWidth <= result.innerWidth, `${viewport.name}: document ${result.documentScrollWidth} > ${result.innerWidth}`);
            assert.ok(result.bodyScrollWidth <= result.innerWidth, `${viewport.name}: body ${result.bodyScrollWidth} > ${result.innerWidth}`);
            assert.deepEqual(result.visibleOverflow, [], `${viewport.name}: elementos visíveis fora da viewport`);
            console.log(`${viewport.name}: ${result.innerWidth}x${result.innerHeight}, scrollWidth=${result.documentScrollWidth} — OK`);
        }
        console.log(`viewport-smoke.js: ${viewports.length} viewports aprovados em Chrome/Edge headless.`);
    } finally {
        server.closeAllConnections?.();
        server.close();
    }
}

main().catch(error => {
    if (error.code === "BROWSER_ENV_UNAVAILABLE") {
        console.log(`viewport-smoke.js: SKIP — ${error.message}.`);
    } else {
        console.error(`viewport-smoke.js: FALHOU — ${error.message}`);
        process.exitCode = 1;
    }
});
