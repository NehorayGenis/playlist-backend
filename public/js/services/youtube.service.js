const YT_KEY = 'AIzaSyDzMdhRiZBcJjtHKDwz9QZX4uhE7OsF0mA'
async function getVideos(value) {
	const {
		data: { items }
	} = await axios.get(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${value}`
	)
	const videos = items.map(
		({
			id: { videoId: url },
			snippet: {
				thumbnails: {
					default: { url: thumbnail }
				},
				title
			}
		}) => {
			return { url, thumbnail, title }
		}
	)
	return videos
}

export default {
	getVideos
}
