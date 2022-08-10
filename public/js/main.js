// import store from './store/index'
import { router } from './router/index.js'
import homeView from './pages/homeView.cmp.js'
import navBar from './cmps/nav-bar.cmp.js'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'

const options = {
	template: `
	<nav-bar/>
    <router-view />
    `,
	router,
	components: {
		homeView,
		navBar
	}
}
const app = Vue.createApp(options)
app.use(router)
// app.use(store)
app.mount('#app')
