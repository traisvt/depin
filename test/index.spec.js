'use strict';

const depin = require('../');

// tests

describe('depin', () => {

  let app;

  beforeEach(() => {
    app = depin();
  });

  describe('apply', () => {

    it('should apply function', () => {
      app
        .register('hello', () => 'Hello')
        .register(function world() {
          return 'Earth';
        })
        .set('punctuation', '!')
      ;
      const result = app.apply((hello, world, punctuation) => {
        expect(hello).toBe('Hello');
        expect(world).toBe('Earth');
        expect(punctuation).toBe('!');
        return 'OK';
      });
      expect(result).toBe('OK');
    });

  });

  describe('get', () => {

    it('should return dependency value from key', () => {
      app.set('key', 'value');
      expect(app.get('key')).toBe('value');
    });

    it('should return undefined if not found', () => {
      expect(app.get('key')).toBeUndefined();
    });

    it('should pick multiple values', () => {
      app.set('first', 'first');
      app.set('second', 'second');
      expect(app.get('first')).toBe('first');
      expect(app.get('second')).toBe('second');
    });

    it('should return dependency picker', () => {
      app.set('first', 'first');
      app.set('second', 'second');
      const picker = app.get();
      expect(picker.first).toBe('first');
      expect(picker.second).toBe('second');
    });

  });

  describe('register', () => {

    it('should register and get named provider', () => {
      app.register('myNamedProvider', () => (
        { myValue: 'ok' }
      ));
      expect(app.get('myNamedProvider')).toEqual({ myValue: 'ok' });
    });

    it('should register and get auto named provider', () => {
      app.register(function myProvider() {
        return { myValue: 'ok' };
      });
      expect(app.get('myProvider')).toEqual({ myValue: 'ok' });
    });

    it('should throw if provider is anonymous function', () => {
      expect(() =>
        app.register(() => ({}))
      ).toThrowErrorMatchingSnapshot();
    });

    it('should take dependencies', () => {
      app
        .register('hello', () => 'Hello')
        .register(function world() {
          return 'Earth';
        })
        .set('punctuation', '!')
        .register(function sentence(hello, world, punctuation) {
          return `${hello} ${world}${punctuation}`;
        }, 'punctuation', 'world', 'hello')
      ;
      expect(app.get('sentence')).toBe('! EarthHello');
    });

    it('should infer dependencies', () => {
      app
        .register('hello', () => 'Hello')
        .register(function world() {
          return 'Earth';
        })
        .set('punctuation', '!')
        .register(function sentence(hello, world, punctuation) {
          return `${hello} ${world}${punctuation}`;
        })
      ;
      expect(app.get('sentence')).toBe('Hello Earth!');
    });

  });

  describe('set', () => {

    it('should register key-value', () => {
      app.set('key', 'value');
      expect(app.get('key')).toBe('value');
    });

    it('should register key-values object', () => {
      app.set({
        key1: 'value-1',
        key2: 'value-2',
      });
      expect(app.get('key1')).toBe('value-1');
      expect(app.get('key2')).toBe('value-2');
    });

    it('should throw if key is invalid', () => {
      expect(
        () => depin().set(true, 'value')
      ).toThrowErrorMatchingSnapshot();
      expect(
        () => depin().set(10, 'value')
      ).toThrowErrorMatchingSnapshot();
    });

  });

  describe('run', () => {

    it('should run function', () => {
      let ran = false;
      depin()
        .register('hello', () => 'Hello')
        .register(function world() {
          return 'Earth';
        })
        .set('punctuation', '!')
        .run((hello, world, punctuation) => {
          ran = true;
          expect(hello).toBe('Hello');
          expect(world).toBe('Earth');
          expect(punctuation).toBe('!');
        })
      ;
      expect(ran).toBe(true);
    });

  });

  it('should chain all but apply() and get()', () => {
    expect(
      app
        .register(function test() { /**/ })
        .set({})
        .run(() => { /**/ })
    ).toBe(app);
  });

});
