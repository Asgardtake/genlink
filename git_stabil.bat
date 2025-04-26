@echo off
setlocal ENABLEDELAYEDEXPANSION
chcp 65001 >nul
cd /d "%~dp0"
cls
color 0B

:: 🟢 Начален въпрос
echo ========================================
echo        Git PUSH към stable-version
echo ========================================
echo.
echo Искаш ли да започнеш качване?
echo [1] Да
echo [2] Не
set /p startChoice=👉 Въведи 1 или 2: 

if "%startChoice%"=="2" (
    color 0C
    echo ❌ Изход. Натисни клавиш за затваряне...
    pause >nul
    exit /b
) else if not "%startChoice%"=="1" (
    color 0C
    echo ❌ Невалиден избор. Затваряне.
    pause >nul
    exit /b
)

:: 🔍 Проверка за .git
if not exist ".git" (
    color 0C
    echo ❌ .git не е намерен. Скриптът няма да продължи.
    pause >nul
    exit /b
)

:: 🔄 Проверка на текущия branch
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set currentBranch=%%b

if not defined currentBranch (
    color 0C
    echo ❌ Не може да се определи текущият Git branch.
    pause >nul
    exit /b
)

if /i not "!currentBranch!"=="stable-version" (
    color 0E
    echo 🔄 Смяна към stable-version...
    git checkout stable-version
    echo.
)

:askCommit
color 0E
echo 🛑 Да продължа ли с PUSH?
echo [1] Да
echo [2] Не
set /p confirmChoice=👉 Въведи 1 или 2: 

if "%confirmChoice%"=="1" (
    git diff --quiet
    if !errorlevel! equ 0 (
        color 0E
        echo 🔎 Няма промени за качване. Всичко е актуално!
        goto end
    )

    set /p commitMessage=📝 Въведи съобщение за комита:

    echo.
    echo ➕ Добавям файловете...
    git add .

    echo.
    echo 💬 Комит със съобщение: "!commitMessage!"
    git commit -m "!commitMessage!"

    echo.
    echo 🚀 Качвам в remote branch stable-version...
    git push origin stable-version

    echo.
    color 0A
    echo ✅ Успешно качване!
    goto end
) else if "%confirmChoice%"=="2" (
    color 0C
    echo ❌ Отказано от потребителя.
    goto end
) else (
    color 0C
    echo ❌ Невалиден избор.
    echo.
    goto askCommit
)

:end
echo.
echo Натисни произволен клавиш за изход...
pause >nul
exit /b
