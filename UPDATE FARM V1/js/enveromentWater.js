

var socket = io.connect()

/*

var ctx_pH_1 = document.getElementById('pH_1_chart')
var ctx_pH_2 = document.getElementById('pH_2_chart')




                        var data_pH_1_gate =   {
                                        labels: ['PH.1'],
                                        datasets: [{
                                        label: '#ff66b3',
                                        data: [61, 39],
                                        backgroundColor: [
                                            'rgba(89, 124, 43)',
                                            'rgba(210, 228, 89)'       
                                        ],
                                        borderColor: [
                                            'rgba(255, 255, 255)',
                                            'rgba(255, 255, 255)'                                    
                                        ],
                                        borderWidth: 2
                                        }]
                                    }
                        
                         var data_pH_2_gate =   {
                                        labels: ['pH.2'],
                                        datasets: [{
                                        label: '#ff66b3',
                                        data: [61, 39],
                                        backgroundColor: [
                                            'rgba(89, 124, 43)',
                                            'rgba(210, 228, 89)'       
                                        ],
                                        borderColor: [
                                            'rgba(255, 255, 255)',
                                            'rgba(255, 255, 255)'                                    
                                        ],
                                        borderWidth: 2
                                        }]
                                    }
                                    
                         var gate_pH_1 = new Chart(ctx_pH_1, {
                                type: 'doughnut',
                                data: data_pH_1_gate,                              
                                options: {cutoutPercentage:60,responsive:false
                                
                                 
                                }
                                })

                        var gate_pH_2 = new Chart(ctx_pH_2, {
                                    type: 'doughnut',
                                    data: data_pH_2_gate,                              
                                    options: {
                                        cutoutPercentage:60,responsive:false }
                                     
                                })                                   
                                


socket.on('temperature', function (value) {                               
    data_pH_1_gate.datasets[0].data[0]=value;
    data_pH_1_gate.datasets[0].data[1]=100-value;
    gate_pH_1.update()                                   
  })
                                   
socket.on('humidity', function (value) {
    data_pH_2_gate.datasets[0].data[0]=value;
    data_pH_2_gate.datasets[0].data[1]=100-value;
    gate_pH_2.update()                                   
   })
                      
*/




var socket = io.connect()


Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
    //Get ctx from string
    var ctx = chart.chart.ctx;
    
            //Get options from the center object in options
    var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
    var color = centerConfig.color || '#000';
    var sidePadding = centerConfig.sidePadding || 20;
    var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
    //Start with a base font of 30px
    ctx.font = "30px " + fontStyle;
    
            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
    var stringWidth = ctx.measureText(txt).width;
    var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

    // Find out how much the font can grow in width.
    var widthRatio = elementWidth / stringWidth;
    var newFontSize = Math.floor(30 * widthRatio);
    var elementHeight = (chart.innerRadius * 2);

    // Pick a new font size so it will not be larger than the height of label.
    var fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
    ctx.font = fontSizeToUse+"px " + fontStyle;
    ctx.fillStyle = color;
    
    //Draw text in center
    ctx.fillText(txt, centerX, centerY);
        }
    }
});



    var config_phChart = {
        type: 'doughnut',
        data: {
            labels: [
              "Basic","Acidic"
            ],
            datasets: [{
                data: [50, 50],
                backgroundColor: [
                  "#9933ff",
                  "#ff3333"
                ],
                hoverBackgroundColor: [
                  "#9933ff",
                  "#ff3333"
                ]
            }]
        },
    options: {
        elements: {
            center: {
                text: 'NaN',
      color: '#000000', // Default is #000000
      fontStyle: 'Arial', // Default is Arial
      sidePadding: 20 // Defualt is 20 (as a percentage)
            }
        }
    }
};



var config_ec = {
    type: 'doughnut',
    data: {
        labels: [
          "EC "
        ],
        datasets: [{
            data: [50, 50],
            backgroundColor: [
              "#e6ac00",
              "#ffdf80"
            ],
            hoverBackgroundColor: [
              "#e6ac00",
              "#ffdf80"
            ]
        }]
    },
options: {
    elements: {
        center: {
            text: 'NaN',
  color: '#e6ac00',
  fontStyle: 'Arial', 
  sidePadding: 20 
        }
    }
}
};



    var ctx_ph = document.getElementById("myChart_ph").getContext("2d");
    var myChart_ph = new Chart(ctx_ph, config_phChart);

    var ctx_ec = document.getElementById("myChart_ec").getContext("2d");
    var myChart_ec = new Chart(ctx_ec, config_ec);



    socket.on('ph', function (value) {   
        config_phChart.options.elements.center.text = String(value)                    
        config_phChart.data.datasets[0].data[0]=value;
        config_phChart.data.datasets[0].data[1]=100-value;
        myChart_ph.update()                                   
     });    


     socket.on('ec', function (value) {
        config_ec.options.elements.center.text = String(value)
        config_ec.options.datasets[0].data[0]=value;
        config_ec.options.datasets[0].data[1]=100-value;
        myChart_ec.update()                                   
       })