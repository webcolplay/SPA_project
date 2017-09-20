
import Vue from 'vue'
import App from './App'
import './css/common.css';
// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
Vue.use(ElementUI);

import { Loading } from 'element-ui';
//mint-ui
// import Mint from 'mint-ui';
// Vue.use(Mint);

//  vue-router
import router from './router'

// vuex
import store from './store'

// import request from './config/request.js'

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
	if($.cookie('check')=='true'&&to.path=='/login'){
		util.loadingInstance=Loading.service({ fullscreen: true });
		next('/chat'); 
	}else if(to.path=='/chat'){
		//跳转到聊天页面路由加载页
		util.loadingInstance1=Loading.service({ fullscreen: true });
		setTimeout(function(){
			next();
		},500)
	}else{
		//防止页面跳转引起加载页一直存在
		util.loadingInstance&&util.loadingInstance.close()
		util.loadingInstance1&&util.loadingInstance1.close()
		next();   //执行next()才能执行下面路由渲染
	}
})
router.afterEach(transition => {
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
