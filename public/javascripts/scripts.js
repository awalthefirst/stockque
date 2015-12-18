(function () {
    var socket = io.connect(),
        names,
        d = new Date(),
        day = d.getDate(),
        month = d.getMonth() + 1,
        year = d.getFullYear(),
        end_date = year + '-' + month + '-' + day,
        start_date = (year - 1) + '-' + month + '-' + day,
        newStart_date = year + '-' + month + '-' +(day-2),
        head = "https://www.quandl.com/api/v3/datasets/WIKI/",
        tail = ".json?order=asc&exclude_column_names=true&api_key=gewBYDX5gmvKK8TXbpLg&start_date=" + start_date + "&end_date=" + end_date + "&limit=n",
        newtail = ".json?order=asc&exclude_column_names=true&api_key=gewBYDX5gmvKK8TXbpLg&start_date=" + newStart_date + "&end_date=" + end_date + "&limit=n";
        
    //add data
    $('.add').click(addHandler)
    $('input').keyup(function (e) {
        if (e.keyCode == 13) {
            addHandler()
        }
    })

    function addHandler() {
        var query = $("input").val()
        $("input").val('');

        if (query.length > 1 && names.indexOf(query.toUpperCase()) === -1) {
            $.getJSON(head + query + newtail).done(function () {
                //call socket io
                socket.emit('added', {
                    stock: query.toUpperCase()
                });
            })
        }
    }

    //remove data
    $('.floatr').on('click', 'button', function () {
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
            if (data.length === 0) {
                createChart();
            }
            $.each(names, function (i, name) {
                $.getJSON(head + name + tail, function (data) {

                    //create remove element
                    $('.floatr').append($('<button>').text(name + ' (remove)')
                        .addClass('remove').attr("id", name))

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
        reloadChart();
    });

})();
