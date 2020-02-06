

var socket = io.connect()



socket.on('plant_2_pump_state', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#pump_check_plant_2').bootstrapToggle(status_pump)  
    });

socket.on('plant_2_valve_1', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#valve_1_check_plant_2').bootstrapToggle(status_pump)  
    });

socket.on('plant_2_valve_2', function (value) {
    var status_pump = (value ==1?"on":"off")
    $('#valve_2_check_plant_2').bootstrapToggle(status_pump)  
    });

 
socket.on('plant_2_Mode_Status', function (value) {
  if(value =='Manua Mode'){
    $('#option1_plant_2').addClass('active');
    $('#option2_plant_2').removeClass('active') ;
  }
  else{
    $('#option1_plant_2').removeClass('active');
    $('#option2_plant_2').addClass('active') ;
  }
});
 
 

