var express = require('express');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 5000;

var db_name = process.env.DB_NAME || "test"
var db_host = process.env.DB_HOST || "localhost"
var required_params = ["district", "street", "long", "lat", "zip", "freehold", "price",  "bedrooms", "gfa", "built_in"];

// Generalized allo log function. May be.
var log_err = function(err, res, mong){

    if(mong.connection){
        mong.connection.close();
    }

    if(res){
        res.send(500, { "message": "Something wrong." });
    }
    
    console.log("Opps error occured : " + err)
};

mongoose.connect('mongodb://' + db_host + '/' + db_name, function (err, res){
    if (err) {
        console.log ('Could not connect to ' + db_host + '/' + db_name);
        return;
    }
});


var db = mongoose.connection
    ,property_model,
    property,
    limit =5 ;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function callback () {

    //FIXME : Put this under lib
    var property_schema = mongoose.Schema({
        address: {
            district: String,
            street: String,
            long: String,
            lat: String,
            zip: Number
        },
        freehold: Boolean,
        prices: [{price: Number, date: Date}],
        bedrooms: Number,
        built_in: Number,
        gfa: Number,
        verfied: Boolean
    });

    property_model = mongoose.model('property_model', property_schema);

});

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT");
});

app.use(express.bodyParser());

app.use(function(req, res, next){
    console.log("%s %s %s %s", req.method, req.url, req.ip, req.get('user-agent'));
    next();
});

app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/', function(req, res) {
    property_model
    .find({})
    //.where('name.last').equals('Ghost')
    //.where('age').gt(17).lt(66)
    //.where('likes').in(['vaporizing', 'talking'])
    .limit(limit)
    //.sort('-occupation')
    //.select('name occupation')
    .exec(function(err, result){
        if(err){
            console.log("Something goes wrong " + err);
        }
        //console.log("Data found " + result);
        res.send({ 
            limit : limit,
            data : result,
            total : "GET TOTAL DATA, mongodb TODO",
            current : 0
        });
        res.end();      
    });
});

app.get('/property/:id', function(req, res, next) {

    var id = req.params.id;

    try {
        id = new mongoose.Types.ObjectId(id);
    } catch(err) {
        console.log("Error: " + err.message);
        res.send(400, { "message": "Invalid length of ID, must be 12 characters." });
        res.end();
    }
    
    if(id instanceof mongoose.Types.ObjectId){
       property_model
        .find({ _id: id })
        .exec(function(err, result){
            if(err){
                res.send(500, { "message": "Oops something wrong could find you request." });
                console.log("Something goes wrong " + err);
            }
            //console.log("Data found " + result);

            if(result.length > 1){
                console.log("WARN: The data must be unique " + id);
            }
            res.send({ 
                data : result
            });
        });
    }      

});


app.get('/property', function(req, res) {

    var data = req.query;
    console.log(data);

    // Sanitizie the param. it MUST

    console.log(data);

//   street: '23',
//   zip: '4',
//   freehold: '1',
//   price: '2344',
//   bedrooms: '45',
//   gfa: '45' }
// { long: '5678',
//   lat: '23',
//   street: '23',
//   zip: '4',
//   freehold: '1',
//   price: '2344',
//   bedrooms: '45
// }}

    //FIXME make it smart.
    if(data.long){
        property_model = property_model.where('address.long').equals(data.long)
    }
    if(data.lat){
        property_model = property_model.where('address.lat').equals(data.lat)
    }
    // if(data.street){
    //     property_model = property_model.where('address.street').equals(data.street)
    // }
    // if(data.gfa){
    //     property_model = property_model.where('address.gfa').equals(data.gfa)
    // }
    // if(data.zip){
    //     property_model = property_model.where('address.zip').equals(data.zipzip)
    // }
    // // if(data.price){
    // //     property_model = property_model.where('address.price').equals(data.price)
    // // }
    // if(data.bedrooms){
    //     property_model = property_model.where('address.bedrooms').equals(data.bedrooms)
    // }

    // .where('bedrooms').equals()
    // //.where('likes').in(['vaporizing', 'talking'])
    property_model.limit(limit)
    // //.sort('-occupation')
    // //.select('name occupation')
    .exec(function(err, result){
        if(err){
            res.send(400, {"message": "Invalid POST data, " + required_params[p]});
            res.end();
        }
        //console.log("Data found " + result);
        res.send({ 
            limit : limit,
            data : result,
            total : "GET TOTAL DATA, mongodb TODO",
            current : 0
        });
        res.end();      
    });
});



app.post('/property', function(req, res, next) {

    var data = req.body;

    // Make sure require_params are passed. 
    // TODO make this DRY.
    for(var p in required_params){
        if(data[required_params[p]] == undefined){
            res.send(400, {"message": "Invalid POST data, " + required_params[p]});
            res.end();
        }
        
    }

    var property = new property_model(
        {
            address: {
                district: data.district,
                street: data.street,
                long: data.long,
                lat: data.lat,
                zip: data.zip
            },
            freehold: data.freehold,
            prices: [
                {price: data.price, date: Date.now()}
            ],
            bedrooms: data.bedrooms,
            built_in: data.built_in,
            gfa: data.gfa,
            verfied: false
        }
    );
    property.save(function(err, result){
        if(err) {
            res.send(500, { "message": "Could not save the data Dude" });
            console.log("Somthing wrong, Oopps!");

        } else{
            res.send(200, { "message": "It is Dude, " + result });    
        }
        res.end();
    });

});
