import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteTimeslot, getTimeslots } from '../../actions/timeslot';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';

const TimeslotDisplay = ({
  postId,
  timeslot: { timeslots },
  getTimeslots,
  deleteTimeslot
}) => {
  useEffect(() => {
    getTimeslots(postId);
  }, [getTimeslots, postId, timeslots]);

  const getDaysString = (days) => {
    let string = '';
    let keys = Object.keys(days);
    for (let i = 0; i < keys.length; i++) {
      if (days[keys[i]]) {
        if (string !== '') {
          string += ', ';
        }
        string += keys[i];
      }
    }
    return string;
  };

  const newTimeslots = (timeslots[postId] ? timeslots[postId] : [])
    .filter((ts) => ts.visible === true)
    .map((ts) => (
      <tr key={ts._id}>
        <td>
          {ts.positive ? (
            <i className="fa fa-plus" />
          ) : (
            <i className="fa fa-minus" />
          )}
        </td>
        <td>{formatDate(ts.startDate)}</td>
        <td>{formatDate(ts.endDate)}</td>
        <td>
          {ts.startTime
            .map((time) => {
              return (
                '' +
                Math.floor(time / 60) +
                ':' +
                (time % 60 === 0 ? '00' : time % 60)
              );
            })
            .join(', ')}
        </td>
        <td>
          {'' +
            Math.floor(ts.duration / 60) +
            ':' +
            (ts.duration % 60 === 0 ? '00' : ts.duration % 60)}
        </td>
        <td>{getDaysString(ts.day)}</td>
        <td>
          <button
            onClick={() => deleteTimeslot(ts._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <Fragment>
      <h2 className="my-2">
        Timeslots{' '}
        <Link
          to={`/timeslots/create/${postId}`}
          className="btn btn-primary right post-btn"
        >
          Create Timeslot
        </Link>
      </h2>
      {newTimeslots.length === 0 ? (
        <p>There are no timeslots</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th />
              <th className="hide-sm">Valid from</th>
              <th className="hide-sm">Valid to</th>
              <th className="hide-sm">Start time</th>
              <th className="hide-sm">Duration</th>
              <th className="hide-sm">Days</th>
              <th />
            </tr>
          </thead>
          <tbody>{newTimeslots}</tbody>
        </table>
      )}
    </Fragment>
  );
};

TimeslotDisplay.propTypes = {
  timeslot: PropTypes.object.isRequired,
  getTimeslots: PropTypes.func.isRequired,
  deleteTimeslot: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  timeslot: state.timeslot
});

export default connect(mapStateToProps, { getTimeslots, deleteTimeslot })(
  TimeslotDisplay
);
