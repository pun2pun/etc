
var socket = io.connect()
var temp_humi_ctx = document.getElementById('chart_plant_2')

var data = {
  labels: [0],
  datasets: [{
    data: [0],     
    fill: false,                      
    label: 'Temperature',                          
    backgroundColor: '#36A2EB',
    borderColor:'#36A2EB'    
  },
  {
    data: [0],   
    fill: false,                        
    label: 'Humidity',                          
    backgroundColor: 'rgba(89, 124, 43)',
    borderColor:'rgba(89, 124, 43)'
                              }
]
}
var optionsAnimations = {
    responsive: true,
    title:{text:"Environment",fontSize: 20 ,display:false},
    
    scales: {
        yAxes: [{
            ticks: {
                min: 0,
                max: 100,
                stepSize: 20
            }
        }]
    }
}
var chart = new Chart(temp_humi_ctx, {
  type: 'line',
  data: data,
  
  options: optionsAnimations
})








var humid_spare = 0;
socket.on('plant_2_humidity', function (value) {
  humid_spare = value;                               
          })




socket.on('plant_2_temperature', function (value) {    
    var length = data.labels.length;
    
    if (length >= 20) {
    data.datasets[0].data.shift();
    data.datasets[1].data.shift();
    data.labels.shift();
    }
    
    data.datasets[0].data.push(value);
    data.datasets[1].data.push(humid_spare);
    data.labels.push(moment().format('HH:mm:ss'));
    chart.update();
})