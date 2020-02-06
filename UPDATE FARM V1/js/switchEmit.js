

var socket = io.connect()



socket.on('pumpCheck', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#pump_check').bootstrapToggle(status_pump)  
    });

socket.on('vavle_1_check', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#valve_1_check').bootstrapToggle(status_pump)  
    });

socket.on('vavle_2_check', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#valve_2_check').bootstrapToggle(status_pump)  
    });

socket.on('vavle_3_check', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#valve_3_check').bootstrapToggle(status_pump)  
    });
 
socket.on('fan_check', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#fan_check').bootstrapToggle(status_pump)  

    });

 
socket.on('Mode_Check', function (value) {
  if(value =='Manual'){
    $('#option1').addClass('active');
    $('#option2').removeClass('active') ;
  }
  else{
    $('#option1').removeClass('active');
    $('#option2').addClass('active') ;
  }
});
 
 

