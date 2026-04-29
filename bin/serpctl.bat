@echo off
rem Wrapper for Node.js CLI Boilerplate


rem Check whether Node.js is available on the system.
where node >nul || (
    echo No Node.js on the system >&2
    exit /b 1
)

rem Get the path of current batch script.
set cwd=%~dp0
rem Get the directory to our PHP script.
set libexec=%cwd%..\libexec

rem Run the PHP script and pass command-line arguments to it.
node %libexec%\serpctl.js %*