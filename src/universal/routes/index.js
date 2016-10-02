import App from '../containers/App';
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Landing from '../modules/Landing';

// export default store => {
//   return {
//     path: '/',
//     component: App,
//     // childRoutes: [
//       // require('./landing'),
//     //   require('./accounts')(store),
//     //   require('./graphql'),
//     //   require('./notFound'),
//     // ],
//   };
// };

export default (
  <Route path="/" component={App}>
    <Route path="landing" component={Landing}/>
  </Route>
);
