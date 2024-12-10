import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_TIMESLOTS,
  GET_TIMESLOT,
  TIMESLOT_ERROR,
  DELETE_TIMESLOT,
  ADD_TIMESLOT
} from './types';

// Get timeslots
export const getTimeslots = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/timeslots/${id}`);
    
    dispatch({
      postId: id,
      type: GET_TIMESLOTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: TIMESLOT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete timeslot
export const deleteTimeslot = (id) => async (dispatch) => {
  try {
    await api.delete(`/timeslots/${id}`);

    dispatch({
      postId: id,
      type: DELETE_TIMESLOT,
      payload: id
    });

    dispatch(setAlert('Timeslot Removed', 'success'));
  } catch (err) {
    dispatch({
      type: TIMESLOT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add timeslot
export const addTimeslot = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/timeslots', formData);

    dispatch({
      postId: formData.postId,
      type: ADD_TIMESLOT,
      payload: res.data
    });

    dispatch(setAlert('Timeslot Created', 'success'));
  } catch (err) {
    dispatch({
      type: TIMESLOT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get timeslot
export const getTimeslot = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/timeslots/one/${id}`);
    
    dispatch({
      postId: id,
      type: GET_TIMESLOT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: TIMESLOT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};