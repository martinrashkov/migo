import {
  GET_CHATS,
  UPDATE_CHAT,
  CREATE_CHAT,
  DELETE_CHAT,
  ADD_USER_TO_CHAT,
  REMOVE_USER_FROM_CHAT,
  CHAT_ERROR
} from '../actions/types';

const initialState = {
  chats: [],
  error: {}
};

function chatReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CHATS:
      return {
        ...state,
        chats: payload
      };
    case UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === payload._id ? payload : chat
        )
      };
    case CREATE_CHAT:
      return {
        ...state,
        chats: [payload, ...state.chats]
      };
    case DELETE_CHAT:
      return {
        ...state,
        chats: state.chats.filter((chat) => chat._id !== payload)
      };
    case ADD_USER_TO_CHAT:
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === payload.id
            ? { ...chat, users: [payload.user, ...chat.users] }
            : chat
        ),
        loading: false
      };
    case REMOVE_USER_FROM_CHAT:
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat._id === payload.id
            ? {
                ...state.chat,
                users: state.chat.comments.filter(
                  (user) => user._id !== payload.user
                )
              }
            : chat
        ),
        loading: false
      };
    case CHAT_ERROR:
      return {
        ...state,
        error: payload
      };
    default:
      return state;
  }
}

export default chatReducer;
