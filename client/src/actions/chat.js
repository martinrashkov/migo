import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_CHATS,
  UPDATE_CHAT,
  CREATE_CHAT,
  DELETE_CHAT,
  ADD_USER_TO_CHAT,
  REMOVE_USER_FROM_CHAT,
  CHAT_ERROR
} from './types';

// Get chats
export const getChats = () => async (dispatch) => {
  try {
    const res = await api.get('/chats');
    
    dispatch({
      type: GET_CHATS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get chat
export const updateChat = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/chats/${id}`);
    
    dispatch({
      type: UPDATE_CHAT,
      payload: res.data
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create chat
export const createChat = (userIds, name) => async (dispatch) => {
  try {
    const res = await api.post('/chats', { userIds, name });
    
    dispatch({
      type: CREATE_CHAT,
      payload: res.data
    });

    dispatch(setAlert('Chat Created', 'success'));

    return res.data._id;
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete chat
export const deleteChat = (id) => async (dispatch) => {
  try {
    await api.delete(`/chats/${id}`);

    dispatch({
      type: DELETE_CHAT,
      payload: id
    });

    dispatch(setAlert('Chat Removed', 'success'));
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add user to chat
export const addUserToChat = (chatId, userId) => async (dispatch) => {
  try {
    const res = await api.post(`/chats/${chatId}/add/${userId}`);
    
    dispatch({
      type: ADD_USER_TO_CHAT,
      payload: {users: res.data, id: chatId}
    });

    dispatch(setAlert('User Added', 'success'));
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove user from chat
export const removeUserFromChat = (chatId, userId) => async (dispatch) => {
  try {
    await api.delete(`/chats/${chatId}/add/${userId}`);
    
    dispatch({
      type: REMOVE_USER_FROM_CHAT,
      payload: {id: chatId, user: userId}
    });

    dispatch(setAlert('User Removed', 'success'));
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};