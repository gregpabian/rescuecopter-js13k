module.exports = function ( grunt ) {
    require( 'load-grunt-tasks' )( grunt );

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        src: 'src/',
        build: 'build/',
        dist: 'dist/',

        clean: {
            build: [ '<%= build %>' ],
            dist: [ '<%= dist %>' ],
            postbuild: [ '<%= build %>game.js', '<%= build %>style.min.css' ]
        },

        compress: {
            dist: {
                options: {
                    archive: '<%= dist %>rescuecopter.zip',
                    level: 7
                },
                files: [ {
                    cwd: '<%= build %>',
                    src: '**',
                    expand: true
                } ]
            }
        },

        concat: {
            options: {
                separator: '\n\n'
            },
            build: {
                src: [
                    '<%= src %>js/utils.js',
                    '<%= src %>js/timer.js',
                    '<%= src %>js/definitions.js',
                    '<%= src %>js/jsfxr.js',
                    '<%= src %>js/sound.js',
                    '<%= src %>js/sprite.js',
                    '<%= src %>js/sprites.js',
                    '<%= src %>js/loader.js',
                    '<%= src %>js/body.js',
                    '<%= src %>js/label.js',
                    '<%= src %>js/button.js',
                    '<%= src %>js/gauge.js',
                    '<%= src %>js/background.js',
                    '<%= src %>js/map.js',
                    '<%= src %>js/controls.js',
                    '<%= src %>js/copter.js',
                    '<%= src %>js/guy.js',
                    '<%= src %>js/bird.js',
                    '<%= src %>js/tree.js',
                    '<%= src %>js/lake.js',
                    '<%= src %>js/pad.js',
                    '<%= src %>js/water.js',
                    '<%= src %>js/smoke.js',
                    '<%= src %>js/flame.js',
                    '<%= src %>js/game.js'
                ],
                dest: '<%= build %>game.js'
            }
        },

        copy: {
            build: {
                src: '<%= wrap.build.dest %>',
                dest: '<%= build %>game.min.js'
            }
        },

        csslint: {
            options: {
                ids: false,
            },
            lint: {
                src: [ '<%= src %>style.css' ]
            }
        },

        cssmin: {
            build: {
                src: '<%= src %>style.css',
                dest: '<%= build %>style.min.css'
            }
        },

        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            build: {
                src: '<%= htmlrefs.build.dest %>',
                dest: '<%= htmlrefs.build.dest %>'
            }
        },

        htmlrefs: {
            build: {
                src: '<%= src %>index.html',
                dest: '<%= build %>index.html'
            }
        },

        imagemin: {
            build: {
                src: '<%= src %>img/sprites.png',
                dest: '<%= build %>img/sprites.png'
            }
        },

        jshint: {
            options: {
                // unused: true
            },
            lint: {
                src: [ 'gruntfile.js', '<%= src %>js/*.js' ]
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: false
                }
            },
            build: {
                src: '<%= wrap.build.dest %>',
                dest: '<%= build %>game.min.js'
            }
        },

        wrap: {
            options: {
                wrapper: [
                    '( function ( document, window, undefined ) {\n\t\'use strict\';\n',
                    '\n} )( document, this );'
                ]
            },
            build: {
                src: [ '<%= concat.build.dest %>' ],
                dest: '<%= concat.build.dest %>'
            }
        }
    } );

    grunt.registerTask( 'lint', [ 'jshint', 'csslint' ] );
    grunt.registerTask( 'build', [
        'lint', 'clean:build', 'concat', 'wrap', 'uglify', 'cssmin', 'htmlrefs', 'htmlmin',
        'imagemin', 'clean:postbuild'
    ] );
    grunt.registerTask( 'dist', [ 'clean:dist', 'compress' ] );

    grunt.registerTask( 'default', [ 'lint', 'build', 'dist' ] );
};