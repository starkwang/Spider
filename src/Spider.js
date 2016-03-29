import fetchFollwerOrFollwee from './fetchFollwerOrFollwee';
import getUser from './getUser';
import config from '../config';
import co from 'co';
import 'babel-polyfill';
import Promise from 'bluebird';

export function Spider(userPageUrl, socket) {
    co(SpiderMain(userPageUrl, socket));
}


function* SpiderMain(userPageUrl, socket) {
    try {
        //======抓取目标用户信息======//
        var user = yield getUser(userPageUrl);
        socket.emit('notice', '抓取用户信息成功');
        socket.emit('get user', user);


        //======抓取目标用户好友列表======//
        var myFriendsTmp = yield getFriends(user, socket);


        //======好友列表完善======//
        var myFriends = yield Promise.map(myFriendsTmp,
            myFriend => getUser(myFriend.url), 
            { concurrency: config.concurrency ? config.concurrency : 3 }
        )
        socket.emit('data', myFriends.map(friend => ({
            "user": friend,
            "sameFriends": []
        })));

        //======找出相同好友======//
        var result = yield Promise.map(myFriends,
            myFriend => searchSameFriend(myFriend, myFriends, socket), 
            { concurrency: config.concurrency ? config.concurrency : 3 }
        );
        socket.emit('data', result);

    } catch (err) {
        console.log(err);
    }

}


function getFriends(user, socket) {
    if (!socket) {
        var socket = {
            emit: () => {}
        }
    }
    var works = [fetchFollwerOrFollwee({
        isFollowees: true,
        user: user
    }, socket), fetchFollwerOrFollwee({
        user: user
    }, socket)];
    return Promise.all(works).then(result => {
        var followees = result[0];
        var followers = result[1];
        var friends = [];
        followers.forEach(function(follower) {
            followees.forEach(function(followee) {
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
            emit: () => {}
        }
    }
    socket.emit("notice", "searchSameFriend with " + aFriend.name + "......");
    console.log("searchSameFriend with " + aFriend.name + "......");
    return getFriends(aFriend, socket)
        .then(targetFriends => {
            var sameFriends = [];
            console.log('counting for ' + aFriend.name + '......')
            targetFriends.forEach(targetFriend => {
                myFriends.forEach(myFriend => {
                    if (targetFriend.hash_id === myFriend.hash_id) {
                        sameFriends.push(targetFriend);
                    }
                })
            })
            console.log("\n\n==============\n Same Friends with " + aFriend.name + "\n");
            socket.emit('same friend', {
                hash_id: aFriend.hash_id,
                sameFriends: sameFriends
            })
            console.log(sameFriends);
            console.log("\n\n");

            return {
                user: aFriend,
                sameFriends: sameFriends
            };
        })
}
