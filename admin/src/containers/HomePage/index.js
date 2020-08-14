/*
 *
 * HomePage
 *
 */

import React, {memo, Component} from "react";
import { request } from "strapi-helper-plugin";
import { Header } from '@buffetjs/custom';
import SelectCollectionType from "../../components/SelectCollectionType";

class HomePage extends Component {
  state = {
    loading: true,
    collectionTypes: [],
    revisions: [],
  };

  getConfigs = async () => {
    try {
      return request('/revision/config', { method: 'GET' });
    } catch (e) {
      strapi.notification.error(`${e}`);
      return {};
    }
  };

  componentDidMount = () => {
    this.getConfigs().then(res => {
      const collectionTypes = res.collectionTypes;
      this.setState({ collectionTypes });

      if (collectionTypes.length) {
        this.getRevisions(collectionTypes[0]).then(res => {
          this.setState({ revisions: res.data, loading: false });
        })
      }
    });
  };

  getRevisions = async (collectionType) => {
    try {
      return request(`/revision/?collectionType=${collectionType}`, { method: 'GET' });
    } catch (e) {
      strapi.notification.error(`${e}`);
      return;
    }
  }

  handleCollectionTypeChange = (collectionType) => {
    this.getRevisions(collectionType).then(res => {
      this.setState({ revisions: res.data, loading: false });
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Header
              title={{ label: 'Revisions' }}
              content={"History of Collection Types"}
              isLoading={this.state.loading}
            />
          </div>
        </div>
        { !this.state.loading &&
        <div className="row">
          <div className="col-3">
            <SelectCollectionType options={this.state.collectionTypes} onCollectionTypeSelection={this.handleCollectionTypeChange} />
          </div>
        </div>
        }
      </div>
    );
  }
}

export default memo(HomePage);
