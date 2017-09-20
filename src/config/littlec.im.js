var conn = new Littlec.im.Connection();
var handleOpen,handleError,handleClosed,handleTextMessage,handlePictureMessage,handleAudioMessage,handleFileMessage,handlePresence,handleOfflineMessage,
handleReadedMessage,handleArriveMessage,handleSysemMessage,handleVideoMessage;

//初始化连接 
conn.init({ 
	resource:'web',
    appKey:'091414dy', 
//当连接成功时的回调方法 
    onOpened: function() { 
        handleOpen(conn); 
    }, 
//当连接关闭时的回调方法 
    onClosed: function() { 
        handleClosed(); 
    }, 
//收到文本、表情消息时的回调方法 
    onTextMessage: function(message) { 
        handleTextMessage(message); 
    },
//收到图片消息时的回调方法 
    onPictureMessage: function(message) { 
        handlePictureMessage(message); 
    }, 
//收到音频消息的回调方法
    onAudioMessage: function(message) { 
        handleAudioMessage(message); 
    },
//收到视频消息的回调方法
    onVideoMessage: function(message) { 
        handleVideoMessage(message); 
    },
//收到文件消息的回调方法
    onFileMessage: function(message) { 
        handleFileMessage(message); 
    },
//收到联系人订阅请求的回调方法
    onPresence: function(message) {
        handlePresence(message); 
    }, 
// //收到群信息的回调方法包括（收到创建群、群邀请、群退出、踢人等）
//     onGroupChatMessage: function(message) {
//         handleGroupChat(message); 
//     }, 
// //收到有关入群邀请的信息，包括邀请、同意、拒绝
//     onInviteeMessage:function(message){ 
//         handleInviteeMessage(message);
//     }, 
//收到离线消息的回调
    onOfflineMessage:function(message){ 
        handleOfflineMessage(message); 
    }, 
//收到已读消息的回调
    onReadedMessage:function(message){ 
        handleReadedMessage (message); 
    },
  //消息到达好友的回调
    // onArriveMessage:function(message){ 
    //     handleArriveMessage(message); 
    // }, 
   //异常时的回调方法
    onError: function(err) { 
        // console.log(message)
        handleError(err); 
    }, 
    //系统通知回调方法
    onSysemMessage: function(message) { 
        // console.log(message)
        handleSysemMessage(message); 
    } 
})
var registerUser=function(options){
	conn.registerUserWithoutPhoneCode(options);
}

var open=function(user,pwd,sucFn,errFn){
	handleOpen=sucFn
	handleError=errFn
	conn.open({ user :user, pwd :pwd });

}
var close=function(){
	conn.close();
}
//获取当前用户信息
var queryUserInfo=function(successFn,errorFn){    //successFn:function(msg){ console.log(msg)}
	var options = { 
		//成功回调函数
		success: successFn,
		//失败回调函数 
		error:errorFn
	}
	conn.queryUserInfo(options);
}
//修改昵称方法
var modifyUserNick=function(options){
	conn.modifyUserNick(options);
}
//发送文字，表情消息
var sendTextMessage=function(options){
	// var options = {
	// 	to :['18958062829'],
	// 	msg :'你好',
	// 	type :'chat', 
 //        error:function(e){console.log(e)}
 //    };
	conn.sendTextMessage(options);
}
//发送表情时，
var Emoji=function(Unicode){
	return Littlec.im.Helper.convertCodePointsToUnicode(Unicode)
}
//获取所有表情图片链接以及对应的码点
var getInCommonUseEmojiList=function(){
	return Littlec.im.Helper.getInCommonUseEmojiList()
}

//发送图片
var sendPicture=function(options){
	// var options = { 
	// 	type:'chat',
	// 	fileInputId: fileInputId,
	// 	// fileInputId为 input 标签的id值 
	// 	to:['18958062829'],
	// 	//长度为1的好友用户名数组,单聊 
	// 	onFileUploadError: function(error) { 
	// 		console.log(error);
	// 	},
	// 	onFileUploadProgress: function(data) { 
	// 		//文件上传中的处理 
	// 	}, 
	// 	onFileUploadComplete: function(data) { 
	// 		//文件上传成功后的处理 
	// 	}
	// };
	conn.sendPicture(options);
}
//发送文件 
/*
##  支持格式： 图片文件： "BMP", "GIF", "JPEG", "JPEG2000", "TIFF", "PSD", "PNG", "SVG", "PCX", "DXF", "WMF", "EMF", "LIC", "FLI", "FLC", "EPS", "TGA", "JPG" ; 
##  音频文件："WMA", "MP3", "WAV", "MID", "MP1", "MP2", "AMR", "WMA", "M4A", "AAC" ; 视频文件："RMVB", "AVI", "RM", "MPG", "MPEG", "MOV", "WMV", "ASF", "DAT", "ASX", "WVX", "MPE", "MPA", "MP4", "3GP"；
##  app文件："APK"，"IPA"; 
##  文本文件："DOC", "DOCX", "PPT", "PPTX", "XLS", "XLSX", "TXT", "PLIST",”VCF”
##  大小：需大于0KB，小于10M
*/
var sendFile=function(options){
	// var options = { 
	// 	type:'chat',
	// 	fileInputId: fileInputId,
	// 	// fileInputId为 input 标签的id值 
	// 	to:['18958062829'],
	// 	//长度为1的好友用户名数组,单聊 
	// 	onFileUploadError: function(error) { 
	// 		console.log(error);
	// 	},
	// 	onFileUploadProgress: function(data) { 
	// 		//文件上传中的处理 
	// 	}, 
	// 	onFileUploadComplete: function(data) { 
	// 		//文件上传成功后的处理 
	// 	}
	// };
	conn.sendFile(options);
}
//给用户发送短信
var sendTextSMS=function(options){
	// var options = {
	// 	to :['18958062829'], 
	// //长度为1的好友用户名数组,单聊 msg :’你好’,
	// 	type :'chat', 
	// //单聊或群发
	// 	error:function(e){console.log(e)}
	// };
	conn.sendTextSMS(options);
}
//同意添加好友
var agreeAdd=function(options){
	conn.subscribed(options);
}
//添加好友
var add=function(options){
	conn.subscribe(options);
}

//向好友发送删除请求 
var removeRoster=function(options){
	conn.removeRoster (options);
}
var queryUserInfo=function(options){
	conn.queryUserInfo(options);
}
/*roster 数据格式
[{ 
	name:联系人用户名,
 	nick:联系人昵称,
  	phone：联系人电话, 
  	subscription:关系类型(from,to,both) 
}]
*/
//获取好友列表
var getRoster=function(options){
	conn.getRoster(options);
}
//历史消息
var queryChat=function(options){
	 
	conn.queryChat(options);
}
//关闭聊天时的回调方法
var closed=function(fn){
	handleClosed=fn
}
//收到文本、表情消息时的回调方法
var textMessage=function(fn){
	handleTextMessage=fn
}
//收到图片消息时的回调方法
var pictureMessage=function(fn){
	handlePictureMessage=fn
}
//收到音频消息的回调方法
var audioMessage=function(fn){
	handleAudioMessage=fn
}
//收到视频消息的回调方法
var videoMessage=function(fn) { 
    handleVideoMessage=fn 
}
//收到文件消息的回调方法
var fileMessage=function(fn){
	handleFileMessage=fn
}
//收到联系人订阅请求的回调方法
var presence=function(fn){
	handlePresence=fn
}
//系统通知回调方法
var sysemMessage=function(fn){
	handleSysemMessage=fn
}
//系统通知回调方法
var error=function(fn){
	handleError=fn
}
export default {
	conn,
	open,
	close,
	queryUserInfo,
	sendTextMessage,
	Emoji,
	getInCommonUseEmojiList,
	sendPicture,
	sendFile,
	sendTextSMS,
	agreeAdd,
	add,
	removeRoster,
	getRoster,
	queryChat,
	registerUser,
	textMessage,
	pictureMessage,
	audioMessage,
	videoMessage,
	fileMessage,
	presence,
	sysemMessage,
	error,
	queryUserInfo,
	modifyUserNick,
	closed
}
