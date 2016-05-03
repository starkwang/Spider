'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Spider = Spider;

var _fetchFollwerOrFollwee = require('./fetchFollwerOrFollwee');

var _fetchFollwerOrFollwee2 = _interopRequireDefault(_fetchFollwerOrFollwee);

var _getUser = require('./getUser');

var _getUser2 = _interopRequireDefault(_getUser);

var _spider = require('../spider.config');

var _spider2 = _interopRequireDefault(_spider);

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
    var user, myFriendsTmp, myFriends, result;
    return regeneratorRuntime.wrap(function SpiderMain$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return (0, _getUser2.default)(userPageUrl);

                case 3:
                    user = _context.sent;

                    socket.emit('notice', '抓取用户信息成功');
                    socket.emit('get user', user);

                    //======抓取目标用户好友列表======//
                    _context.next = 8;
                    return getFriends(user, socket);

                case 8:
                    myFriendsTmp = _context.sent;
                    _context.next = 11;
                    return _bluebird2.default.map(myFriendsTmp, function (myFriend) {
                        return (0, _getUser2.default)(myFriend.url);
                    }, { concurrency: _spider2.default.concurrency ? _spider2.default.concurrency : 3 });

                case 11:
                    myFriends = _context.sent;

                    socket.emit('data', myFriends.map(function (friend) {
                        return {
                            "user": friend,
                            "sameFriends": []
                        };
                    }));

                    //======找出相同好友======//
                    _context.next = 15;
                    return _bluebird2.default.map(myFriends, function (myFriend) {
                        return searchSameFriend(myFriend, myFriends, socket);
                    }, { concurrency: _spider2.default.concurrency ? _spider2.default.concurrency : 3 });

                case 15:
                    result = _context.sent;

                    socket.emit('data', result);

                    _context.next = 22;
                    break;

                case 19:
                    _context.prev = 19;
                    _context.t0 = _context['catch'](0);

                    console.log(_context.t0);

                case 22:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this, [[0, 19]]);
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
//# sourceMappingURL=data:application/json;base64,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LEdBQWUsUUFBMUMsQ0FBWixDQVBrRDtBQVFsRCxXQUFPLFdBQVcsT0FBWCxFQUFvQixNQUFwQixFQUNGLElBREUsQ0FDRyx5QkFBaUI7QUFDbkIsWUFBSSxjQUFjLEVBQWQsQ0FEZTtBQUVuQixnQkFBUSxHQUFSLENBQVksa0JBQWtCLFFBQVEsSUFBUixHQUFlLFFBQWpDLENBQVosQ0FGbUI7QUFHbkIsc0JBQWMsT0FBZCxDQUFzQix3QkFBZ0I7QUFDbEMsc0JBQVUsT0FBVixDQUFrQixvQkFBWTtBQUMxQixvQkFBSSxhQUFhLE9BQWIsS0FBeUIsU0FBUyxPQUFULEVBQWtCO0FBQzNDLGdDQUFZLElBQVosQ0FBaUIsWUFBakIsRUFEMkM7aUJBQS9DO2FBRGMsQ0FBbEIsQ0FEa0M7U0FBaEIsQ0FBdEIsQ0FIbUI7QUFVbkIsZ0JBQVEsR0FBUixDQUFZLDRDQUE0QyxRQUFRLElBQVIsR0FBZSxJQUEzRCxDQUFaLENBVm1CO0FBV25CLGVBQU8sSUFBUCxDQUFZLGFBQVosRUFBMkI7QUFDdkIscUJBQVMsUUFBUSxPQUFSO0FBQ1QseUJBQWEsV0FBYjtTQUZKLEVBWG1CO0FBZW5CLGdCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBZm1CO0FBZ0JuQixnQkFBUSxHQUFSLENBQVksTUFBWixFQWhCbUI7O0FBa0JuQixlQUFPO0FBQ0gsa0JBQU0sT0FBTjtBQUNBLHlCQUFhLFdBQWI7U0FGSixDQWxCbUI7S0FBakIsQ0FEVixDQVJrRDtDQUF0RCIsImZpbGUiOiJTcGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmV0Y2hGb2xsd2VyT3JGb2xsd2VlIGZyb20gJy4vZmV0Y2hGb2xsd2VyT3JGb2xsd2VlJztcbmltcG9ydCBnZXRVc2VyIGZyb20gJy4vZ2V0VXNlcic7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL3NwaWRlci5jb25maWcnO1xuaW1wb3J0IGNvIGZyb20gJ2NvJztcbmltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gU3BpZGVyKHVzZXJQYWdlVXJsLCBzb2NrZXQpIHtcbiAgICBjbyhTcGlkZXJNYWluKHVzZXJQYWdlVXJsLCBzb2NrZXQpKTtcbn1cblxuXG5mdW5jdGlvbiogU3BpZGVyTWFpbih1c2VyUGFnZVVybCwgc29ja2V0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgLy89PT09PT3mipPlj5bnm67moIfnlKjmiLfkv6Hmga89PT09PT0vL1xuICAgICAgICB2YXIgdXNlciA9IHlpZWxkIGdldFVzZXIodXNlclBhZ2VVcmwpO1xuICAgICAgICBzb2NrZXQuZW1pdCgnbm90aWNlJywgJ+aKk+WPlueUqOaIt+S/oeaBr+aIkOWKnycpO1xuICAgICAgICBzb2NrZXQuZW1pdCgnZ2V0IHVzZXInLCB1c2VyKTtcblxuXG4gICAgICAgIC8vPT09PT095oqT5Y+W55uu5qCH55So5oi35aW95Y+L5YiX6KGoPT09PT09Ly9cbiAgICAgICAgdmFyIG15RnJpZW5kc1RtcCA9IHlpZWxkIGdldEZyaWVuZHModXNlciwgc29ja2V0KTtcblxuXG4gICAgICAgIC8vPT09PT095aW95Y+L5YiX6KGo5a6M5ZaEPT09PT09Ly9cbiAgICAgICAgdmFyIG15RnJpZW5kcyA9IHlpZWxkIFByb21pc2UubWFwKG15RnJpZW5kc1RtcCxcbiAgICAgICAgICAgIG15RnJpZW5kID0+IGdldFVzZXIobXlGcmllbmQudXJsKSxcbiAgICAgICAgICAgIHsgY29uY3VycmVuY3k6IGNvbmZpZy5jb25jdXJyZW5jeSA/IGNvbmZpZy5jb25jdXJyZW5jeSA6IDMgfVxuICAgICAgICApXG4gICAgICAgIHNvY2tldC5lbWl0KCdkYXRhJywgbXlGcmllbmRzLm1hcChmcmllbmQgPT4gKHtcbiAgICAgICAgICAgIFwidXNlclwiOiBmcmllbmQsXG4gICAgICAgICAgICBcInNhbWVGcmllbmRzXCI6IFtdXG4gICAgICAgIH0pKSk7XG5cbiAgICAgICAgLy89PT09PT3mib7lh7rnm7jlkIzlpb3lj4s9PT09PT0vL1xuICAgICAgICB2YXIgcmVzdWx0ID0geWllbGQgUHJvbWlzZS5tYXAobXlGcmllbmRzLFxuICAgICAgICAgICAgbXlGcmllbmQgPT4gc2VhcmNoU2FtZUZyaWVuZChteUZyaWVuZCwgbXlGcmllbmRzLCBzb2NrZXQpLFxuICAgICAgICAgICAgeyBjb25jdXJyZW5jeTogY29uZmlnLmNvbmN1cnJlbmN5ID8gY29uZmlnLmNvbmN1cnJlbmN5IDogMyB9XG4gICAgICAgICk7XG4gICAgICAgIHNvY2tldC5lbWl0KCdkYXRhJywgcmVzdWx0KTtcblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH1cblxufVxuXG5cbmZ1bmN0aW9uIGdldEZyaWVuZHModXNlciwgc29ja2V0KSB7XG4gICAgaWYgKCFzb2NrZXQpIHtcbiAgICAgICAgdmFyIHNvY2tldCA9IHtcbiAgICAgICAgICAgIGVtaXQ6ICgpID0+IHt9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHdvcmtzID0gW2ZldGNoRm9sbHdlck9yRm9sbHdlZSh7XG4gICAgICAgIGlzRm9sbG93ZWVzOiB0cnVlLFxuICAgICAgICB1c2VyOiB1c2VyXG4gICAgfSwgc29ja2V0KSwgZmV0Y2hGb2xsd2VyT3JGb2xsd2VlKHtcbiAgICAgICAgdXNlcjogdXNlclxuICAgIH0sIHNvY2tldCldO1xuICAgIHJldHVybiBQcm9taXNlLmFsbCh3b3JrcykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICB2YXIgZm9sbG93ZWVzID0gcmVzdWx0WzBdO1xuICAgICAgICB2YXIgZm9sbG93ZXJzID0gcmVzdWx0WzFdO1xuICAgICAgICB2YXIgZnJpZW5kcyA9IFtdO1xuICAgICAgICBmb2xsb3dlcnMuZm9yRWFjaChmdW5jdGlvbihmb2xsb3dlcikge1xuICAgICAgICAgICAgZm9sbG93ZWVzLmZvckVhY2goZnVuY3Rpb24oZm9sbG93ZWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9sbG93ZXIuaGFzaF9pZCA9PT0gZm9sbG93ZWUuaGFzaF9pZCkge1xuICAgICAgICAgICAgICAgICAgICBmcmllbmRzLnB1c2goZm9sbG93ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZyaWVuZHM7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaFNhbWVGcmllbmQoYUZyaWVuZCwgbXlGcmllbmRzLCBzb2NrZXQpIHtcbiAgICBpZiAoIXNvY2tldCkge1xuICAgICAgICB2YXIgc29ja2V0ID0ge1xuICAgICAgICAgICAgZW1pdDogKCkgPT4ge31cbiAgICAgICAgfVxuICAgIH1cbiAgICBzb2NrZXQuZW1pdChcIm5vdGljZVwiLCBcInNlYXJjaFNhbWVGcmllbmQgd2l0aCBcIiArIGFGcmllbmQubmFtZSArIFwiLi4uLi4uXCIpO1xuICAgIGNvbnNvbGUubG9nKFwic2VhcmNoU2FtZUZyaWVuZCB3aXRoIFwiICsgYUZyaWVuZC5uYW1lICsgXCIuLi4uLi5cIik7XG4gICAgcmV0dXJuIGdldEZyaWVuZHMoYUZyaWVuZCwgc29ja2V0KVxuICAgICAgICAudGhlbih0YXJnZXRGcmllbmRzID0+IHtcbiAgICAgICAgICAgIHZhciBzYW1lRnJpZW5kcyA9IFtdO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvdW50aW5nIGZvciAnICsgYUZyaWVuZC5uYW1lICsgJy4uLi4uLicpXG4gICAgICAgICAgICB0YXJnZXRGcmllbmRzLmZvckVhY2godGFyZ2V0RnJpZW5kID0+IHtcbiAgICAgICAgICAgICAgICBteUZyaWVuZHMuZm9yRWFjaChteUZyaWVuZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRGcmllbmQuaGFzaF9pZCA9PT0gbXlGcmllbmQuaGFzaF9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FtZUZyaWVuZHMucHVzaCh0YXJnZXRGcmllbmQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblxcbj09PT09PT09PT09PT09XFxuIFNhbWUgRnJpZW5kcyB3aXRoIFwiICsgYUZyaWVuZC5uYW1lICsgXCJcXG5cIik7XG4gICAgICAgICAgICBzb2NrZXQuZW1pdCgnc2FtZSBmcmllbmQnLCB7XG4gICAgICAgICAgICAgICAgaGFzaF9pZDogYUZyaWVuZC5oYXNoX2lkLFxuICAgICAgICAgICAgICAgIHNhbWVGcmllbmRzOiBzYW1lRnJpZW5kc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNhbWVGcmllbmRzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZXI6IGFGcmllbmQsXG4gICAgICAgICAgICAgICAgc2FtZUZyaWVuZHM6IHNhbWVGcmllbmRzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KVxufVxuIl19
//# sourceMappingURL=Spider.js.map
