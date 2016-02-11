/**
 * Created by laur on 10.02.2016.
 */
"use strict";
(function () {

  var baseLeaf = function (collection, filter) {
    this.collection = collection;
    this.qry = {};
    this.qryItems = [];
    this.filter = filter;
    this.buildFilter();
  }


  function cleanUp() {
    this.qry = {};
    this.qryItems = [];

    this.buildFilter();
  };

  function buildFilter() {
    for (var itm in this.filter) {
      _.extend(this.qry, this.filter[itm]);
    }
  };

  /**
   * This is used as a common syntactic sugar
   * @returns {returnThis}
   */
  function returnThis() {
    return this;
  }


  baseLeaf.prototype.cleanUp = cleanUp;
  baseLeaf.prototype.buildFilter = buildFilter;

  /// common sugars
  baseLeaf.prototype.where = returnThis;
  baseLeaf.prototype.all = returnThis;
// common sugars end
  module.exports = baseLeaf;

}());
