@echo off
echo ========================================================
echo Pushing MegaVault Internship Project to GitHub Repository
echo Repository: https://github.com/saitejin/MegaVault_Internship-Project.git
echo ========================================================

git init
git add .
git commit -m "Initial commit: MegaVault AI Powered E-Commerce Shopping Platform with 14-Page Internship Report"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/saitejin/MegaVault_Internship-Project.git
git push -u origin main

echo ========================================================
echo Project successfully pushed to GitHub!
echo ========================================================
pause
