/*
 * grunt-xtemplate
 * https://github.com/bigfactory/grunt-xtemplate
 *
 * Copyright (c) 2014 xiaocong.hxc
 * Licensed under the MIT license.
 */

'use strict';

var compiler = require('./lib/compiler');

module.exports = function(grunt) {
    grunt.registerMultiTask('xtemplate', 'xtemplate compiler', function() {
        var options = this.options({});


        this.files.forEach(function(f) {
            var src;

            src = f.src.map(function(filepath) {
                var ret = compiler.compileFile(filepath, options);

                grunt.file.write(ret.tplFile.path, ret.tplFile.contents);
                if (options.isBuildRenderFile === undefined || options.isBuildRenderFile) {
                    grunt.file.write(ret.tplRenderFile.path, ret.tplRenderFile.contents);
                }

            });


        });
    });

};