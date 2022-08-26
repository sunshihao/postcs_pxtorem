// 本地校验
"use strict";

var fs = require("fs");
var postcss = require("postcss");
// var pxToViewport = require('..');
var pxtorem = require("..");
var css = fs.readFileSync("main.css", "utf8");
// var css = fs.readFileSync('demo.ts', 'utf8');

var processedCss = postcss(pxtorem()).process(css).css;

fs.writeFile("main-viewport1.css", processedCss, function(err) {
  if (err) {
    throw err;
  }
  console.log("File with viewport units written.");
});
