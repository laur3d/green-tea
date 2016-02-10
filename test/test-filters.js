/**
 * Created by laur on 08.02.2016.
 */

var mongo = require("mongodb").MongoClient;
var expect = require('chai').expect;
var _ = require('lodash');
var obj = require('mongodb').ObjectID;
var async = require('async');
var assert = require('assert');
var greenTea = require("../index");


describe("Tea Tests - with filters", function () {
  var mongoUrl = "mongodb://localhost:27017/greentea-test";
  var db;
  var locationCollection;
  var Location;

  var newLocation = {
    "_id": "56b998a2087cd862040ed1ae",
    "name": "a",
    "prenume": "a",
    "path": null,
    "tenantId": 4,
    "parentId": null,
    "attributes": [],
    "assets": []
  }

  var arrLocations = [
    {
      "name": "b",
      "prenume": "b",
      "tenantId": 2,
      "path": null,
      "parentId": null,
      "attributes": [],
      "assets": []
    },
    {
      "name": "c",
      "prenume": "c",
      "tenantId": 3,
      "path": null,
      "parentId": null,
      "attributes": [],
      "assets": []
    }
  ];

  before("Prepare database", function (done) {
    mongo.connect(mongoUrl, function (err, dbC) {
      db = dbC;
      assert.equal(null, err, "unable to connect with database");
      locationCollection = db.collection("locations");
      locationCollection.drop(function (err, reply) {
        Location = new greenTea(locationCollection, [{"tenantId": 2}]);
        done();
      });

    });
  });

  after("CleanUp", function (done) {
    if (db) {
      db.close(done);
    }
  });

  // white leaf ( add items )
  it("should insert a new item", function (done) {
    Location.insert.object(newLocation).apply(function (err, newObj) {
      expect(err).to.be.null;
      expect(newObj).to.be.a("array");
      expect(newObj[0]).to.have.property("name", "a");
      done();
    });
    //done();
  });

  it("should insert an array of items", function (done) {
    Location.insert.objects(arrLocations).apply(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length.of.at.least(2);
      expect(result[0]).to.have.property("name", "b");
      done();
    });
  });

  it("should find all", function (done) {
    Location.get.find(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(1);
      done();
    });
  });

  it("should  set values of objects in scope of filter", function (done) {

    Location.set.property("prenume").to("Mickey the Moose").forObjects({"name": "b"}).apply(function (err,
                                                                                               result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(1);
      done();
    });
  });

  it("should not set values of objects outside of scope of filter", function (done) {
    //Location = new greenTea(locationCollection, [{"tenantId": 2}]);
    Location.set.property("prenume").to("Mickey the Moose").forObjects({"name": "c"}).apply(function (err,
                                                                                               result) {
      expect(err).to.have.property("nModified", 0);
      expect(result).to.be.a("array");
      expect(result).to.have.length(0);
      done();
    });
  });

  it("should update objects in scope of filter", function (done) {
    //Location = new greenTea(locationCollection, [{"tenantId": 2}]);
    async.waterfall([
                      function getTheObject(asyncCB) {
                        Location.get.where().property({"name": "b"}).find(function (err, result) {
                          expect(err).to.be.null;
                          expect(result).to.be.a("array");
                          expect(result).to.have.length.of.at.least(1);
                          expect(result[0]).to.have.property("name", "b");
                          asyncCB(null, result[0]);
                        });
                      },
                      function (objToChange, asyncCB) {
                        expect(objToChange).to.be.a("object");
                        objToChange.path = "a/b/c/d";
                        Location.update.object(objToChange).apply(function (err, obj) {
                          expect(err).to.be.null;
                          expect(obj).to.be.a("array");
                          expect(obj).to.have.length.of.at.least(1);
                          asyncCB(null, obj[0]);
                        });
                      }

                    ], function (err, resultsOfChange) {
      expect(err).to.be.null;
      expect(resultsOfChange).to.have.property("path", "a/b/c/d");
      done();
    });
  });

  it("should not update objects outside of scope of filter ", function (done) {
    //Location = new greenTea(locationCollection, [{"tenantId": 2}]);
    var updatedLocation = {
      "_id": "56b998a2087cd862040ed1ae",
      "name": "a",
      "prenume": "sss",
      "path": null,
      "tenantId": 4,
      "parentId": null,
      "attributes": [],
      "assets": []
    };

    Location.update.object(updatedLocation).apply(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.be.empty;

      done();
    });
  });

  it("should not delete outside of scope", function (done) {
    var updatedLocation = {
      "_id": "56b998a2087cd862040ed1ae",
      "name": "a",
      "prenume": "sss",
      "path": null,
      "tenantId": 4,
      "parentId": null,
      "attributes": [],
      "assets": []
    };


    Location.destroy.id("56b998a2087cd862040ed1ae").apply(function (err, result) {
      expect(err).to.be.null;
      expect(result.succesfull).to.be.false;
      done();
    });
  });

});
