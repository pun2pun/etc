

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



    var config_tempChart = {
        type: 'doughnut',
        data: {
            labels: [
              "Temperature (ºC)"
            ],
            datasets: [{
                data: [300, 50],
                backgroundColor: [
                  "#36A2EB",
                  "#d1eafa"
                ],
                hoverBackgroundColor: [
                  "#36A2EB",
                  "#d1eafa"
                ]
            }]
        },
    options: {
        elements: {
            center: {
                text: '0 C',
      color: '#36A2EB', // Default is #000000
      fontStyle: 'Arial', // Default is Arial
      sidePadding: 20 // Defualt is 20 (as a percentage)
            }
        }
    }
};



var config_humiChart = {
    type: 'doughnut',
    data: {
        labels: [
          "Humidity (%)"
        ],
        datasets: [{
            data: [50, 50],
            backgroundColor: [
              "rgba(89, 124, 43)",
              "rgba(210, 228, 89)"
            ],
            hoverBackgroundColor: [
              "rgba(89, 124, 43)",
              "rgba(210, 228, 89)"
            ]
        }]
    },
options: {
    elements: {
        center: {
            text: '0 %',
  color: 'rgba(89, 124, 43)',
  fontStyle: 'Arial', 
  sidePadding: 20 
        }
    }
}
};



    var ctx_temp = document.getElementById("myChart_temp_plant_2").getContext("2d");
    var myChart_temp = new Chart(ctx_temp, config_tempChart);

    var ctx_humi = document.getElementById("myChart_humi_plant_2").getContext("2d");
    var myChart_humi = new Chart(ctx_humi, config_humiChart);



    socket.on('plant_2_temperature', function (value) {   
        config_tempChart.options.elements.center.text = String(value)                    
        config_tempChart.data.datasets[0].data[0]=value;
        config_tempChart.data.datasets[0].data[1]=100-value;
        myChart_temp.update()                                   
     });    


     socket.on('plant_2_humidity', function (value) {
        config_humiChart.options.elements.center.text = String(value)
        config_humiChart.data.datasets[0].data[0]=value;
        config_humiChart.data.datasets[0].data[1]=100-value;
        myChart_humi.update()                                   
       })