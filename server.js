const express = require('express')
const cookieParser = require('cookie-parser')

const VideoService = require('./services/VideoServiceSQL')
const userService = require('./services/UserServiceSQL')
const app = express()
const port = process.env.PORT || 3030
const path = require('path')

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Welcome to Video Life Server')
})

app.get('/api/user', (req, res) => {
	userService
		.getUsers()
		.then(users => res.send(users))
		.catch(err => console.error(err))
})

app.delete('/api/user/:userId', (req, res) => {
	const userId = req.params
	userService
		.removeUser(userId)
		.then(() => res.send('User Removed!'))
		.catch(err => res.status(500).send('Cannot remove user'))
})

//user login
app.post('/api/login', (req, res) => {
	const { username, password } = req.body
	const credential = {
		username,
		password
	}

	userService.checkLogin(credential).then(user => {
		if (user) {
			const loginToken = userService.getLoginToken(user)
			res.cookie('loginToken', loginToken)
			res.send(user)
		} else {
			res.status(401).send('Invalid credentials')
		}
	})
})

//user logout
app.post('/api/logout', (req, res) => {
	res.clearCookie('loginToken')
	res.send('Logged out')
})

//signup
app.post('/api/signup', (req, res) => {
	const { fullname, username, password } = req.body
	const signupInfo = {
		fullname,
		username,
		password,
		isAdmin: false
	}
	userService.signup(signupInfo).then(user => {
		const loginToken = userService.getLoginToken(user)
		res.cookie('loginToken', loginToken)
		res.send(user)
	})
})

//list
app.get('/api/video', (req, res) => {
	const { bySeverity, pageIdx = 0 } = req.query

	const filterBy = {
		bySeverity,
		pageIdx
	}
	console.log('getting')
	VideoService.query(filterBy)
		.then(Videos => res.send(Videos))
		.catch(err => res.status(500).send('Cannot get Videos'))
})

//create
app.post('/api/video', (req, res) => {
	const loggedInUser = userService.validateToken(req.cookies.loginToken)
	if (!loggedInUser && !loggedInUser.isAdmin)
		return res.status(401).send('Cannot add video')
	// console.log('req.body', req.body)
	const { url, title, thumbnail, isSaved } = req.body
	const video = {
		url,
		title,
		thumbnail,
		isSaved
	}
	VideoService.save(video)
		.then(savedVideo => res.send(savedVideo))
		.catch(err => res.status(500).send('Cannot get video'))
})

//update
app.put('/api/video/:VideoId', (req, res) => {
	const loggedInUser = userService.validateToken(req.cookies.loginToken)
	if (!loggedInUser && !loggedInUser.isAdmin)
		return res.status(401).send('Cannot update video')
	const { _id, description, title, creator, severity } = req.body
	const video = {
		_id,
		description,
		title,
		severity,
		creator
	}
	VideoService.save(video, loggedInUser)
		.then(savedVideo => res.send(savedVideo))
		.catch(err => res.status(401).send('Cannot update video'))
})

///read
app.get('/api/video/:VideoId', (req, res) => {
	const { VideoId } = req.params
	let visitedVideos = JSON.parse(req.cookies.visitedVideos || '[]')
	if (!visitedVideos.includes(VideoId)) visitedVideos.push(VideoId)
	res.cookie('visitedVideos', JSON.stringify(visitedVideos), { maxAge: 7000 })
	if (visitedVideos.length > 3) {
		console.log(
			'user visited the top amount of Videos, you can revisit them only:',
			visitedVideos
		)
		return res.status(401).send('Cannot get more Videos')
	}

	const { loginToken } = req.cookies
	const user = userService.validateToken(loginToken)
	if (!user) return res.status(401).send('Unauthorized')

	VideoService.getById(VideoId)
		.then(video => res.send(video))
		.catch(err => res.status(500).send('Cannot get video'))
})

//delete
app.delete('/api/video/:VideoId', (req, res) => {
	const loggedInUser = userService.validateToken(req.cookies.loginToken)
	console.log('user admin?', loggedInUser)
	if (!loggedInUser && !loggedInUser.isAdmin)
		return res.status(401).send('Cannot delete video')
	const { VideoId } = req.params
	VideoService.remove(VideoId, loggedInUser)
		.then(() => res.send('Removed'))
		.catch(err => {
			res.status(401).send('Only creator can delete video')
			// res.status(500).send('Cannot get video')
		})
})

app.get('/**', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(port, () => {
	console.log(`Server ready at port: http://localhost:${port}/#/ `)
})
