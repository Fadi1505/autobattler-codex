@echo off
cd /d "%~dp0"

echo Starting Autobattler at http://127.0.0.1:4173
start "" "http://127.0.0.1:4173"

where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 4173
) else (
  python -m http.server 4173
)

pause
