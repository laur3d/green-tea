/**
 * Created by laur on 08.02.2016.
 */
"use strict";
(function () {
  var BaseLeaf = require("./baseLeaf");

  var orangeLeaf = function (collection, filter) {
    BaseLeaf.call(this, collection, filter);
    this.objectToUpdate = {};
    this.objID = null;
  }

  orangeLeaf.prototype = Object.create(BaseLeaf.prototype);


  function object(object) {
    // determine id
    this.objectToUpdate = object;
    this.objID = new ObjectID(object._id);
    return this;
  }

  function apply(cb) {
    var _this = this;

    // apply filter
    for (var item in this.filter) {
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
                                   _this.cleanUp();
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
  }

  function cleanUp() {
    this.objectToUpdate = {};
    this.objID = null;
    BaseLeaf.prototype.cleanUp.call(this);
  }

  orangeLeaf.prototype.object = object;
  orangeLeaf.prototype.apply = apply;

  module.exports = orangeLeaf;
}())
