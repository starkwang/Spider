'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fetchFollwerOrFollwee;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _spider = require('../spider.config');

var _spider2 = _interopRequireDefault(_spider);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchFollwerOrFollwee(options, socket) {
    var user = options.user;
    var isFollowees = options.isFollowees;
    var grounpAmount = isFollowees ? Math.ceil(user.followeeAmount / 20) : Math.ceil(user.followerAmount / 20);
    var offsets = [];
    for (var i = 0; i < grounpAmount; i++) {
        offsets.push(i * 20);
    }
    return _bluebird2.default.map(offsets, function (offset) {
        return getFollwerOrFollwee(user, offset, isFollowees, socket);
    }, { concurrency: _spider2.default.concurrency ? _spider2.default.concurrency : 3 }).then(function (array) {
        return _lodash2.default.flatten(array);
    });
}

function getFollwerOrFollwee(user, offset, isFollowees, socket) {
    socket.emit('notice', '开始抓取 ' + user.name + ' 的第 ' + offset + '-' + (offset + 20) + ' 位' + (isFollowees ? '关注的人' : '关注者'));
    console.log('开始抓取 ' + user.name + ' 的第 ' + offset + '-' + (offset + 20) + ' 位' + (isFollowees ? '关注的人' : '关注者'));
    var params = "{\"offset\":{{counter}},\"order_by\":\"created\",\"hash_id\":\"{{hash_id}}\"}".replace(/{{counter}}/, offset).replace(/{{hash_id}}/, user.hash_id);
    return new _bluebird2.default(function (resolve, reject) {
        (0, _request2.default)({
            method: 'POST',
            url: isFollowees ? 'https://www.zhihu.com/node/ProfileFolloweesListV2' : 'https://www.zhihu.com/node/ProfileFollowersListV2',
            form: {
                method: "next",
                params: params,
                _xsrf: _spider2.default._xsrf
            },
            headers: {
                'cookie': _spider2.default.cookie,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZldGNoRm9sbHdlck9yRm9sbHdlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFLd0I7O0FBTHhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxTQUFTLHFCQUFULENBQStCLE9BQS9CLEVBQXdDLE1BQXhDLEVBQWdEO0FBQzNELFFBQUksT0FBTyxRQUFRLElBQVIsQ0FEZ0Q7QUFFM0QsUUFBSSxjQUFjLFFBQVEsV0FBUixDQUZ5QztBQUczRCxRQUFJLGVBQWUsY0FBYyxLQUFLLElBQUwsQ0FBVSxLQUFLLGNBQUwsR0FBc0IsRUFBdEIsQ0FBeEIsR0FBb0QsS0FBSyxJQUFMLENBQVUsS0FBSyxjQUFMLEdBQXNCLEVBQXRCLENBQTlELENBSHdDO0FBSTNELFFBQUksVUFBVSxFQUFWLENBSnVEO0FBSzNELFNBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFlBQUosRUFBa0IsR0FBbEMsRUFBdUM7QUFDbkMsZ0JBQVEsSUFBUixDQUFhLElBQUksRUFBSixDQUFiLENBRG1DO0tBQXZDO0FBR0EsV0FBTyxtQkFBUSxHQUFSLENBQVksT0FBWixFQUNIO2VBQVUsb0JBQW9CLElBQXBCLEVBQTBCLE1BQTFCLEVBQWtDLFdBQWxDLEVBQStDLE1BQS9DO0tBQVYsRUFDQSxFQUFFLGFBQWEsaUJBQU8sV0FBUCxHQUFxQixpQkFBTyxXQUFQLEdBQXFCLENBQTFDLEVBRlosRUFJTixJQUpNLENBSUQ7ZUFBUyxpQkFBRSxPQUFGLENBQVUsS0FBVjtLQUFULENBSk4sQ0FSMkQ7Q0FBaEQ7O0FBZWYsU0FBUyxtQkFBVCxDQUE2QixJQUE3QixFQUFtQyxNQUFuQyxFQUEyQyxXQUEzQyxFQUF3RCxNQUF4RCxFQUFnRTtBQUM1RCxXQUFPLElBQVAsQ0FBWSxRQUFaLEVBQXFCLFVBQVUsS0FBSyxJQUFMLEdBQVksTUFBdEIsR0FBK0IsTUFBL0IsR0FBd0MsR0FBeEMsSUFBK0MsU0FBUyxFQUFULENBQS9DLEdBQThELElBQTlELElBQXNFLGNBQWMsTUFBZCxHQUF1QixLQUF2QixDQUF0RSxDQUFyQixDQUQ0RDtBQUU1RCxZQUFRLEdBQVIsQ0FBWSxVQUFVLEtBQUssSUFBTCxHQUFZLE1BQXRCLEdBQStCLE1BQS9CLEdBQXdDLEdBQXhDLElBQStDLFNBQVMsRUFBVCxDQUEvQyxHQUE4RCxJQUE5RCxJQUFzRSxjQUFjLE1BQWQsR0FBdUIsS0FBdkIsQ0FBdEUsQ0FBWixDQUY0RDtBQUc1RCxRQUFJLFNBQVMsZ0ZBQWdGLE9BQWhGLENBQXdGLGFBQXhGLEVBQXVHLE1BQXZHLEVBQStHLE9BQS9HLENBQXVILGFBQXZILEVBQXNJLEtBQUssT0FBTCxDQUEvSSxDQUh3RDtBQUk1RCxXQUFPLHVCQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDcEMsK0JBQVE7QUFDSixvQkFBUSxNQUFSO0FBQ0EsaUJBQUssY0FBYyxtREFBZCxHQUFvRSxtREFBcEU7QUFDTCxrQkFBTTtBQUNGLHdCQUFRLE1BQVI7QUFDQSx3QkFBUSxNQUFSO0FBQ0EsdUJBQU8saUJBQU8sS0FBUDthQUhYO0FBS0EscUJBQVM7QUFDTCwwQkFBVSxpQkFBTyxNQUFQO0FBQ1YsZ0NBQWdCLGtEQUFoQjtBQUNBLGlDQUFpQixVQUFqQjtBQUNBLG9DQUFvQixnQkFBcEI7YUFKSjtBQU1BLHFCQUFTLElBQVQ7U0FkSixFQWVHLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxJQUFYLEVBQW9CO0FBQ25CLGdCQUFJLE1BQU0sRUFBTixDQURlO0FBRW5CLGdCQUFJO0FBQ0Esb0JBQUksSUFBSixFQUFVO0FBQ04sMEJBQU0sS0FBSyxLQUFMLENBQVcsSUFBWCxFQUFpQixHQUFqQixDQUFxQixHQUFyQixDQUF5QixTQUF6QixDQUFOLENBRE07aUJBQVYsTUFFTztBQUNILDBCQUFPLG1CQUFQLENBREc7aUJBRlA7YUFESixDQU1FLE9BQU8sQ0FBUCxFQUFVO0FBQ1Isd0JBQVEsR0FBUixDQUFZLHFCQUFaLEVBRFE7QUFFUix3QkFBUSxHQUFSLENBQVksQ0FBWixFQUFlLElBQWYsRUFGUTtBQUdSLHdCQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUhRO2FBQVY7QUFLRixnQkFBSSxHQUFKLEVBQVM7QUFDTCxvQkFBSSxJQUFJLElBQUosSUFBWSxXQUFaLElBQTJCLElBQUksSUFBSixJQUFZLGlCQUFaLEVBQStCO0FBQzFELDRCQUFRLG9CQUFvQixJQUFwQixFQUEwQixNQUExQixFQUFrQyxXQUFsQyxFQUErQyxNQUEvQyxDQUFSLEVBRDBEO2lCQUE5RCxNQUVPO0FBQ0gsMkJBQU8sR0FBUCxFQURHO2lCQUZQO2FBREosTUFNTztBQUNILHdCQUFRLEdBQVIsRUFERzthQU5QO1NBYkQsQ0FmSCxDQURvQztLQUFyQixDQUFuQixDQUo0RDtDQUFoRTs7QUE4Q0EsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3JCLFFBQUksU0FBUyxFQUFULENBRGlCO0FBRXJCLFFBQUksTUFBTSxvQkFBTixDQUZpQjtBQUdyQixRQUFJLE1BQU0seURBQU4sQ0FIaUI7QUFJckIsUUFBSSxNQUFNLG9EQUFOLENBSmlCO0FBS3JCLFFBQUksSUFBSixDQUFTLElBQVQsRUFMcUI7QUFNckIsV0FBTyxPQUFQLEdBQWlCLE9BQU8sRUFBUCxDQU5JO0FBT3JCLFFBQUksSUFBSixDQUFTLElBQVQsRUFQcUI7QUFRckIsV0FBTyxJQUFQLEdBQWMsT0FBTyxFQUFQLENBUk87QUFTckIsUUFBSSxJQUFKLENBQVMsSUFBVCxFQVRxQjtBQVVyQixXQUFPLEdBQVAsR0FBYSxPQUFPLEVBQVAsQ0FWUTtBQVdyQixXQUFPLE1BQVAsQ0FYcUI7Q0FBekI7O0FBY0EsU0FBUyxVQUFULENBQW9CLENBQXBCLEVBQXVCO0FBQ25CLFlBQVEsR0FBUixDQUFZLENBQVosRUFEbUI7QUFFbkIsV0FBTyxDQUFQLENBRm1CO0NBQXZCIiwiZmlsZSI6ImZldGNoRm9sbHdlck9yRm9sbHdlZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9zcGlkZXIuY29uZmlnJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoRm9sbHdlck9yRm9sbHdlZShvcHRpb25zLCBzb2NrZXQpIHtcbiAgICB2YXIgdXNlciA9IG9wdGlvbnMudXNlcjtcbiAgICB2YXIgaXNGb2xsb3dlZXMgPSBvcHRpb25zLmlzRm9sbG93ZWVzO1xuICAgIHZhciBncm91bnBBbW91bnQgPSBpc0ZvbGxvd2VlcyA/IE1hdGguY2VpbCh1c2VyLmZvbGxvd2VlQW1vdW50IC8gMjApIDogTWF0aC5jZWlsKHVzZXIuZm9sbG93ZXJBbW91bnQgLyAyMCk7XG4gICAgdmFyIG9mZnNldHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VucEFtb3VudDsgaSsrKSB7XG4gICAgICAgIG9mZnNldHMucHVzaChpICogMjApO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5tYXAob2Zmc2V0cyxcbiAgICAgICAgb2Zmc2V0ID0+IGdldEZvbGx3ZXJPckZvbGx3ZWUodXNlciwgb2Zmc2V0LCBpc0ZvbGxvd2Vlcywgc29ja2V0KSxcbiAgICAgICAgeyBjb25jdXJyZW5jeTogY29uZmlnLmNvbmN1cnJlbmN5ID8gY29uZmlnLmNvbmN1cnJlbmN5IDogMyB9XG4gICAgKVxuICAgIC50aGVuKGFycmF5ID0+IF8uZmxhdHRlbihhcnJheSkpXG59XG5cbmZ1bmN0aW9uIGdldEZvbGx3ZXJPckZvbGx3ZWUodXNlciwgb2Zmc2V0LCBpc0ZvbGxvd2Vlcywgc29ja2V0KSB7XG4gICAgc29ja2V0LmVtaXQoJ25vdGljZScsJ+W8gOWni+aKk+WPliAnICsgdXNlci5uYW1lICsgJyDnmoTnrKwgJyArIG9mZnNldCArICctJyArIChvZmZzZXQgKyAyMCkgKyAnIOS9jScgKyAoaXNGb2xsb3dlZXMgPyAn5YWz5rOo55qE5Lq6JyA6ICflhbPms6jogIUnKSk7XG4gICAgY29uc29sZS5sb2coJ+W8gOWni+aKk+WPliAnICsgdXNlci5uYW1lICsgJyDnmoTnrKwgJyArIG9mZnNldCArICctJyArIChvZmZzZXQgKyAyMCkgKyAnIOS9jScgKyAoaXNGb2xsb3dlZXMgPyAn5YWz5rOo55qE5Lq6JyA6ICflhbPms6jogIUnKSk7XG4gICAgdmFyIHBhcmFtcyA9IFwie1xcXCJvZmZzZXRcXFwiOnt7Y291bnRlcn19LFxcXCJvcmRlcl9ieVxcXCI6XFxcImNyZWF0ZWRcXFwiLFxcXCJoYXNoX2lkXFxcIjpcXFwie3toYXNoX2lkfX1cXFwifVwiLnJlcGxhY2UoL3t7Y291bnRlcn19Lywgb2Zmc2V0KS5yZXBsYWNlKC97e2hhc2hfaWR9fS8sIHVzZXIuaGFzaF9pZCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVxdWVzdCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogaXNGb2xsb3dlZXMgPyAnaHR0cHM6Ly93d3cuemhpaHUuY29tL25vZGUvUHJvZmlsZUZvbGxvd2Vlc0xpc3RWMicgOiAnaHR0cHM6Ly93d3cuemhpaHUuY29tL25vZGUvUHJvZmlsZUZvbGxvd2Vyc0xpc3RWMicsXG4gICAgICAgICAgICBmb3JtOiB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIm5leHRcIixcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICBfeHNyZjogY29uZmlnLl94c3JmXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdjb29raWUnOiBjb25maWcuY29va2llLFxuICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JyxcbiAgICAgICAgICAgICAgICAnY2FjaGUtY29udHJvbCc6ICduby1jYWNoZScsXG4gICAgICAgICAgICAgICAgJ3gtcmVxdWVzdGVkLXdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGltZW91dDogMTUwMFxuICAgICAgICB9LCAoZXJyLCByZXMsIGJvZHkpID0+IHtcbiAgICAgICAgICAgIHZhciB0bXAgPSBbXTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wID0gSlNPTi5wYXJzZShib2R5KS5tc2cubWFwKHBhcnNlQ2FyZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgKCdCb2R5IGlzIHVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcbj09PT09PUVSUk9SPT09PT09XCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUsIGJvZHkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09RVJST1I9PT09PT1cXG5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09ICdFVElNRURPVVQnIHx8IGVyci5jb2RlID09ICdFU09DS0VUVElNRURPVVQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZ2V0Rm9sbHdlck9yRm9sbHdlZSh1c2VyLCBvZmZzZXQsIGlzRm9sbG93ZWVzLCBzb2NrZXQpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0bXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlQ2FyZCh0ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciByZTEgPSAvZGF0YS1pZD1cXFwiKFxcUyopXFxcIi9nO1xuICAgIHZhciByZTIgPSAvPGgyIGNsYXNzPVxcXCJ6bS1saXN0LWNvbnRlbnQtdGl0bGVcXFwiPi4qPiguKik8XFwvYT48XFwvaDI+L2dcbiAgICB2YXIgcmUzID0gL2hyZWY9XFxcIihodHRwczpcXC9cXC93d3dcXC56aGlodVxcLmNvbVxcL3Blb3BsZVxcL1xcUyopXFxcIi9nO1xuICAgIHJlMS5leGVjKHRleHQpO1xuICAgIHJlc3VsdC5oYXNoX2lkID0gUmVnRXhwLiQxO1xuICAgIHJlMi5leGVjKHRleHQpO1xuICAgIHJlc3VsdC5uYW1lID0gUmVnRXhwLiQxO1xuICAgIHJlMy5leGVjKHRleHQpO1xuICAgIHJlc3VsdC51cmwgPSBSZWdFeHAuJDE7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY29uc29sZUxvZyh4KSB7XG4gICAgY29uc29sZS5sb2coeCk7XG4gICAgcmV0dXJuIHg7XG59XG4iXX0=
//# sourceMappingURL=fetchFollwerOrFollwee.js.map
