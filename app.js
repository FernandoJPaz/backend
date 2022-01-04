var app = require('express')();
var fs = require('fs');

var options = {
  key : fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'sopes1pass123'
};

//var server = require('https').createServer(app,options);
var server = require('http').createServer(app);
const MongoClient = require('mongodb').MongoClient;
const index = require("./routes/index");

const uri = "mongodb://myUserAdmin:sopes1pass123@35.223.95.97:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const port = 5000;//process.env.PORT || 8080;

app.use(index);


const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

var database;
let interval;
const db_name = "Vacunas"; //Nombre de la base de datos a usar
const collection_name = "Registro"; //Nombre de la coleccion a usar

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);
    dbo.collection(collection_name).find({}).toArray(function (err, result) {
        if(err){
            socket.emit("FromAPI",[]);
        }else{
            let aux = [];
            let data = [];
            for (const iterator of result) {
                if (!aux.includes(iterator.location)) {
                    aux.push(iterator.location);
                    data.push({ location: iterator.location, cantidad: 1 })
                } else {
                    data.find(x => x.location === iterator.location).cantidad++;
                }
            }
            data.sort((a, b) => b.cantidad - a.cantidad);
            socket.emit("FromAPI",data);
        }
        db.close();
    });
  });
};

//Levanta el servidor y Conecta la Base de Datos
server.listen(port, () => {
  console.log(`Listening on port -> ${port}`)
  MongoClient.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true}, (error, client) => {
		if(error){
			throw error;
		}
		database = client.db(db_name);
               	collection = database.collection(collection_name);
    console.log("Mongo Success!");
    client.close();
	});
});
