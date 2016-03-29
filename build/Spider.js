'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Spider = Spider;

var _fetchFollwerOrFollwee = require('./fetchFollwerOrFollwee');

var _fetchFollwerOrFollwee2 = _interopRequireDefault(_fetchFollwerOrFollwee);

var _getUser = require('./getUser');

var _getUser2 = _interopRequireDefault(_getUser);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

require('babel-polyfill');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [SpiderMain].map(regeneratorRuntime.mark);

function Spider(userPageUrl, socket) {
    (0, _co2.default)(SpiderMain(userPageUrl, socket));
}

function SpiderMain(userPageUrl, socket) {
    var user, myFriendsTmp, myFriends, input, result;
    return regeneratorRuntime.wrap(function SpiderMain$(_context) {
        while (1) switch (_context.prev = _context.next) {
            case 0:
                _context.prev = 0;
                _context.next = 3;
                return (0, _getUser2.default)(userPageUrl);

            case 3:
                user = _context.sent;

                socket.emit('notice', '抓取用户信息成功');
                socket.emit('get user', user);

                _context.next = 8;
                return getFriends(user, socket);

            case 8:
                myFriendsTmp = _context.sent;
                _context.next = 11;
                return _bluebird2.default.map(myFriendsTmp, function (myFriend) {
                    return (0, _getUser2.default)(myFriend.url);
                }, { concurrency: _config2.default.concurrency ? _config2.default.concurrency : 3 });

            case 11:
                myFriends = _context.sent;
                input = myFriends.map(function (friend) {
                    return {
                        "user": friend,
                        "sameFriends": []
                    };
                });

                socket.emit('data', input);

                _context.next = 16;
                return _bluebird2.default.map(myFriends, function (myFriend) {
                    return searchSameFriend(myFriend, myFriends, socket);
                }, { concurrency: _config2.default.concurrency ? _config2.default.concurrency : 3 });

            case 16:
                result = _context.sent;

                socket.emit('data', result);
                _context.next = 23;
                break;

            case 20:
                _context.prev = 20;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0);

            case 23:
            case 'end':
                return _context.stop();
        }
    }, _marked[0], this, [[0, 20]]);
}

function getFriends(user, socket) {
    if (!socket) {
        var socket = {
            emit: function emit() {}
        };
    }
    var works = [(0, _fetchFollwerOrFollwee2.default)({
        isFollowees: true,
        user: user
    }, socket), (0, _fetchFollwerOrFollwee2.default)({
        user: user
    }, socket)];
    return _bluebird2.default.all(works).then(function (result) {
        var followees = result[0];
        var followers = result[1];
        var friends = [];
        followers.forEach(function (follower) {
            followees.forEach(function (followee) {
                if (follower.hash_id === followee.hash_id) {
                    friends.push(follower);
                }
            });
        });
        return friends;
    });
}

function searchSameFriend(aFriend, myFriends, socket) {
    if (!socket) {
        var socket = {
            emit: function emit() {}
        };
    }
    socket.emit("notice", "searchSameFriend with " + aFriend.name + "......");
    console.log("searchSameFriend with " + aFriend.name + "......");
    return getFriends(aFriend, socket).then(function (targetFriends) {
        var sameFriends = [];
        console.log('counting for ' + aFriend.name + '......');
        targetFriends.forEach(function (targetFriend) {
            myFriends.forEach(function (myFriend) {
                if (targetFriend.hash_id === myFriend.hash_id) {
                    sameFriends.push(targetFriend);
                }
            });
        });
        console.log("\n\n==============\n Same Friends with " + aFriend.name + "\n");
        socket.emit('same friend', {
            hash_id: aFriend.hash_id,
            sameFriends: sameFriends
        });
        console.log(sameFriends);
        console.log("\n\n");

        return {
            user: aFriend,
            sameFriends: sameFriends
        };
    });
}