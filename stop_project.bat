@echo off
title VentureLens Shutdown
echo Stopping VentureLens background servers...
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
echo Done! All VentureLens servers have been stopped.
timeout /t 3
