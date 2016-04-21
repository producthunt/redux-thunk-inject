# Redux Thunk Inject

A drop-in replacement for redux-thunk that let's you inject additional
variables into your action creators.

## Installation

```
npm install --save redux-thunk-inject
```

Then use with [`applyMiddleware()`](http://redux.js.org/docs/api/applyMiddleware.html):

```js
import { createStore, applyMiddleware } from 'redux'
import thunkInject from 'redux-thunk-inject'
import rootReducer from './reducers/index'

const contextualApi = {
  something: 'for the current user only, necessary in action creators'
}

const other = 'other'

const store = createStore(
  rootReducer,
  applyMiddleware(thunkInject(contextualApi, other /*, ...*/))
)
```

Then in your async action creators:

```js
export function createUser () {
  return (dispatch, getState, contextualApi, other) => {
    contextualApi.createUser().then(() => {
      dispatch('USER_CREATED');
    })
  }
}
```

## License

MIT
