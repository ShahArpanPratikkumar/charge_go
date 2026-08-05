import subprocess
import sys
import re

def run(cmd, check=True):
    res = subprocess.run(cmd, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and res.returncode != 0:
        print(f"Error executing: {cmd}")
        print(res.stderr)
        sys.exit(res.returncode)
    return res.stdout.strip()

def show_log(label):
    print(f"\n--- {label} COMMIT HISTORY ---")
    log_output = run('git log --format="%h %ai %s"')
    print(log_output)
    return log_output

def main():
    show_log("BEFORE")

    # Command for git filter-branch to rewrite commits in April 22 to May 2, 2026 range
    filter_cmd = '''git filter-branch -f --env-filter '
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
    ' --tag-name-filter cat -- --all'''

    print("\nExecuting git filter-branch...")
    run(filter_cmd)
    print("Filter-branch completed successfully.")

    show_log("AFTER")

if __name__ == "__main__":
    main()
