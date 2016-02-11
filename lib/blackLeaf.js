/**
 * Created by laur on 08.02.2016.
 */
"use strict";
(function () {
  var BaseLeaf = require("./baseLeaf");

  var blackLeaf = function (collection, filter) {// jscs:ignore requireFunctionDeclarations
    BaseLeaf.call(this, collection, filter);
    this.objectsToRemove = [];
  }

  blackLeaf.prototype = Object.create(BaseLeaf.prototype);

  function object(object) {
    this.objectsToRemove.push(object._id);
    return this;
  }

  function objects(objects) {
    //this.objectsToRemove = this.objectsToRemove.concat(objects);
    for(var itm in objects){
      this.objectsToRemove.push(itm._id);
    }
    return this;
  }

  function id(idString) {
    this.objectsToRemove.push(idString);
    return this;
  }

  function apply(cb) {
    var _this = this;
    async.each(this.objectsToRemove, function (item, asCb) {
      var id;
      _this.cleanUp();

      id = new ObjectID(item);

      // apply filter
      for (item in _this.filter) {
        _.extend(_this.qry, _this.filter[item]);
      }
      // add the obj ID of the object
      _.extend(_this.qry, {"_id": id});

      _this.collection.deleteOne(_this.qry, function (err, result) {
        /* istanbul ignore if*/
        if (result && result.deletedCount === 0) {
          asCb(result);
        }

        if (err) {
          asCb(err);
        }
        asCb();
      });

    }, function (err) {
      _this.cleanUp();
      /* istanbul ignore if*/
      if (err) {
        if (err && err.deletedCount === 0) {
          cb(null,
             {message: "Could not find document, maybe outside filter scope", succesfull: false});
        }
        cb(err);
      }
      cb(null, {message: "Delete succesfull", succesfull: true});
    });


  }

  function cleanUp() {
    this.objectsToRemove = [];
    BaseLeaf.prototype.cleanUp.call(this);
  }

  blackLeaf.prototype.object = object;
  blackLeaf.prototype.objects = objects;
  blackLeaf.prototype.id = id;
  blackLeaf.prototype.apply = apply;
  blackLeaf.prototype.cleanUp = cleanUp;


  module.exports = blackLeaf;

}());
