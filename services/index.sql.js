const videoService = require('./video.service.js')

;(async () => {
	const name = 'play'
	const videos = await videoService.query({ name })
	console.log('Vugs:', videos)
})()
