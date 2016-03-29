import request from 'request';
import Promise from 'bluebird';
import config from '../config';

export default function getUser(userPageUrl) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: userPageUrl,
            headers: {
                'cookie': config.cookie
            }
        }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(parse(body));
            }
        })
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
    var reg4 = /<title> (.*) - 知乎<\/title>/g
    reg4.exec(html);
    user.name = RegExp.$1;
    return user;
}
