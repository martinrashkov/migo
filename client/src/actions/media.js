import api from '../utils/api';
import { setAlert } from './alert';

import { GET_MEDIA, MEDIA_ERROR } from './types';

// Get media by id
export const getMedia = (mediaId) => async (dispatch) => {
  try {
    const res = await api.get(`/media/${mediaId}`);

    dispatch({
      type: GET_MEDIA,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MEDIA_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
