const { src, dest, watch, parallel, series } = require('gulp');

const scss            = require('gulp-sass')(require('sass'));
const concat          = require('gulp-concat');
const autoprefixer    = require('gulp-autoprefixer');
const uglify          = require('gulp-uglify');
const imagemin        = require('gulp-imagemin');
const browserSync     = require('browser-sync').create();
const rename          = require('gulp-rename');
const del             = require('del');
const nunjucksRender  = require('gulp-nunjucks-render');
// const svgSprite    = require('gulp-svg-sprite');
// const replace      = require('gulp-replace');
// const cheerio      = require('gulp-cheerio');



//===========================================//svgSprites
// const svgSprites = () => {
//   return src(['app/images/icons/**.svg'])

//   .pipe(cheerio({
//     run: function($) {
//       $('[fill]').remooveAttr('fill');
//       $('[stroke]').remooveAttr('stroke');
//       $('[style]').remooveAttr('style');
//     },
//     parseerOptions: {xmlMode: true}
//   }))

//   .pipe(replace('&gt;', '>'))

//   .pipe(svgSprite({
//     mode: {
//       stack: {
//         sprite: "../sprite.svg" //sprite file name
//       }
//     },
//   }))

//   .pipe(dest('app/images'));
// }

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  })
}

function styles() {
    return src('app/scss/*.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    // .pipe(concat('style.min.css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

//============================================//scripts
function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

  function images() {
    return src('app/images/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
  }

function build() {
  return src([
    'app/**/*.html',
    'app/fonts/**/*',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], { base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function nunjucks() {
  return src('app/**/*.njk')
    .pipe(nunjucksRender())
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/**/*.njk'], nunjucks);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html',]).on('change', browserSync.reload);
  // watch(['app/images/icons/**.svg'], svgSprites);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.nunjucks = nunjucks;
// exports.svgSprites = svgSprites;
exports.build = series(cleanDist, images, build);

exports.default = parallel(nunjucks, styles, scripts, browsersync, images, watching);