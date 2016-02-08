/**
 * Created by laur on 08.02.2016.
 */

var orangeLeaf = function (collection) {
  var _this = this;
  this.collection = collection;
  this.objectToUpdate = {};
  this.objID = null;
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
    //delete object._id;
    var _this = this;
    this.collection.replaceOne({
                                 _id: this.objID
                               }, this.objectToUpdate,
                               function (err, result) {
                                 /* istanbul ignore if*/
                                 if (err) {
                                   cb(err, null);
                                 }
                                 if (result.ops !== undefined) {
                                   _this.cleanUp();
                                   cb(null, result.ops);
                                 }
                                 cb(null, []);

                               });
  },
  cleanUp: function () {
    this.objectToUpdate = {};
    this.objID = null;
    console.log("Orange is clean and shiny!");
  }
};

module.exports = orangeLeaf;
