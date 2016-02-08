/**
 * Created by laur on 08.02.2016.
 */

/**
 * This Leaf is responsible for the querying of mongo
 * @param collection
 */
var greenLeaf = function (collection) {
  this.Collection = collection;
  this.qry = {};
  this.qryItems = [];
};
greenLeaf.prototype = {
  constructor: greenLeaf,

  where: function (qryItem) {
    this.qryItems.push(qryItem);
    return this;
  },

  and: function () {
    this.isAndModifier = true;
    return this;

  },

  or: function () {
    this.isOrModifier = true;
    return this;
  },

  cleanUp: function () {
    this.qry = {};
    this.qryItems = [];
    console.log("Green is clean !");
  },

  find: function (cb) {
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
      //console.log("the query is ", this.qry);
      this.Collection.aggregate([this.qry], function (err, items) {
        _this.cleanUp();
        cb(err, items);
      });

    } else {
      for (var itm in this.qryItems) {
        _.extend(this.qry, this.qryItems[itm]);
      }
      console.log("the query is ", this.qry);
      this.Collection.find(this.qry, function (err, items) {
        /* istanbul ignore if*/
        if (err) {
          _this.cleanUp();
          cb(err, null);
          return;
        }
        items.toArray( function (err, docs) {
          _this.cleanUp();
          cb(err, docs);
        });
      });
    }
  }
};

module.exports = greenLeaf;
