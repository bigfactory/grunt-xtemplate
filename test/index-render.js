define(function(require,exports,module){
/*compiled by xtemplate#3.5.2*/
var tpl = require("./index");
var XTemplateRuntime = require("xtemplate/runtime");
var instance = new XTemplateRuntime(tpl);
module.exports = function(){
return instance.render.apply(instance,arguments);
};
});