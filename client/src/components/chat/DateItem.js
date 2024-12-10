import React from 'react';

const MessageItem = ({ date }) => {

  return (
    <section className={"message-container"}>
      <p>{new Date(date).getDate()}</p>
    </section>
  );
};

export default MessageItem;
