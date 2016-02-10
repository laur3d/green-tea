/**
 * Created by laur on 08.02.2016.
 */
var greyLeaf = function (collection, filter) {// jscs:ignore requireFunctionDeclarations
  var _this             = this;
  this.collection       = collection;
  this.objectsToRemove  = [];
  this.qry              = {};
  this.filter           = filter;
  this.updateQry        = {isDeleted: true};

}

greyLeaf.prototype = {
  constructor: greyLeaf,
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
      _this.cleanUp();
      if (typeof item === "object") {
        if(typeof item._id === "object"){
          id = item._id;
        }else{
          id = item;
        }

      } else {
        id = new ObjectID(item);
      }

      // apply filter
      for (item in _this.filter) {
        _.extend(_this.qry, _this.filter[item]);
      }
      // add the obj ID of the object
      _.extend(_this.qry, {"_id": id});

      // instead of delte, add an isDeleted: true
      this.collection.update(this.qry, {$set: this.updateQry}, function (err, result) {


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


  },
  buildFilter: function () {
    for (var itm in this.filter) {
      _.extend(this.qry, this.filter[itm]);
    }
  },
  cleanUp: function () {
    this.objectsToRemove = [];
    this.qry = {};
    this.buildFilter();
    console.log("Black is clean and shiny!");
  }


};

module.exports = greyLeaf;
