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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldFVzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCOztBQUp4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLFNBQVMsT0FBVCxDQUFpQixXQUFqQixFQUE4QjtBQUN6QyxXQUFPLHVCQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDcEMsK0JBQVE7QUFDSixvQkFBUSxLQUFSO0FBQ0EsaUJBQUssV0FBTDtBQUNBLHFCQUFTO0FBQ0wsMEJBQVUsaUJBQU8sTUFBUDthQURkO1NBSEosRUFNRyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsSUFBWCxFQUFvQjtBQUNuQixnQkFBSSxHQUFKLEVBQVM7QUFDTCx1QkFBTyxHQUFQLEVBREs7YUFBVCxNQUVPO0FBQ0gsd0JBQVEsTUFBTSxJQUFOLENBQVIsRUFERzthQUZQO1NBREQsQ0FOSCxDQURvQztLQUFyQixDQUFuQixDQUR5QztDQUE5Qjs7QUFrQmYsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUNqQixRQUFJLE9BQU8sRUFBUCxDQURhOztBQUdqQixRQUFJLE9BQU8seURBQVAsQ0FIYTtBQUlqQixTQUFLLElBQUwsQ0FBVSxJQUFWLEVBSmlCO0FBS2pCLFNBQUssT0FBTCxHQUFlLE9BQU8sRUFBUCxDQUxFOztBQU9qQixRQUFJLE9BQU8sb0NBQVAsQ0FQYTtBQVFqQixTQUFLLElBQUwsQ0FBVSxJQUFWLEVBUmlCO0FBU2pCLFNBQUssY0FBTCxHQUFzQixTQUFTLE9BQU8sRUFBUCxDQUEvQixDQVRpQjs7QUFXakIsUUFBSSxPQUFPLG9DQUFQLENBWGE7QUFZakIsU0FBSyxJQUFMLENBQVUsSUFBVixFQVppQjtBQWFqQixTQUFLLGNBQUwsR0FBc0IsU0FBUyxPQUFPLEVBQVAsQ0FBL0I7OztBQWJpQixRQWdCYixPQUFPLDZCQUFQLENBaEJhO0FBaUJqQixTQUFLLElBQUwsQ0FBVSxJQUFWLEVBakJpQjtBQWtCakIsU0FBSyxJQUFMLEdBQVksT0FBTyxFQUFQLENBbEJLO0FBbUJqQixXQUFPLElBQVAsQ0FuQmlCO0NBQXJCIiwiZmlsZSI6ImdldFVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vc3BpZGVyLmNvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVzZXIodXNlclBhZ2VVcmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICByZXF1ZXN0KHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHVzZXJQYWdlVXJsLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdjb29raWUnOiBjb25maWcuY29va2llXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIChlcnIsIHJlcywgYm9keSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHBhcnNlKGJvZHkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2UoaHRtbCkge1xuICAgIHZhciB1c2VyID0ge307XG5cbiAgICB2YXIgcmVnMSA9IC9kYXRhLW5hbWU9XFxcImN1cnJlbnRfcGVvcGxlXFxcIj5cXFsuKlxcXCIoXFxTKilcXFwiXFxdPFxcL3NjcmlwdD4vZztcbiAgICByZWcxLmV4ZWMoaHRtbCk7XG4gICAgdXNlci5oYXNoX2lkID0gUmVnRXhwLiQxO1xuXG4gICAgdmFyIHJlZzIgPSAv5YWz5rOo5LqGPFxcL3NwYW4+PGJyIFxcLz5cXG48c3Ryb25nPihcXGQqKS9nO1xuICAgIHJlZzIuZXhlYyhodG1sKTtcbiAgICB1c2VyLmZvbGxvd2VlQW1vdW50ID0gcGFyc2VJbnQoUmVnRXhwLiQxKTtcblxuICAgIHZhciByZWczID0gL+WFs+azqOiAhTxcXC9zcGFuPjxiciBcXC8+XFxuPHN0cm9uZz4oXFxkKikvZztcbiAgICByZWczLmV4ZWMoaHRtbCk7XG4gICAgdXNlci5mb2xsb3dlckFtb3VudCA9IHBhcnNlSW50KFJlZ0V4cC4kMSk7XG5cbiAgICAvL3ZhciByZWc0ID0gLzxhIGNsYXNzPVxcXCJuYW1lXFxcIiBocmVmPVxcXCJcXC9wZW9wbGVcXC8uKlxcXCI+KC4qKTxcXC9hPi9nO1xuICAgIHZhciByZWc0ID0gLzx0aXRsZT4gKC4qKSAtIOefpeS5jjxcXC90aXRsZT4vZ1xuICAgIHJlZzQuZXhlYyhodG1sKTtcbiAgICB1c2VyLm5hbWUgPSBSZWdFeHAuJDE7XG4gICAgcmV0dXJuIHVzZXI7XG59XG4iXX0=
//# sourceMappingURL=getUser.js.map
