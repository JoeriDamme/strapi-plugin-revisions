/*
 *
 * HomePage
 *
 */

import React, {memo, Component} from "react";
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import MenuLeft from '../../components/MenuLeft';
import {
  HeaderNav,
  LoadingIndicator,
  PluginHeader,
  request
} from "strapi-helper-plugin";

class HomePage extends Component {
  state = {
    loading: true,
    importConfigs: []
  };

  getConfigs = async () => {
    try {
      console.log({
        request,
        window: window.location
      });
      const response = await request(`/revision/config`, { method: 'GET' });
      return response;
    } catch (e) {
      strapi.notification.error(`${e}`);
      return {};
    }
  };

  componentDidMount() {
    this.getConfigs().then(res => {
      this.setState({ collectionTypes: res.collectionTypes, loading: false });
    });
  };

  render() {
    return (
      <div className={"container-fluid"}>
        <PluginHeader
          title={"Revision"}
          description={"History of Collection Types"}
        />
        <div className="row">
          <div className="col-3">
            <MenuLeft></MenuLeft>
          </div>
          <div className="col-9">
            col9
          </div>
        </div>
        
      </div>
    );
  }
}

export default memo(HomePage);
