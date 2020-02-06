var express = require('express');
var app = express();
var pathComp= require("express-static");
var bodyParser =  require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require("moment");
var MongoClient = require('mongodb').MongoClient;
var path = require('path')
const url = "mongodb+srv://admin:1212312121@cluster0-4e5vh.gcp.mongodb.net/test?retryWrites=true&w=majority";
var chart = require('chart.js')
//----------------------------------------------- MQTTT----------------------------------------
var mqtt = require('mqtt');
var Topic = '#'; 
var Broker_URL = 'mqtt://tailor.cloudmqtt.com';
var options = {
    port: 16852,
    clientId: 'Web Server',
    username: 'punpuntest',
    password: '1212312121',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};



InitServer();


var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);


function mqtt_connect()
{
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted)
{
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
}

function mqtt_reconnect(err)
{
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err)
{
    console.log("Error!");
	if (err) {console.log(err);}
}

function after_publish()
{
	//do nothing
}

function mqtt_messsageReceived(topic, message, packet)
{
    console.log('Topic=' +  topic + '  Message=' + message);   
    
    if(topic == 'PLC_plant_1'){
        var stringData = message.toString();
        stringData = stringData.trim();
        var spliteData = stringData.split(',');
        var temp_db = (parseInt(spliteData[8].trim()))/10;
        var humi_db = (parseInt(spliteData[7]))/10;
        var SpeddInverter = parseInt(spliteData[6]);
        var Fan_status = (spliteData[5] == 'f1'?1:0);
        var Pump_status = (spliteData[4] == 'p1'?1:0);
        var Vavle_1_status = (spliteData[3] == 'v11'?1:0);
        var Vavle_2_status = (spliteData[2] == 'v21'?1:0);
        var Vavle_3_status = (spliteData[1] == 'v31'?1:0);
        var Mode_Status = spliteData[0];

        io.sockets.emit('temperature',temp_db);
        io.sockets.emit('humidity',humi_db);
        io.sockets.emit('speed_Inverter',SpeddInverter);
        io.sockets.emit('pump_state',Pump_status);
        io.sockets.emit('Fan_state',Fan_status);
        io.sockets.emit('Fan_state',Fan_status);
        io.sockets.emit('Mode_Status',Mode_Status);

        mongoDataWrite_plant_1(temp_db,humi_db,SpeddInverter,Fan_status,Pump_status,Vavle_1_status,Vavle_2_status,Vavle_3_status,Mode_Status);
   }

   if(topic == 'PLC_plant_2'){

    var stringData = message.toString();
    stringData = stringData.trim();
    var spliteData = stringData.split(',');
    var temp_db = (parseInt(spliteData[0].trim()))/10;
    var humi_db = (parseInt(spliteData[1]))/10;
    var Pump_status = (spliteData[5] == 'Pump ON'?1:0);
    var Vavle_1_status = (spliteData[3] == 'Vavle1 ON'?1:0);
    var Vavle_2_status = (spliteData[4] == 'Vavle2 ON'?1:0);
    var Mode_Status = spliteData[2];


    io.sockets.emit('plant_2_temperature',temp_db);
    io.sockets.emit('plant_2_humidity',humi_db);
    io.sockets.emit('plant_2_pump_state',Pump_status);
    io.sockets.emit('plant_2_valve_1',Vavle_1_status);
    io.sockets.emit('plant_2_valve_2',Vavle_2_status);
    io.sockets.emit('plant_2_Mode_Status',Mode_Status);

    mongoDataWrite_plant_2(temp_db,humi_db,Pump_status,Vavle_1_status,Vavle_2_status,Mode_Status);
}



  
}

function mqtt_close()
{
	console.log("Close MQTT");
}
//--------------------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/',function(req,res){
    
    res.sendFile(__dirname+'/src/index.html');
});

app.get('/plant_1.html',function(req,res){
    
    res.sendFile(__dirname+'/src/plant_1.html');
    console.log("Monitor page");
});


http.listen(3000,function(req,res){
   console.log('start server at 3000');

});

setInterval(InitServer,2000);

//---------------------------------------- update Databass ----------------------------
function mongoDataWrite_plant_1(temp,humi,inverter_speed,f_state,p_state,v1_state,v2_state,v3_state,Mode_state){

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("SMART_FARM");  
        var date_time = moment().format('MMMM Do YYYY, h:mm:ss a');

        var Data_write = {
            "Time":date_time,
            "Temperature":temp,
            "Humidity":humi,
            "Mode":Mode_state,
            Output:{
                "speed_fan": inverter_speed,
                "fan_status":f_state,
                "pump_status":p_state,
                "valve_1_status":v1_state,
                "valve_2_status":v2_state,
                "valve_3_status":v3_state
            }
        };

        dbo.collection("PLC_plant_1").insertOne(Data_write,function(err,response){
            if (err) throw err ;
             console.log("complete  collection");
               db.close();  
        })
    

    });       
}


function mongoDataWrite_plant_2(temp,humi,p_state,v1_state,v2_state,Mode_state){

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("SMART_FARM");  
        var date_time = moment().format('MMMM Do YYYY, h:mm:ss a');

      
        var Data_write = {
            "Time":date_time,
            "Temperature":temp,
            "Humidity":humi,
            "Mode":Mode_state,
            Output:{
            
                "pump_status":p_state,
                "valve_1_status":v1_state,
                "valve_2_status":v2_state
            }
        };

        dbo.collection("PLC_plant_2").insertOne(Data_write,function(err,response){
            if (err) throw err ;
             console.log("complete  collection");
               db.close();  
        })
    

    });       
}

function InitServer(){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
       var dbo = db.db("SMART_FARM"); 
        
        dbo.collection("PLC",function(err,collection){
            collection
                .find()
                .sort({$natural:-1})
                .limit(1)
                .next()
                .then(
                    function(doc){
                         
                        var Temperature = doc.Temperature;
                        var Humidity = doc.Humidity;
                        var Speed_inverter = doc.Output["speed_fan"] / 100;
                        var Pump_status = (doc.Output["pump_status"] == 1?1:0);
                        var fan_status = (doc.Output["fan_status"] == 1?1:0);
                        var vavle_1_status = (doc.Output["valve_1_status"] == 1?1:0);
                        var vavle_2_status = (doc.Output["valve_2_status"] == 1?1:0);
                        var vavle_3_status = (doc.Output["valve_3_status"] == 1?1:0);
                        var Mode_Check = doc.Mode;
                       
                        io.sockets.emit('temperature',Temperature)
                        io.sockets.emit('humidity',Humidity)
                        io.sockets.emit('SpeedInverter',Speed_inverter)
                        io.sockets.emit('pumpCheck',Pump_status)
                        io.sockets.emit('fan_check',fan_status)
                        io.sockets.emit('vavle_1_check',vavle_1_status)
                        io.sockets.emit('vavle_2_check',vavle_2_status)
                        io.sockets.emit('vavle_3_check',vavle_3_status)
                        io.sockets.emit('Mode_Check',Mode_Check)
                       
                                    
                    },
                    function(err){console.log('Error',err);}
                )
                
            db.close();
        });
    });
};