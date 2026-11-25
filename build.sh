#!/bin/bash
# Vercel runs this to build the live site into the "dist" folder.
set -e

rm -rf dist
mkdir dist

# Home page with links to all six tasks
cp index.html dist/

# Tasks 1 and 2: plain HTML/CSS/JS, copied as they are
cp -r Task1_Portfolio dist/task1
cp -r Task2_Landing_Page dist/task2

# Task 3: build the React app so it lives at /task3/
cd Task3_React_Todo
npm ci
npx vite build --base=/task3/ --outDir ../dist/task3
cd ..

# Task 6: build the React front end so it lives at /task6/
cd Task6_Full_Stack_App/client
npm ci
npx vite build --base=/task6/ --outDir ../../dist/task6
cd ../..

# Tasks 4, 5 and 6's API run as Vercel Functions (see the api folder)
echo "Site built in dist/"
