import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@mui/material';

import { sendMessage, getMessages } from '../../actions/message';
import { updateChat } from '../../actions/chat';

import MessageItem from './MessageItem';

const clearAllIntervals = () => {
  // Get a reference to the last interval + 1
  const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

  // Clear any timeout/interval up to that id
  for (let i = 1; i < interval_id; i++) {
    window.clearInterval(i);
  }
}

const ChatDisplay = ({
  sendMessage,
  getMessages,
  updateChat,
  message: { messages, currChat },
  auth: { user }
}) => {
  useEffect(() => {
    clearAllIntervals();
    const interval = setInterval(() => {
      if (currChat && currChat._id) {
        updateChat(currChat._id);
        getMessages(currChat._id);
      }
      return () => clearInterval(interval);
    }, 1000);
  }, [updateChat, getMessages, currChat]);
  const [text, setText] = useState('');

  const onSend = (e) => {
    e.preventDefault();
    if (text.length === 0 || !currChat || !currChat._id) return;
    sendMessage(currChat._id, text);
    setText('');
  };

  let lastDate = null;

  return (
    <section className="height-100" style={{ padding: "0", paddingTop: "auto", overflow: 'clip' }}>
      <section className="height-90" style={{ boxSizing: "border-box", overflow: 'auto' }}>
        {messages.map((message) => {
          let currUser = currChat.users.find(
            (user) => user.id === message.from
          );
          let shouldHaveDate = lastDate === null || lastDate === message.date;
          lastDate = message.date;

          return (
            <MessageItem
              key={message._id}
              message={{
                ...message,
                avatar: currUser ? currUser.avatar : '',
                name: currUser ? currUser.name : 'Undefined',
                shouldHaveDate: shouldHaveDate
              }}
              isMine={user._id === message.from}
            />
          );
        })}
      </section>
      <section className="height-10" style={{ boxSizing: "border-box"}}>
        <form className="message-form" onSubmit={onSend}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Message"
            style={{ resize: 'none', flexGrow: '1' }}
            value={text || ''}
            onKeyDown={(e) => {
              if(e.keyCode === 13 && e.shiftKey === false) {
                onSend(e);
              }
            }}
            onChange={(e) => {
                setText(e.target.value);
            }}
          />
          <div className="height-100">
            <Button type="submit" onClick={onSend} className="height-100">
              <i
                className="fas fa-paper-plane height-100"
                style={{ color: 'var(--primary-color)' }}
              />
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
};

ChatDisplay.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  getMessages: PropTypes.func.isRequired,
  updateChat: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  chat: state.message,
  message: state.message,
  auth: state.auth
});

export default connect(mapStateToProps, {
  sendMessage,
  getMessages,
  updateChat
})(ChatDisplay);
