import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';

const ProfileExperience = ({
  experience: { location, club, main, to, from, description, sport, expLevel },
  sports
}) => (
  <div>
    <p>
    {formatDate(from)} - {to ? formatDate(to) : 'Now'}
    </p>
    <p>
      <strong>Sport: </strong> {sports[sport].name}
    </p>
    <p>
      <strong>Level: </strong> {expLevel}
    </p>
    <p>
      <strong>Is main: </strong> {main ? "yes" : "no"}
    </p>
    <p>
      <strong>Location: </strong> {location}
    </p>
    <p>
      <strong>Club: </strong> {club}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
