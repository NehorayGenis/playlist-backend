const YT_KEY = 'AIzaSyBVbvO_wzAq3b0_5PM1ViTAjL01I-eg_Dg'
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
