import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPopup = ({
  sports,
  currentPlaceId,
  setCurrentPlaceId,
  post: { _id, user, text, name, avatar, location, title, sport }
}) => {
  //const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  return (
    <>
      <Marker
        longitude={location.longitude}
        latitude={location.latitude}
        onClick={() => handleMarkerClick(_id)}
        style={{ cursor: 'pointer' }}
      ></Marker>
      {_id === currentPlaceId && (
        <Popup
          longitude={location.longitude}
          latitude={location.latitude}
          closeOnClick={false}
          closeButton={true}
          anchor="top"
          onClose={() => setCurrentPlaceId(null)}
        >
          <>
            <details className="unselectable">
              <summary>{sports[sport].name}</summary>

              <label>{title}</label>
              <br></br>
              <label>Created by {name}</label>
              <br></br>
            </details>
            <Link className="unselectable" to={`/posts/${_id}`}>
              Go to post
            </Link>
          </>
        </Popup>
      )}
    </>
  );
};

MapPopup.defaultProps = {
  showActions: true
};

MapPopup.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  sports: state.staticData.sports
});

export default connect(mapStateToProps)(MapPopup);
