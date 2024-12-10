import {
  SET_CHAT,
  GET_MESSAGES,
  SEND_MESSAGE,
  DELETE_MESSAGE,
  MESSAGE_ERROR
} from '../actions/types';

const initialState = {
  messages: [],
  currChat: {},
  error: {}
};

function messageReducer(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case SET_CHAT:
      return {
        ...state,
        currChat: payload
      };
    case GET_MESSAGES:
      return {
        ...state,
        messages: payload.sort(function(a,b){
          return new Date(a.date) - new Date(b.date);
        })
      };
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload]
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((mesage) => mesage._id !== payload)
      };
    case MESSAGE_ERROR:
      return {
        ...state,
        error: payload
      };
    default:
      return state;
  }
}

export default messageReducer;
