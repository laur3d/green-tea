/**
 * Created by laur on 16.02.2016.
 */
var mongo = require("mongodb").MongoClient;
var expect = require('chai').expect;
var _ = require('lodash');
var obj = require('mongodb').ObjectID;
var async = require('async');
var assert = require('assert');
var greenTea = require("../index");


describe("Tea Tests - with extensions", function () {
  var mongoUrl = "mongodb://localhost:27017/greentea-test";
  var db;
  var locationCollection;
  var Location;

  var newLocation = {
    "_id": new ObjectID("56b998a2087cd862040ed1ae"),
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
        Location = new greenTea(locationCollection, [{"tenantId": 4}]);
        done();
      });

    });
  });

  after("CleanUp", function (done) {
    if (db) {
      db.close(done);
    }
  });


  it("should insert a new item", function (done) {
    Location.insert.object(newLocation).apply(function (err, newObj) {
      expect(err).to.be.null;
      expect(newObj).to.be.a("array");
      expect(newObj[0]).to.have.property("name", "a");
      done();
    });
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

  it("should find by id [ using short hand notation ]", function (done) {
    Location.get.id("56b998a2087cd862040ed1ae").find(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(1);
      done();
    });
  });

  it("should update using new where functionality using [where - property (strings) - is ]", function (done) {
    Location.set.property("name").to("f").where().property("prenume").is("a").apply(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(1);
      expect(result[0]).to.have.property("name", "f");
      done();
    });
  });

  it("should update using new where functionality using [where - property (object) ]", function (done) {
    Location.set.property("name").to("X").where().property({"prenume": "a"}).apply(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(1);
      expect(result[0]).to.have.property("name", "X");
      done();
    });
  });

  it("should update using new where functionality using [where - id ]", function (done) {
    Location.set.property("name").to("Z").where().id("56b998a2087cd862040ed1ae").apply(function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(1);
      expect(result[0]).to.have.property("name", "Z");
      done();
    });
  });

});
