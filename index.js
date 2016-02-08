/**
 * Created by laur on 05.02.2016.
 */

// globals
_ = require("lodash");
ObjectID = require("mongodb").ObjectID;
async = require("async");
// global

var greenLeaf = require("./lib/greenLeaf");
var yellowLeaf = require("./lib/yellowLeaf");
var orangeLeaf = require("./lib/orangeLeaf");
var whiteLeaf = require("./lib/whiteLeaf");
var blackLeaf = require("./lib/blackLeaf");

var greenTea = function (collection, filter) {
  self = this;
  this.filter = filter;
  this.Collection = collection;

  // proxy required for recreation of the leaf object
  // due to an odd bug in mongo driver

  var greenProxy = function (collection, filter) {
    return new greenLeaf(collection, filter);
  };

  var yellowProxy = function (collection, filter) {
    return new yellowLeaf(collection, filter);
  };

  var orangeProxy = function (collection, filter) {
    return new orangeLeaf(collection, filter);
  };

  var blackProxy = function (collection, filter) {
    return new blackLeaf(collection, filter);
  };

  var whiteProxy = function (collection, filter) {
    return new whiteLeaf(collection, filter);
  };


  self.get = greenProxy(collection, filter);
  self.set = yellowProxy(collection, filter);
  self.update = orangeProxy(collection, filter);
  self.insert = whiteProxy(collection, filter);
  self.remove = blackProxy(collection, filter);
};

module.exports = greenTea;
