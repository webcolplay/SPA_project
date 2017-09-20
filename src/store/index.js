import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import chatDate from './chatDate/';

export default new Vuex.Store({
    modules: {
        chatDate
    }
});