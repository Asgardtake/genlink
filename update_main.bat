@echo off
setlocal ENABLEDELAYEDEXPANSION
chcp 65001 >nul
cd /d "%~dp0"
title 🚀 Git Update Local Folder 🚀
cls
color 0A

:: ================================
::            START SCREEN
:: ================================
echo ===========================================================
echo              🚀 GIT UPDATE LOCAL FOLDER
echo ===========================================================
echo.
git branch
echo.
echo Do you want to UPDATE local folder from origin/main?
echo.
echo    [1] ✅ Yes
echo    [2] ❌ No
echo.

set /p choice=👉 Choose option (1/2): 

if "%choice%"=="1" (
    cls
    color 0B
    echo ===========================================================
    echo             🔄 FETCHING FROM origin/main
    echo ===========================================================
    echo.

    echo 🔍 Fetching changes...
    git fetch origin main
    echo.

    echo 💾 Detecting what will change...
    git diff --name-status HEAD origin/main > changes_list.txt
    echo.

    cls
    color 0A
    echo ===========================================================
    echo              📋 SUMMARY OF CHANGES
    echo ===========================================================
    echo.

    set "newFiles=0"
    set "modifiedFiles=0"
    set "deletedFiles=0"

    for /f "tokens=1,*" %%a in (changes_list.txt) do (
        if "%%a"=="A" (
            set /a newFiles+=1
        ) else if "%%a"=="M" (
            set /a modifiedFiles+=1
        ) else if "%%a"=="D" (
            if /i not "%%b"=="update_main.bat" if /i not "%%b"=="upload_stable.bat" (
                set /a deletedFiles+=1
            )
        )
    )

    echo ➕ Truly new files added : !newFiles!
    echo 📝 Files modified        : !modifiedFiles!
    echo 🗑️ Files deleted          : !deletedFiles!
    echo.

    del changes_list.txt >nul 2>&1

    echo ===========================================================
    echo 📂 Updating local folder WITHOUT HARD RESET...
    echo ===========================================================
    echo.

    git pull origin main --no-rebase
    echo.

    echo ===========================================================
    echo ✅ LOCAL FOLDER SUCCESSFULLY UPDATED!
    echo ===========================================================
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b

) else if "%choice%"=="2" (
    color 0C
    echo.
    echo ❌ Cancelled by user.
    echo Press any key to exit...
    pause >nul
    exit /b
) else (
    color 0C
    echo.
    echo ❌ Invalid choice. Try again.
    echo Press any key to exit...
    pause >nul
    exit /b
)
