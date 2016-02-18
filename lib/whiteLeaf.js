/**
 * Created by laur on 08.02.2016.
 */
"use strict";

(function () {
  var BaseLeaf = require("./baseLeaf");
  var whiteLeaf = function (collection, filter) {// jscs:ignore requireFunctionDeclarations
    //var _this = this;
    //this.collection = collection;
    BaseLeaf.call(this, collection, filter);
    this.objectsToAdd = [];
  };

  whiteLeaf.prototype = Object.create(BaseLeaf.prototype);
//
  function object(object) {
    if (object._id == "" || object._id && object._id == null) {
      delete object._id;
    } else if (typeof object._id === "string") {
      var newObj = new ObjectID(object._id);
      object._id = newObj;
    }
    this.objectsToAdd.push(object);
    return this;
  };

  function objects(objects) {
    for (var obj in objects) {
      this.object(objects[obj]);
    }
    return this;
  };

  function apply(cb) {
    var _this = this;
    this.collection.insert(this.objectsToAdd, function (err, objects) {
      _this.cleanUp();
      /* istanbul ignore if*/
      if (err) {
        cb(err, null);
        return;
      }
      /* istanbul ignore else*/
      if (objects.result.ok === 1) {
        cb(null, objects.ops);
        return;
      } else {
        cb(null, []);
        return;
      }

      cb(null, []);
    });
  };

  function cleanUp() {

    this.objectsToAdd = [];
    BaseLeaf.prototype.cleanUp.call(this);
  }

  whiteLeaf.prototype.object = object;
  whiteLeaf.prototype.objects = objects;
  whiteLeaf.prototype.apply = apply;
  whiteLeaf.prototype.cleanUp = cleanUp;


  module.exports = whiteLeaf;
}());
