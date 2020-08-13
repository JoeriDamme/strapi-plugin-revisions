# Strapi plugin revisions

Add revision history of collection types to Strapi.

# Important

This plugin is still in development and not ready for any production environment.
The goal is to release the first stable version the end of September 2020.

# Compatibility

This plugin is currently been developed for Strapi v3.1.3. 

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

