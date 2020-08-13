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

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  config: async (ctx) => {
    ctx.send({
      collectionTypes: strapi.config.get('server.revisions.collectionTypes', []),
    })
  }
};
