'use strict';

var request = require('request');
var Promise = require('bluebird');
var config = require('../config');

var fetchFollwerOrFollwee = function fetchFollwerOrFollwee(options, socket) {
    var user = options.user;
    var isFollowees = options.isFollowees;
    var grounpAmount = isFollowees ? Math.ceil(user.followeeAmount / 20) : Math.ceil(user.followerAmount / 20);
    var offsets = [];
    for (var i = 0; i < grounpAmount; i++) {
        offsets.push(i * 20);
    }
    return Promise.map(offsets, function (offset) {
        return getFollwerOrFollwee(user, offset, isFollowees, socket);
    }, { concurrency: config.concurrency ? config.concurrency : 3 }).then(function (array) {
        var result = [];
        array.forEach(function (item) {
            result = result.concat(item);
        });
        return result;
    });
};

function getFollwerOrFollwee(user, offset, isFollowees, socket) {
    socket.emit('notice', '开始抓取 ' + user.name + ' 的第 ' + offset + '-' + (offset + 20) + ' 位' + (isFollowees ? '关注的人' : '关注者'));
    console.log('开始抓取 ' + user.name + ' 的第 ' + offset + '-' + (offset + 20) + ' 位' + (isFollowees ? '关注的人' : '关注者'));
    var params = "{\"offset\":{{counter}},\"order_by\":\"created\",\"hash_id\":\"{{hash_id}}\"}".replace(/{{counter}}/, offset).replace(/{{hash_id}}/, user.hash_id);
    // console.log(params);
    return new Promise(function (resolve, reject) {
        request({
            method: 'POST',
            url: isFollowees ? 'https://www.zhihu.com/node/ProfileFolloweesListV2' : 'https://www.zhihu.com/node/ProfileFollowersListV2',
            form: {
                method: "next",
                params: params,
                _xsrf: config._xsrf
            },
            headers: {
                'cookie': config.cookie,
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'cache-control': 'no-cache',
                'x-requested-with': 'XMLHttpRequest'
            },
            timeout: 1500
        }, function (err, res, body) {
            var tmp = [];
            try {
                if (body) {
                    tmp = JSON.parse(body).msg.map(parseCard);
                } else {
                    throw 'Body is undefined';
                }
            } catch (e) {
                console.log("\n======ERROR======");
                console.log(e, body);
                console.log("======ERROR======\n");
            }
            if (err) {
                if (err.code == 'ETIMEDOUT' || err.code == 'ESOCKETTIMEDOUT') {
                    resolve(getFollwerOrFollwee(user, offset, isFollowees, socket));
                } else {
                    reject(err);
                }
            } else {
                resolve(tmp);
            }
        });
    });
}

function parseCard(text) {
    var result = {};
    var re1 = /data-id=\"(\S*)\"/g;
    var re2 = /<h2 class=\"zm-list-content-title\">.*>(.*)<\/a><\/h2>/g;
    var re3 = /href=\"(https:\/\/www\.zhihu\.com\/people\/\S*)\"/g;
    re1.exec(text);
    result.hash_id = RegExp.$1;
    re2.exec(text);
    result.name = RegExp.$1;
    re3.exec(text);
    result.url = RegExp.$1;
    return result;
}

function consoleLog(x) {
    console.log(x);
    return x;
}

module.exports = fetchFollwerOrFollwee;