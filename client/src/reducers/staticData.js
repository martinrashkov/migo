import {
    SET_SPORTS
  } from '../actions/types';
  
  const initialState = {
    sports: {}
  };
  
  function staticDataReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SET_SPORTS:
        return {
          ...state,
          sports: payload
        };
      default:
        return state;
    }
  }
  
  export default staticDataReducer;
  