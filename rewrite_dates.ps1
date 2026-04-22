# PowerShell script to rewrite git commit dates between April 22 and May 2, 2026

Write-Host "=== BEFORE COMMIT HISTORY ===" -ForegroundColor Cyan
git log --format="%h %ai %s"

Write-Host "`n=== REWRITING COMMIT DATES (April 22 - May 2, 2026) ===" -ForegroundColor Yellow

$envFilter = @'
case "$GIT_AUTHOR_DATE" in
    *"2026-04-22"*)
        export GIT_AUTHOR_DATE="2026-04-22 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-22 10:00:00 +0530"
        ;;
    *"2026-04-23"*)
        export GIT_AUTHOR_DATE="2026-04-23 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-23 10:00:00 +0530"
        ;;
    *"2026-04-24"*)
        export GIT_AUTHOR_DATE="2026-04-24 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-24 10:00:00 +0530"
        ;;
    *"2026-04-25"*)
        export GIT_AUTHOR_DATE="2026-04-25 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-25 10:00:00 +0530"
        ;;
    *"2026-04-26"*)
        export GIT_AUTHOR_DATE="2026-04-26 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-26 10:00:00 +0530"
        ;;
    *"2026-04-27"*)
        export GIT_AUTHOR_DATE="2026-04-27 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-27 10:00:00 +0530"
        ;;
    *"2026-04-28"*)
        export GIT_AUTHOR_DATE="2026-04-28 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-28 10:00:00 +0530"
        ;;
    *"2026-04-29"*)
        export GIT_AUTHOR_DATE="2026-04-29 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-29 10:00:00 +0530"
        ;;
    *"2026-04-30"*)
        export GIT_AUTHOR_DATE="2026-04-30 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-04-30 10:00:00 +0530"
        ;;
    *"2026-05-01"*)
        export GIT_AUTHOR_DATE="2026-05-01 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-05-01 10:00:00 +0530"
        ;;
    *"2026-05-02"*)
        export GIT_AUTHOR_DATE="2026-05-02 10:00:00 +0530"
        export GIT_COMMITTER_DATE="2026-05-02 10:00:00 +0530"
        ;;
esac
'@

git filter-branch -f --env-filter $envFilter --tag-name-filter cat -- --all

Write-Host "`n=== AFTER COMMIT HISTORY ===" -ForegroundColor Green
git log --format="%h %ai %s"
