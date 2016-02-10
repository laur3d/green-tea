/**
 * Created by laur on 09.02.2016.
 */

var mongo = require("mongodb").MongoClient;
var expect = require('chai').expect;
var _ = require('lodash');
var obj = require('mongodb').ObjectID;
var async = require('async');
var assert = require('assert');
var greenTea = require("../index");


describe("Tea Tests - soft delete", function () {
  var mongoUrl = "mongodb://localhost:27017/greentea-test";
  var db;
  var locationCollection;
  var Location;

  var newLocation = {
    "_id": new obj("56b998a2087cd862040ed1ae"),
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
        Location = new greenTea(locationCollection, []);
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

  it("Should soft delete an item ", function(done){

    Location.delete.id("56b998a2087cd862040ed1ae").apply(function (err, result) {
      expect(err).to.be.null;
      expect(result.succesfull).to.be.true;
      done();
    });


  });

  it("find all should not contain the soft deleted items", function(done){
    Location.get.find(function(err, result){
      expect(err).to.be.null;
      expect(result).to.be.a("array");
      expect(result).to.have.length(2);
      done;
    });
  });

  it("Should not find a soft deleted item by id", function(done){
    expect(true).to.be.false;
  });

  it("should not be able to update a soft deleted item", function(done){
    expect(true).to.be.false;
  });

  it("should not be able to delete a soft deleted item", function(done){
    expect(true).to.be.false;
  });

  it("should  be able to revive a soft deleted item", function(done){
    expect(true).to.be.false;
  });

});
