import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LoadingIndicator } from 'strapi-helper-plugin';

class MenuLeft extends Component {
  render() {
    return (
      <div className="menu-left">
        <h2>Collection Types</h2>
        <div className="list-group" id="list-tab" role="tablist">
          <a className="list-group-item list-group-item-action" id="list-restaurants-list" data-toggle="list" href="#list-restaurants" role="tab" aria-controls="restaurants">Restaurants</a>
          <a className="list-group-item list-group-item-action" id="list-categories-list" data-toggle="list" href="#list-categories" role="tab" aria-controls="categories">Categories</a>
        </div>
      </div>
    )
  };
}

export default MenuLeft;
