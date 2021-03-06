'use strict';

var assert = require('chai').assert;
var registrar = require('../index');

describe('registry', function () {

    it('should be a factory function', function () {
        assert.equal(typeof registrar(), 'object');
    });

    describe('set', function () {

        var registry;

        beforeEach(function(){
            registry = registrar();
        });

        it('should set a type predicate', function () {
            var predicate = function () {  };

            registry.set('testType', predicate);

            assert.equal(registry.get('testType'), predicate);
        });

        it('should throw an error if key is not a string', function () {
            var errorSet = registry.set.bind(null, {}, function () {  });

            assert.throws(errorSet, 'Invalid type name: ' + {});
        });

        it('should throw an error if key is invalid', function () {
            var badTypeName = 'bad type <[;]>=>,';
            var errorCall = registry.set.bind(null, badTypeName, function () {  });

            assert.throws(errorCall, 'Invalid type name: ' + badTypeName);
        });

        it('should throw an error if key already exists', function () {
            registry.set('foo', function () {  });
            var errorCall = registry.set.bind(null, 'foo', function () {  });

            assert.throws(errorCall, 'Type already registered with name foo');
        });

        it('should throw an error if type predicate param is not a function', function () {
            var errorCall = registry.set.bind(null, 'foo', null);

            assert.throws(errorCall, 'Type predicate parameter must be a function');
        });

    });

    describe('get', function () {
        const type1 = 'type1';

        var type1Predicate = function (value) {
                return value === type1;
            };

        var registry;

        beforeEach(function () {
            registry = registrar();
            registry.set(type1, type1Predicate);
        });

        it('should recieve a valid entry', function () {
           var predicate = registry.get(type1);

           assert.equal(type1Predicate, predicate);
        });

        it('should throw a meaningful error if key has not been registered', function () {
           var errorCall = registry.get.bind(null, 'badKey', null);

           assert.throw(errorCall, /The given type "badKey" does not exist/); 
        });
    });
});
