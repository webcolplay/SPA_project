import * as types from './mutations_types'

export default {
    [types.currentMessage](state,data){
    	state.currentMessage=data;
    },
    allChatConent(state,payload){
        if(_.has(state.allChatConent,payload.to)){
            state.allChatConent[payload.to]=state.allChatConent[payload.to].concat(payload.data)
        }else{
            state.allChatConent=Object.assign({},{[payload.to]:payload.data})
            // state.allChatConent[payload.to]=payload.data
        }
    },
    uerName(state,str){
        state.userName=str
    },
    passWord(state,str){
        state.passWord=str
    }
};