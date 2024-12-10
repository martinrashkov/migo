import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';
import formatDate from '../../utils/formatDate';

const Experience = ({ experience, deleteExperience, sports }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{sports[exp.sport] ? sports[exp.sport].name : 'No sport'}</td>
      <td>{exp.expLevel}</td>
      <td className="hide-sm">{exp.description || 'No description'}</td>
      <td>
        {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : 'Now'}
      </td>
      <td>{exp.location || 'No location'}</td>
      <td>{exp.club || 'No club'}</td>
      <td>
        <button
          onClick={() => deleteExperience(exp._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h3 className="m-top-2">Experience Credentials</h3>
      <table className="table">
        <thead>
          <tr>
            <th className="hide-sm">Sport</th>
            <th className="hide-sm">Level</th>
            <th className="hide-sm">Description</th>
            <th className="hide-sm">Years</th>
            <th className="hide-sm">Location</th>
            <th className="hide-sm">Club</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  sports: PropTypes.object,
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  sports: state.staticData.sports
});

export default connect(mapStateToProps, { deleteExperience })(Experience);
