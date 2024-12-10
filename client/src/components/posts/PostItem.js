import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  deletePost,
  auth,
  sports,
  post: {
    _id,
    text,
    name,
    avatar,
    user,
    likes,
    comments,
    date,
    location,
    address,
    title,
    sport
  },
  showActions
}) => {
  //<Navigate to="/posts/${_id}" />;
  const words = address.split(' ');
  address = words[words.length - 2] + ' ' + words[words.length - 1];

  return (
    <Link className="" to={`/posts/${_id}`}>
      <div className="post-container bg-white p-1 my-1 ">
        <div>
          <Link to={`/profile/${user._id}`}>
            <img
              className="round-img"
              src={'/api/media/' + user.avatar}
              alt=""
            />
            <h4 className="">{name}</h4>
          </Link>
        </div>
        <div>
          <p className="title">{title ? title : 'Title not specified'}</p>
          <p className="post-date">Posted on {formatDate(date)}</p>
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
              Address:{' '}
            </span>
            {address ? address : 'not specified'}
          </p>

          {showActions && (
            <Fragment>
              {auth.isAuthenticated && (
                <Link to={`/meetups/create/${_id}`} className="btn btn-primary">
                  Meet
                </Link>
              )}
              {auth.isAuthenticated &&
                !auth.loading &&
                user._id === auth.user._id && (
                  <>
                    <Link to={`/posts/edit/${_id}`} className="btn btn-primary">
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(_id)}
                      type="button"
                      className="btn btn-danger"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </>
                )}
            </Fragment>
          )}
        </div>
      </div>
    </Link>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  sports: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  sports: state.staticData.sports
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
