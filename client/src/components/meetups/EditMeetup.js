import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getMeetup, updateMeetup } from '../../actions/meetup';

const EditMeetup = ({ getMeetup, updateMeetup, meetup: { meetup } }) => {
  const { id } = useParams();

  useEffect(() => {
    getMeetup(id);
  }, [getMeetup, id]);

  const [date, setDate] = useState('');

  const onClick = async () => {
    updateMeetup({ ...meetup, date: date });
  };

  return (
    <section className="container page form">
      <Link to="/meetups" className="btn backBtn">
        Back To Meetups
      </Link>
      <h1 className="large text-primary">Edit your meetup</h1>

      <div className="form-group">
        <p>Edit the date and time of the meetup</p>
        <DatePicker
          selected={date}
          onChange={(newDate) => setDate(newDate)}
          showTimeSelect
          dateFormat="d MMMM, yyyy h:mm aa"
          placeholderText="DD/MM/YYYY"
        />
      </div>
      <button className="btn btn-primary" onClick={onClick}>
        Confirm changes
      </button>
    </section>
  );
};

EditMeetup.propTypes = {
  getMeetup: PropTypes.func.isRequired,
  meetup: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  updateMeetup: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  meetup: state.meetup,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getMeetup,
  updateMeetup
})(EditMeetup);
