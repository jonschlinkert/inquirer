'use strict';

var assert = require('assert');
var expect = require('chai').expect;
var _ = require('lodash');

var ReadlineStub = require('../../helpers/readline');
var fixtures = require('../../helpers/fixtures');
var Rawlist = require('../../../lib/prompts/rawlist');

describe('`rawlist` prompt', function() {
  beforeEach(function() {
    this.rl = new ReadlineStub();
    this.fixture = _.clone(fixtures.rawlist);
    this.rawlist = new Rawlist(this.fixture, this.rl);
  });

  it('should default to first choice', function(done) {
    this.rawlist.run(function(answer) {
      expect(answer).to.equal('foo');
      done();
    });

    this.rl.emit('line');
  });

  it('should select given index', function(done) {
    this.rawlist.run(function(answer) {
      expect(answer).to.equal('bar');
      done();
    });
    this.rl.emit('line', '2');
  });

  it('should not allow invalid index', function(done) {
    var self = this;
    var callCount = 0;

    this.rawlist.run(function(answer) {
      callCount++;
    });

    this.rl.emit('line', 'blah');
    setTimeout(function() {
      self.rl.emit('line', '1');
      setTimeout(function() {
        assert.equal(callCount, 1);
        done();
      }, 10);
    }, 10);
  });

  it('should require a choices array', function() {
    var mkPrompt = function() {
      new Rawlist({
        name: 'foo',
        message: 'bar'
      });
    };
    expect(mkPrompt).to.throw(/choices/);
  });

  it('should allow a default index', function(done) {
    this.fixture.default = 1;
    var list = new Rawlist(this.fixture, this.rl);

    list.run(function(answer) {
      expect(answer).to.equal('bar');
      done();
    });

    this.rl.emit('line');
  });

  it('shouldn not allow an invalid index as default', function(done) {
    this.fixture.default = 4;
    var list = new Rawlist(this.fixture, this.rl);

    list.run(function(answer) {
      expect(answer).to.equal('foo');
      done();
    });

    this.rl.emit('line');
  });
});
