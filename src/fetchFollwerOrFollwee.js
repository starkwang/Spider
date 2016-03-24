"use strict"

import request from 'request'
import Promise from 'bluebird'
import tracer from 'tracer'
import config from '../config'

const logger = tracer.colorConsole()

const parseCard = text => {
	const re1 = /data-id=\"(\S*)\"/g
	const re2 = /<h2 class=\"zm-list-content-title\">.*>(.*)<\/a><\/h2>/g
	const re3 = /href=\"(https:\/\/www\.zhihu\.com\/people\/\S*)\"/g
	let result = {}

	re1.exec(text)
	result.hash_id = RegExp.$1

	re2.exec(text)
	result.name = RegExp.$1

	re3.exec(text)
	result.url = RegExp.$1

	return result
}
const fetchFollwerOrFollwee = (options, socket) => {
  let user = options.user
  let isFollowees = options.isFollowees
  let grounpAmount = isFollowees ? Math.ceil(user.followeeAmount / 20) : Math.ceil(user.followerAmount / 20)
  let offsets = []
	let concurrency = config.concurrency ? config.concurrency : 3

  for (let i = 0; i < grounpAmount; i++) {
	  offsets.push(i * 20);
  }

  return Promise.map(offsets, offset => getFollwerOrFollwee(user, offset, isFollowees, socket), {concurrency})
	  .then(function(array) {
      let result = []

		  array.forEach(item => {
			  result = result.concat(item)
		  })

	    return result
		})
}
const getFollwerOrFollwee = (user, offset, isFollowees, socket) => {
	const params = "{\"offset\":{{counter}},\"order_by\":\"created\",\"hash_id\":\"{{hash_id}}\"}".replace(/{{counter}}/, offset).replace(/{{hash_id}}/, user.hash_id)
	const options = {
		method: 'POST',
		url: isFollowees ? 'https://www.zhihu.com/node/ProfileFolloweesListV2' : 'https://www.zhihu.com/node/ProfileFollowersListV2',
		form: {
			method: "next",
			params: params,
			_xsrf: config._xsrf,
		},
		headers: {
			'cookie': config.cookie,
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'cache-control': 'no-cache',
			'x-requested-with': 'XMLHttpRequest',
		},
		timeout: 1500,
	}

	socket.emit('notice','开始抓取 ' + user.name + ' 的第 ' + offset + '-' + (offset + 20) + ' 位' + (isFollowees ? '关注的人' : '关注者'))

	// debug
	logger.log('开始抓取 ' + user.name + ' 的第 ' + offset + '-' + (offset + 20) + ' 位' + (isFollowees ? '关注的人' : '关注者'))

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			let tmp = []

			if (body) {
				tmp = JSON.parse(body).msg.map(parseCard)
			}

			if (err) {
				if (err.code == 'ETIMEDOUT' || err.code == 'ESOCKETTIMEDOUT') {
					resolve(getFollwerOrFollwee(user, offset, isFollowees, socket))
				} else {
					reject(err)
				}
			} else {
				resolve(tmp)
			}
		})
	})
}

module.exports = fetchFollwerOrFollwee
