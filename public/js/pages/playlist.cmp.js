import youtubeService from '../services/youtube.service.js'
import { videoService } from '../services/video-service.js'
// import searchBar from '../cmps/search-bar.cmp.js'

export default {
	template: `
        <!-- <searchBar /> -->
        <div v-if="videos" class="playlist-container">
            <div class="video">
                <!-- <pre>{{ currVid }}</pre> -->
                <h2>{{ currVid.title }}</h2>
                <iframe width="560" height="315" :src="getUrl()" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
            <div class="playlist">
                <span @click="setCurrVid(video)" v-for="video in videos" :key="video._id" class="vid-preview">
                    <p> {{ video.title }}</p>
                    <img :src="video.thumbnail" alt="thumbnail">
                </span>
            </div>
        </div>
    `,
	data() {
		return {
			currVid: null,
			videos: null
		}
	},
	async created() {
		this.videos = await videoService.query()
		// this.videos = null
		if (!this.videos) {
			this.videos = await youtubeService.getVideos('java script')
		}
		youtubeService.getVideos('java script')
		this.currVid = this.videos[0]
		// this.videos.shift()
	},
	methods: {
		getUrl() {
			return 'https://www.youtube.com/embed/' + this.currVid.url
		},
		setCurrVid(vid) {
			this.currVid = vid
		}
	},
	components: {
		// searchBar
	}
}
