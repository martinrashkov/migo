import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import { Box } from '@mui/material';
import Map, { NavigationControl } from 'react-map-gl';
import MapPopup from './MapPopup';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicGFuY2FrZWJveSIsImEiOiJjbGUyajU0dncxbXo3M3BwNmdkYXNwZzdlIn0.v1N4CI0aULZ7M6S12iW5Kg';

const MapPage = ({ getPosts, post: { posts } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  return (
    <Box
      sx={{
        overflow: 'hidden'
      }}
    >
      <Map
        initialViewState={{
          longitude: 23.3219,
          latitude: 42.6977,
          zoom: 12
        }}
        style={{
          width: '100vw',
          height: '93.3vh',
          marginTop: '60px',
          overflow: 'hidden'
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        cursor="auto"
      >
        {posts.map((post) => {
          return (
            <MapPopup
              key={post._id}
              post={post}
              currentPlaceId={currentPlaceId}
              setCurrentPlaceId={setCurrentPlaceId}
            />
          );
        })}
        <NavigationControl position="bottom-right"></NavigationControl>
      </Map>
    </Box>
  );
};

MapPage.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(MapPage);
