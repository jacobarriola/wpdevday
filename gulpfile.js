// Load our plugins
var	gulp			=	require('gulp'),
	sass			=	require('gulp-ruby-sass'),
	notify			=	require('gulp-notify'),
	minifycss		=	require('gulp-minify-css'),
	rename			=	require('gulp-rename'),
	autoprefixer	=	require('gulp-autoprefixer'),
	browserSync		=	require('browser-sync');

// Our browser-sync task.  

gulp.task('browser-sync', function() {
	var files = [
		'**/*.php'
	];

	browserSync.init(files, {
		proxy: 'master.dev/'
	});
});


// Our 'styles' tasks, which handles our sass actions such as compliling and minification

gulp.task('styles', function() {
	return sass('assets/sass/app.scss', {
			style: 'expanded',
			lineNumbers: true,
			sourcemap: false  
		})
		.on('error', notify.onError(function(error) {
			return "Error: " + error.message;
		}))
		.pipe(autoprefixer({ 
			browsers: ['last 2 versions', 'ie >= 8']
		})) // our autoprefixer - add and remove vendor prefixes using caniuse.com
		.pipe(gulp.dest('assets/css')) // Location of our app.css file
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.css file is written
		.pipe(rename({suffix: '.min'})) // Create a copy version of our compiled app.css file and name it app.min.css
		.pipe(minifycss({
			keepSpecialComments:0
		})) // Minify our newly copied app.min.css file
		.pipe(gulp.dest('assets/css')) // Save app.min.css onto this directory	
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.min.css file is written
		.pipe(notify({
			message: "Styles task complete!"
		}));
});


// Our default gulp task, which runs 'styles' when a sass file changes.  This is task is executed by typing 'gulp' on the Terminal
gulp.task('default', ['styles', 'browser-sync'], function() {
	// Watch our sass files and run 'styles' task when changes are made
	gulp.watch('assets/sass/**/*.scss', ['styles']);
})
