import React, {PropTypes, Component} from 'react';
// import App from '../../components/App/App';
// import {connect} from 'react-redux';
// import socketOptions from 'universal/utils/socketOptions';
// import loginWithToken from '../../decorators/loginWithToken/loginWithToken';
import {SketchPicker} from 'react-color';
export default class Landing extends Component {
  // static propTypes = {
  //   children: PropTypes.element.isRequired,
  //   isAuthenticated: PropTypes.bool.isRequired,
  // }
  handleSubmit(e) {
    e.preventDefault();
    console.log('hoo');
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="email"/>
        <input type="password"/>
        <input type="submit"/>
      </form>
    );
  }
}
