export default function thunkInjectMiddleware (...inject) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') return action(dispatch, getState, ...inject)
      return next(action)
    }
  }
}
