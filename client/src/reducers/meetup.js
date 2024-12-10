import {
  GET_MY_MEETUPS,
  GET_POST_MEETUPS,
  MEETUP_ERROR,
  DELETE_MEETUP,
  ADD_MEETUP,
  GET_MEETUP,
  UPDATE_MEETUP
} from '../actions/types';

const initialState = {
  myMeetups: [],
  postMeetups: [],
  meetup: null,
  loading: true
};

function meetupReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_MEETUP:
      return {
        ...state,
        meetup: payload,
        loading: false
      };
    case GET_MY_MEETUPS:
      return {
        ...state,
        myMeetups: payload,
        loading: false
      };
    case GET_POST_MEETUPS:
      return {
        ...state,
        postMeetups: payload,
        loading: false
      };
    case UPDATE_MEETUP:
      return {
        ...state,
        myMeetups: state.myMeetups.map(meetup => meetup._id === payload._id ? payload : meetup),
        meetup: payload,
        loading: false
      };
    case ADD_MEETUP:
      return {
        ...state,
        myMeetups: [payload, ...state.myMeetups],
        postMeetups: [payload, ...state.myMeetups],
        loading: false
      };
    case DELETE_MEETUP:
      return {
        ...state,
        myMeetups: state.myMeetups.filter((meetup) => meetup._id !== payload),
        postMeetups: state.myMeetups.filter((meetup) => meetup._id !== payload),
        loading: false
      };
    case MEETUP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

export default meetupReducer;
