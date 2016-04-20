'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getUser;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _spider = require('../spider.config');

var _spider2 = _interopRequireDefault(_spider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUser(userPageUrl) {
    return new _bluebird2.default(function (resolve, reject) {
        (0, _request2.default)({
            method: 'GET',
            url: userPageUrl,
            headers: {
                'cookie': _spider2.default.cookie
            }
        }, function (err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(parse(body));
            }
        });
    });
}

function parse(html) {
    var user = {};

    var reg1 = /data-name=\"current_people\">\[.*\"(\S*)\"\]<\/script>/g;
    reg1.exec(html);
    user.hash_id = RegExp.$1;

    var reg2 = /关注了<\/span><br \/>\n<strong>(\d*)/g;
    reg2.exec(html);
    user.followeeAmount = parseInt(RegExp.$1);

    var reg3 = /关注者<\/span><br \/>\n<strong>(\d*)/g;
    reg3.exec(html);
    user.followerAmount = parseInt(RegExp.$1);

    //var reg4 = /<a class=\"name\" href=\"\/people\/.*\">(.*)<\/a>/g;
    var reg4 = /<title> (.*) - 知乎<\/title>/g;
    reg4.exec(html);
    user.name = RegExp.$1;
    return user;
}