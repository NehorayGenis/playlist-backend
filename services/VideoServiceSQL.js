const DBService = require('./DBServiceSQL')

async function query(criteria = {}) {
	console.log('querying')
	var namePart = criteria.name || ''
	var query = `SELECT * FROM video  WHERE video.title LIKE '%${namePart}%'`
	const videos = await DBService.runSQL(query)
	return videos
}

async function getById(videoId) {
	var query = `SELECT * FROM video WHERE video._id = ${videoId}`

	var videos = await DBService.runSQL(query)
	if (videos.length === 1) return videos[0]
	throw new Error(`video id ${videoId} not found`)
}

async function add(video) {
	console.log('adding')
	var sqlCmd = `INSERT INTO video (title, url, thumbnail,isSaved) 
                VALUES ("${video.title}",
                        "${video.url}",
                        "${video.thumbnail}",
                        "${video.isSaved}")`
	console.log(sqlCmd)
	const newVideo = await DBService.runSQL(sqlCmd)
	console.log('newVideo', newVideo)
	const currVideo = await getById(newVideo.insertId)
	console.log('currVideo', currVideo)

	return currVideo
}

function save(video) {
	if (video._id) {
		return update(video)
	} else {
		return add(video)
	}
}

async function update(video) {
	var query = `UPDATE video set title = "${video.title}",
                                url = "${video.url}",
                                thumbnail = ${video.thumbnail}
                WHERE video._id = ${video._id}`

	var okPacket = await DBService.runSQL(query)
	console.log(okPacket)
	if (okPacket.affectedRows !== 0) return okPacket
	throw new Error(`No video updated - video id ${video._id}`)
}

function remove(videoId, userId) {
	var query = `DELETE FROM video WHERE video._id = ${videoId}`
	// var query = `DELETE FROM video WHERE video._id = ${videoId} && creator_id = ${userId}`
	console.log('videoId', videoId)
	return DBService.runSQL(query).then(okPacket =>
		okPacket.affectedRows === 1
			? okPacket
			: Promise.reject(new Error(`No video deleted - video id ${videoId}`))
	)
}

module.exports = {
	query,
	getById,
	add,
	update,
	remove,
	save
}
