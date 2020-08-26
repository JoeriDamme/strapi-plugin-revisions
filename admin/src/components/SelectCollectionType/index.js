import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@buffetjs/core';

class SelectCollectionType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.selectedValue,
    }
  }
  
  render() {
    return (
      <Select
        name="selectCollectionType"
        onChange={({ target: { value } }) => {
          this.setState({ value });
          this.props.onCollectionTypeSelection(value);
        }}
        options={this.props.options}
        value={this.state.value}
      />
    );
  }
}

SelectCollectionType.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCollectionTypeSelection: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default SelectCollectionType;