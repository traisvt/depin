'use strict';

const fnArgs = require('fn-args');

// exports

/**
 * @param {object} app
 * @return {object} with bottle functions
 */
function depinFactory() {

  const container = {};
  const depin = {};

  // private

  const pick = new Proxy(depin, {
    get(target, property) {
      return target.get(property);
    },
  });

  // expose

  Object.assign(depin, {

    /**
     * @param {function} func
     * @return {*}
     */
    apply(func) {
      const dependencies = fnArgs(func);
      return func(...dependencies.map(depin.get));
    },

    /**
     * @param {string} [name]
     * @return {*|Proxy} value or Proxy to pick values from
     */
    get(name) {
      if (name == null) {
        return pick;
      }
      return container[name];
    },

    /**
     * @param {string}   [name]
     * @param {function} factory
     * @param {...*}     [dependencies]
     * @return {object} app
     */
    register(...args) {
      let dependencies, factory, name;

      if (typeof args[0] === 'function') {
        [factory] = args;
        name = factory.$name || factory.name;
        dependencies = args.slice(1);
      } else {
        [name, factory] = args;
        dependencies = args.slice(2);
      }

      if (!name) {
        throw new TypeError(
          'Cannot register anonymous provider. Either name your provider, or pass a name argument while registering.'
        );
      }

      if (dependencies.length === 0) {
        dependencies = fnArgs(factory);
      }

      Object.defineProperty(container, name, {
        get() {
          return factory(...dependencies.map(depin.get));
        },
      });

      return depin;
    },

    /**
     * @param {function} func
     * @return {object} app
     */
    run(func) {
      depin.apply(func);
      return depin;
    },

    /**
     * @param {string|object} nameOrValues
     * @param {*}             [value]      only needed when first arg is name
     * @return {object} app
     * @example
     *   app.set('key1', 'value1');
     *   app.set({
     *     key2: 'value2',
     *     key3: 'value3',
     *   });
     */
    set(nameOrValues, value) {
      // option 1: args = [values:object]
      if (typeof nameOrValues === 'object') {
        const values = nameOrValues;
        for (const name of Object.keys(values)) {
          depin.set(name, values[name]);
        }
        return depin;
      }
      // option 2: args = [key:string, value:*]
      const name = nameOrValues;
      if (typeof name !== 'string') {
        throw new TypeError(`Expected value key to be of type 'string'. Instead received '${typeof name}'.`);
      }
      container[name] = value;
      return depin;
    },

  });

  return depin;
}

module.exports = depinFactory;
