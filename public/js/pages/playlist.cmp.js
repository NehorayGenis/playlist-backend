import youtubeService from '../services/youtube.service.js'
import { videoService } from '../services/video-service.js'
// import searchBar from '../cmps/search-bar.cmp.js'

export default {
	template: `
        <!-- <searchBar /> -->
        <div v-if="videos?.length" class="playlist-container">
            <div class="video">
                <!-- <pre>{{ currVid }}</pre> -->
                <h2>{{ currVid.title }}</h2>
                <iframe width="560" height="315" :src="getUrl()" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
            <div class="playlist">
                <span @click.self="setCurrVid(video)" v-for="video in videos" :key="video._id" class="vid-preview">
                    <p> {{ video.title }}</p>
                    <img :src="video.thumbnail" alt="thumbnail">
					<button @click.prevent="onRemoveVid(video)">Remove</button>
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
		this.currVid = this.videos[0]
		// this.videos.shift()
	},
	methods: {
		getUrl() {
			return 'https://www.youtube.com/embed/' + this.currVid.url
		},
		setCurrVid(vid) {
			// console.log(vid)
			this.currVid = vid
		},
		onRemoveVid(vid) {
			try {
				const idx = this.videos.findIndex(v => v._id === vid._id)
				console.log('before', this.videos)
				this.videos.splice(idx, 1)
				console.log('after', this.videos)
				this.currVid = this.videos[0]
				videoService.remove(vid._id)
			} catch (e) {
				this.videos.splice(idx, 0, vid)
			}
		}
	},
	components: {
		// searchBar
	}
}
