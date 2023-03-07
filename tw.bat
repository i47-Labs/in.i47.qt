@echo off
SET NODE_ENV=production
npx tailwindcss -i ./css/app.css -o ./css/app.min.css --minify && minify ./js/app.js > ./js/app.min.js
