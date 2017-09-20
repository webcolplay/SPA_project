import Vue from 'vue'
import Router from 'vue-router'
import second from 'components/second/Hello'
import login from 'components/login/login'
import register from 'components/register/register'
import chat from 'components/chat/chat'
import edit from 'components/edit/edit'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		hidden: true,
		redirect: to => {
			return 'login';
		},
	},{
		path: '/login',
		hidden: true,
		component: login
	},{
		path: '/register',
		hidden: true,
		component: register
	},{
		path: '/chat',
		hidden: true,
		component: chat
	},{
		path: '/edit',
		hidden: true,
		component: edit
	}
	,{
		path: '/404',
		hidden: true,
		component: second
	}]
})
