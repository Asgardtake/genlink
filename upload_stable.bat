@echo off
setlocal ENABLEDELAYEDEXPANSION
chcp 65001 >nul
cd /d "%~dp0"
title Git Upload Menu
cls
color 0B

:: ================================
::        START SCREEN
:: ================================
echo ===========================================================
echo             GIT FORCE PUSH TO stable-version
echo ===========================================================
echo.
echo    [1] Start Process
echo    [2] Exit
echo.
set /p startChoice=Enter 1 or 2: 

if "%startChoice%"=="1" (
    cls
    color 0A
    echo You chose to start!
    echo Press any key to continue...
    pause >nul
    goto checkGit
) else (
    color 0C
    echo You chose to exit.
    goto end
)

:: ================================
::        CHECK GIT
:: ================================
:checkGit
cls
color 0B
echo ===========================================================
echo                  CHECKING GIT REPO
echo ===========================================================
echo.

if not exist ".git" (
    color 0C
    echo .git folder not found!
    goto end
)

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set currentBranch=%%b

if not defined currentBranch (
    color 0C
    echo Cannot determine current Git branch!
    goto end
)

if /i not "!currentBranch!"=="stable-version" (
    echo Switching to stable-version branch...
    git checkout stable-version
    if errorlevel 1 (
        color 0C
        echo Error switching to stable-version!
        goto end
    )
)

echo Now on branch: stable-version
echo.
echo Press any key to continue...
pause >nul
goto prepareCommit

:: ================================
::        PREPARE COMMIT
:: ================================
:prepareCommit
cls
color 0B
echo ===========================================================
echo             STAGING ALL LOCAL FILES
echo ===========================================================
echo.

echo Adding all files (new, modified, deleted)...
git add --force -A

:: Check staged changes
set added=0
set modified=0
set deleted=0

for /f "tokens=1,*" %%a in ('git diff --cached --name-status') do (
    if "%%a"=="A" set /a added+=1
    if "%%a"=="M" set /a modified+=1
    if "%%a"=="D" set /a deleted+=1
)

if %added%==0 if %modified%==0 if %deleted%==0 (
    color 0A
    echo No changes detected. Nothing to commit.
    goto end
)

echo Summary of changes to commit:
echo -------------------------------
echo New files      : %added%
echo Modified files : %modified%
echo Deleted files  : %deleted%
echo -------------------------------
echo.

goto doCommit

:: ================================
::        DO COMMIT AND PUSH
:: ================================
:doCommit
color 0B
echo ===========================================================
echo             COMMITTING AND FORCE PUSHING
echo ===========================================================
echo.

:: Generate commit message
for /f "tokens=1-5 delims=/: " %%d in ("%date% %time%") do (
    set year=%%d
    set month=%%e
    set day=%%f
    set hour=%%g
    set minute=%%h
)
set commitMessage=Full Sync !year!-!month!-!day! !hour!:!minute!

echo Commit message: "!commitMessage!"
git commit -m "!commitMessage!"

if %errorlevel% neq 0 (
    color 0E
    echo Warning: Nothing to commit or minor issue.
)

echo.
echo Force pushing to stable-version branch...
git push origin stable-version --force

if errorlevel 1 (
    color 0C
    echo Error during push!
    goto end
)

color 0A
echo.
echo ===========================================================
echo SUCCESS: Files successfully pushed to stable-version!
echo ===========================================================
goto end

:: ================================
::        END OF SCRIPT
:: ================================
:end
echo.
echo Press any key to exit...
pause >nul
exit
