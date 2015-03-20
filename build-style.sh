#!/bin/sh
stylus src/styles/react-datalist.styl -p | sed ':a;N;$!ba;s/\n/ /g' | xargs -I css replace '_interopRequire\(require\("./styles/react-datalist.styl"\)\);' '"css"' lib/ReactDataList.js
