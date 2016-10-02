import {reducer as form} from 'redux-form';
import {compose} from 'redux';
import {combineReducers} from 'redux-immutablejs';

import route from './routing';

const currentReducers = {
  form,
  route,
};
export default (newReducers, reducerEnhancers) => {
  console.log(newReducers);
  Object.assign(currentReducers, newReducers);
  const reducer = combineReducers({...currentReducers});
  if (reducerEnhancers) {
    return Array.isArray(reducerEnhancers)
      ? compose(...reducerEnhancers)(reducer)
      : reducerEnhancers(reducer);
  }
  return reducer;
};

export {currentReducers};

