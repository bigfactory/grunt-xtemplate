
'use strict';

var path = require('path');
var fs = require('fs');
var util = require('modulex-util');
var XTemplate = require('xtemplate');

var tplInner = [
    '/*compiled by xtemplate#@version@*/',
    'var ret = module.exports = @func@;',
    'ret.TPL_NAME = module.id || module.name;'
].join('\n');

var tpl = ['@define@{',
    tplInner,
    '});'
].join('\n');

var renderTplInner = [
    '/*compiled by xtemplate#@version@*/',
    'var tpl = require("@tpl@");',
    'var XTemplateRuntime = require("@runtime@");',
    'var instance = new XTemplateRuntime(tpl);',
    'module.exports = function(){',
    'return instance.render.apply(instance,arguments);',
    '};'
].join('\n');

var renderTpl = ['@define@{',
    renderTplInner,
    '});'
].join('\n');

function getFunctionName(name) {
    return name.replace(/-(.)/g, function(m, m1) {
        return m1.toUpperCase();
    })
}

var wrapper = {
    'modulex': 'modulex.add(function(require,exports,module)',
    'kissy': 'KISSY.add(function(S,require,exports,module)',
    'define': 'define(function(require,exports,module)'
};


exports.compileFile = function(filepath, config) {
    config = util.merge({
        wrap: 'define', // defaults to modulex. set to define compiled to define() or kissy to KISSY.add
        compileConfig: {
            isModule: 1, // defaults to 1. use native template require
            catchError: false // defaults to false. whether to point to line of xtpl when exception occurs(impact performance)
        },
        // runtime:'', defaults to kg/xtemplate/x.y.z/runtime
        runtime: 'xtemplate/runtime',
        suffix: '.xtpl', // defaults to .xtpl. transform xx.tpl -> xx.js
        truncatePrefixLen: 0, //optional, remove the first length string of file path from generate code
        XTemplate: XTemplate // required. xtemplate module
    }, config);

    var suffix = config.suffix || '.xtpl';
    // var XTemplate = config.XTemplate;
    var runtime = config.runtime || 'kg/xtemplate/' + XTemplate.version + '/runtime';
    var wrap = config.wrap;
    var truncatePrefixLen = config.truncatePrefixLen || 0;
    var define = wrapper[wrap] || wrapper.modulex;
    var compileConfig = util.merge({
        isModule: 1
    }, config.compileConfig);

    var fileContent;
    var ret = {
        tplFile: '',
        tplRenderFile: ''
    };


    if (path.extname(filepath) !== suffix) {
        return;
    }
    fileContent = fs.readFileSync(filepath, config.encoding || 'utf-8');

    var name = path.basename(filepath, suffix);
    var functionName = getFunctionName(name);
    var compiledFunc = XTemplate.Compiler.compileToStr(util.merge(compileConfig, {
        name: filepath.slice(truncatePrefixLen),
        functionName: functionName,
        content: fileContent
    }));

    var tplFile = {};
    tplFile.path = filepath.slice(0, 0 - suffix.length) + '.js';
    tplFile.contents = new Buffer(util.substitute(wrap !== false ? tpl : tplInner, {
        version: XTemplate.version,
        func: compiledFunc,
        define: define
    }, /@([^@]+)@/g));

    var tplRenderFile = {};
    tplRenderFile.path = filepath.slice(0, 0 - suffix.length) + '-render.js';
    tplRenderFile.contents = new Buffer(util.substitute(wrap !== false ? renderTpl : renderTplInner, {
        tpl: './' + name,
        version: XTemplate.version,
        runtime: runtime,
        define: define
    }, /@([^@]+)@/g));

    ret.tplFile = tplFile;
    ret.tplRenderFile = tplRenderFile;

    return ret;
};