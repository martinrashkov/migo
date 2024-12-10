import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addMeetup } from '../../actions/meetup';
import { createChat } from '../../actions/chat';

const TimeslotItem = ({
  post,
  date,
  startTime,
  duration,
  addMeetup,
  createChat,
  auth: { user }
}) => {
  const onClick = async (e) => {
    e.preventDefault();

    let meetupDate = new Date(date);
    meetupDate.setHours(Math.floor(startTime / 60));
    meetupDate.setMinutes(startTime % 60);

    addMeetup({
      ...post,
      date: meetupDate,
      post: post._id,
      duration: duration
    });
  };

  const st =
    '' +
    Math.floor(startTime / 60) +
    ':' +
    (startTime % 60 >= 10 ? startTime % 60 : '0' + (startTime % 60));

  const et =
    '' +
    Math.floor((startTime + duration) / 60) +
    ':' +
    ((startTime + duration) % 60 >= 10
      ? (startTime + duration) % 60
      : '0' + ((startTime + duration) % 60));

  return (
    <div className="timeslot-item" onClick={onClick}>
      <p>{st + '-' + et}</p>
    </div>
  );
};

TimeslotItem.propTypes = {
  auth: PropTypes.object.isRequired,
  addMeetup: PropTypes.func.isRequired,
  createChat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  addMeetup,
  createChat
})(TimeslotItem);
