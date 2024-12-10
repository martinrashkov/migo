import api from '../utils/api';
import {
  GET_MESSAGES,
  SEND_MESSAGE,
  DELETE_MESSAGE,
  MESSAGE_ERROR
} from '../actions/types';

// Get chat messages
export const getMessages = (chatId) => async (dispatch) => {
  try {
    const res = await api.get(`/messages/from/${chatId}`);
    
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Send message
export const sendMessage = (chatId, text) => async (dispatch) => {
  try {
    const res = await api.post(`/messages/${chatId}`, { text });
    
    dispatch({
      type: SEND_MESSAGE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete message
export const deleteMessage = (id) => async (dispatch) => {
  try {
    await api.delete(`/messages/${id}`);

    dispatch({
      type: DELETE_MESSAGE,
      payload: id
    });

    // dispatch(setAlert('Message Removed', 'success'));
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};