/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  ;


/**
 * `ResourceOwnerPasswordStrategy` constructor.
 *
 * @api protected
 */
function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  if (!verify) {
    throw new Error('OAuth 2.0 resource owner password strategy requires a verify function');
  }

  passport.Strategy.call(this);

  this.name = 'oauth2-resource-owner-password';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on client credentials in the request body.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req) {
  if (!req.body || (!req.body['client_id'] || !req.body['username'] || !req.body['password'])) {
    return this.fail();
  }

  var clientId = req.body['client_id'];
  var clientSecret = req.body['client_secret'];
  var username = req.body['username'];
  var password = req.body['password'];

  var self = this;

  function verified(err, client, user, info) {
    if (err) { return self.error(err); }
    if (!client) { return self.fail(); }
    if (!user) { return self.fail(); }
    self.success(client, user, info);
  }

  if (self._passReqToCallback) {
    this._verify(req, clientId, clientSecret, username, password, verified);
  } else {
    this._verify(clientId, clientSecret, username, password, verified);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
