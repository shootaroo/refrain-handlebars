/* global it */
'use strict';
var path = require('path');

var assert = require('power-assert');
var refrain = require('refrain');

var target = require('../index');

it('partial', function () {
  target.call(refrain({
    srcDir: 'test',
    handlebars: {
      partialsDir: 'test/partials'
    }
  }), '{{> foo}}{{> ./bar }}<p>{{page.data.foo}}</p>', {
    page: {
      filePath: path.resolve('test/foo.hbs'),
      data: {
        foo: 'bar'
      }
    }
  }, function (err, output) {
    assert(output === '<h1>bar</h1>\n<b>bar</b>\n<p>bar</p>');
  });
});

it('handlebars-helpers', function () {

  target.call(refrain({
    srcDir: 'test'
  }), '<dl>{{#page.data.foo}}<li>{{#is . 3}}buz{{else}}{{.}}{{/is}}</li>{{/page.data.foo}}</dl>', {
    page: {
      data: {
        foo: [1, 2, 3]
      }
    }
  }, function (err, output) {
    assert(output === '<dl><li>1</li><li>2</li><li>buz</li></dl>');
  });
});
