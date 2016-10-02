import {render} from 'react-dom';
import React from 'react';
import {AppContainer} from 'react-hot-loader';
import {Map as iMap, fromJS} from 'immutable';
import makeStore from './makeStore';
import Root from './Root';
import FontFaceObserver from 'fontfaceobserver';

import styles from '../universal/styles/global/styles.css';
const openSansObserver = new FontFaceObserver('Microsoft Yahei', {});
openSansObserver.load().then(() => {
  document.body.classList.add(styles.fontLoaded);
}, () => {
  document.body.classList.remove(styles.fontLoaded);
});

const {auth, routing, form} = window.__INITIAL_STATE__;

const initialState = iMap([
  ['route', fromJS(routing)],
]);
const store = makeStore(initialState);
render(
  <AppContainer>
    <Root store={store}/>
  </AppContainer>
  , document.getElementById('root'));

if (window.devToolsExtension) {
  window.devToolsExtension.updateStore(store);
}

if (module.hot) {
  module.hot.accept('./Root', () => {
    const Root = require('./Root');
    render(
      <AppContainer>
        <Root store={store}/>
      </AppContainer>
    , document.getElementById('root'));
  });
}
