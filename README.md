real - open real estate data
============================

Links and Resources
-------------------

 - [Tracker](https://apptrajectory.com/sinar-reald37533/real)
 - [Git](https://github.com/yclian/real)
 - [Hackathon.io](http://hackathon.io/projects/2393)


Express
--------

* /
    *GET* get all property, limit by 5 property only

* /property/:id
    *GET* property of that specific ID
    ID must be 12 Bytes of String.

* /property
    *POST* Create new property
    Required fields:
        ["district", "street", "long", "lat", "zip", "freehold", "price",  "bedrooms", "gfa", "built_in"];

* /property/
    *GET* Search any property with the following filter and limit by 5 only per request:
        ["district", "street", "long", "lat", "zip", "freehold", "price",  "bedrooms", "gfa", "built_in"];

* /property/:id
    *PUT* To update the property value
        Supported value to be updated:
            ["freehold", "price"]

* /property/:id
    *DELETE* a property
    **This feature is disabeld at time moment**
