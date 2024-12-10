import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import MeetupItem from '../meetups/MeetupItem';
import { getMeetup } from '../../actions/meetup';

const Meetup = ({ getMeetup, meetup: {meetup, loading} }) => {
  const { id } = useParams();
  useEffect(() => {
    getMeetup(id);
  }, [getMeetup, id]);

  return loading || meetup === null ? (
    <Spinner />
  ) : (
    <section className="container">
      <Link to="/meetups" className="btn backBtn">
        Back To Meetup
      </Link>
      <MeetupItem meetup={meetup} showActions={false} />
    </section>
  );
};

Meetup.propTypes = {
  getMeetup: PropTypes.func.isRequired,
  meetup: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  meetup: state.meetup
});

export default connect(mapStateToProps, { getMeetup })(Meetup);
