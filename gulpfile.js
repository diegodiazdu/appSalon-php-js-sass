
const {series, src, dest, watch, parallel} = require('gulp');//API gulp //series
  const sass = require('gulp-dart-sass');//dependencia gulp-dar-sass
  const imagemin = require('gulp-imagemin');//dependencia gulp-imagemin
  const notify = require('gulp-notify');//dependencia gulp-notify

  const webp = require('gulp-webp');

  const concat = require('gulp-concat');

  //Utilidades CSS

  const autoprefixer = require('autoprefixer')
  const postcss = require('gulp-postcss')
  const cssnano = require('cssnano')
  const sourcemaps = require('gulp-sourcemaps');
  //utilidades JS
  const terser = require('gulp-terser-js');
  const rename = require('gulp-rename');

  const paths = {
    imagenes: 'src/img/**/*',
    css: 'src/scss/app.scss',
    watch: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
    
  }

  //Compilar CSS
  function css(){

    return src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))//mejoras al codigo
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./build/css'))
  }
//task minificar CSS
  function minificarCSS(){

    return src(paths.css)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(dest('./build/css'))
    .pipe(notify("CSS Minificado"))

  }

  function javascript(){

    return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({suffix:'.min'}))
    .pipe(dest('./build/js'))

  }

//Task minificar imagenes
  function imagenes() {
    return src('src/img/**/*')
    .pipe(imagemin())
    .pipe(dest('./build/img'))
    .pipe(notify("Imagen minificadas"))
    
  }
  function toWebp(){
    return src('src/img/**/*')
    .pipe(webp())
    .pipe(dest('./build/img'))
    .pipe(notify("Imagen to Webp"))

  }
//Task Watch (compilar cada ves que escuche cambios)
  function watchArchivos(){
    watch(paths.watch,css);
    watch(paths.js,javascript)
  }

  exports.css = css;
  exports.minificarCSS = minificarCSS;
  exports.imagenes = imagenes;
  exports.toWebp = toWebp;
  exports.watchArchivos = watchArchivos;

/*   exports.default = series(css,javascript, imagenes ,toWebp, watchArchivos) */
exports.default = series(javascript,css,watchArchivos)