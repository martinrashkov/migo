import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getChats } from '../../actions/chat';
import ChatList from './ChatList';
import ChatDisplay from './ChatDisplay';

const Chat = ({ getChats }) => {
  useEffect(() => {
    getChats();
  }, [getChats]);
  return (
    <section className="chatConteiner height-100">
      <section className="bg-white width-30 height-100" style={{ overflow: "auto" }}>
        <ChatList />
      </section>
      <section className="bg-white width-70 height-100">
        <ChatDisplay />
      </section>
    </section>
  );
};

Chat.propTypes = {
  getChats: PropTypes.func.isRequired,
  chats: PropTypes.array
};

const mapStateToProps = (state) => ({
  chats: state.chats
});

export default connect(mapStateToProps, { getChats })(Chat);
