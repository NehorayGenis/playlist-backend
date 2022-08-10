import { videoService } from '../services/video-service.js'
import { userService } from '../services/user.services.js'

// import videoList from '../cmps/video-list.cmp.js'
// import userList from '../cmps/user-list.cmp.js'

export default {
	template: `
        <section v-if="videos">
            <button @click="logout">Logout</button>
            <div style="display:flex; justify-content:space-between;">
                <div >
                    <h1>User Profile</h1>
                    <h3>Welcome back : {{user.username}}</h3>
                    <button v-if="user.isAdmin">Admin log</button>
                    <router-link to="/video">Go to video list</router-link>
                </div>
                <!-- <user-list v-if="user.isAdmin" /> -->
            </div>
            <h4>Your videos:</h4>
            <!-- <video-list :videos="videos" @removeVideo="removeVideo"/> -->
            
        </section>
 `,
	components: {
		// videoList,
		// userList
	},
	data() {
		return {
			user: null,
			videos: null
		}
	},
	methods: {
		logout() {
			userService
				.logout()
				.then(() => {
					this.user = null
				})
				.catch(err => {
					console.error('Cannot logout', err)
				})
			this.$router.push('/login-signup')
		},

		removeVideo(videoId) {
			console.log(videoId)
			videoService.remove(videoId).then(() => this.loadVideos())
		},

		loadVideos() {
			videoService.query().then(videos => {
				console.log(videos)
				videos = videos.filter(video => video.creator_id === this.user._id)
				this.videos = videos
			})
		}
	},
	computed: {},
	created() {
		this.user = userService.getLoggedInUser()
		console.log(this.user)
		if (!this.user) {
			console.log('Please login first')
			this.$router.push('/login-signup')
			return
		}
		this.loadVideos()
	},
	mounted() {},
	unmounted() {}
}
