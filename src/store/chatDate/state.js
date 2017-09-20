module.exports = {
    //发送消息的内容，格式按照历史消息记录
    currentMessage:{},
    //所有聊天记录
    allChatConent:{},
    //用户名
    userName:$.cookie("username")||'',
    //密码
    passWord:$.cookie("password")||''
};