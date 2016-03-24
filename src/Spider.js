"use strict"

import Promise from 'bluebird'
import tracer from 'tracer'
import fetchFollwerOrFollwee from './fetchFollwerOrFollwee'
import getUser from './getUser'
import config from '../config'

const logger = tracer.colorConsole()

const Spider = (userPageUrl, socket) => {
	const concurrency = config.concurrency ? config.concurrency : 3

	socket.emit('notice', '抓取用户信息......')

	return getUser(userPageUrl)
		.then(function (user) {
			socket.emit('notice', '抓取用户信息成功')
			socket.emit('get user', user)

			return getFriends(user, socket)
		})
		.then(function (myFriends) {
			return Promise.map(myFriends, myFriend => getUser(myFriend.url), {concurrency})
		})
		.then(function (myFriends) {
			let input = []

			myFriends.forEach(friend => {
				input.push({
					user: friend,
					sameFriends: [],
				})
			})

			socket.emit('data', input)

			// debug
			logger.log(myFriends)

			return Promise.map(myFriends, myFriend => searchSameFriend(myFriend, myFriends, socket), {concurrency})
		})
		.then(function (data) {
			socket.emit('data', data)
		})
		.catch(function (err) {
			// debug
			logger.error(err)
		})
}
const getFriends = (user, socket) => {
	const options1 = {
		isFollowees: true,
		user,
	}
	const options2 = {user}
	const works = [fetchFollwerOrFollwee(options1, socket), fetchFollwerOrFollwee(options2, socket)]

	return Promise.all(works)
		.then(function(result) {
			const [followees, followers] = result
			let friends = []

			followers.forEach(follower => {
				followees.forEach(followee => {
					if (follower.hash_id === followee.hash_id) {
						friends.push(follower)
					}
				})
			})

			return friends
		})
}
const searchSameFriend = (aFriend, myFriends, socket) => {
	socket.emit("notice", "searchSameFriend with " + aFriend.name + "......")

	// debug
	logger.log("searchSameFriend with " + aFriend.name + "......")

	return getFriends(aFriend, socket)
		.then(function(targetFriends) {
			let sameFriends = []

			// debug
			logger.log('counting for ' + aFriend.name + '......')
			logger.log("\n\n==============\n Same Friends with " + aFriend.name + "\n")

			targetFriends.forEach(targetFriend => {
				myFriends.forEach(myFriend => {
					if (targetFriend.hash_id === myFriend.hash_id) {
						sameFriends.push(targetFriend)
					}
				})
			})

			socket.emit('same friend', {
				hash_id: aFriend.hash_id,
				sameFriends: sameFriends
			})

			// debug
			logger.log(sameFriends)
			logger.log("\n\n")

			return {
				user: aFriend,
				sameFriends,
			}
		})
}

module.exports = Spider
