/**
 * Created by laur on 08.02.2016.
 */
var yellowLeaf = function (collection) {
  var _this = this;
  this.collection = collection;
  this.keyToSet = [];
  this.filterKey = [];
  this.updateQry = {};

};

yellowLeaf.prototype = {
  constructor: yellowLeaf,
  property: function (value) {

    if(typeof value === "string"){
      var _this = this;
      keyName = value;

      return {
        to: function (val) {
          var tmpObj = {};
          tmpObj[keyName] = val;
          _this.keyToSet.push(tmpObj);
          keyName = "";
          return _this;
        }
      };
    }else{
      this.keyToSet.push(value);
      return this;
    }
    //return this;
  },
  value: function (value) {
    return this;
  },
  and: function () {
    /* istanbul ignore next*/
    return this;
  },
  for: function (filter) {
    this.filterKey.push(filter);
    return this;
  },
  apply: function (cb) {
    var _this = this;
    for (var itm in this.keyToSet) {
      _.extend(this.updateQry, this.keyToSet[itm]);
    }
    var filterObj = {};
    for (var itm in this.filterKey) {
      _.extend(filterObj, this.filterKey[itm]);
    }

    //console.log(this.updateQry);
    //console.log(filterObj);

    this.collection.update(filterObj, {$set: this.updateQry}, function (err, result) {
      /* istanbul ignore if*/
      if (err) {
        cb(err, null);
      }
      /* istanbul ignore else*/
      if (result.result.ok === 1) {
        var qry = {
          $match: filterObj
        };
        _this.collection.aggregate([qry], function (err, result) {
          /* istanbul ignore if*/
          if (err) {
            _this.cleanUp();
            cb(err, null);
          }
          _this.cleanUp();
          cb(null, result);
        });
      } else {
        cb(null, result);
      }
    });
  },

  cleanUp: function () {
    this.keyToSet = [];
    this.filterKey = [];
    this.updateQry = {};
    console.log("Yellow is clean");
  }

};

module.exports = yellowLeaf;
