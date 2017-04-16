import * as assert from 'assert'
import { removeWhiteSpace } from './util/index'
import jsonToTypescript from '../src/index'

describe('Multiple interfaces', function () {

  it('should create separate interface for nested objects', function() {
    const json = {
      a: {
        b: 42
      }
    }

    const expectedTypes = [
      `interface RootObject {
        a: A;
      }`,
      `interface A {
        b: number;
      }`,
    ].map(removeWhiteSpace)

    jsonToTypescript(json)
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })
  })

  it('should not create duplicate on same type object fields', function() {
    const json = {
      a: {
        b: 42
      },
      c: {
        b: 24
      }
    }

    const expectedTypes = [
      `interface RootObject {
        a: A;
        c: A;
      }`,
      `interface A {
        b: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = jsonToTypescript(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })

    assert(interfaces.length === 2)
  })

  it('should have unique names for nested objects since they ', function() {
    const json = {
      name: 'Larry',
      parent: {
        name: 'Garry',
        parent: {
          name: 'Marry',
          parent: null
        }
      }
    }

    const expectedTypes = [
      `interface RootObject {
        name: string;
        parent: Parent2;
      }`,
      `interface Parent {
        name: string;
        parent?: any;
      }`,
      `interface Parent2 {
        name: string;
        parent: Parent;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = jsonToTypescript(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should support multi nested arrays', function() {
    const json = {
      cats: [
        [
          {name: 'Kittin'},
          {name: 'Kittin'},
          {name: 'Kittin'},
        ],
        [
          {name: 'Kittin'},
          {name: 'Kittin'},
          {name: 'Kittin'},
        ],
      ]
    }

    const expectedTypes = [
      `interface RootObject {
        cats: Cat[][];
      }`,
      `interface Cat {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    jsonToTypescript(json)
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })
  })

  it('should resolve "any" type to arrays containing different types', function() {
    const json = {
      cats: [
        {name: 'Kittin'},
        {label: 'Kittin'}
      ]
    }

    const expectedTypes = [
      `interface RootObject {
        cats: any[];
      }`,
    ].map(removeWhiteSpace)

    jsonToTypescript(json)
      .forEach( i => {
        const noWhiteSpaceInterface = removeWhiteSpace(i)
        assert(expectedTypes.includes(noWhiteSpaceInterface))
      })
  })

  it('should singularize array types (dogs: [...] => dogs: Dog[] )', function() {
    const json = {
      dogs: [
        { name: 'sparky' },
        { name: 'goodboi' },
      ]
    }

    const expectedTypes = [
      `interface RootObject {
        dogs: Dog[];
      }`,
      `interface Dog {
        name: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = jsonToTypescript(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should not singularize if not array type (dogs: {} => dogs: Dogs )', function() {
    const json = {
      cats: {
        popularity: 'very popular'
      }
    }

    const expectedTypes = [
      `interface RootObject {
        cats: Cats;
      }`,
      `interface Cats {
        popularity: string;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = jsonToTypescript(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should capitalize interface names', function() {
    const json = {
      cat: {}
    }

    const expectedTypes = [
      `interface RootObject {
        cat: Cat;
      }`,
      `interface Cat {
      }`,
    ].map(removeWhiteSpace)

    const interfaces = jsonToTypescript(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

  it('should start unique names increment with 2', function() {
    const json = {
      a: {
        human: {legs : 4}
      },
      b: {
        human: {arms : 2}
      },
    }

    const expectedTypes = [
      `interface RootObject {
        a: A;
        b: B;
      }`,
      `interface A {
        human: Human;
      }`,
      `interface B {
        human: Human2;
      }`,
      `interface Human {
        legs: number;
      }`,
      `interface Human2 {
        arms: number;
      }`,
    ].map(removeWhiteSpace)

    const interfaces = jsonToTypescript(json)
    interfaces.forEach( i => {
      const noWhiteSpaceInterface = removeWhiteSpace(i)
      assert(expectedTypes.includes(noWhiteSpaceInterface))
    })
  })

})