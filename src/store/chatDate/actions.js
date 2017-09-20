import * as types from './mutations_types';

export default {
    changeMessage({commit},message){
    	commit(types.currentMessage,message);
    },
    changeAllChatConent({commit},obj){
        commit('allChatConent',obj);
    },
    changeUerName({commit},str){
        commit('uerName',str);
    },
    changePassWord({commit},str){
        commit('passWord',str);
    }
};