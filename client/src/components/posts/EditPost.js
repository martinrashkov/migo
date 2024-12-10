import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePost, getPost } from '../../actions/post';
import SportsAutocomplete from '../sports/SportsAutocomplete';
import TimeslotDisplay from '../timeslots/TimeslotDisplay';
import { Link, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const initialState = {
  text: '',
  title: '',
  location: { longitude: '', latitude: '' },
  address: '',
  sport: ''
};

const EditPost = ({ getPost, updatePost, post: { post }, sports }) => {
  const [formData, setFormData] = useState(initialState);

  const { id } = useParams();

  useEffect(() => {
    if (post && post._id === id) {
      setFormData({ ...post, sport: sports[post.sport] });
    } else {
      getPost(id);
    }
  }, [getPost, id, post, sports]);

  const options = sports
    ? Object.keys(sports).map((key) => {
        return { ...sports[key], id: key, key: key };
      })
    : [];
  options.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  let i = 0;
  while (i < options.length - 1) {
    if (options[i].name === options[i + 1].name) {
      options.splice(i + 1, 1);
    } else {
      i++;
    }
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSportChange = (newValue) => {
    setFormData({ ...formData, sport: newValue });
  };

  const onAddressChange = (e) => {
    setFormData({
      ...formData,
      address: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updatePost({ ...formData, sport: formData.sport.id });
  };

  const handleAddClick = (e) => {
    const url =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      e.lngLat.lng +
      ',' +
      e.lngLat.lat +
      '.json?access_token=' +
      MAPBOX_TOKEN;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response.error);
        }
      })
      .then((response) => {
        setFormData({
          ...formData,
          location: {
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng
          },
          address: response.features[0].place_name
        });
      });
  };

  const MAPBOX_TOKEN = //'pk.eyJ1IjoibWFydGlucmFzaGtvdiIsImEiOiJjbTRpZ2E1dDEwMWMyMmlxeGVzdm5pMmlzIn0.ubg7WtgkeyURW52hxItrzg';
    'sk.eyJ1IjoibWFydGlucmFzaGtvdiIsImEiOiJjbTRpaHdoZHEwMjN3MmtzZmw4em9hMzA0In0.WfIWGuJ2Nin6zWfetdXHCw';

  return (
    <section className="container page">
      <h1 className="large text-primary">Edit your post</h1>
      <p className="lead">
        <i className="fas fa-user" />
        Change information for your post
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <small className="form-text">Change the title</small>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={formData.title || ''}
            onChange={onChange}
          />
        </div>
        <div className="post-form">
          <small className="form-text">Change your description</small>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Description"
            value={formData.text || ''}
            onChange={onChange}
            required
          />
        </div>
        <div className="autocomplete form-group">
          <small className="form-text">Change the sport</small>
          <div style={{ marginTop: '-15px' }}>
            <SportsAutocomplete
              options={options}
              value={formData.sport}
              onChange={onSportChange}
              label="Sport"
            />
          </div>
        </div>

        <div className="form-group">
          <small className="form-text">Change the location</small>
          <div>
            <Box
              sx={{
                width: '70vw',
                height: '40vh'
              }}
            >
              <Map
                initialViewState={{
                  longitude: 23.3219,
                  latitude: 42.6977,
                  zoom: 7
                }}
                style={{
                  overflow: 'hidden'
                }}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                cursor="auto"
                onClick={handleAddClick}
              >
                {formData.location && (
                  <Marker
                    longitude={formData.location.longitude}
                    latitude={formData.location.latitude}
                    style={{ cursor: 'auto' }}
                  ></Marker>
                )}
                <NavigationControl position="top-left"></NavigationControl>
              </Map>
            </Box>
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="address"
            value={
              formData.address
                ? formData.address || 'Address'
                : 'Address (read-only)'
            }
            disabled
            onChange={onAddressChange}
          />
        </div>

        <div>
          <TimeslotDisplay postId={id} />
        </div>


        <button
          type="submit"
          className="btn btn-primary my-1"
          onClick={onSubmit}
        >
          Confirm changes
        </button>
        <Link className="btn btn-light my-1" to="/posts">
          Go Back
        </Link>
      </form>
    </section>
  );
};

EditPost.propTypes = {
  sports: PropTypes.object,
  post: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  sports: state.staticData.sports,
  post: state.post
});

export default connect(mapStateToProps, { getPost, updatePost })(EditPost);
