import { storageService } from './async-storage-service.js'

const API = '/api/video/'

export const videoService = {
	query,
	getById,
	getEmptyVideo,
	save,
	remove
}

function query(filterBy = {}) {
	return axios.get(API, { params: filterBy }).then(res => res.data)
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

function save(video) {
	if (video._id) {
		return axios.put(API + video._id, video).then(res => res.data)
	} else {
		return axios.post(API, video).then(res => res.data)
	}
}
