
var socket = io.connect()
var inverter_ctx = document.getElementById('InverterChart')



var data_inverter = {
  labels: [0],
  datasets: [{
    data: [0],     
    fill: false,                      
    label: 'speed',                          
    backgroundColor: '#ff0000',
    borderColor:'#ff0000'    
  }
]
}
var optionsAnimations = {
    responsive: true,
    title:{text:"Inverter",fontSize: 20 ,display:false},
    
    scales: {
        yAxes: [{
            ticks: {
                min: 0,
                max: 60,
                stepSize: 10
            }
        }]
    }
}
var chart_inverter = new Chart(inverter_ctx, {
  type: 'line',
  data: data_inverter,
  
  options: optionsAnimations
})


socket.on('SpeedInverter', function (value) {    
    var length = data.labels.length;
    data_inverter.datasets[0].label = "speed    "+String(value)+"    Hz"
    if (length >= 20) {
        data_inverter.datasets[0].data.shift();
        data_inverter.labels.shift();
    }
    
    data_inverter.datasets[0].data.push(value);
    data_inverter.labels.push(moment().format('HH:mm:ss'));
    chart_inverter.update();
})

socket.on('fan_check', function (value) {

  data_inverter.datasets[0].backgroundColor  = (value ==1?"#1a1aff":"#bbbcc5")
  data_inverter.datasets[0].borderColor  = (value ==1?"#1a1aff":"#bbbcc5")
  chart_inverter.update();
  });