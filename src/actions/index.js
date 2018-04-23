import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';

var querystring = require('querystring');

//import {localStorage} from 'local-storage'
import localStorage from 'local-storage';

const ROOT_URL = 'https://phnodeapi.herokuapp.com';

export function signinUser({ userID, pinCode }) {
  return function(dispatch) {    
    let params = querystring.stringify({userID, pinCode});
    console.log(params);    
    axios.post(`${ROOT_URL}/user/login`, params)
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated        
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        localStorage.set('token', response.data.data.userToken);        
        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch((err) => {
        // If request is bad...
        // - Show an error to the user
        console.log(err);
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/sensor/sensor-registration`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.set('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  //localStorage.removeItem('token');
  localStorage.remove('token');

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/sensor/store-events`, {
      headers: { Authorization: `Bearer ${localStorage.get('token')}` }
    })
    .then(response => {
      dispatch({
        type: FETCH_MESSAGE,
        payload: response.data.data
      });
    })
    .catch(err=>{
      console.log('**ERROR**', err);
    });
  }
}
