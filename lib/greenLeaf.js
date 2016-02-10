/**
 * This Leaf is responsible for the querying of mongo
 * @param collection
 */
"use strict";

(function () {

  var BaseLeaf = require("./baseLeaf");

  var greenLeaf = function (collection, filter) {
    BaseLeaf.call(this, collection, filter);
    this.isAndModifier = false;
    this.isOrModifier = false;
  };

  greenLeaf.prototype = Object.create(BaseLeaf.prototype);

  function property(value) {
    var _this = this;

    if (typeof value === "string") {
      var keyName = value;

      return {
        is: function (val) {
          var tmpObj = {};
          tmpObj[keyName] = val;
          _this.qryItems.push(tmpObj);
          keyName = "";
          return _this;
        }
      };
    } else {
      this.qryItems.push(value);
      return this;
    }
  }

  function and() {
    this.isAndModifier = true;
    return this;

  }

  function or() {
    this.isOrModifier = true;
    return this;
  }

  function find(cb) {
    // construct qry
    var _this = this;
    /* istanbul ignore else*/
    if (this.isOrModifier || this.isAndModifier) {
      // use matcher
      this.qry.$match = {};
      /* istanbul ignore if*/
      if (this.isAndModifier) {
        this.qry.$match.$and = this.qryItems;
      }
      /* istanbul ignore else*/
      if (this.isOrModifier) {
        this.qry.$match.$or = this.qryItems;
      }
      this.collection.aggregate([this.qry], function (err, items) {
        _this.cleanUp();
        cb(err, items);
      });

    } else {
      for (var itm in this.qryItems) {
        _.extend(this.qry, this.qryItems[itm]);
      }

      this.collection.find(this.qry, function (err, items) {
        /* istanbul ignore if*/
        if (err) {
          _this.cleanUp();
          cb(err, null);
          return;
        }
        items.toArray(function (err, docs) {
          _this.cleanUp();
          cb(err, docs);
        });
      });
    }
  }

  function cleanUp(){
    this.isAndModifier = false;
    this.isOrModifier = false;

    BaseLeaf.prototype.cleanUp.call(this);
  }

  greenLeaf.prototype.property = property;
  greenLeaf.prototype.and = and;
  greenLeaf.prototype.or = or;
  greenLeaf.prototype.find = find;
  greenLeaf.prototype.cleanUp = cleanUp;

  module.exports = greenLeaf;

}());
