const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();

client.on('connect', function () {
    console.log('Connected to Redis...');
});

// Set Port
const port = 3000;

// Init app
const app = express();

// View Engine\
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// methodOverride
app.use(methodOverride('_method'));

// Search Page
app.get('/', function (req, res, next) {
    res.render('searchsiswa');
});

app.post('/siswa/search', (req, res, next) => {
    let id = req.body.id;

    client.hgetall(id, function (err, obj) {
        if (!obj) {
            res.render('searchsiswa', {
                error: 'siswa does not exist'
            });
        } else {
            obj.id = id;
            res.render('detailsiswa', {
                siswa: obj
            })
        }
    })
});

app.get('/siswa/edit/:id', (req, res, next) => {
    let id = req.params.id;

    client.hgetall(id, function (err, obj) {
        obj.id = id;
        res.render('editsiswa', {
            siswa: obj
        })
    })

})

app.get('/siswa/add', function (req, res, next) {
    res.render('addsiswa');
});

app.post('/siswa/add', function (req, res, next) {
    let id = req.body.id;
    let nisn = req.body.nisn;
    let nama = req.body.nama;

    client.hmset(id, [
        'nama', nama, 'nisn', nisn
    ], function (err, reply) {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    })
})

app.put('/siswa/update', function (req, res, next) {
    let id = req.body.id;
    let nisn = req.body.nisn;
    let nama = req.body.nama;

    client.hmset(id, [
        'nama', nama, 'nisn', nisn
    ], function (err, reply) {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    })
})

app.delete('/siswa/delete/:id', function (req, res, next) {
    client.del(req.params.id);
    res.redirect('/')
})


app.listen(port, function () {
    console.log('Server started on port ' + port);
});