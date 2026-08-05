@echo off
title Portfolio IP Logger Server
echo Starting Portfolio Visitor IP and Timestamp Logger Server...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
