import { storageService } from './async-storage-service.js'

const API = '/api/video/'

export const videoService = {
	query,
	getById,
	getEmptyVideo,
	save,
	remove
}

// console.log(axios)
async function query(filterBy = {}) {
	const { data } = await axios.get(API, { params: filterBy })
	return data
}

function getById(videoId) {
	return axios.get(API + videoId).then(res => res.data)
}

function getEmptyVideo() {
	return {
		title: '',
		severity: ''
	}
}

function remove(videoId) {
	return axios.delete(API + videoId).then(res => res.data)
}

async function save(video) {
	try {
		if (video._id) {
			const { data } = await axios.put(API + video._id, video)
			return data
		} else {
			// console.log('video', video)
			const { data } = await axios.post(API, video)
			// console.log(data)
			return data
		}
	} catch (e) {
		console.error(e)
	}
}
