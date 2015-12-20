
'use strict';

describe("Test emitting events", function () {

  const Emitter = require('../emitter');
  const should = require('should');


  describe("Emitting events", function () {

    it("should emit 'newListener'", function () {
      let events = new Emitter();
      let fnFoo = function foo() {};
      let fnBar = function bar() {};
      let listeners = {};

      this.timeout(1000);

      return events.addListener('newListener', function (type, listener) {
        listeners[type] = listener;
      }).then(function () {
        return events.addListener('foo', fnFoo).then(events.on('bar', fnBar)).then(function () {

          listeners.should.have.ownProperty('foo').and.equal(fnFoo);
          listeners.should.have.ownProperty('bar').and.equal(fnBar);

        });
      });
    });


    it("should emit 'removeListener'", function () {
      let events = new Emitter();
      let fn = function () {};
      let listeners = { 'foo': fn };

      this.timeout(1000);

      return events.addListener('removeListener', function (type, listener) {
        listener.should.equal(listeners[type]);

        listeners[type] = false;
      }).then(function () {
        return events.on('foo', fn).then(function () {
          return events.removeListener('foo', fn).then(function () {

            listeners.should.have.ownProperty('foo').and.equal(false);

          });
        });
      });
    });


    it("should emit with no arguments", function () {
      let events = new Emitter();
      let fn = function () {
        arguments.should.have.lengthOf(0);
      };

      this.timeout(1000);

      return events.addListener('foo', fn).then(function () {
        return events.emit('foo').then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(0);

          Emitter.listenerCount(events, 'foo').should.equal(1);

          return events.on('foo', fn).then(function () {
            return events.emit('foo').then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(0);

              events.listeners('foo').should.be.an.instanceOf(Array).and.have.lengthOf(2);
              Emitter.listenerCount(events, 'foo').should.equal(2);

            });
          });
        });
      });
    });


    it("should emit with one argument", function () {
      let events = new Emitter();
      let a = 'Hello';
      let fn = function (arg1) {
        arguments.should.have.lengthOf(1);

        arg1.should.equal(a);

        return arg1;
      };

      this.timeout(1000);

      return events.addListener('foo', fn).then(function () {
        return events.emit('foo', a).then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(a);

        }).then(events.on('foo', fn)).then(function () {
          return events.emit('foo', a).then(function (results) {

            results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
            should(results[0]).equal(a);
            should(results[1]).equal(a);
          });
        });
      });
    });


    it("should emit with two argument", function () {
      let events = new Emitter();
      let a = 'Hello';
      let b = 'World';
      let fn1 = function (arg1, arg2) {
        arguments.should.have.lengthOf(2);

        arg1.should.equal(a);
        arg2.should.equal(b);

        return arg1;
      };
      let fn2 = function (arg1, arg2) {
        arguments.should.have.lengthOf(2);

        arg1.should.equal(a);
        arg2.should.equal(b);

        return arg2;
      };

      this.timeout(1000);

      return events.addListener('foo', fn1).then(function () {
        return events.emit('foo', a, b).then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(a);

        }).then(events.on('foo', fn2)).then(function () {
          return events.emit('foo', a, b).then(function (results) {

            results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
            should(results[0]).equal(a);
            should(results[1]).equal(b);
          });
        });
      });
    });


    it("should emit with three argument", function () {
      let events = new Emitter();
      let a = 'Hello';
      let b = 'World';
      let c = '!!';
      let fn1 = function (arg1, arg2, arg3) {
        arguments.should.have.lengthOf(3);

        arg1.should.equal(a);
        arg2.should.equal(b);
        arg3.should.equal(c);

        return arg1;
      };
      let fn2 = function (arg1, arg2, arg3) {
        arguments.should.have.lengthOf(3);

        arg1.should.equal(a);
        arg2.should.equal(b);
        arg3.should.equal(c);

        return arg2;
      };
      let fn3 = function (arg1, arg2, arg3) {
        arguments.should.have.lengthOf(3);

        arg1.should.equal(a);
        arg2.should.equal(b);
        arg3.should.equal(c);

        return arg3;
      };

      this.timeout(1000);

      return events.addListener('foo', fn1).then(function () {
        return events.emit('foo', a, b, c).then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(a);

        }).then(events.addListener('foo', fn2)).then(function () {
          return events.emit('foo', a, b, c).then(function (results) {

            results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
            should(results[0]).equal(a);
            should(results[1]).equal(b);

          }).then(events.on('foo', fn3)).then(function () {
            return events.emit('foo', a, b, c).then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(3);
              should(results[0]).equal(a);
              should(results[1]).equal(b);
              should(results[2]).equal(c);

            });
          });
        });
      });
    });


    it("should emit with many argument", function () {
      let events = new Emitter();
      let args = ['a', 'b', 'c', 'd'];
      function fnGenerator(retVal) {
        return function () {
          arguments.should.have.lengthOf(args.length);
          Array.prototype.slice.call(arguments).should.eql(args);

          return retVal;
        }
      }

      return events.addListener('foo', fnGenerator(1)).then(function () {
        return events.emit('foo', 'a', 'b', 'c', 'd').then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(1);

        }).then(events.on('foo', fnGenerator(2))).then(function () {
          return events.emit('foo', 'a', 'b', 'c', 'd').then(function (results) {

            results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
            should(results[0]).equal(1);
            should(results[1]).equal(2);

          });
        });
      });
    });

  });


  describe("Emitting event once", function () {

    it("should emit 'newListener'", function () {
      let events = new Emitter();
      let fnFoo = function foo() {};
      let fnBar = function bar() {};
      let listeners = {};

      this.timeout(1000);

      return events.addListener('newListener', function (type, listener) {
        listeners[type] = listener;
      }).then(function () {
        return events.once('foo', fnFoo).then(events.on('bar', fnBar)).then(function () {

          listeners.should.have.ownProperty('foo').and.equal(fnFoo);
          listeners.should.have.ownProperty('bar').and.equal(fnBar);

        });
      });
    });


    it("should emit 'removeListener'", function () {
      let events = new Emitter();
      let fn = function () {};
      let listeners = { 'foo': fn };

      this.timeout(1000);

      return events.addListener('removeListener', function (type, listener) {
        listener.should.equal(listeners[type]);

        listeners[type] = false;
      }).then(function () {
        return events.once('foo', fn).then(function () {
          return events.removeListener('foo', fn).then(function () {

            listeners.should.have.ownProperty('foo').and.equal(false);

          });
        });
      });
    });


    it("should emit 'newListener' only once", function () {
      let events = new Emitter();
      let fn = function () {};
      let newHandlerCount = 0;

      this.timeout(1000);

      return events.once('newListener', function (type, listener) {
        ++newHandlerCount;
      }).then(function () {
        newHandlerCount.should.equal(0);
        events._eventsCount.should.equal(1);

        return events.on('foo', fn).then(events.on('foo', fn)).then(function () {

          newHandlerCount.should.equal(1);
          events._eventsCount.should.equal(2);

        });
      });

    });


    it("should emit with no arguments", function () {
      let events = new Emitter();
      let fn = function () {
        arguments.should.have.lengthOf(0);
      };

      this.timeout(1000);

      return events.once('foo', fn).then(function () {
        events._events.should.have.ownProperty('foo').and.be.a.Function;

        return events.emit('foo').then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(0);

          events._events.should.not.have.ownProperty('foo');

          return events.once('foo', fn).then(events.once('foo', fn)).then(function () {
            events._events.should.have.ownProperty('foo').and.have.lengthOf(2);

            return events.emit('foo').then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(0);

              events._events.should.not.have.ownProperty('foo');
            });
          });
        });
      });
    });


    it("should emit with one argument", function () {
      let events = new Emitter();
      let a = 'Hello';
      let fn = function (arg1) {
        arguments.should.have.lengthOf(1);

        arg1.should.equal(a);

        return arg1;
      };

      this.timeout(1000);

      return events.once('foo', fn).then(function () {
        return events.emit('foo', a).then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(a);

          events._events.should.not.have.ownProperty('foo');

          return events.once('foo', fn).then(events.once('foo', fn)).then(function (results) {
            return events.emit('foo', a).then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
              should(results[0]).equal(a);
              should(results[1]).equal(a);

              events._events.should.not.have.ownProperty('foo');

            });
          });
        });
      });
    });


    it("should emit with two argument", function () {
      let events = new Emitter();
      let a = 'Hello';
      let b = 'World';
      let fn1 = function (arg1, arg2) {
        arguments.should.have.lengthOf(2);

        arg1.should.equal(a);
        arg2.should.equal(b);

        return arg1;
      };
      let fn2 = function (arg1, arg2) {
        arguments.should.have.lengthOf(2);

        arg1.should.equal(a);
        arg2.should.equal(b);

        return arg2;
      };

      this.timeout(1000);

      return events.once('foo', fn1).then(function () {
        return events.emit('foo', a, b).then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(a);

          events._events.should.not.have.ownProperty('foo');

          return events.once('foo', fn1).then(events.once('foo', fn2)).then(function (results) {
            return events.emit('foo', a, b).then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
              should(results[0]).equal(a);
              should(results[1]).equal(b);

              events._events.should.not.have.ownProperty('foo');

            });
          });
        });
      });
    });


    it("should emit with three argument", function () {
      let events = new Emitter();
      let a = 'Hello';
      let b = 'World';
      let c = '!!';
      let fn1 = function (arg1, arg2, arg3) {
        arguments.should.have.lengthOf(3);

        arg1.should.equal(a);
        arg2.should.equal(b);
        arg3.should.equal(c);

        return arg1;
      };
      let fn2 = function (arg1, arg2, arg3) {
        arguments.should.have.lengthOf(3);

        arg1.should.equal(a);
        arg2.should.equal(b);
        arg3.should.equal(c);

        return arg2;
      };
      let fn3 = function (arg1, arg2, arg3) {
        arguments.should.have.lengthOf(3);

        arg1.should.equal(a);
        arg2.should.equal(b);
        arg3.should.equal(c);

        return arg3;
      };

      this.timeout(1000);

      return events.once('foo', fn1).then(function () {
        return events.emit('foo', a, b, c).then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(a);

          events._events.should.not.have.ownProperty('foo');

          return events.once('foo', fn1).then(events.once('foo', fn2)).then(function () {
            return events.emit('foo', a, b, c).then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
              should(results[0]).equal(a);
              should(results[1]).equal(b);

              events._events.should.not.have.ownProperty('foo');

              return events.once('foo', fn1).then(events.once('foo', fn2)).then(events.once('foo', fn3)).then(function () {
                return events.emit('foo', a, b, c).then(function (results) {

                  results.should.be.an.instanceOf(Array).and.have.lengthOf(3);
                  should(results[0]).equal(a);
                  should(results[1]).equal(b);
                  should(results[2]).equal(c);

                  events._events.should.not.have.ownProperty('foo');

                });
              });
            });
          });
        });
      });
    });


    it("should emit with many argument", function () {
      let events = new Emitter();
      let args = ['a', 'b', 'c', 'd'];
      function fnGenerator(retVal) {
        return function () {
          arguments.should.have.lengthOf(args.length);
          Array.prototype.slice.call(arguments).should.eql(args);

          return retVal;
        }
      }

      return events.once('foo', fnGenerator(1)).then(function () {
        return events.emit('foo', 'a', 'b', 'c', 'd').then(function (results) {

          results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          should(results[0]).equal(1);

          events._events.should.not.have.ownProperty('foo');

          return events.once('foo', fnGenerator(1)).then(events.once('foo', fnGenerator(2))).then(function () {
            return events.emit('foo', 'a', 'b', 'c', 'd').then(function (results) {

              results.should.be.an.instanceOf(Array).and.have.lengthOf(2);
              should(results[0]).equal(1);
              should(results[1]).equal(2);

              events._events.should.not.have.ownProperty('foo');
            });
          });
        });
      });
    });

  });



  describe('Test errors', function () {


    it('should reject error instance when no error listeners', function () {
      let events = new Emitter();

      return events.emit('error', new Error('Test Error')).then(function () {
        throw new Error('Failed test');
      }, function (err) {
        err.should.be.instanceOf(Error).and.have.ownProperty('message').equal('Test Error');
      });
    });

    it('should reject error string when no error listeners', function () {
      let events = new Emitter();

      return events.emit('error', 'Test string').then(function () {
        throw new Error('Failed test');
      }, function (err) {
        err.should.be.instanceOf(Error).and.have.ownProperty('message').equal('Uncaught, unspecified "error" event. (Test string)');
      });
    });

    it('should reject undefined error when no error listeners', function () {
      let events = new Emitter();

      return events.emit('error').then(function () {
        throw new Error('Failed test');
      }, function (err) {
        err.should.be.instanceOf(Error).and.have.ownProperty('message').equal('Uncaught, unspecified "error" event.');
      });
    });

    it('should reject even with undefined _events', function () {
      let events = new Emitter();

      events._events = null;

      return events.emit('error').then(function () {
        throw new Error('Failed test');
      }, function (err) {
        err.should.be.instanceOf(Error).and.have.ownProperty('message').equal('Uncaught, unspecified "error" event.');
      });
    });

  });


  it('should resolve on missing listeners', function () {
    let events = new Emitter();

    return events.emit('missing');
  });

  it('should resolve on missing listeners with undefined _events', function () {
    let events = new Emitter();

    events._events = null;

    return events.emit('missing');
  });

  describe('Filtering the listener return values', function () {
    
    it('should filter out undefined results by default', function () {
      let events = new Emitter();
      
      return Promise.all([
        events.on('foo', function() { return undefined; }),
        events.on('foo', function() { return 1; }),
        events.on('foo', function() { return 2; }),
      ]).then(function() {
        return events.emit('foo').then(function(results) {
          results.sort().should.deepEqual([1, 2]);
        });
      });
    });

    it('should accept custom result filters', function() {
      let events = new Emitter();
      
      function filter(value) {
        return value !== 2;
      }
      
      events.setResultFilter(filter);
      events._resultFilter.should.equal(filter);
      
      return Promise.all([
        events.on('foo', function() { return undefined; }),
        events.on('foo', function() { return 1; }),
        events.on('foo', function() { return 2; }),
      ]).then(function() {
        return events.emit('foo').then(function(results) {
          results.sort().should.deepEqual([undefined, 1].sort());
        });
      });
    });
    
    it("should accept a custom 'null' filter", function() {
      let events = new Emitter();
      
      events.setResultFilter(null);
      
      return Promise.all([
        events.on('foo', function() { return undefined; }),
        events.on('foo', function() { return 1; }),
        events.on('foo', function() { return 2; }),
      ]).then(function() {
        return events.emit('foo').then(function(results) {
          results.sort().should.deepEqual([undefined, 1, 2].sort());
        });
      });
    });
    
    it('should throw when adding invalid filters', function() {
      let events = new Emitter();
      
      try {
        events.setResultFilter(42);
      } catch (err) {
        err.should.be.instanceOf(Error).and.have.ownProperty('message').equal('filter must be a function');
      }
    });
  });
});
