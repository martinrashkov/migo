import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import * as ReactDOM from 'react-dom';

import { getTimeslots } from '../../actions/timeslot';

import TimeslotItem from './TimeslotItem';

const TimeslotHolder = ({ post, timeslot: { timeslots }, getTimeslots }) => {
  useEffect(() => {
    const handleClick = (event) => {
      event.preventDefault();
      let elements = document.getElementsByClassName('react-datepicker-popper');
      if (elements && elements[0])
        elements[0].addEventListener('click', handleClick);
    };

    const element = ref.current;

    ReactDOM.findDOMNode(element).addEventListener('click', handleClick);

    getTimeslots(post._id);
  }, [getTimeslots, post._id]);

  const ref = useRef(null);

  const removeTime = (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getTimeslotElements = useCallback((theTimeslots, date) => {
    let daysOfTheWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ];

    let currDateInt = removeTime(new Date()).getTime();

    if (removeTime(new Date(date)).getTime() < currDateInt) return [];

    let elements = [];
    let negativeTimeslots = [];

    let theDay = daysOfTheWeek[new Date(date).getDay()];

    for (let index in theTimeslots) {
      let timeslot = theTimeslots[index];
      if (timeslot.positive) {
        if (
          currDateInt >= removeTime(new Date(timeslot.startDate)).getTime() &&
          currDateInt <= removeTime(new Date(timeslot.endDate)).getTime() &&
          timeslot.day[theDay]
        ) {
          for (let st in timeslot.startTime) {
            elements.push({
              startTime: timeslot.startTime[st],
              duration: timeslot.duration
            });
          }
        }
      } else {
        if (
          currDateInt >= removeTime(new Date(timeslot.startDate)).getTime() &&
          currDateInt <= removeTime(new Date(timeslot.endDate)).getTime() &&
          timeslot.day[theDay]
        ) {
          for (let st in timeslot.startTime) {
            negativeTimeslots.push({
              startTime: timeslot.startTime[st],
              duration: timeslot.duration
            });
          }
        }
      }
    }

    for (let index in negativeTimeslots) {
      let timeslot = negativeTimeslots[index];
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        if (
          (element.startTime <= timeslot.startTime &&
            element.startTime + element.duration >= timeslot.startTime) ||
          (element.startTime <= timeslot.startTime + timeslot.duration &&
            element.startTime + element.duration >=
              timeslot.startTime + timeslot.duration)
        ) {
          elements.splice(i, 1);
        }
      }
    }

    elements.sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });

    return elements;
  }, []);

  const [date, setDate] = useState(new Date());
  const [timeslotElements, setTimeslots] = useState(
    getTimeslotElements(timeslots, date)
  );
  const [currBatch, setBatch] = useState(0);
  const batchSize = 6;

  useEffect(() => {
    setTimeslots(getTimeslotElements(timeslots, date));
  }, [getTimeslotElements, date, timeslots]);

  return (
    <section
      className="post-container bg-white p-1 my-1"
      style={{
        height: '100%',
        margin: '0.5rem',
        padding: '0.2rem',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '18rem',
        maxHeight: '14rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'top'
        }}
      >
        <div
          style={{ margin: '0.5rem' }}
          onClick={(e) => {
            e.preventDefault();
            setDate(new Date(date.getTime() - 86400000));
            setTimeslots(getTimeslotElements(timeslots, date));
            setBatch(0);
          }}
        >
          <i className="fa fa-arrow-left" />
        </div>
        <DatePicker
          style={{ margin: '0.5rem', width: 'fit-content' }}
          selected={date}
          onChange={(newDate) => {
            setDate(newDate);
            setTimeslots(getTimeslotElements(timeslots, date));
            setBatch(0);
          }}
          dateFormat="d MMMM, yyyy"
          placeholderText="DD/MM/YYYY"
          ref={ref}
        />
        <div
          style={{ margin: '0.5rem' }}
          onClick={(e) => {
            e.preventDefault();
            setDate(new Date(date.getTime() + 86400000));
            setTimeslots(getTimeslotElements(timeslots, date));
            setBatch(0);
          }}
        >
          <i className="fa fa-arrow-right" />
        </div>
      </div>
      <div
        style={{
          overflowX: 'none',
          overflowY: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {Math.floor(timeslotElements.length / batchSize) > 0 ? (
          <div
            style={{
              padding: '0.5rem'
            }}
            onClick={(e) => {
              e.preventDefault();
              if (currBatch === 0) {
                setBatch(Math.floor(timeslotElements.length / batchSize));
              } else {
                setBatch(currBatch - 1);
              }
            }}
          >
            <i className="fa fa-arrow-left" />
          </div>
        ) : (
          ''
        )}
        <div
          style={{
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          {timeslotElements.length === 0 ? (
            <p>There are no available events</p>
          ) : (
            timeslotElements
              .filter(
                (timeslot, index) => Math.floor(index / batchSize) === currBatch
              )
              .map((timeslot, index) => {
                return (
                  <TimeslotItem
                    key={index}
                    post={post}
                    startTime={timeslot.startTime}
                    duration={timeslot.duration}
                    date={date}
                  />
                );
              })
          )}
        </div>
        {Math.floor(timeslotElements.length / batchSize) > 0 ? (
          <div
            style={{
              padding: '0.5rem'
            }}
            onClick={(e) => {
              e.preventDefault();
              if (
                currBatch === Math.floor(timeslotElements.length / batchSize)
              ) {
                setBatch(0);
              } else {
                setBatch(currBatch + 1);
              }
            }}
          >
            <i className="fa fa-arrow-right" />
          </div>
        ) : (
          ''
        )}
      </div>
    </section>
  );
};

TimeslotHolder.propTypes = {
  post: PropTypes.object.isRequired,
  timeslot: PropTypes.object.isRequired,
  getTimeslots: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  timeslot: state.timeslot
});

export default connect(mapStateToProps, { getTimeslots })(TimeslotHolder);
