import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_MEETUP,
  GET_MY_MEETUPS,
  GET_POST_MEETUPS,
  MEETUP_ERROR,
  DELETE_MEETUP,
  ADD_MEETUP,
  UPDATE_MEETUP
} from './types';

// Get my meetups
export const getMyMeetups = () => async (dispatch) => {
  try {
    const res = await api.get('/meetups');

    dispatch({
      type: GET_MY_MEETUPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get post meetups
export const getPostMeetups = (postId) => async (dispatch) => {
  try {
    const res = await api.get(`/meetups/post/${postId}`);

    dispatch({
      type: GET_POST_MEETUPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete meetup
export const deleteMeetup = (id) => async (dispatch) => {
  try {
    await api.delete(`/meetups/${id}`);

    dispatch({
      type: DELETE_MEETUP,
      payload: id
    });

    dispatch(setAlert('Meetup Removed', 'success'));
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add meetup
export const addMeetup = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/meetups', formData);

    dispatch({
      type: ADD_MEETUP,
      payload: res.data
    });

    if (res.data.timeslot) {
      window.location.replace(
        window.location.protocol +
          '//' +
          window.location.host +
          '/meetups/' +
          res.data._id
      );
    }

    dispatch(setAlert('Meetup Created', 'success'));
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get meetup
export const getMeetup = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/meetups/${id}`);
    dispatch({
      type: GET_MEETUP,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update meetup
export const updateMeetup = (formData) => async (dispatch) => {
  try {
    const res = await api.put(`/meetups/${formData._id}`, formData);

    dispatch({
      type: UPDATE_MEETUP,
      payload: res.data
    });

    dispatch(setAlert('Meetup Updated', 'success'));
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


// Change meetup status
export const changeMeetupStatus = (id, newStatus) => async (dispatch) => {
  try {
    const res = await api.put(`/meetups/status/${id}`, {status: newStatus});

    dispatch({
      type: UPDATE_MEETUP,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MEETUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};