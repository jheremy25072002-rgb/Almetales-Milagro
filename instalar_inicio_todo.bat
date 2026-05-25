@echo off
setlocal
cd /d "%~dp0"

set "SYNC_TASK=Almetales Milagro - Sincronizar compras"
set "APP_TASK=Almetales Milagro - Abrir app"
set "SYNC_SCRIPT=%~dp0sincronizacion_mysql_oculta.ps1"
set "APP_SCRIPT=%~dp0abrir_app_web.bat"

echo Instalando inicio automatico de ALMETALES...

schtasks /Create /TN "%SYNC_TASK%" /SC ONLOGON /RL LIMITED /F /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%SYNC_SCRIPT%\""
if errorlevel 1 (
  echo No se pudo instalar la sincronizacion automatica.
  pause
  exit /b 1
)

schtasks /Create /TN "%APP_TASK%" /SC ONLOGON /RL LIMITED /F /TR "\"%APP_SCRIPT%\""
if errorlevel 1 (
  echo No se pudo instalar la apertura automatica de la app.
  pause
  exit /b 1
)

echo.
echo Listo. Al entrar a Windows se iniciara la sincronizacion y se abrira la app.
echo.
echo Probando sincronizacion ahora...
schtasks /Run /TN "%SYNC_TASK%"
echo.
pause
