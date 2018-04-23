import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import sensor_id from '../../images/sensor_id.png';
import {Image, Container, Button} from 'semantic-ui-react';

class Signin extends Component {
  handleFormSubmit({ userID, pinCode }) {
    // Need to do something to log user in
    this.props.signinUser({ userID, pinCode });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { userID, pinCode }} = this.props;

    return (
        <Container text textAlign="center" style={{width: '30%'}} >
          <Image src={sensor_id} alt='Sensor ID' size="tiny" centered />
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset className="form-group" >
              <label>Please type in your <br/>Sensor ID</label>
              <input {...userID} className="form-control" style={{borderRadius: '0px', border: '2px #666 solid', fontWeight: 'bold', color: '#666'  }} />
            </fieldset>
            <fieldset className="form-group">
              <label>Password</label>
              <input {...pinCode} type="password" className="form-control" style={{borderRadius: '0px', border: '2px #666 solid', fontWeight: 'bold', color: '#666'}} />
            </fieldset>
            {this.renderAlert()}
            <Button action="submit" negative >SIGN IN</Button>
          </form>
        </Container>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'signin',
  fields: ['userID', 'pinCode']
}, mapStateToProps, actions)(Signin);
