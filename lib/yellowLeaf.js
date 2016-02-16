/**
 * Created by laur on 08.02.2016.
 */
"use strict";

(function () {
  var BaseLeaf = require("./baseLeaf");

  var yellowLeaf = function (collection, filter) { // jscs:ignore requireFunctionDeclarations
    BaseLeaf.call(this, collection, filter);

    this.keyToSet = [];
    this.filterKey = [];
    this.updateQry = {};
  };

  yellowLeaf.prototype = Object.create(BaseLeaf.prototype);

  function property(value) {

    if (typeof value === "string") {
      var _this = this;
      var keyName = value;

      function to(val) {
        var tmpObj = {};
        tmpObj[keyName] = val;
        _this.keyToSet.push(tmpObj);
        keyName = "";
        return _this;
      }

      return {
        to: to
      };
    } else {
      this.keyToSet.push(value);
      return this;
    }
    //return this;
  }

  function value(value) {
    return this;
  }

  function and() {
    /* istanbul ignore next*/
    return this;
  }

  function forObjects(filter) {
    this.filterKey.push(filter);
    return this;
  }

  /***
   * Pass the filter
   * @param filter object
   * @returns {*}
   */
  function where(filter) {
    var _this = this;
    if (typeof filter === "object") {
      return forObjects(filter);
    } else {
      return {
        property: prop,
        id: id
      };
    }

    function prop(value) {
      if (typeof value === "string") {
        var keyName = value;

        function is(val) {
          var tmpObj = {};
          tmpObj[keyName] = val;
          _this.filterKey.push(tmpObj);
          keyName = "";
          return _this;
        }

        return {
          is: is
        };
      } else {
        _this.filterKey.push(value);
        return _this;
      }
    }

    function id(value) {
      if (typeof value === "string") {
        var val = new ObjectID(value);

        _this.filterKey.push(
          {"_id": val}
        );
      }

      return _this;
    }
  }



  function id(value) {
    if (typeof value === "string") {
      this.qryItems.push(
        {"_id": value}
      );
    }
  }

  function apply(cb) {
    var _this = this;

    for (var itm in this.keyToSet) {
      _.extend(this.updateQry, this.keyToSet[itm]);
    }


    for (var itm in this.filterKey) {
      _.extend(this.qry, this.filterKey[itm]);
    }

    this.collection.update(this.qry, {$set: this.updateQry}, function (err, result) {
      /* istanbul ignore if*/
      if (err) {
        cb(err, null);
      }

      /* istanbul ignore else*/
      if (result.result.ok === 1 && result.result.nModified === 1) {
        var qry = {
          $match: _this.qry
        };

        _this.collection.aggregate([qry], function (err, result) {
          _this.cleanUp();
          /* istanbul ignore if*/
          if (err) {

            cb(err, null);
          }
          _this.cleanUp();
          cb(null, result);
        });
      } else {
        _this.cleanUp();
        cb(result.result, []);
      }
    });
  }

  function cleanUp() {
    this.keyToSet = [];
    this.filterKey = [];
    this.updateQry = {};
    BaseLeaf.prototype.cleanUp.call(this);
  }

  yellowLeaf.prototype.property = property;
  yellowLeaf.prototype.value = value;
  yellowLeaf.prototype.and = and;
  yellowLeaf.prototype.forObjects = forObjects;
  yellowLeaf.prototype.apply = apply;
  yellowLeaf.prototype.cleanUp = cleanUp;
  yellowLeaf.prototype.id = id;
  yellowLeaf.prototype.where = where;
  //yellowLeaf.prototype.buildFilter = buildFilter;


  module.exports = yellowLeaf;
}());
