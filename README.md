# green-tea
PROJECT STATUS: __IN DEVELOPEMENT__
WARNING: __FOR NOW ONLY MONGO 2.6 is supported!__

### What is this ? 

This is an abstraction layer over the base mongo driver, it uses a fluent API inspired by the 
chai expect style 



### How to use it 

Make a new instance of it : 

    npm install green-tea --save 
    var greenTea = require("green-tea");    
    var Locations = new greenTea(locationCollection);
    
### Get Data using Green-Tea

Get all the documents using property filters:


    Location.get.where().property({"name": "a"}).find(function (err, result) {
          
    });


This will return an err object if the mongo driver throws an  error,or an array with the 
result. If there is only one item found, the result will be an array with one element. 
If no elements are found, there will be an empty array.

#### Aditional notation

The property filter also supports a more verbose style: 

    Location.get.where().property("name").is("value").find(function (err, result) {
        
    });

#### And / Or 

    Location.get.where().property({"name": "a"})
    .or()
    .where().property({"name": "c"}).find(
          function (err, result) {
    
    });

 And 

    Location.get.where().property({"name": "a"})
        .and()
        .where().property({"state": "c"}).find(
              function (err, result) {
        
    });

As a notice, the queries that are generated using "and" and "or" use the aggregation 
framework of the node js mongo driver, in order to be faster and easier on the memory / cpu.

### Insert data 

In order to insert new documents:

     it("should insert a new item", function (done) {
        Location.insert.object(newLocation).apply(function (err, newObj) {
          expect(err).to.be.null;
          expect(newObj).to.be.a("array");
          expect(newObj[0]).to.have.property("name", "a");
          done();
     });

Or for batch inserting (and array of objects)

    Location.insert.objects(arrLocations).apply(function (err, result) {

    });

The insert functionality only supports objects. 

### Update Objects

This was broken into two distinct parts, replacing documents, and updating specific 
properties.

#### Replace whole documents
Replace the whole object, passing a new version from a previous optained version :

    Location.update.object(objToChange).apply(function (err, obj) {
   
    });


#### Update specific values

     Location.set.property("name").to("John")
             .forObjects({"_id": objToChange._id}).apply(function (err, obj) {
                          
     });

or a more fluent version

    Location.set.property({"name": "John"}).and().property({"state": "NY"})
                              .forObjects({"_id": objToChange._id}).apply(function (err, obj) {
    
    });


### Delete objects | ( soft delete )

Delete by passing an existing object ( or an object that contains a valid _id property )

    Location.remove.object(object).apply(function (err, result) {
    
    });

Delete by passing just the id 

     Location.remove.id(object._id).apply(function (err, result) {
     
     });

Revive an item, just add the revive call in a normal remove call ( I know, it will be moved to it's own class but
 bear with me ... :) ).

    Location.delete.id("56b998a2087cd862040ed1ae").revive().apply(function (err, result) {
          expect(err).to.be.null;
          expect(result.succesfull).to.be.true;
          done();
    });

### Destroy | Permanent delete 

Basicly it's the same as remove syntax wise just use "destroy" instead of "remove". Also, obviously there is no revive... 

    Location.destroy.object(object).apply(function (err, result) {
            expect(err).to.be.null;
            expect(result.succesfull).to.be.true;
            asyncCB(null, true);
    });

### Filtering

In order to have global filtering ( that will filter __ALL__ request ) just add the
 require filtered to the constructor like this : 
 
     Location = new greenTea(locationCollection, [{"country": "Italy"}]);
            done();
     });

All the actions of this specific instance will be bound to the italy country. 
If you try to update a country that does has a different country, it will tell you that
that document does not exist.

### The soft delete mechanism

The soft delete mechanism basicly works like a global filter that gets set on the constructor of green-tea. 
So the ideea is that all queries ( except revive from the "remove" functionality ) will ignore the soft deleted items.
The soft delete works as by adding an "isDeleted: true" flag on the object, it uses the "{ isDeleted: { $ne: true } }" 
global filter.

### Still to do 


* Performance improvements
* More query options / support for more complex stuff
* Config file
* Mongo management (?) 
