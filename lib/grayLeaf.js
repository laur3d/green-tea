/**
 * Created by laur on 08.02.2016.
 */
"use strict";
(function () {
  var BaseLeaf = require("./baseLeaf");
  var obj = require('mongodb').ObjectID;
  var greyLeaf = function (collection, filter) {// jscs:ignore requireFunctionDeclarations
    BaseLeaf.call(this, collection, filter);
    this.objectsToRemove = [];
    this.reviveObject = false;
  }

  greyLeaf.prototype = Object.create(BaseLeaf.prototype);

  function object(object) {
    this.objectsToRemove.push(object);
    return this;
  }

  function revive() {
    this.reviveObject = true;
    return this;
  }

  function objects(objects) {
    this.objectsToRemove = this.objectsToRemove.concat(objects);
    return this;
  }

  function id(idString) {
    this.objectsToRemove.push(idString);
    return this;
  }

  function apply(cb) {
    var _this = this;
    async.each(this.objectsToRemove, function (item, asCb) {

      var baseFilter = {
        isDeleted: {
          $ne: true
        }
      };
      var baseUpdate = {
        $set: {
          "isDeleted": true
        }
      };
      if (_this.reviveObject === true) {
        baseUpdate = {
          $set: {
            "isDeleted": false
          }
        };
      }

      var id;

      if (typeof item === "object") {
        if (typeof item._id === "object") {
          id = item._id;
        } else {
          id = item;
        }
      } else {
        id = new obj(item);
      }

      // apply filter
      // clean just filter
      _this.qry = {};
      for (item in _this.filter) {
        if(_this.reviveObject && _this.filter[item].isDeleted != undefined){
        }else{
          _.extend(_this.qry, _this.filter[item]);
        }
      }
      _.extend(_this.qry, {
        "_id": id
      });

      _this.collection.update(_this.qry, baseUpdate, function (err, result) {
        /* istanbul ignore if*/
        if (result.result && result.result.nModified === 0) {
          asCb(result.result);
          return;
        }

        if (err) {
          asCb(err);
          return;
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
    this.reviveObject = false;
    BaseLeaf.prototype.cleanUp.call(this);
  }

  greyLeaf.prototype.object = object;
  greyLeaf.prototype.objects = objects;
  greyLeaf.prototype.id = id;
  greyLeaf.prototype.apply = apply;
  greyLeaf.prototype.cleanUp = cleanUp;
  greyLeaf.prototype.revive = revive;


  module.exports = greyLeaf;

}());
