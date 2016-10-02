import React, {PropTypes, Component} from 'react';
// import App from '../../components/App/App';
import {connect} from 'react-redux';
import {Link} from 'react-router';

// import socketOptions from 'universal/utils/socketOptions';
// import loginWithToken from '../../decorators/loginWithToken/loginWithToken';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <div>
      ho?s发
        <Link to="/landing">wo</Link>
        {this.props.children}
      </div>
    );
  }
}
