# Strapi plugin revisions

Add revision history of collection types to Strapi.

# Important

This plugin is still in development and not ready for any production environment.
The goal is to release the first stable version the end of September 2020.

# Compatibility

This plugin is currently been developed for Strapi v3.1.3.

# Development

1. Clone the repo.
2. Go to the folder of your Strapi installation.
3. Create a name folder `revision`.
4. Copy the content of the cloned repo to the `revision` folder.
5. Start strapi with the following command: `yarn develop --watch-admin`.

# Configuration

1. Define the Collection Types that needs revisions in the server configuration. Please use the singular noun:

```javascript
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // more settings...
  // add lines below:
  revisions: {
    collectionTypes: ['restaurant', 'category'], // change to your collection types
  }
});
```

That's it for now :)

