import chai from 'chai'

import thunkInjectMiddleware from '../src'

describe('thunkInjectMiddleware', () => {
  const doDispatch = () => {}
  const doGetState = () => {}
  const inject1 = Symbol('inject1')
  const inject2 = Symbol('inject1')
  const nextHandler = thunkInjectMiddleware(inject1, inject2)({ dispatch: doDispatch, getState: doGetState })

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler)
    chai.assert.strictEqual(nextHandler.length, 1)
  })

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler()

      chai.assert.isFunction(actionHandler)
      chai.assert.strictEqual(actionHandler.length, 1)
    })

    describe('handle action', () => {
      it('must run the given action function with dispatch, getState and the injected vars', done => {
        const actionHandler = nextHandler()

        actionHandler((dispatch, getState, inj1, inj2) => {
          chai.assert.strictEqual(dispatch, doDispatch)
          chai.assert.strictEqual(getState, doGetState)
          chai.assert.strictEqual(inj1, inject1)
          chai.assert.strictEqual(inj2, inject2)
          done()
        })
      })

      it('must pass action to next if not a function', done => {
        const actionObj = {}

        const actionHandler = nextHandler(action => {
          chai.assert.strictEqual(action, actionObj)
          done()
        })

        actionHandler(actionObj)
      })

      it('must return the return value of next if not a function', () => {
        const expected = 'redux'
        const actionHandler = nextHandler(() => expected)

        const outcome = actionHandler()
        chai.assert.strictEqual(outcome, expected)
      })

      it('must return value as expected if a function', () => {
        const expected = 'rocks'
        const actionHandler = nextHandler()

        const outcome = actionHandler(() => expected)
        chai.assert.strictEqual(outcome, expected)
      })

      it('must be invoked synchronously if a function', () => {
        const actionHandler = nextHandler()
        let mutated = 0

        actionHandler(() => mutated++)
        chai.assert.strictEqual(mutated, 1)
      })
    })
  })

  describe('handle errors', () => {
    it('must throw if argument is non-object', done => {
      try {
        thunkInjectMiddleware()()
      } catch (err) {
        done()
      }
    })
  })
})
