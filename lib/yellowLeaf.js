/**
 * Created by laur on 08.02.2016.
 */
var yellowLeaf = function (collection, filter) {
  var _this = this;
  this.collection = collection;
  this.keyToSet = [];
  this.filterKey = [];
  this.updateQry = {};
  this.qry = {};
  this.filter = filter;

  this.buildFilter();

};

yellowLeaf.prototype = {
  constructor: yellowLeaf,
  property: function (value) {

    if (typeof value === "string") {
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
    } else {
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

    for (var itm in this.filterKey) {
      _.extend(this.qry, this.filterKey[itm]);
    }


    //console.log(this.updateQry);
    //console.log(filterObj);

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

          /* istanbul ignore if*/
          if (err) {
            _this.cleanUp();
            cb(err, null);
          }
          _this.cleanUp();
          cb(null, result);
        });
      } else {
        cb(result.result, []);
      }
    });
  },

  buildFilter: function () {
    for (var itm in this.filter) {
      _.extend(this.qry, this.filter[itm]);
    }
  },

  cleanUp: function () {
    this.keyToSet = [];
    this.filterKey = [];
    this.updateQry = {};
    this.buildFilter();
    console.log("Yellow is clean");
  }

};

module.exports = yellowLeaf;
