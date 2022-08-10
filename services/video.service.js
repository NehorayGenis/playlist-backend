const fs = require('fs')
const videos = require('../data/videos.json')

const PAGE_SIZE = 6

module.exports = {
	query,
	getById,
	remove,
	save
}

function query(filterBy) {
	const regex = new RegExp(filterBy.bySeverity, 'i')
	let filteredVideos = videos.filter(video => regex.test(video.severity))

	// const startIdx = filterBy.pageIdx * PAGE_SIZE
	// filteredVideos = filteredVideos.slice(startIdx, startIdx + PAGE_SIZE)
	console.log(filteredVideos)
	return Promise.resolve(filteredVideos)
}

function getById(videoId) {
	const video = videos.find(video => video._id === videoId)
	return Promise.resolve(video)
}

function remove(videoId, loggedInUser) {
	const idx = videos.findIndex(video => video._id === videoId)
	if (loggedInUser._id !== videos[idx].creator._id && !loggedInUser.isAdmin) {
		console.log(loggedInUser, videos[idx].creator)
		return Promise.reject()
	}
	videos.splice(idx, 1)
	return _saveVideosToFile()
}

function save(video, loggedinUser) {
	if (video._id) {
		const idx = videos.findIndex(currVideo => currVideo._id === video._id)
		if (idx === -1) return Promise.reject('No such car')

		if (videos[idx].creator._id !== loggedinUser._id) {
			return Promise.reject('Not your car')
		}
		videos[idx] = video
	} else {
		video._id = _makeId()
		video.createdAt = Date.now()
		videos.push(video)
	}
	return _saveVideosToFile().then(() => video)
}

function _makeId(length = 5) {
	var txt = ''
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

function _saveVideosToFile() {
	return new Promise((resolve, reject) => {
		const content = JSON.stringify(videos, null, 2)
		fs.writeFile('../data/videos.json', content, err => {
			if (err) {
				console.error(err)
				return reject(err)
			}
			resolve()
		})
	})
}
