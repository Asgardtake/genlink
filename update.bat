@echo off
chcp 65001 >nul
cls
color 0A

echo ----------------------------------------
echo         G I T   U P D A T E   М Е Н Ю
echo ----------------------------------------
echo.
git branch
echo.
echo Искаш ли да направиш ^< git pull origin main ^> ?
echo.
echo    [1] Да
echo    [2] Не
echo.

set /p choice=Избери опция (1/2): 

if "%choice%"=="1" (
    echo.
    echo Изпълнявам git pull...
    git pull origin main
    echo.
    echo Натисни Enter за изход.
    pause >nul
) else if "%choice%"=="2" (
    echo.
    echo Отказано. Натисни Enter за изход.
    pause >nul
) else (
    echo.
    color 0C
    echo Невалиден избор. Опитай пак.
    echo.
    pause >nul
)
