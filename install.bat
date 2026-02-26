@echo off
echo Installing project dependencies...
npm install firebase react-firebase-hooks lucide-react react-router-dom react-hook-form date-fns motion clsx tailwind-merge
echo.
echo Installing dev dependencies...
npm install -D typescript vite @vitejs/plugin-react @tailwindcss/vite tailwindcss autoprefixer @types/node
echo.
echo All dependencies installed successfully!
pause
