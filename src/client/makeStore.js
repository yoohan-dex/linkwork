import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import ApolloClient from 'apollo-client';
import makeReducer from '../universal/redux/makeReducer';

const sagaMiddleware = createSagaMiddleware();
const apollo = new ApolloClient();

const devtoolsExt = __PRODUCTION__ ?
    (() => noop => noop) :
    global.devToolsExtension || (() => noop => noop);

export default initialState => {
  const reducer = makeReducer(apollo.reducer());
  console.log(reducer);
  const reduxRouterMiddleware = routerMiddleware(browserHistory);
  const middlewares = [
    sagaMiddleware,
    reduxRouterMiddleware,
    apollo.middleware(),
  ];
  const enhancers = [
    applyMiddleware(...middlewares),
    devtoolsExt(),
  ];
  const store = createStore(
    reducer,
    initialState,
    compose(...enhancers)
  );
  if (module.hot) {
    module.hot.accept('../universal/redux/makeReducer', () => {
      System.import('../universal/redux/makeReducer').then((reducerModule) => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(apollo.reducer());

        store.replaceReducer(nextReducers);
      });
    });
  }

  return store;
};

export {apollo};

