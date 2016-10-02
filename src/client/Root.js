import React, {Component} from 'react';
import {Router, browserHistory, applyRouterMiddleware} from 'react-router';
import {ApollProvider} from 'react-apollo';
import {Provider} from 'react-redux';
import routes from '../universal/routes';
import {syncHistoryWithStore} from 'react-router-redux';
import {useScroll} from 'react-router-scroll';
import {apollo} from './makeStore';
import {selectLocationState} from '../universal/containers/App/selectors';

export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
  }

  render() {
    const {store} = this.props;
    const history = syncHistoryWithStore(browserHistory, store, {
      selectLocationState: selectLocationState(),
    });
    return (
      <ApollProvider store={store} client={apollo}>
        <div>
          <Router
            history={history}
            routes={routes}
            render={applyRouterMiddleware(useScroll())}
            />
        </div>
      </ApollProvider>
    );
  }
}
