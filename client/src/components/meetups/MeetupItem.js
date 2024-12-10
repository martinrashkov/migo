import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect, useDispatch } from 'react-redux';
import { deleteMeetup, changeMeetupStatus } from '../../actions/meetup';

import { SET_CHAT } from '../../actions/types';

import { updateChat } from '../../actions/chat';
import { getMessages } from '../../actions/message';

const MeetupItem = ({
  updateChat,
  getMessages,
  deleteMeetup,
  changeMeetupStatus,
  auth,
  sports,
  meetup: {
    _id,
    text,
    status,
    name,
    user,
    date,
    postDate,
    location,
    postUser,
    sport,
    chat
  },
  showActions
}) => {
  const dispatch = useDispatch();

  const onClick = async () => {
    if(chat){
      const theChat = await updateChat(chat);

      getMessages(chat);

      dispatch({
        type: SET_CHAT,
        payload: theChat
      });
    }
  };

  return (
    <Link className="" to={`/meetups/${_id}`}>
      <div className="post-container bg-white p-1 my-1" style={{borderColor: status === "Declined" ? "red" : ''}}>
        <div>
          <Link to={`/profile/${user._id}`}>
            <img
              className="round-img"
              src={'/api/media/' + user.avatar}
              alt=""
            />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">
            <span className="" style={{ color: 'var(--primary-color)' }}>
              Description:{' '}
            </span>
            {text ? text : 'there is no description'}
          </p>
          <p className="my-1">
            <span className="" style={{ color: 'var(--primary-color)' }}>
              Date:{' '}
            </span>
            {date ? formatDate(date) : 'not specified'}
          </p>
          <p className="post-date">
            Posted on {postDate ? formatDate(postDate) : 'not specified'}
          </p>
        </div>
        <div>
          <p className="my-1">
            <span className="" style={{ color: 'var(--primary-color)' }}>
              Sport:{' '}
            </span>
            {sport && sports && sports[sport]
              ? sports[sport].name
              : 'not specified'}
          </p>
          <p className="my-1">
            <span className="" style={{ color: 'var(--primary-color)' }}>
              Location:{' '}
            </span>
            <p className="my-1">
              <span className="" style={{ color: 'var(--primary-color)' }}>
                Longitude:{' '}
              </span>
              {location.longitude ? location.longitude : 'not specified'}
            </p>
            <p className="my-1">
              <span className="" style={{ color: 'var(--primary-color)' }}>
                Latitude:{' '}
              </span>
              {location.latitude ? location.latitude : 'not specified'}
            </p>
          </p>

          {showActions && (
            <Fragment>
              {/* <button
            onClick={() => addLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-up" />{' '}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            onClick={() => removeLike(_id)}
            type="button"
            className="btn btn-light"
          > 
            <i className="fas fa-thumbs-down" />
          </button> */}
              {status !== 'Declined' && (
                <Link
                  to={`/chat`}
                  onClick={onClick}
                  className="btn btn-primary"
                >
                  Message
                </Link>
              )}
              {auth.isAuthenticated &&
                (user._id === auth.user._id || postUser === auth.user._id) &&
                (status === 'Pending' && postUser === auth.user._id ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        changeMeetupStatus(_id, 'Approved');
                      }}
                      type="button"
                      className="btn btn-primary"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        changeMeetupStatus(_id, 'Declined');
                      }}
                      type="button"
                      className="btn btn-danger"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    {status !== 'Declined' && (
                      <Link
                        to={`/meetups/edit/${_id}`}
                        className="btn btn-primary"
                      >
                        Edit
                      </Link>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteMeetup(_id);
                      }}
                      type="button"
                      className="btn btn-danger"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </>
                ))}
            </Fragment>
          )}
        </div>
      </div>
    </Link>
  );
};

MeetupItem.defaultProps = {
  showActions: true
};

MeetupItem.propTypes = {
  meetup: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  sports: PropTypes.object.isRequired,
  deleteMeetup: PropTypes.func.isRequired,
  changeMeetupStatus: PropTypes.func.isRequired,
  updateChat: PropTypes.func.isRequired,
  getMessages: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  sports: state.staticData.sports
});

export default connect(mapStateToProps, {
  updateChat,
  getMessages,
  deleteMeetup,
  changeMeetupStatus
})(MeetupItem);
