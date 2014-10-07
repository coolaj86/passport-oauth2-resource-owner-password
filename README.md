# passport-oauth2-resource-owner-password

OAuth 2.0 resource owner password authentication strategy for [Passport](https://github.com/jaredhanson/passport).

This module lets you authenticate requests containing resource owner credentials in the
request body, as [defined](http://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-1.3.3)
by the OAuth 2.0 specification.

## Install

```bash
npm install passport-oauth2-resource-owner-password
```

## Usage

#### Configure Strategy

The OAuth 2.0 resource owner password authentication strategy authenticates clients
using a client ID, username, and password
The strategy requires a `verify` callback,
which accepts those credentials and calls `done` providing a client.

```javascript
passport.use(new ResourceOwnerPasswordStrategy(
  function(clientId, clientSecret, username, password, done) {
    Clients.findOne({ clientId: clientId }, function (err, client) {
      // this strategy does not require clientSecret as it is intended to be used in cases
      // (such as mobile apps) which are inherintly insecure

      if (err) { return done(err); }
      if (!client) { return done(null, false); }

      Users.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (hashsum(user.salt + password) !== user.secret) { return done(null, false); }

        return done(null, { client: client, user: user });
      })
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'oauth2-resource-owner-password'`
strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application, using [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
middleware to implement the token endpoint:

```javascript
app.get(
  '/oauth/token'
, passport.authenticate(
    [ 'basic'
    , 'oauth2-client-password'
    , 'oauth2-resource-owner-password'
    ]
  , { session: false }
  )
, oauth2orize.token()
, oauth2orize.errorHandler()
);
```

## Examples

The [example](https://github.com/coolaj86/oauth2orize/tree/master/examples/express2)
included with [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
demonstrates how to implement a complete OAuth 2.0 authorization server.
`ResourceOwnerPasswordStrategy` is used to authenticate clients as they request access
tokens from the token endpoint.

## Tests

TODO

```bash
npm install --dev
make test
```

[![Build Status](https://secure.travis-ci.org/coolaj86/passport-oauth2-resource-owner-password.png)](http://travis-ci.org/coolaj86/passport-oauth2-resource-owner-password)

## Credits

  - [AJ ONeal](http://github.com/coolaj86)

The Client Password Strategy by [Jared Hanson](http://github.com/jaredhanson) was used as a template to create this.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2014 AJ ONeal <[http://coolaj86.com/](http://coolaj86.com/)>
