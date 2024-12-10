import {
  GET_TIMESLOTS,
  GET_TIMESLOT,
  TIMESLOT_ERROR,
  DELETE_TIMESLOT,
  ADD_TIMESLOT
} from '../actions/types';

const initialState = {
  timeslots: [],
  timeslot: null,
  loading: true,
  error: {}
};

function timeslotReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TIMESLOTS:
      return {
        ...state,
        timeslots: payload,
        loading: false
      };
    case GET_TIMESLOT:
      return {
        ...state,
        timeslot: payload,
        loading: false
      };
    case ADD_TIMESLOT:
      return {
        ...state,
        timeslots: [payload, ...state.timeslots],
        loading: false
      };
    case DELETE_TIMESLOT:
      return {
        ...state,
        timeslots: state.timeslots.filter((timeslot) => timeslot._id !== payload),
        loading: false
      };
    case TIMESLOT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

export default timeslotReducer;
