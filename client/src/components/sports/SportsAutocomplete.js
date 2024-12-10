import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { connect } from 'react-redux';

const SportsAutocomplete = (props) => {
  const defaultProps = {
    options: props.options,
    getOptionLabel: (option) => option.name
  };

  const handleChange = (e, newValue) => {
    props.onChange(newValue);
  };

  return (
    <Autocomplete
      {...defaultProps}
      value={props.value || null}
      defaultValue={null}
      onChange={handleChange}
      disablePortal
      className="form-group"
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(SportsAutocomplete);
