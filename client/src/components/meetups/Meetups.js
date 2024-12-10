import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MeetupItem from './MeetupItem.js';
import { getMyMeetups } from '../../actions/meetup';

const Meetups = ({ getMyMeetups, meetup: { myMeetups }, auth: { user } }) => {
  useEffect(() => {
    getMyMeetups();
  }, [getMyMeetups]);

  return (
    <section className="container page">
      <h1 className="large text-primary">Meetups</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <div className="meetups">
        {myMeetups
          .filter(
            (meetup) =>
              meetup.status !== 'Declined' || meetup.user._id === user._id
          )
          .map((meetup) => {
            return <MeetupItem key={meetup._id} meetup={meetup} />;
          })}
      </div>
    </section>
  );
};

Meetups.propTypes = {
  getMyMeetups: PropTypes.func.isRequired,
  meetup: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  meetup: state.meetup,
  auth: state.auth
});

export default connect(mapStateToProps, { getMyMeetups })(Meetups);
