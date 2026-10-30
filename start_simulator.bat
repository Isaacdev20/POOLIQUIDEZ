@echo off
title QuantPool V3 Simulator - Simulador de Liquidez Concentrada
echo ===================================================================
echo   QUANTPOOL V3 SIMULATOR - DEFI-LAB + DEFILLAMA
echo   Simulador de Ganhos Mensais e Perda Impermanente Uniswap V3
echo ===================================================================
echo.
cd /d "%~dp0"
echo Iniciando o simulador em http://localhost:3000 ...
echo Abrindo o navegador automaticamente...
start http://localhost:3000
echo.
call npm.cmd run start
if errorlevel 1 (
    echo Iniciando em modo de desenvolvimento...
    call npm.cmd run dev
)
pause
