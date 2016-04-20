var echarts = require('echarts');
var serverConfig = require('../../server.config');
var socket = require('socket.io-client')(`http://localhost:${serverConfig.socketPort}`);
var $ = require('jquery');
var myChart = echarts.init(document.getElementById('main'));
var echartParser = require('./echartParser');
var USER_NAME;
$("#submit").click(function() {
    socket.emit('fetch start', {
        url: $("#url").val()
    });
})
var dataStore = [];

socket.on('data', function(data) {
    console.log(data);
    dataStore = data;
    result = echartParser(dataStore);
    result.data[0].name = USER_NAME;
    var option = {
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        animationDuration: 2000,
        animationDurationUpdate:1000,
        animationEasingUpdate: 'quinticInOut',
        series: [{
            name: 'Les Miserables',
            type: 'graph',
            layout: 'force',
            data: result.data,
            links: result.links,
            roam: true,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
        }]
    };
    myChart.setOption(option);
});
socket.on('same friend', function(data) {
    dataStore.forEach(function(item) {
        if (item.user.hash_id == data.hash_id) {
            item.sameFriends = data.sameFriends;
            result = echartParser(dataStore);
            result.data[0].name = USER_NAME;
            var option = {
                title: {
                    text: 'Les Miserables',
                    subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [{
                    name: 'Les Miserables',
                    type: 'graph',
                    layout: 'force',
                    data: result.data,
                    links: result.links,
                    roam: true,
                    label: {
                        normal: {
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                }]
            };
            myChart.setOption(option);
        }
    })
})
socket.on('get user',function(user){
    USER_NAME = user.name;
})
socket.on('log', function(data) {
    console.log(data);
});

var notice = $("#notice");
socket.on('notice', function(data) {
    notice.html(data);
});
