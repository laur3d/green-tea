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

      function is(val) {
        var tmpObj = {};
        tmpObj[keyName] = val;
        _this.qryItems.push(tmpObj);
        keyName = "";
        return _this;
      }

      return {
        is: is
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

      var tmpFilter = [];
      tmpFilter = tmpFilter.concat(this.filter);

      this.qry.$match.$and = tmpFilter;

      if (this.isAndModifier) {
        _.extend(this.qry.$match.$and, this.qryItems);
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
      for (var itm in this.filter) {
        _.extend(this.qry, this.filter[itm]);
      }

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

  function cleanUp() {
    this.isAndModifier = false;
    this.isOrModifier = false;
    //console.log("222222222222222222222222222222222222222222222222222222");
    //console.log("OBJ BEFORE CLEAN", this);
    BaseLeaf.prototype.cleanUp.call(this);
    //console.log("OBJ AFTER CLEAN", this);
    //console.log("3333333333333333333333333333333333333333333333333333333333");


  }

  function buildFilter() {
    this.qry = {};
    this.filterKeys = {};

    //BaseLeaf.prototype.buildFilter.call(this);
  }

  greenLeaf.prototype.property = property;
  greenLeaf.prototype.and = and;
  greenLeaf.prototype.or = or;
  greenLeaf.prototype.find = find;
  greenLeaf.prototype.cleanUp = cleanUp;
  greenLeaf.prototype.buildFilter = buildFilter;

  module.exports = greenLeaf;

}());
