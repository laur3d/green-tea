/**
 * Created by laur on 08.02.2016.
 */
var blackLeaf = function (collection) {// jscs:ignore requireFunctionDeclarations
  var _this = this;
  this.collection = collection;
  this.objectsToRemove = [];
}

blackLeaf.prototype = {
  constructor: blackLeaf,
  object: function (object) {
    this.objectsToRemove.push(object);
    return this;
  },
  objects: function (objects) {
    this.objectsToRemove = this.objectsToRemove.concat(objects);
    return this;
  },
  id: function (idString) {
    this.objectsToRemove.push(idString);
    return this;
  },
  apply: function (cb) {
    var _this = this;
    async.each(this.objectsToRemove, function (item, asCb) {
      var id;
      if (typeof item === "object") {
        id = item._id;
      } else {
        id = new ObjectID(item);
      }

      _this.collection.deleteOne({"_id": id}, function (err, result) {
        /* istanbul ignore if*/
        if (err) {
          asCb(err);
        }
        asCb();
      });

    }, function (err) {
      _this.cleanUp();
      /* istanbul ignore if*/
      if (err) {
        cb(err);
      }
      cb(null, true);
    });


  },
  cleanUp: function () {
    this.objectsToRemove = [];
    console.log("Black is clean and shiny!");
  }


};

module.exports = blackLeaf;
