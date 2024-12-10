import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Switch from '@mui/material/Switch';

import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/post';
import { addTimeslot } from '../../actions/timeslot';

const initialState = {
  positive: true,
  visible: true,
  startDate: '',
  endDate: '',
  startTime: [0],
  duration: 0,
  day: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  }
};

const TimeslotForm = ({ getPost, addTimeslot, post: { post, loading } }) => {
  const { id } = useParams();
  useEffect(() => {
    getPost(id);
  }, [getPost, id]);

  const [formData, setFormData] = useState(initialState);

  const dateStringToTimeInteger = (dateString) => {
    let time = new Date(dateString).toTimeString().slice(0, 5).split(':');
    return parseInt(time[0]) * 60 + parseInt(time[1]);
  };

  const onClick = async () => {
    addTimeslot({...formData, postId: id});

    setFormData(initialState);
  };

  return loading || post === null ? (
    <Spinner />
  ) : (
    <section className="container page form">
      <Link to={`/posts/edit/${id}`} className="btn backBtn">
        Back To Posts
      </Link>
      <h1 className="large text-primary">Create a timeslot</h1>

      <div className="form-group">
        <small className="form-text">Original post</small>
        <PostItem post={post} showActions={false} />
      </div>

      <div className="form-group">
        <p>
          Is the timeslot adding or removing an event
          <Switch
            checked={formData.positive}
            onChange={(e) =>
              setFormData({ ...formData, positive: e.target.checked })
            }
            inputProps={{ 'aria-label': 'controlled' }}
          />{' '}
          {formData.positive ? 'Adding' : 'Removing'}
        </p>
      </div>
      <div className="form-group">
        <p>Pick a date from which the timeslot will be valid</p>
        <DatePicker
          selected={formData.startDate}
          onChange={(newDate) =>
            setFormData({ ...formData, startDate: newDate })
          }
          dateFormat="d MMMM, yyyy"
          placeholderText="DD/MM/YYYY"
          required
        />
      </div>

      <div className="form-group">
        <p>Pick a date until which the timeslot will be valid</p>
        <DatePicker
          selected={formData.endDate}
          onChange={(newDate) => setFormData({ ...formData, endDate: newDate })}
          dateFormat="d MMMM, yyyy"
          placeholderText="DD/MM/YYYY"
          required
        />
      </div>
      <div className="form-group">
        <p>Pick a starting time for the timeslot</p>
        {formData.startTime.map((time, index) => (
          <div key={index}>
            <div
              style={{
                width: 'fit-content',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <DatePicker
                selected={new Date().setHours(Math.floor(time / 60), time % 60)}
                onChange={(newDate) => {
                  let newStartTime = formData.startTime.map((t, i) => {
                    if (i === index) return dateStringToTimeInteger(newDate);
                    return t;
                  });
                  setFormData({ ...formData, startTime: newStartTime });
                }}
                timeCaption="Time"
                placeholderText="Pick time"
                locale="pt-BR"
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                dateFormat="HH:mm"
                timeIntervals={15}
              />
              <button
                onClick={() => {
                  let newStartTime = formData.startTime;
                  newStartTime.splice(index, 1);
                  setFormData({ ...formData, startTime: newStartTime });
                }}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
        ))}
        <i
          className="fa fa-plus"
          onClick={() =>
            setFormData({ ...formData, startTime: [...formData.startTime, 0] })
          }
        />
      </div>
      <div className="form-group">
        <p>Duration</p>
        <DatePicker
          selected={new Date().setHours(Math.floor(formData.duration / 60), formData.duration % 60)}
          onChange={(newDate) => 
            setFormData({ ...formData, duration: dateStringToTimeInteger(newDate) })
          }
          timeCaption="Time"
          placeholderText="Pick time"
          locale="pt-BR"
          showTimeSelect
          showTimeSelectOnly
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          timeIntervals={5}
        />
      </div>
      <div className="form-group">
        <p>On which days will the timeslot be active</p>
        <table>
          <tbody>
            <tr>
              <td>Monday:</td>
              <td>
                <Switch
                  checked={formData.day.monday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, monday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
            <tr>
              <td>Tuesday:</td>
              <td>
                <Switch
                  checked={formData.day.tuesday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, tuesday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
            <tr>
              <td>Wednesday:</td>
              <td>
                <Switch
                  checked={formData.day.wednesday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, wednesday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
            <tr>
              <td>Thursday:</td>
              <td>
                <Switch
                  checked={formData.day.thursday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, thursday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
            <tr>
              <td>Friday:</td>
              <td>
                <Switch
                  checked={formData.day.friday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, friday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
            <tr>
              <td>Saturday:</td>
              <td>
                <Switch
                  checked={formData.day.saturday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, saturday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
            <tr>
              <td>Sunday:</td>
              <td>
                <Switch
                  checked={formData.day.sunday}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      day: { ...formData.day, sunday: e.target.checked }
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary" onClick={onClick}>
        Create timeslot
      </button>
    </section>
  );
};

TimeslotForm.propTypes = {
  getPost: PropTypes.func.isRequired,
  addTimeslot: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, {
  getPost,
  addTimeslot
})(TimeslotForm);
