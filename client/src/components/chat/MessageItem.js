import React from 'react';
import { connect } from 'react-redux';

import DateItem from './DateItem';

const MessageItem = ({ message, isMine }) => {
  const { date, text, name, avatar, shouldHaveDate } = message;

  return (
    <section>
      {shouldHaveDate ? <DateItem date={date} /> : ''}
      <section
        className={'message-container' + (isMine ? ' message-darker' : '')}
      >
        <img
          src={'/api/media/' + avatar}
          alt="Avatar"
          className={'round-img width-10' + (isMine ? ' message-right' : '')}
        />
        <p style={{ color: 'var(--primary-color)' }}>{name}</p>
        <p style={{ wordWrap: 'break-word' }}>{text}</p>
        <span className={isMine ? 'message-time-left' : 'message-time-right'}>
          {new Date(date).toTimeString().substring(0, 5)}
        </span>
      </section>
    </section>
  );
};

MessageItem.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(MessageItem);
