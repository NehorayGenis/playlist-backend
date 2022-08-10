import homeView from '../pages/homeView.cmp.js'
import playlist from '../pages/playlist.cmp.js'

import loginSignup from '../pages/login-signup.cmp.js'
import userDetails from '../pages/user-details.cmp.js'

const routes = [
	{ path: '/', component: homeView },
	{ path: '/playlist', component: playlist },
	{ path: '/login-signup', component: loginSignup },
	{ path: '/user-details', component: userDetails }
]

export const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes
})
