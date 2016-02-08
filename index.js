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

var greenTea = function (collection) {
  self = this;
  this.Collection = collection;

  // proxy required for recreation of the leaf object
  // due to an odd bug in mongo driver

  var greenProxy = function (collection) {
    return new greenLeaf(collection);
  };

  var yellowProxy = function (collection) {
    return new yellowLeaf(collection);
  };

  var orangeProxy = function (collection) {
    return new orangeLeaf(collection);
  };

  var blackProxy = function (collection) {
    return new blackLeaf(collection);
  };

  var whiteProxy = function (collection) {
    return new whiteLeaf(collection);
  };


  self.get = greenProxy(collection);
  self.set = yellowProxy(collection);
  self.update = orangeProxy(collection);
  self.insert = whiteProxy(collection);
  self.remove = blackProxy(collection);
};

module.exports = greenTea;
