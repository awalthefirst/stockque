(function () {
    var socket = io.connect()
    var head = "https://www.quandl.com/api/v3/datasets/WIKI/";
    var tail = ".json?order=asc&exclude_column_names=true&api_key=gewBYDX5gmvKK8TXbpLg&start_date=2015-01-01&end_date=2015-12-10&limit=n"

    var names;

    //add data
    $('.add').click(function () {
        var query = $("input").val()
        $("input").val('');

        if (query.length > 1 && names.indexOf(query.toUpperCase()) === -1) {
            $.getJSON(head + query + tail).done(function () {
                //call socket io
                socket.emit('added', {
                    stock: query.toUpperCase()
                });
            })
        }
    })

    //remove data
    $('.floatr').on('click','button',function () {
        socket.emit('removed', {
            stock: this.id
        });
    })

    var seriesOptions = [],
        seriesCounter = 0;

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
                },
                showEmpty: true
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value;
                    }
                },
                showEmpty: true
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
        $.getJSON('/api').done(function (data) {
            names = data;
             $('.floatr').html('');
            $.each(names, function (i, name) {
                $.getJSON(head + name + tail, function (data) {

                    //create remove element
                    $('.floatr').append( $('<button>').text(name + ' (remove)')
                    .addClass('remove').attr("id",name) )

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
        })
    };
    reloadChart();;

    socket.on('reload', function (data) {
        console.log('reload fired')
        reloadChart();
    });



})();
