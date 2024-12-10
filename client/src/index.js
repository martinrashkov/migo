import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import api from './utils/api';
import store from './store';
import { SET_SPORTS } from './actions/types';

ReactDOM.render(<App />, document.getElementById('root'));

//API sport
async function load() {
  const res = await api.get('/sports');

  store.dispatch({
    type: SET_SPORTS,
    payload: res.data
  });
}
load();
