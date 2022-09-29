var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'product', cmd: 'add' }, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'product', cmd: 'get' }, function (msg, respond) {
        this.make('product').load$(msg.data.user_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete-all' }, function (msg, respond) {
        this.make('product').remove$({}, respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all' }, function (msg, respond) {
        this.make('product').list$({}, respond);
    });
}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-product', function (args, done) {
    console.log("--> cmd:add-product");
    var product = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-product', function (args, done) {
    console.log("--> cmd:get-all-product");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all', function (args, done) {
    done(null, { cmd: "delete-all" });
});

seneca.add('role:api, cmd:get-all-product', function (args, done) {
    console.log("--> cmd:get-all-product");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.act('role:web', {
    use: {
        prefix: '/detail',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { GET: true },
            'get-all-product': { GET: true },
            'get-product': { GET: true, },
            'delete-product': { GET: true, },
            'delete-all': {GET: true}
            }
         }
        })

var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));



app.listen(3009)
console.log("Server listening on localhost:3009 ...");
console.log("http://localhost:3009/detail/add-product?product=mobile&price=200&category=phone  method: post");
console.log("http://localhost:3009/detail/delete-all");
console.log("http://localhost:3009/detail/get-all-product method: get");