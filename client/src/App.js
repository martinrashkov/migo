import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import MapPage from './components/map/MapPage';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-forms/ProfileForm';
import AddExperience from './components/profile-forms/AddExperience';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import EditPost from './components/posts/EditPost';
import PostForm from './components/posts/PostForm';
import Meetups from './components/meetups/Meetups';
import Meetup from './components/meetup/Meetup';
import EditMeetup from './components/meetups/EditMeetup';
import MeetupForm from './components/meetups/MeetupForm';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import Chat from './components/chat/Chat';
import TimeslotForm from './components/timeslots/TimeslotForm';
import { LOGOUT } from './actions/types';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './style/App.css';
import './style/Landing.css';
import './style/Navbar.css';
import './style/Posts.css';
import './style/Meetups.css';
import './style/Profile.css';
import './style/Chat.css';
import './style/Message.css';
import './style/Timeslot.css';

const App = () => {
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/open-map" element={<MapPage />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:id" element={<Post />} />
          <Route
            path="posts/edit/:id"
            element={<PrivateRoute component={EditPost} />}
          />
          <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            path="create-profile"
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            path="edit-profile"
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            path="add-experience"
            element={<PrivateRoute component={AddExperience} />}
          />
          <Route
            path="create-post"
            element={<PrivateRoute component={PostForm} />}
          />
          <Route path="chat" element={<PrivateRoute component={Chat} />} />
          <Route
            path="meetups"
            element={<PrivateRoute component={Meetups} />}
          />
          <Route
            path="meetups/:id"
            element={<PrivateRoute component={Meetup} />}
          />
          <Route
            path="meetups/edit/:id"
            element={<PrivateRoute component={EditMeetup} />}
          />
          <Route
            path="meetups/create/:id"
            element={<PrivateRoute component={MeetupForm} />}
          />
          <Route path="timeslots/create/:id" element={<TimeslotForm />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
