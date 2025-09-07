@echo off
setlocal enabledelayedexpansion

echo ------------------------------------------
echo Pulling latest changes from Git repo in current folder...
call git pull
if errorlevel 1 (
    echo ERROR: git pull failed!
    pause
    exit /b 1
)

echo ------------------------------------------
echo Enter the full path to your Python project root folder:
set /p pythonPath=
set pythonPath=%pythonPath:"=%

echo ------------------------------------------
echo Checking if dist folder exists in Python project...
if exist "%pythonPath%\dist" (
    echo Found existing dist folder at "%pythonPath%\dist"
    echo Removing old dist folder...
    rmdir /s /q "%pythonPath%\dist"
) else (
    echo No existing dist folder found.
)

echo ------------------------------------------
echo Running npm install...
call npm install --no-progress --loglevel=error
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo npm install completed successfully.

echo ------------------------------------------
echo Running npm run build...
call npm run build
if errorlevel 1 (
    echo ERROR: npm build failed!
    pause
    exit /b 1
)
echo npm build completed successfully.

echo ------------------------------------------
echo Copying build folder to Python project...
xcopy /e /i /y "dist" "%pythonPath%\dist"
if errorlevel 1 (
    echo ERROR: Failed to copy dist folder!
    pause
    exit /b 1
)

echo ------------------------------------------
echo Deployment complete!
pause
