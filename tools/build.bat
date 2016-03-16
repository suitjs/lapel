cmd /c jsdoc ./js/lapel.js -d docs/deploy/ -t docs/template/ -c docs/template/conf.json -r README.md
cmd /c uglifyjs js/lapel.js -o js/lapel.min.js
