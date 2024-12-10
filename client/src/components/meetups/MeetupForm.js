import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import PostItem from '../posts/PostItem';
import { getPostMeetups, addMeetup } from '../../actions/meetup';
import { getPost } from '../../actions/post';
import { createChat } from '../../actions/chat';

const MeetupForm = ({
  auth: { user },
  getPostMeetups,
  addMeetup,
  createChat,
  getPost,
  post: { post, loading }
}) => {
  const { id } = useParams();
  useEffect(() => {
    getPostMeetups(id);
    getPost(id);
  }, [getPostMeetups, getPost, id]);

  const [date, setDate] = useState('');

  const onClick = async () => {
    addMeetup({ ...post, date: date, post: post._id });
  };

  return loading || post === null ? (
    <Spinner />
  ) : (
    <section className="container page form">
      <Link to="/posts" className="btn backBtn">
        Back To Posts
      </Link>
      <h1 className="large text-primary">Organize a meetup</h1>

      <div className="form-group">
        <small className="form-text">Original post</small>
        <PostItem post={post} showActions={false} />
      </div>

      <div className="form-group">
        <p>Pick a date and time for the meetup</p>
        <DatePicker
          selected={date}
          onChange={(newDate) => setDate(newDate)}
          showTimeSelect
          dateFormat="d MMMM, yyyy h:mm aa"
          placeholderText="DD/MM/YYYY"
        />
      </div>
      <button className="btn btn-primary" onClick={onClick}>
        Create meet
      </button>
    </section>
  );
};

MeetupForm.propTypes = {
  getPostMeetups: PropTypes.func.isRequired,
  meetup: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addMeetup: PropTypes.func.isRequired,
  createChat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  meetup: state.meetup,
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getPostMeetups,
  getPost,
  addMeetup,
  createChat
})(MeetupForm);
