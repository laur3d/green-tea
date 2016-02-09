/**
 * Created by laur on 08.02.2016.
 */

var orangeLeaf = function (collection, filter) {
  var _this = this;
  this.collection = collection;
  this.objectToUpdate = {};
  this.objID = null;
  this.qry = {};
  this.filter = filter;
}

orangeLeaf.prototype = {
  constructor: orangeLeaf,
  object: function (object) {
    // determine id
    this.objectToUpdate = object;
    this.objID = new ObjectID(object._id);
    return this;
  },
  apply: function (cb) {
    var _this = this;

    // apply filter
    for (item in this.filter) {
      _.extend(this.qry, this.filter[item]);
    }
    // add the obj ID of the object
    _.extend(this.qry, {"_id": this.objID});

    //

    this.collection.replaceOne(this.qry, this.objectToUpdate,
                               function (err, result) {
                                 /* istanbul ignore if*/
                                 if (err) {
                                   console.log(err);
                                   cb(err, null);
                                   return;
                                 }

                                 if (result.result.nModified > 0) {
                                   if (result.ops !== undefined) {
                                     _this.cleanUp();
                                     cb(null, result.ops);
                                     return;
                                   }
                                   cb(null, []);
                                 } else {
                                   _this.cleanUp();
                                   cb(null, []);

                                 }


                               });
  },
  buildFilter: function () {
    for (var itm in this.filter) {
      _.extend(this.qry, this.filter[itm]);
    }
  },
  cleanUp: function () {
    this.objectToUpdate = {};
    this.objID = null;
    this.qry = {};
    this.buildFilter();
    console.log("Orange is clean and shiny!");
  }
};

module.exports = orangeLeaf;
