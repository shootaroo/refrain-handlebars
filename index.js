'use strict';
var path = require('path');

var fast = require('fast.js');
var handlebars = require('handlebars');
var helpers = require('handlebars-helpers');

var PARTIALS_REGEX = /\{\{\s*>\s*([^\s}]+)\s*\}\}/;

helpers.register(handlebars, {}, {});

module.exports = function (text, content, callback) {
  var refrain = this;
  refrain.options.handlebars = fast.assign({
    partialsDir: refrain.options.srcDir
  }, refrain.options.handlebars || {});
  registerPartial(text, refrain, content);
  var tmpl = handlebars.compile(text);
  callback(null, tmpl(fast.assign(content, {
  })));
};


function registerPartial(text, refrain, content) {
  var match = PARTIALS_REGEX.exec(text);
  if (match) {
    var isRelative = match[1].indexOf('.') === 0;
    var dir = isRelative ? path.dirname(content.page.filePath) : refrain.options.handlebars.partialsDir;
    var partial = refrain.load(path.resolve(dir, match[1] + '.hbs'));
    if (partial) {
      handlebars.registerPartial(match[1], partial.page.template);
    }
    registerPartial(text.substring(match[0].length), refrain, content);
  }
}
