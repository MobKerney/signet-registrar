var signetRegistrar = (function () {
    'use strict';

    return function () {
        function isTypeOf(type, value) {
            return typeof value === type;
        }

        function isValidTypeName(value) {
            return isTypeOf('string', value) && value.match(/^[^\(\)\<\>\[\]\:\;\=\,\s]+$/) !== null;
        }

        function throwOnBadType(name, predicate) {
            if (!isValidTypeName(name)) {
                throw new Error('Invalid type name: ' + name);
            }

            if (!isTypeOf('undefined', registry[name])) {
                throw new Error('Type already registered with name ' + name);
            }

            if (!isTypeOf('function', predicate)) {
                throw new Error('Type predicate parameter must be a function');
            }
        }

        // Core registry code

        var registry = {};

        function get(name) {
            var predicate = registry[name];
            if (typeof predicate === 'undefined') {
                throw new Error('The given type "' + name + '" does not exist');
            }
            return predicate;
        }

        function set(name, predicate) {
            throwOnBadType(name, predicate);

            registry[name] = predicate;
        }

        return {
            get: get,
            set: set
        };
    };

})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = signetRegistrar;
}
