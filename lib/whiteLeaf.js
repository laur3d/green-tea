/**
 * Created by laur on 08.02.2016.
 */
var whiteLeaf = function (collection) {// jscs:ignore requireFunctionDeclarations
  var _this = this;
  this.collection = collection;
  this.objectsToAdd = [];
}

whiteLeaf.prototype = {
  object: function (object) {
    this.objectsToAdd.push(object);
    return this;
  },
  objects: function (objects) {
    this.objectsToAdd = this.objectsToAdd.concat(objects);
    return this;
  },
  apply: function (cb) {
    var _this = this;
    this.collection.insert(this.objectsToAdd, function (err, objects) {
      _this.cleanUp();
      /* istanbul ignore if*/
      if (err) {
        cb(err, null);
      }
      /* istanbul ignore else*/
      if (objects.result.ok === 1) {
        cb(null, objects.ops);
      } else {
        cb(null, []);
      }

      cb(null, []);
    });
  },
  cleanUp: function () {
    this.objectsToAdd = [];
    console.log("White is clean and shiny!");
  }
};

module.exports = whiteLeaf;
