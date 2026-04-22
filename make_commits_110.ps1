# Native PowerShell script to run Node.js commit generator or execute 110 commits
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Running 110 Commit Generator for April 22 - May 2" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Node.js detected! Executing make_commit_history.js..." -ForegroundColor Green
    node make_commit_history.js
} else {
    Write-Host "Node.js not found. Please install Node.js or run the script using Git Bash / CMD." -ForegroundColor Red
}
