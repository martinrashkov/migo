import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
  const authLinks = (
    <>
      <ul>
        <li className="btn-text unselectable">
          <Link to="/open-map" className="btn btn-map">
            View map
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/meetups">Meetups</Link>
        </li>
        <li>
          <Link to="/chat">
            <i className="fas fa-comment" />{' '}
            <span className="hide-sm">Chat</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <i className="fas fa-user" />{' '}
            <span className="hide-sm">Profile</span>
          </Link>
        </li>
        <li>
          <a onClick={logout} href="#!">
            <i className="fas fa-sign-out-alt" />{' '}
            <span className="hide-sm">Logout</span>
          </a>
        </li>
      </ul>
    </>
  );

  const guestLinks = (
    <>
      <ul>
        <li className="btn-text unselectable">
          <Link to="/open-map" className="btn btn-map">
            View map
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/register">
            <i className="fas fa-pen-alt"></i>
            <span className="hide-sm"> Register</span>
          </Link>
        </li>
        <li>
          <Link to="/login">
            <i className="fas fa-sign-in-alt" />{' '}
            <span className="hide-sm">Login</span>
          </Link>
        </li>
      </ul>
    </>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link className="unselectable" to="/">
          MIGO
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
