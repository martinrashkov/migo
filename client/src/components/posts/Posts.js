import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import { getPosts } from '../../actions/post';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';

const Posts = ({ getPosts, post: { posts } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <section className="container page">
      <div className="posts-page">
        <h1 className="large text-primary">Posts</h1>
        <p className="lead">
          <i className="fas fa-user" /> Welcome to the community
          <Link to="/create-post" className="btn btn-primary right post-btn">
            Create Post
          </Link>
        </p>
        <div className="posts">
          {posts.map((post) => {
            return <PostItem key={post._id} post={post} />;
          })}
        </div>
      </div>
    </section>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
