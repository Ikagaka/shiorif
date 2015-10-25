path = require 'path'
gulp = require 'gulp'
merge2 = require 'merge2'
rename = require 'gulp-rename'
clone = require 'gulp-clone'
sh = require 'gulp-shell'
typedoc = require 'gulp-typedoc'
typescript = require 'gulp-typescript'
sourcemaps = require 'gulp-sourcemaps'
uglify = require 'gulp-uglify'

tsconfig = typescript.createProject 'tsconfig.json'

gulp.task 'default', ['ts']

gulp.task 'ts', ->
  tsresult = tsconfig
    .src()
    .pipe sourcemaps.init()
    .pipe typescript(tsconfig)
  js = tsresult.js
  jsu = js.pipe clone()
  merge2 [
    js.pipe(sourcemaps.write('.')).pipe(gulp.dest 'lib')
    jsu.pipe(uglify()).pipe(rename extname: '.min.js').pipe(sourcemaps.write('.')).pipe(gulp.dest 'lib')
    tsresult.dts.pipe gulp.dest 'lib'
  ]

gulp.task 'doc', ->
  gulp.src tsconfig.config.files
    .pipe typedoc
      target: tsconfig.config.compilerOptions.target
      module: tsconfig.config.compilerOptions.module
      includeDeclarations: false
      out: 'doc'

gulp.task 'dtsm', ->
  gulp.src ''
    .pipe sh [path.join('node_modules/.bin/dtsm') + ' install']
