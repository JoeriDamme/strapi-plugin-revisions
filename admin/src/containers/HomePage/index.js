/*
 *
 * HomePage
 *
 */

import React, {memo, Component} from "react";
import { request } from "strapi-helper-plugin";
import { Header } from '@buffetjs/custom';
import SelectCollectionType from "../../components/SelectCollectionType";
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import CollectionTable from "../../components/CollectionTable";

class HomePage extends Component {
  state = {
    loading: true,
    collectionTypes: [],
    collectionEntries: [],
    selectedValue: null,
    attributes: null,
  };

  modelOptions = null;

  componentDidMount = () => {
    this.getConfigs().pipe(
      concatMap(response => {
        this.modelOptions = response.modelOptions;
        this.setState({
          collectionTypes: response.collectionTypes,
          selectedValue: response.collectionTypes[0],
          modelOptions: this.modelOptions[response.collectionTypes[0]],
        });
        return this.getCollectionEntries(response.collectionTypes[0]);
      }))
      .subscribe(
        response => {
          this.setState({ collectionEntries: response.data, loading: false });
        },
        error => {
          strapi.notification.error(error.message);
        }
    );

    this.getRevisions().subscribe();
  };

  getConfigs = () => {
    return from(request('/revision/config', { method: 'GET' }));
  };

  getRevisions = (collectionType) => {
    return from(request(`/revision?collectionType=${collectionType}`, { method: 'GET' }));
  };

  getCollectionEntries = (collectionType) => {
    return from(request(`/revision/collection-entries?collectionType=${collectionType}`, { method: 'GET' }));
  }

  handleCollectionTypeChange = (collectionType) => {
    this.setState({
      loading: true,
      selectedValue: collectionType,
    });

    this.getCollectionEntries(collectionType).subscribe(response => {
      this.setState({
        collectionEntries: response.data,
        loading: false,
        modelOptions: this.modelOptions[collectionType],
      });
    });
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
        <div className="content">
          <div className="row">
            <div className="col-3">
              <SelectCollectionType
                options={this.state.collectionTypes}
                onCollectionTypeSelection={this.handleCollectionTypeChange}
                selectedValue={this.state.selectedValue}
              />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <CollectionTable collectionEntries={this.state.collectionEntries} modelOptions={this.state.modelOptions} />
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default memo(HomePage);
