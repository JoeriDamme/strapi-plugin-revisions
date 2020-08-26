import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from '@buffetjs/core';
import './styles.css';

const typesForHeader = ['string', 'richtext'];

class CollectionTable extends Component {
  headers = [];

  constructor(props) {
    super(props);

    this.state = {
      headers: [],
      rows: [],
    }

  }

  componentDidMount = () => {
    this.setupTable();
  }

  setupTable = () => {
    this.setState({
      headers: this.getHeaders(this.props.modelOptions),
    }, () => {
      this.setState({
        rows: this.getRows(this.props.collectionEntries),
      })
    })
  }

  filterTypesForHeader = (allAttributes) => {
    const result = [];
    Object.entries(allAttributes).forEach(([key, value]) => {
      if (typesForHeader.includes(value.type)) {
        result.push({
          name: key,
          value: key,
        });
      }
    });

    return result;
  }

  createTimestampHeaders = (timestamps) => {
    const result = [];

    timestamps.forEach(timestamp => {
      result.push({
        name: timestamp,
        value: timestamp,
      });
    });

    return result;
  }

  getHeaders = (modelOptions) => {
    const { allAttributes, options } = modelOptions;

    let result = [{
      name: 'Id',
      value: 'id',
    }]

    // add string and richtext types
    result = [...result, ...this.filterTypesForHeader(allAttributes)];

    // add timestamps
    if (options.timestamps) {
      result = [...result, ...this.createTimestampHeaders(options.timestamps)];
    }

    return result;
  }

  getRows = (collectionEntries) => {
    const result = [];
    const headers = this.state.headers;
    const headerValues = headers.map(header => header.value);

    collectionEntries.forEach(entry => {
      const row = {};
      headerValues.forEach(header => {
        row[header] = entry[header];
      });
      result.push(row);
    });

    return result;
  }

  render() {
    return (
      <Table headers={this.state.headers} rows={this.state.rows} />
    );
  }
}

CollectionTable.propTypes = {
  collectionEntries: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelOptions: PropTypes.object.isRequired,
};

export default CollectionTable;