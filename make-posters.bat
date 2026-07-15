@echo off
rem Generates poster thumbnails for every background video.
rem Needs ffmpeg: winget install ffmpeg  (then reopen cmd)
cd /d "%~dp0assets\backgrounds"
if not exist "..\posters" mkdir "..\posters"
for %%f in (*.mp4) do (
  echo %%f
  ffmpeg -y -v error -ss 1 -i "%%f" -vf "scale=640:-2" -frames:v 1 -q:v 4 "..\posters\%%~nf.jpg"
)
echo.
echo done - posters are in assets\posters
pause
