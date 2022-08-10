// import store from './store/index'
import { router } from './router/index.js'
import homeView from './pages/homeView.cmp.js'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'

const options = {
	template: `
    <router-view />
    `,
	router,
	components: { homeView }
}
const app = Vue.createApp(options)
app.use(router)
// app.use(store)
app.mount('#app')
