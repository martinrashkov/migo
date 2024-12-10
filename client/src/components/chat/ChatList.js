import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChatItem from './ChatItem';

const ChatList = ({ chat: { chats } }) => {
  return (
    <section
      className="container"
    >
      {chats ? (
        chats.map((chat) => <ChatItem key={chat._id} chat={chat} />)
      ) : (
        <p>No chats</p>
      )}
    </section>
  );
};

ChatList.propTypes = {
  chat: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  chat: state.chat
});

export default connect(mapStateToProps, {})(ChatList);
