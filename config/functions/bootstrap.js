'use strict';
const modelNamesx = ['restaurant', 'category'];

module.exports = async () => {
  strapi.log.debug('Starting revision plugin...');
  doExtendModels(strapi.config.get('server.revisions.collectionTypes', []));
};

/**
 * Extend the given models with lifecycles.
 * @param {String[]} modelNames 
 */
function doExtendModels(modelNames) {
  if (!Array.isArray(modelNames)) {
    throw new Error('Revision Plugin error: Please supply the names of the collection types as an array. Example [\'restaurant\', \'category\']');
  }

  strapi.log.debug(`Revision Plugin: loading following models:`, modelNames);

  modelNames.forEach(name => {
    doModelValidation(name);
    createModelLifeCycles(name);
  });
}

/**
 * Extend the given model with the After Create, Update and Delete lifecycles.
 * @param {string} name 
 */
function createModelLifeCycles(name) {
  const strapiModel = strapi.models[name];

  createAfterCreateLifecycle(strapiModel);
  createAfterUpdateLifecycle(strapiModel);
  createAfterDeleteLifecycle(strapiModel);
}

/**
 * Create the after update lifecycle for a loaded strapi model.
 * @param {object} strapiModel Model loaded in the strapi.models global object.
 */
function createAfterUpdateLifecycle(strapiModel) {
  const collectionName = strapiModel.info.name;
  const lifecycles = strapiModel.lifecycles;
  if (!lifecycles) {
    strapiModel.lifecycles = {
      afterUpdate: afterUpdateHook(collectionName),
    }
  } else {
    lifecycles.afterUpdate = afterUpdateHook(collectionName);
  }
}

/**
 * Create the after create lifecycle for a loaded strapi model.
 * @param {object} strapiModel Model loaded in the strapi.models global object.
 */
function createAfterCreateLifecycle(strapiModel) {
  const collectionName = strapiModel.info.name;
  const lifecycles = strapiModel.lifecycles;
  if (!lifecycles) {
    strapiModel.lifecycles = {
      afterCreate: afterCreateHook(collectionName),
    }
  } else {
    lifecycles.afterCreate = afterCreateHook(collectionName);
  }
}

/**
 * Create the after delete lifecycle for a loaded strapi model.
 * @param {object} strapiModel Model loaded in the strapi.models global object.
 */
function createAfterDeleteLifecycle(strapiModel) {
  const collectionName = strapiModel.info.name;
  const lifecycles = strapiModel.lifecycles;
  if (!lifecycles) {
    strapiModel.lifecycles = {
      afterDelete: afterDeleteHook(collectionName),
    }
  } else {
    lifecycles.afterDelete = afterDeleteHook(collectionName);
  }
}

/**
 * Checks if the model exists in the strapi.models global object.
 * Check if the model is a collection type.
 * @param {string} name Name of the collection type.
 */
function doModelValidation(name) {
  if (!strapi.models[name]) {
    throw new Error(`Revision Plugin error: Collection type '${name}' not found. Please check your collection type names.`);
  } else if (strapi.models[name].kind !== 'collectionType') {
    strapi.log.debug(`Model name kind: '${strapi.models[name].kind}'`);
    throw new Error(`Revision Plugin error: Defined model '${name}' is not a Collection Type.`);
  }
}

/**
 * Create a revision row in the database.
 * @param {object: Revision} data 
 */
async function createRevision(data) {
  const revisionModel = strapi.plugins.revision.models.revision;
  return revisionModel.forge(data).save();
}

/**
 * Attach the afterCreate lifeCycle hook.
 * @param {string} collectionName 
 * @returns {function} The afterCreate lifecycle.
 */
const afterCreateHook = function(collectionName) {
  return async function afterCreate(result, data) {
    strapi.log.debug(`Revision Plugin  after CREATE lifecycle called for '${collectionName}'`, { result, data });
    const revisionData = buildRevision(result, data, collectionName, 'create');
    const newRevision = await createRevision(revisionData);
  }
}

/**
 * Attach the afterUpdate lifeCycle hook.
 * @param {string} collectionName 
 * @returns {function} The afterUpdate lifecycle.
 */
const afterUpdateHook = function(collectionName) {
  return async function afterUpdate(result, params, data) {
    strapi.log.debug(`Revision Plugin: after UPDATE lifecycle called for '${collectionName}'`, { params });
    const revisionData = buildRevision(result, data, collectionName, 'update');
    const newRevision = await createRevision(revisionData);
  }
}

/**
 * Attach the afterDelete lifeCycle hook.
 * @param {string} collectionName 
 * @returns {function} The afterDelete lifecycle.
 */
const afterDeleteHook = function(collectionName) {
  return async function afterDelete(result, params) {
    strapi.log.debug(`Revision Plugin: after DELETE lifecycle called for '${collectionName}'`, { params });
    const revisionData = buildRevision(result, null, collectionName, 'delete');
    const newRevision = await createRevision(revisionData);
  }
}

/**
 * Creates object that can be used to forge a Revision.
 * @param {object} result Result from lifecycle hook.
 * @param {object} data Data from lifecycle hook.
 * @param {string} collectionName The name of the collection that will be stored.
 * @param {string: enum('create', 'update', 'delete')} action The action taken.
 */
function buildRevision(result, data, collectionName, action) {
  return {
    collection_id: result.id,
    collection_name: collectionName,
    action,
    data: data ? JSON.stringify(data) : null,
    created_by: result.created_by.id,
    updated_by: result.created_by.id,
  }
}
