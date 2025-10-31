@echo off
REM setup.bat - Generate lock files if they don't exist (Windows CMD)

echo.
echo 🚀 Setting up project...
echo.

REM Check if pnpm is installed
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm globally...
    call npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pnpm
        exit /b 1
    )
) else (
    echo ✓ pnpm is already installed
)

REM Generate lock files for server
echo.
echo 📝 Generating server lock files...
cd apps\server
if not exist "pnpm-lock.yaml" (
    echo   Creating pnpm-lock.yaml for server...
    call pnpm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install server dependencies
        cd ..\..
        exit /b 1
    )
) else (
    echo   ✓ pnpm-lock.yaml already exists for server
)
cd ..\..

REM Generate lock files for client
echo.
echo 📝 Generating client lock files...
cd apps\client
if not exist "pnpm-lock.yaml" (
    echo   Creating pnpm-lock.yaml for client...
    call pnpm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install client dependencies
        cd ..\..
        exit /b 1
    )
) else (
    echo   ✓ pnpm-lock.yaml already exists for client
)
cd ..\..

echo.
echo ✅ Setup complete! You can now run: docker-compose up
echo.
pause