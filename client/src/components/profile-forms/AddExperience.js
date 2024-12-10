import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profile';
import SportsAutocomplete from '../sports/SportsAutocomplete';

const AddExperience = ({ addExperience, sports }) => {
  const navigate = useNavigate();
  const initialState = {
    title: '',
    sport: '',
    expLevel: 'Beginner',
    location: '',
    club: '',
    from: '',
    to: '',
    main: false,
    description: ''
  };
  const [formData, setFormData] = useState(initialState);

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

  const onSportChange = (newValue) => {
    setFormData({ ...formData, sport: newValue });
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section className="container page">
      <h1 className="large text-primary">Add Experience</h1>
      <p className="lead">
        <i className="fas fa-running" /> Add any sport that you have done in the
        past or are still doing
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addExperience(
            { ...formData, sport: formData.sport._id.replace(/\s/g, '') },
            navigate
          );
          setFormData(initialState);
        }}
      >
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Relation to the sport"
            value={formData.description || ''}
            onChange={onChange}
          />
        </div>
        <div className="autocomplete form-group">
          <SportsAutocomplete
            options={options}
            value={formData.sport}
            onChange={onSportChange}
            label="Sport"
            required
          />
          <small className="form-text">Which sport do you want to do</small>
        </div>
        <div className="form-group">
          <h4>How good are you at the sport</h4>
          <label>
            <input
              type="radio"
              name="expLevel"
              value="Beginner"
              checked={formData.expLevel === 'Beginner'}
              onChange={onChange}
            />
            Beginner
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="expLevel"
              value="Intermediate"
              checked={formData.expLevel === 'Intermediate'}
              onChange={onChange}
            />
            Intermediate
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="expLevel"
              value="Expert"
              checked={formData.expLevel === 'Expert'}
              onChange={onChange}
            />
            Expert
          </label>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location || ''}
            onChange={onChange}
          />
          <small className="form-text">Where have you done the sport</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Club"
            name="club"
            value={formData.club || ''}
            onChange={onChange}
          />
          <small className="form-text">
            Were or are you associated with a club
          </small>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={formData.from}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={formData.to}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="main"
              checked={formData.main}
              value={formData.main}
              onChange={() => {
                setFormData({ ...formData, main: !formData.main });
              }}
            />{' '}
            Main Sport
          </p>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </section>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
  sports: PropTypes.object
};

const mapStateToProps = (state) => ({
  sports: state.staticData.sports
});

export default connect(mapStateToProps, { addExperience })(AddExperience);
