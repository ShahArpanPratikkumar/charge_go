const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_DIR = __dirname;

const filesToRemove = [
    'make_commit_history.js',
    'make_commit_history.py',
    'make_commits.ps1',
    'make_commits_110.ps1',
    'rewrite_dates.ps1',
    'rewrite_dates.py',
    'run_rewrite.bat',
    'test.bat'
];

console.log("=== Removing temporary setup scripts from Git ===");

filesToRemove.forEach(file => {
    const filePath = path.join(REPO_DIR, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[DELETED] ${file}`);
    }
});

try {
    const env = {
        ...process.env,
        GIT_AUTHOR_DATE: "2026-05-02 18:30:00 +0530",
        GIT_COMMITTER_DATE: "2026-05-02 18:30:00 +0530"
    };
    execSync('git add -A', { cwd: REPO_DIR, env, encoding: 'utf8' });
    execSync('git commit -m "chore: remove repository setup scripts"', { cwd: REPO_DIR, env, encoding: 'utf8' });
    console.log("[OK] Committed file deletions.");
    
    execSync('git push origin main', { cwd: REPO_DIR, env, encoding: 'utf8' });
    console.log("[OK] Pushed cleanup commit to GitHub origin main.");
} catch (err) {
    console.error("[ERROR]", err.message);
}

// Self-delete cleanup.js
const selfPath = path.join(REPO_DIR, 'cleanup.js');
if (fs.existsSync(selfPath)) {
    fs.unlinkSync(selfPath);
    console.log("[CLEANUP COMPLETE] Removed cleanup.js");
}
