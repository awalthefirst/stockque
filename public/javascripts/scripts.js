(function () {

    var head = "https://www.quandl.com/api/v3/datasets/WIKI/";
    var tail = ".json?order=asc&exclude_column_names=true&api_key=gewBYDX5gmvKK8TXbpLg&start_date=2015-01-01&end_date=2015-12-10&limit=n"

    /* var url = "https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json?order=asc&exclude_column_names=true&api_key=gewBYDX5gmvKK8TXbpLg&start_date=2015-01-01&end_date=2015-12-10&limit=n";*/

    $('button').click(function () {
        names  = ['MSFT', 'AAPL' ]; 
        reloadChart();
        console.log();
    })
    
    var seriesOptions = [],
        seriesCounter = 0,
        names = ['MSFT', 'AAPL', 'MMM', "GOOGl"];

    function createChart() {

       $('#container').highcharts('StockChart', {
            rangeSelector: {
                selected: 4,
                inputEnabled: false,
                buttonTheme: {
                    visibility: 'hidden'
                },
                labelStyle: {
                    visibility: 'hidden'
                }
            },
            navigator: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            xAxis: {
                tickLength: false,
                labels: {
                    enabled: false
                }
            },
           yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value;
                    }
                }
            },
            title: {
                text: 'Stock Price'
            },
            credits: {
                enabled: false
            },
            tooltip: {
                valueDecimals: 2
            },

            series: seriesOptions


        });
    }
       
    function reloadChart() {
         
        $.each(names, function (i, name) {
            $.getJSON(head + name + tail, function (data) {

                var arr = []
                data.dataset.data.forEach(function (e) {
                    arr.push([e[0], e[1]])
                })
                seriesOptions[i] = {
                    name: name,
                    data: arr
                };

                seriesCounter += 1;

                if (seriesCounter === names.length) {
                    createChart();
                    seriesCounter = 0;
                    seriesOptions = [];
                }
            });
        })
        
    };
    
   reloadChart();
     
     
    /*var socket = io.connect();

    socket.emit('added', {
        stock: 'googl'
    });

    socket.on('add', function (data) {
        console.log('sever said add: ' + data)
    });

    socket.emit('removed', {
        stock: 'mmm'
    });
 
    socket.on('remove', function (data) {
        console.log('sever said remove: ' + data)
    });*/


})();
