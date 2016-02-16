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


describe("Tea Tests", function () {
  var mongoUrl = "mongodb://localhost:27017/greentea-test";
  var db;
  var locationCollection;
  var Location;

  var newLocation = {
    "name": "a",
    "prenume": "a",
    "path": null,
    "tenantId": 4,
    "parentId": null,
    "attributes": [],
    "assets": []
  };

  var clientMocObj = {
    "_id": "56b998a2087cd862040ed1ae",
    "name": "b",
    "prenume": "b",
    "tenantId": 2,
    "path": "CHECKCHANGE",
    "parentId": null,
    "attributes": [],
    "assets": []
  };



  var arrLocations = [
    {
      "_id": new obj("56b998a2087cd862040ed1ae"),
      "name": "b",
      "prenume": "b",
      "tenantId": 2,
      "path": null,
      "parentId": null,
      "attributes": [],
      "assets": []
    },
    {
      "_id" : "",
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
        Location = new greenTea(locationCollection);
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
    Location.get.all().find(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length.of.at.least(3);
      done();
    });
  });

  it("should get an item with 'or' query", function (done) {

    Location.get.where().property({"name": "a"}).or().where().property({"prenume": "c"}).find(
      function (err, result) {
        expect(err).to.be.null;
        expect(result).to.be.a("array");
        expect(result).to.have.length.of.at.least(2);
        expect(result[0]).to.have.property("name", "a");
        done();
      });

  });

  it("should get an item with 'and' query", function (done) {

    Location.get.where().property({"name": "a"}).and().where().property({"prenume": "a"}).find(
      function (err, result) {
        expect(err).to.be.null;
        expect(result).to.be.a("array");
        expect(result).to.have.length.of.at.least(1);
        expect(result[0]).to.have.property("name", "a");
        done();
      });

  });


  it("should get an item with simple query", function (done) {

    Location.get.where().property({"name": "a"}).find(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length.of.at.least(1);
      expect(result[0]).to.have.property("name", "a");
      done();
    });

  });

  it("should get an item with property query", function (done) {
    Location.get.where().property("name").is("a").find(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length.of.at.least(1);
      expect(result[0]).to.have.property("name", "a");
      done();
    });
  });

  it("should get an empty array if nothing is found", function (done) {

    Location.get.where().property({"name": "fane"}).find(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(0);
      done();
    });

  });

  it("should update an item using object functionality", function (done) {

    async.waterfall([
                      function getTheObject(asyncCB) {
                        Location.get.where().property({"name": "a"}).and().property({path : { $ne: true}}).find(function (err, result) {
                          expect(err).to.be.null;
                          expect(result).to.be.a("array");
                          expect(result).to.have.length.of.at.least(1);
                          expect(result[0]).to.have.property("name", "a");
                          asyncCB(null, result[0]);
                        });
                      },
                      function (objToChange, asyncCB) {
                        expect(objToChange).to.be.a("object");
                        objToChange.name = "Ion";
                        Location.update.object(objToChange).apply(function (err, obj) {
                          expect(err).to.be.null;
                          expect(obj).to.be.a("array");
                          expect(obj).to.have.length.of.at.least(1);
                          asyncCB(null, obj[0]);
                        });


                      }

                    ], function (err, resultsOfChange) {
      expect(err).to.be.null;
      expect(resultsOfChange).to.have.property("name", "Ion");
      done();
    });

  });

  it("should update an item using object functionality [ _id as string ] | emulating call from client", function (done) {

    Location.update.object(clientMocObj).apply(function (err, obj) {
      expect(err).to.be.null;
      expect(obj).to.be.a("array");
      expect(obj).to.have.length.of.at.least(1);
      expect(obj[0]).to.have.property("path", "CHECKCHANGE");
      done();
    });
  });


  it("should update an item using property functionality", function (done) {
    async.waterfall([
                      function getTheObject(asyncCB) {
                        Location.get.where().property({"name": "Ion"}).find(function (err, result) {
                          expect(err).to.be.null;
                          expect(result).to.be.a("array");
                          expect(result).to.have.length.of.at.least(1);
                          expect(result[0]).to.have.property("name", "Ion");
                          asyncCB(null, result[0]);
                        });
                      },
                      function (objToChange, asyncCB) {
                        expect(objToChange).to.be.a("object");
                        Location.set.property("name").to("Gheoghe")
                          .forObjects({"_id": objToChange._id}).apply(function (err, obj) {
                          expect(err).to.be.null;
                          expect(obj).to.be.a("array");
                          expect(obj).to.have.length.of.at.least(1);
                          asyncCB(null, obj[0]);
                        });


                      }

                    ], function (err, resultsOfChange) {
      expect(err).to.be.null;
      expect(resultsOfChange).to.have.property("name", "Gheoghe");
      done();
    });
  });

  it("should update an item using value functionality", function (done) {
    async.waterfall([
                      function getTheObject(asyncCB) {
                        Location.get.where().property({"name": "Gheoghe"}).find(function (err,
                                                                                          result) {
                          expect(err).to.be.null;
                          expect(result).to.be.a("array");
                          expect(result).to.have.length.of.at.least(1);
                          expect(result[0]).to.have.property("name", "Gheoghe");
                          asyncCB(null, result[0]);
                        });
                      },
                      function (objToChange, asyncCB) {
                        expect(objToChange).to.be.a("object");

                        Location.set.property({"name": "Vasile"})
                          .forObjects({"_id": objToChange._id}).apply(function (err, obj) {
                          expect(err).to.be.null;
                          expect(obj).to.be.a("array");
                          expect(obj).to.have.length.of.at.least(1);
                          asyncCB(null, obj[0]);
                        });


                      }

                    ], function (err, resultsOfChange) {
      expect(err).to.be.null;
      expect(resultsOfChange).to.have.property("name", "Vasile");
      done();
    });
  });

  it("should delete an object", function (done) {
    var getObjectId = function (asyncCB) {
      Location.get.where().property({"name": "c"}).find(function (err, result) {
        expect(err).to.be.null;
        expect(result).to.be.a("array");
        expect(result).to.have.length.of.at.least(1);
        asyncCB(null, result[0]);
      });
    };

    var deleteObject = function (object, asyncCB) {
      expect(object).to.be.a("object");
      Location.destroy.object(object).apply(function (err, result) {
        expect(err).to.be.null;
        expect(result.succesfull).to.be.true;
        asyncCB(null, true);
      });
    };

    async.waterfall([getObjectId, deleteObject], function (err, response) {
      done();
    });

  });

  it("should delete and object based on id", function (done) {
    var getObjectId = function (asyncCB) {
      Location.get.where().property({"name": "b"}).find(function (err, result) {
        expect(err).to.be.null;
        expect(result).to.be.a("array");
        expect(result).to.have.length.of.at.least(1);
        asyncCB(null, result[0]);
      });
    };

    var deleteObject = function (object, asyncCB) {
      expect(object).to.be.a("object");
      Location.destroy.id(object._id).apply(function (err, result) {
        expect(err).to.be.null;
        expect(result.succesfull).to.be.true;
        asyncCB(null, true);
      });
    };

    async.waterfall([getObjectId, deleteObject], function (err, response) {
      done();
    });
  });


});
