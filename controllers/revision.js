'use strict';

/**
 * revision.js controller
 *
 * @description: A set of functions called "actions" of the `revision` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */
  index: async (ctx, next) => {
    const queryParameters = ctx.request.query;

    if (!queryParameters.hasOwnProperty('collectionType')) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: 'query parameter "collectionType" is required',
      }
      return next();
    }

    const selectedCollectionType = ctx.request.query.collectionType;
    const availableCollectionTypes = strapi.config.get('server.revisions.collectionTypes', []);

    if (!availableCollectionTypes.includes(selectedCollectionType)) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: `given collectionType "${selectedCollectionType}" is not allowed. Available collection types: ${availableCollectionTypes.join(', ')}`,
      }
      return next();
    }

    const resources = await strapi.query('revision', 'revision').find({ collection_name: selectedCollectionType });

    ctx.send({
      data: resources,
    });
  },

  config: async (ctx) => {
    ctx.send({
      collectionTypes: strapi.config.get('server.revisions.collectionTypes', []),
    })
  }
};
