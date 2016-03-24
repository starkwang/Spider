"use strict"

import request from 'request'
import Promise from 'bluebird'
import tracer from 'tracer'
import config from '../config'

const logger = tracer.colorConsole()

const parse = html => {
	const reg1 = /data-name=\"current_people\">\[.*\"(\S*)\"\]<\/script>/g
	const reg2 = /关注了<\/span><br \/>\n<strong>(\d*)/g
	const reg3 = /关注者<\/span><br \/>\n<strong>(\d*)/g
	const reg4 = /<title> (.*) - 知乎<\/title>/g
	//var reg4 = /<a class=\"name\" href=\"\/people\/.*\">(.*)<\/a>/g;
	let user = {}

	reg1.exec(html)
	user.hash_id = RegExp.$1

	reg2.exec(html)
	user.followeeAmount = parseInt(RegExp.$1)

	reg3.exec(html)
	user.followerAmount = parseInt(RegExp.$1)

	reg4.exec(html)
	user.name = RegExp.$1

	return user
}
const getUser = userPageUrl => {
	return new Promise((resolve, reject) => {
		const options = {
			method: 'GET',
			url: userPageUrl,
			headers: {
				cookie: config.cookie
			},
		}

		request(options, (err, res, body) => {
			if (err) {
				reject(err)
			} else {
				resolve(parse(body))
			}
		})
	})
}

module.exports = getUser
