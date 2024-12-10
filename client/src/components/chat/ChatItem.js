import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { getMessages } from '../../actions/message';
import { Button } from '@mui/material';
import { SET_CHAT } from '../../actions/types';

const ChatItem = ({ getMessages, chat }) => {
  const dispatch = useDispatch();

  return (
    <div className="chat bg-white p-1 my-1">
      <div>
        <Button
          onClick={() => {
            getMessages(chat._id);

            dispatch({
              type: SET_CHAT,
              payload: chat
            });
          }}
        >
          <img
            className="round-img width-30"
            src={'/api/media/' + chat.users[0].avatar}
            alt=""
          />
          <h4 className="width-70" style={{ color: 'var(--primary-color)' }}>
            {chat.name}
          </h4>
        </Button>
      </div>
    </div>
  );
};

ChatItem.propTypes = {
  getMessages: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getMessages })(ChatItem);
