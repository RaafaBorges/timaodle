"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const startedAt = process.hrtime.bigint();
const files = ["storage.test.js", "daily-core.test.js", "history-stats.test.js", "sharing.test.js", "ui.test.js", "autocomplete.test.js", "classic-mode.test.js", "photo-catalog.test.js", "photo-mode.test.js", "more-less-core.test.js", "more-less-mode.test.js", "game-rules.test.js", "daily-determinism.test.js", "history-calendar.test.js", "final-result.test.js", "photo-progression.test.js", "reduced-motion.test.js", "frontend-structure.test.js"];

for (const file of files) {
    const result = spawnSync(process.execPath, [path.join(__dirname, file)], {
        cwd: path.join(__dirname, ".."),
        encoding: "utf8"
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.status !== 0) process.exit(result.status || 1);
}

const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
console.log(`run-tests.js: suíte completa aprovada em ${elapsedMs.toFixed(1)} ms`);
