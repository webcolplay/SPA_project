if (typeof jQuery == 'undefined') {
    alert("need jquery");
} if(typeof Strophe == 'undefined'){
    alert("need Strophe");
} else {

(function($) {
    
if (typeof Littlec == 'undefined') {
    Littlec = {};
}
if (typeof Littlec.im == 'undefined') {
    Littlec.im = {};
}
if (typeof Littlec.im.Connection !== 'undefined') {
    return;
}
var config = {
    adapterIP:"http://adapter.bizz.cmccim.com",
}

var innerBase64 = (function() {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var obj = {
        /**
         * Encodes a string in base64
         * 
         * @param {String}
         *            input The string to encode in base64.
         */
        encode : function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                        + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            } while (i < input.length);

            return output;
        },

        byteEncode : function(bytes) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            do {
                chr1 = bytes[i++];
                chr2 = bytes[i++];
                chr3 = bytes[i++];

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                        + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            } while (i < bytes.length);

            return output;
        },

        /**
         * Decodes a base64 string.
         * 
         * @param {String}
         *            input The string to decode.
         */
        decode : function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            } while (i < input.length);

            return output;
        }
    };

    return obj;
})();
var emptyFn = function(e) {
    console.log(e);
};
var funcError = function(e){ //默认接口错误回调
    console.log(e);
}
var keys = Object.keys || function(obj) { 
    obj = Object(obj); 
    var arr = []; 
    for (var a in obj) 
        arr.push(a); 
    return arr; 
} 
var invert = function(obj) { 
    obj = Object(obj); 
    var result = {}; 
    for (var a in obj) 
        result[obj[a]] = a ;
    return result; 
} 
var entityMap = { escape: { '&': '&', '<': '<', '>': '>', '\"': '\"', "\'": '\''}}; 
entityMap.unescape = invert(entityMap.escape) 
var entityReg = { 
    escape: RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'), 
    unescape: RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g') 
} 
// 将HTML转义为实体 
function escape(html) { 
    if (typeof html !== 'string') return ''; 
    return html.replace(entityReg.escape, function(match) { 
        return entityMap.escape[match]; 
    }) 
} 
// 将实体转回为HTML 
function unescape(str) { 
    if (typeof str !== 'string') return ''; 
    return str.replace(entityReg.unescape, function(match) { 
        return entityMap.unescape[match]; 
    }) 
}
// 正则表达式
var REGEXP_LT = /</g;
var REGEXP_GT = />/g;
var REGEXP_QUOTE = /"/g;
var REGEXP_RELT = /&lt;/g;
var REGEXP_REGT = /&gt;/g;
var REGEXP_ATTR_NAME = /[^a-zA-Z0-9_:\.\-]/img;
var REGEXP_ATTR_VALUE = /&#([a-zA-Z0-9]*);?/img;
var REGEXP_DEFAULT_ON_TAG_ATTR_1 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_2 = /^[\s"'`]*((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_3 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_4 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;

function toTag (text) {
  return text.replace(REGEXP_RELT, '<').replace(REGEXP_REGT, '>');
}
//字符串转换为xml
function strToXml(str,tag){
    if(str){
        var xmlDom;
        if(document.all){ 
    　　  xmlDom =new ActiveXObject("Microsoft.XMLDOM"); 
            if(tag){
                xmlDom.loadXML("<"+tag+">"+str+"</"+tag+">"); 
            }else{
                xmlDom.loadXML(str); 
            }
    　　 }else{ 
            if(tag){
                xmlDom = new DOMParser().parseFromString("<"+tag+">"+str+"</"+tag+">", "text/xml"); 
            }else{
                xmlDom = new DOMParser().parseFromString(str, "text/xml"); 
            }
    　　  
    　　 } 
        return xmlDom;
    }
    return null;
}
//获取xmlnode值
function $getNodeValue(nodeName){
    return this.getElementsByTagName(nodeName) && this.getElementsByTagName(nodeName).length && this.getElementsByTagName(nodeName)[0].childNodes[0] && this.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
};
//时间格式化
Date.prototype.format = function(format){ 
    var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(), //day 
    "h+" : this.getHours(), //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
    "S" : this.getMilliseconds() //millisecond 
    } 

    if(/(y+)/.test(format)) { 
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    } 

    for(var k in o) { 
        if(new RegExp("("+ k +")").test(format)) { 
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
        } 
    } 
    return format; 
} 
 //读取cookies 
function getCookie(name) { 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
}
//删除cookies 
function delCookie(name) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=this.getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+escape(cval)+";expires="+exp.toGMTString()+";path=/"; 
}
//写cookies
function setCookie(c_name,value,expiredays) {  
    var exdate=new Date();  
    exdate.setDate(exdate.getDate()+expiredays);  
    document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";  
}
var tempIndex = 0;
LITTLEC_IM_CONNCTION_USER_NOT_ASSIGN_ERROR = tempIndex++;//0
LITTLEC_IM_CONNCTION_OPEN_ERROR = tempIndex++;//1
LITTLEC_IM_CONNCTION_AUTH_ERROR = tempIndex++;//2
LITTLEC_IM_CONNCTION_OPEN_USERGRID_ERROR = tempIndex++;//3
LITTLEC_IM_CONNCTION_ATTACH_ERROR = tempIndex++;//4
LITTLEC_IM_CONNCTION_ATTACH_USERGRID_ERROR = tempIndex++;//5
LITTLEC_IM_CONNCTION_REOPEN_ERROR = tempIndex++;//6
LITTLEC_IM_CONNCTION_SERVER_CLOSE_ERROR = tempIndex++;//7
LITTLEC_IM_CONNCTION_SERVER_ERROR = tempIndex++;//8
LITTLEC_IM_CONNCTION_IQ_ERROR = tempIndex++;//9
LITTLEC_IM_CONNCTION_PING_ERROR = tempIndex++;//10
LITTLEC_IM_CONNCTION_GETROSTER_ERROR = tempIndex++;//11
LITTLEC_IM_CONNCTION_CROSSDOMAIN_ERROR = tempIndex++;//12
LITTLEC_IM_CONNCTION_LISTENING_OUTOF_MAXRETRIES = tempIndex++;//13
LITTLEC_IM_CONNCTION_RECEIVEMSG_CONTENTERROR = tempIndex++;//14



LITTLEC_IM_UPLOADFILE_BROWSER_ERROR = tempIndex++;//15
LITTLEC_IM_UPLOADFILE_ERROR = tempIndex++;//16
LITTLEC_IM_UPLOADFILE_NO_LOGIN = tempIndex++;//17
LITTLEC_IM_UPLOADFILE_NO_FILE = tempIndex++;//18
LITTLEC_IM_DOWNLOADFILE_ERROR = tempIndex++;//19
LITTLEC_IM_DOWNLOADFILE_NO_LOGIN = tempIndex++;//20
LITTLEC_IM_DOWNLOADFILE_BROWSER_ERROR = tempIndex++;//21

LITTLEC_IM_CONNCTION_NETWORK_ERROR = tempIndex++;//22

LITTLEC_IM_USER_REMOVE= tempIndex++;//23
LITTLEC_IM_USER_CONFLICT = tempIndex++;//24


LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR = tempIndex++;//25
LITTLEC_IM_CONNCTION_QUERYGROUP_ERROR = tempIndex++;//26
LITTLEC_IM_CONNCTION_REMOVEROSTER_ERROR = tempIndex++;//27
LITTLEC_IM_CONNCTION_QUERYROSTER_ERROR = tempIndex++;//28
LITTLEC_IM_CONNCTION_COMMOND_ERROR = tempIndex++;//29
LITTLEC_IM_CONNCTION_PARAM_ERROR = tempIndex++;//30


LITTLEC_IM_CONNCTION_ERROR = tempIndex++;//31
LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR = tempIndex++;//32

LITTLEC_IM_CONNCTION_COMMOND_SUCCESS = 100;

tempIndex = 0;
LITTLEC_IM_MESSAGE_REC_TEXT = tempIndex++;
LITTLEC_IM_MESSAGE_REC_EMOTION = tempIndex++;
LITTLEC_IM_MESSAGE_REC_PHOTO = tempIndex++;
LITTLEC_IM_MESSAGE_REC_AUDIO = tempIndex++;
LITTLEC_IM_MESSAGE_REC_AUDIO_FILE = tempIndex++;
LITTLEC_IM_MESSAGE_REC_VEDIO = tempIndex++;
LITTLEC_IM_MESSAGE_REC_VEDIO_FILE = tempIndex++;
LITTLEC_IM_MESSAGE_REC_FILE = tempIndex++;
LITTLEC_IM_MESSAGE_REC_GROUPCHAT = tempIndex++;

LITTLEC_IM_MESSAGE_SED_TEXT = tempIndex++;
LITTLEC_IM_MESSAGE_SED_EMOTION = tempIndex++;
LITTLEC_IM_MESSAGE_SED_PHOTO = tempIndex++;
LITTLEC_IM_MESSAGE_SED_AUDIO = tempIndex++;
LITTLEC_IM_MESSAGE_SED_AUDIO_FILE = tempIndex++;
LITTLEC_IM_MESSAGE_SED_VEDIO = tempIndex++;
LITTLEC_IM_MESSAGE_SED_VEDIO_FILE = tempIndex++;
LITTLEC_IM_MESSAGE_SED_FILE = tempIndex++;

tempIndex = 0;
LITTLEC_IM_REGISTER_SUCCESS = tempIndex++;
LITTLEC_IM_REGISTER_ERROR = tempIndex++;

tempIndex = 0;
LITTLEC_IM_MESSAGE_SEND_ERROR = tempIndex++;


//错误类型对照数组
var errText = [
    "未指定用户", //0
    "连接错误", //1
    "用户名和密码错误",//2
    "开发者信息错误",//3
    "用户的会话信息错误",//4
    "用户的accessToken错误",//5
    "重复打开连接,请先关闭连接再打开",//6
    "该账号在别处登录",//7
    "服务器异常",//8
    "iq失败",//9
    "ping失败",//10
    "获取联系人信息失败",//11
    "跨域错误",//12
    "超出监听次数范围",//13
    "消息接收错误",//14
    "加入房间失败",//15
    "获取群组列表失败",//16
    "获取群组信息失败",//17
    "获取群主信息失败",//18
    "获取群组成员失败",//19 
    "获取群组出席者列表失败",//20
    "退群失败",//21
    "发送准备建群请求失败",//22
    "建群失败",//23
    "邀请其他人失败",//24
    "当前浏览器不支持异步上传文件,请换用其他浏览器",//25
    "上传文件错误",//26
    "用户未登录到usergrid服务器,无法使用文件上传功能",//27
    "未选择上传文件",//28
    "下载文件失败",//29
    "用户未登录到usergrid服务器,无法使用文件下载功能",//30
    "当前浏览器不支持异步下载文件,请换用其他浏览器",//31
    "网络连接中断",//32
    "用户被删除",//33
    "用户在其他地方重新登录",//34
    "查询群成员失败",//35
    "修改群名字失败",//36
    "查询好友聊天记录失败",//37
    "查询群聊天记录失败",//38
    "删除好友失败",//39
    "查找联系人失败",//40
    "执行命令失败",//41
    "参数错误"//42
];
//群消息类型
tempIndex = 0;
var CREATE_ROOM = tempIndex++,//建群后收到的广播消息
    APPL_MEMBER = tempIndex++,//邀请成员
    DROP_ROOM   = tempIndex++,//退群
    MODIFY_ROOMNAME = tempIndex++,//修改群名字
    KICK_MEMBER = tempIndex++,//群主踢人
    ROOM_OWENER = tempIndex++,//被推选为新的群主
    MODIFY_NICKNAME_IN_ROOM = tempIndex++;//用户修改其群中昵称
    DESTROY_ROOM = tempIndex++;//解散群
    SET_ADMIN = tempIndex++;//指定管理员
    CANCEL_ADMIN = tempIndex++;//取消管理员
    JOIN_REQUEST = tempIndex++;//申请加入群
    BE_APPROVED = tempIndex++;//申请通过
    REQUEST_MEMBER = tempIndex++;//成员主动加入
    BE_REFUSED = tempIndex++;//申请拒绝
    BE_NEWOWNER = tempIndex++;//老群主退群，普通成员成为新群主

//群邀请消息类型
tempIndex = 0;
var INVITEE = tempIndex++,//建群时收到邀请者的消息
    ACCEPT = tempIndex++,//同意邀请
    DECLINE = tempIndex++;//拒绝邀请
//图片类型
var picType = {"jpg": true,"png": true,"bmp": true,"jpeg": true,'gif':true};
//音频类型
//var   audType = {"mp3": true,"wma": true,"wav": true,"amr": true,"avi": true};
var audType = {"mp3": true,"amr": true};
//视频类型
var videoType = {"rmvb": true,"avi": true,"rm": true,"mpg": true,'mpeg':true,"mov": true,'wmv':true,"asf": true,'dat':true,"asx": true,'mp4':true,"3gp": true};
//文件类型
var filesType = {"doc": true,"txt": true,"ppt": true,"pptx": true,"xls": true,"docx": true,"xlsx": true,"plist": true,
                 "bmp":true, "gif":true, "jpeg":true, "jpeg2000":true, "tiff":true, "psd":true, "png":true, "svg":true,
                 "pcx":true, "dxf":true, "wmf":true, "emf":true, "lic":true, "fli":true, "flc":true, "eps":true, "tga":true, "jpg":true,
                 "wma":true, "mp3":true, "wav":true, "mid":true, "mp1":true, "mp2":true, "amr":true,  "m4a":true, "aac":true,
                 "rmvb":true, "avi":true, "rm":true, "mpg":true, "mpeg":true, "mov":true, "wmv":true, "asf":true, "dat":true, "asx":true,
                 "wvx":true, "mpe":true, "mpa":true, "mp4":true, "3gp":true,"apk":true,"ipa":true,'vcf':true};

//{id="",cmdName:""}
var cmdQueue = [];
//判断某字符是不是SJON格式
var testJson= function(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
};
//去掉字符串前后空格
var strTrim = function(str){   
    if(str){
        return str.replace(/^\s+|\s+$/g, "");
    }
    return str;   
}
//guid 转换时间
var guidToTime = function(str){
    if(str){
        var tmp = str.substring(0,str.length-3);
        var x1 = Math.floor(tmp/16);
        x1 = x1*1000;
        x1=Math.floor(x1/(1<<14));
        var twepoch = 1361753741828;
        x1 = x1 + twepoch;
        return x1;
    }
    return '';
} 
//生成roomId
var createRoomId= function(){
    var roomId = 'w'+new Date().getTime();
    for(var i=0;i<3;i++) { 
        roomId+=Math.floor(Math.random()*10); 
    }
    return roomId;
} 
var createStandardXHR = function () {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {
        return false;
    }
};
var createActiveXHR = function () {
    try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
    } catch( e ) {
        return false;
    }
};
if (window.XDomainRequest) {
    XDomainRequest.prototype.oldsend = XDomainRequest.prototype.send;
    XDomainRequest.prototype.send = function() {
        XDomainRequest.prototype.oldsend.apply(this, arguments);
        this.readyState = 2;
    };
}

var xmlrequest = function (crossDomain){
    crossDomain = crossDomain || true;
    var temp = createStandardXHR () || createActiveXHR();
    
    if ("withCredentials" in temp) {
        return temp;
    }
    if(!crossDomain){
        return temp;
    }
    if(window.XDomainRequest===undefined){
        return temp;
    }
    var xhr = new XDomainRequest();
    xhr.readyState = 0;
    xhr.status = 100;
    xhr.onreadystatechange = emptyFn;
    xhr.onload = function () {
        xhr.readyState = 4;
        xhr.status = 200;
        
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xhr.responseText);
        xhr.responseXML = xmlDoc;
        xhr.response = xhr.responseText;
        xhr.onreadystatechange();
    };
    // xhr.upload = function () {
    //     xhr.readyState = 4;
    //     xhr.status = 200;
        
    //     var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    //     xmlDoc.async = "false";
    //     xmlDoc.loadXML(xhr.responseText);
    //     xhr.responseXML = xmlDoc;
    //     xhr.response = xhr.responseText;
    //     xhr.onreadystatechange();
    // };
    xhr.ontimeout = xhr.onerror = function(){
        xhr.readyState = 4;
        xhr.status = 500;
        xhr.onreadystatechange();
    };
    return xhr;
};
Strophe.Request.prototype._newXHR = function(){
    var xhr =  xmlrequest(true);
  if (xhr.overrideMimeType) {
      xhr.overrideMimeType("text/xml");
  }
  xhr.onreadystatechange = this.func.bind(null, this);
  return xhr;
};

function getIEVersion(){
    var ua = navigator.userAgent,matches,tridentMap={'4':8,'5':9,'6':10,'7':11};
    matches = ua.match(/MSIE (\d+)/i);
    if(matches&&matches[1])
    {   
        return +matches[1];
    }
    matches = ua.match(/Trident\/(\d+)/i);
    if(matches&&matches[1])
    {   
        return tridentMap[matches[1]]||null;
    }
    return null;
};
var ieVersion = getIEVersion();

var tepmxhr = xmlrequest();
var hasSetRequestHeader = (tepmxhr.setRequestHeader || false );
var hasOverrideMimeType = (tepmxhr.overrideMimeType || false);
tepmxhr = null;

var doAjaxRequest = function(options) {
    var dataType = options.dataType || 'text';
    var suc = options.success || emptyFn;
    var error = options.error || emptyFn;
    var xhr = xmlrequest();
    xhr.onreadystatechange = function (){
        if( xhr.readyState === 4){
            var status = xhr.status || 0;
            if (status == 200) {
                if(dataType=='text'){
                    suc(xhr.responseText,xhr);
                    return;
                }
                if(dataType=='json'){
                    try{
                        var json = JSON.parse(xhr.responseText);
                        suc(json,xhr);
                    } catch(e){
                        error(xhr.responseText,xhr,"错误的数据,无法转换为json");
                    }
                    return;
                }
                if(dataType=='xml'){
                    if (xhr.responseXML && xhr.responseXML.documentElement) {
                        suc(xhr.responseXML.documentElement,xhr);
                    } else {
                        error(xhr.responseText,xhr,"浏览器不支持ajax返回xml对象");
                    }
                    return;
                }
                suc(xhr.response || xhr.responseText,xhr);
                return;
            } else {
                if(dataType=='json'){
                    try{
                        var json = JSON.parse(xhr.responseText);
                        error(json,xhr,"服务器返回错误信息");
                    } catch(e){
                        error(xhr.responseText,xhr,"服务器返回错误信息");
                    }
                    return;
                }
                if(dataType=='xml'){
                    if (xhr.responseXML && xhr.responseXML.documentElement) {
                        error(xhr.responseXML.documentElement,xhr,"服务器返回错误信息");
                    } else {
                        error(xhr.responseText,xhr,"服务器返回错误信息");
                    }
                    return;
                }
                error(xhr.responseText,xhr,"服务器返回错误信息");
                return;
            }
        }
        if( xhr.readyState === 0){
            error(xhr.responseText,xhr,"服务器异常");
        }
    };

    if(options.responseType){
        if(xhr.responseType){
            xhr.responseType = options.responseType;
        } else {
            error('',xhr,"当前浏览器不支持设置响应类型");
            return null;
        }
    }
    if(options.mimeType){
        if(hasOverrideMimeType){
            xhr.overrideMimeType(options.mimeType);
        } else {
            error('',xhr,"当前浏览器不支持设置mimeType");
            return null;
        }
    }
    
    var type = options.type || "POST";
    xhr.open(type, options.url);
    
    var headers = options.headers || {};
    for(var key in headers){
        if(hasSetRequestHeader){
            xhr.setRequestHeader(key, headers[key]);
        } else {
            error('',xhr,"当前浏览器不支持设置header");
            return null;
        }
    }

    var data = options.data || null;
    xhr.send(data);
    return xhr;
};

var getFileUrlFn = function(fileInputId) {
    var uri = {
        url : '',
        filename : '',
        filetype : ''
    };
    if (window.URL  && window.URL.createObjectURL) {
        var fileItems = document.getElementById(fileInputId).files;
        if (fileItems.length > 0) {
            var u = fileItems.item(0);
            uri.url = window.URL.createObjectURL(u);
            uri.filename = u.name || '';
        }
    } else { // IE
        var u = document.getElementById(fileInputId).value;
        uri.url = u;
        var pos1 = u.lastIndexOf('/');
        var pos2 = u.lastIndexOf('\\');
        var pos = Math.max(pos1, pos2)
        if (pos < 0)
            uri.filename = u;
        else
            uri.filename = u.substring(pos + 1);
    }
    var index = uri.filename.lastIndexOf(".");
    if (index != -1) {
        uri.filetype = uri.filename.substring(index+1).toLowerCase();
    }
    return uri;
};
var isIe = false;
if (navigator.appVersion.indexOf("MSIE") != -1) {
    isIe = true;
}
var getFileSizeFn = function(fileInputId){
    var file = document.getElementById(fileInputId)
    var fileSize = 0;
    if(file){
        if(file.files){
            if(file.files.length>0){
                fileSize = file.files[0].size;
            }
        } else if(isIe){
            file.select();
            var fileobject = new ActiveXObject ("Scripting.FileSystemObject");  
            var file = fileobject.GetFile (file.value);  
            fileSize = file.Size;
        }
    }
    return fileSize;
};

var hasFormData = (typeof FormData != 'undefined');
var isCanUploadFile = (hasSetRequestHeader && hasFormData);
var uploadFn = function(options) {
    options = options || {};
    options.onFileUploadProgress = options.onFileUploadProgress || emptyFn;
    options.onFileUploadComplete = options.onFileUploadComplete || emptyFn;
    options.onFileUploadError = options.onFileUploadError || emptyFn;
    options.onFileUploadCanceled = options.onFileUploadCanceled || emptyFn;

    if (!isCanUploadFile) {
        options.onFileUploadError({
            type : LITTLEC_IM_UPLOADFILE_BROWSER_ERROR,
            msg : '当前浏览器不支持异步上传文件,请换用其他浏览器'
        });
        return;
    }
    var acc = options.accessToken;
    orgName = options.orgName || '';
    appName = options.appName || '';
    appKey = options.appKey || '';
    if(!orgName && !appName && appKey){
        var devInfos = appKey.split('#');
        if(devInfos.length==2){
            orgName = devInfos[0];
            appName = devInfos[1];
        }
    }
    var fileSize = getFileSizeFn(options.fileInputId);
    if(fileSize > 20971520){
        options.onFileUploadError({
            type : LITTLEC_IM_UPLOADFILE_ERROR,
            msg : '上传文件超过服务器大小限制(20M)'
        });
        return;
    }else if(fileSize <= 0){
        options.onFileUploadError({
            type : LITTLEC_IM_UPLOADFILE_ERROR,
            msg : '上传文件大小为0'
        });
        return;
    }
    //文件服务器地址
    // var uploadUrl = config.pafsIP+'/pafs/rest/uploadservices/uploadbynewimagetype?newimagetype=5';
    var uploadUrl = config.pafsIP+'/pafs/rest/uploadservices/uploadfile';
    var xhr = xmlrequest();
    var onError = function(e) {
        options.onFileUploadError({
            type : LITTLEC_IM_UPLOADFILE_ERROR,
            msg : '上传文件失败',
            e : e,
            xhr : xhr
        });
    }
    if(xhr.upload){
        xhr.upload.addEventListener("progress",options.onFileUploadProgress, false);
    }
    if(xhr.addEventListener){
        xhr.addEventListener("abort", options.onFileUploadCanceled, false);
        xhr.addEventListener("load", function(e) {
            try{
                var json = JSON.parse(xhr.responseText);
                options.onFileUploadComplete(json);
            } catch(e){
                options.onFileUploadError({
                    type : LITTLEC_IM_UPLOADFILE_ERROR,
                    msg : '上传文件失败,服务端返回值值不正确',
                    e : e,
                    data : xhr.responseText,
                    xhr : xhr
                });
            }
        }, false);
        xhr.addEventListener("error", onError, false);
    } else if(xhr.onreadystatechange){
        xhr.onreadystatechange = function (){
            if( xhr.readyState === 4){
                if (ajax.status == 200) {
                    try{
                        var json = JSON.parse(xhr.responseText);
                        options.onFileUploadComplete(json);
                    } catch(e){
                        options.onFileUploadError({
                            type : LITTLEC_IM_UPLOADFILE_ERROR,
                            msg : '上传文件失败,服务端返回值不正确',
                            e : e,
                            data : xhr.responseText,
                            xhr : xhr
                        });
                    }
                } else {
                        options.onFileUploadError({
                            type : LITTLEC_IM_UPLOADFILE_ERROR,
                            msg : '上传文件失败,服务端返回异常',
                            data : xhr.responseText,
                            xhr : xhr
                        });
                }
            } else {
                xhr.abort();
                options.onFileUploadCanceled();
            }
        }
    }

    xhr.open("POST", uploadUrl);
    xhr.withCredentials = false;

    xhr.setRequestHeader('restrict-access', 'true');
    xhr.setRequestHeader('Authorization', 'Bearer ' + acc);
    xhr.setRequestHeader('Platform', 'Web');

    var localFile = '';
    var fileInput = document.getElementById(options.fileInputId);
    var localFile = null;
    var filename = "";
    if ("files" in fileInput) {
        localFile = fileInput.files[0];
        filename = localFile.name;
    } else {
        localFile = fileInput.value;
        filename = localFile.substring(localFile.lastIndexOf("\\")+1);
    }
    var formData = new FormData();
    formData.append("fileName", filename);
    formData.append("file", localFile);
    xhr.send(formData);
};
var hasBlob = (typeof Blob != 'undefined');
var isCanDownLoadFile = (hasSetRequestHeader && (hasBlob || hasOverrideMimeType));
var downloadFn = function(options){
    options.onFileDownloadComplete = options.onFileDownloadComplete || emptyFn;
    options.onFileDownloadError = options.onFileDownloadError || emptyFn;
    
    if (!isCanDownLoadFile) {
        options.onFileDownloadError({
            type : LITTLEC_IM_DOWNLOADFILE_BROWSER_ERROR,
            msg : '当前浏览器不支持异步下载文件,请换用其他浏览器'
        });
        return;
    }
    
    var onError = function(e) {
        options.onFileDownloadError({
            type : LITTLEC_IM_DOWNLOADFILE_ERROR,
            msg : '下载文件失败',
            xhr : xhr,
            e : e
        });
    }
    var xhr = xmlrequest();
    if("addEventListener" in xhr){
        xhr.addEventListener("load", function(e) {
            options.onFileDownloadComplete(xhr.response,xhr);
        }, false);
        xhr.addEventListener("error", onError, false);
    } else if("onreadystatechange" in xhr){
        xhr.onreadystatechange = function (){
            if( xhr.readyState === 4){
                if (ajax.status == 200) {
                    options.onFileDownloadComplete(xhr.response,xhr);
                } else {
                        options.onFileDownloadError({
                            type : LITTLEC_IM_DOWNLOADFILE_ERROR,
                            msg : '下载文件失败,服务端返回异常',
                            xhr : xhr
                        });
                }
            } else {
                xhr.abort();
                options.onFileDownloadError({
                    type : LITTLEC_IM_DOWNLOADFILE_ERROR,
                    msg : '错误的下载状态,退出下载',
                    xhr : xhr
                });
            }
        }
    }
    
    var method = options.method || 'GET';
    var resType = options.responseType || 'blob';
    var mimeType = options.mimeType || "text/plain; charset=x-user-defined";
    xhr.open(method, options.url);
    if(typeof Blob != 'undefined'){
        xhr.responseType = resType;
    } else {
        xhr.overrideMimeType(mimeType);
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Accept', 'application/octet-stream');
    xhr.setRequestHeader('share-secret', options.secret);
    xhr.setRequestHeader('Authorization', 'Bearer ' + "accessToken");
    xhr.send(null);
};

var parseNameFromJidFn = function(jid,domain){
    // domain = domain || "";
    // var tempstr = jid;
    // // eidt by lim
    // var atindex = tempstr.indexOf("@" + domain);
    // if(atindex!=-1){
    //     tempstr = tempstr.substring(0,atindex);
    // }
    if(jid){
        return jid.split('#')[0];
    }
    return '';
};
// var parseTextMessageFn = function(message){
//     var bodyMsg = {};
//     var isemotion = false;
//     var receiveMsg = '';
//     if (typeof ioNull !='undefined') {  
//         receiveMsg = ioNull.emoji.parse(message);
//         isemotion = receiveMsg.isEmoji;
//     } 
//     return {"isemotion":isemotion,"body":receiveMsg.data};
// }

var convertEmojiUnicodeToImage = function( stringWithEmoji ){
    if(!stringWithEmoji){
        console.log('参数为空。');
        return;
    }
    if( typeof stringWithEmoji != 'string' ){
        console.log('参数不是字符串类型。');
        return;
    }else{
        return emojione.unicodeToImage(stringWithEmoji);
    }
}

var convertCodePointsToUnicode = function(CodePoints){
    if(!CodePoints){
        console.log('参数为空。');
        return;
    }    
    return emojione.convert(CodePoints);
}
var getInCommonUseEmojiList = function(){
    return emojione.getInCommonUseEmojiList();
}

var parseResponseMessageFn = function(msginfo,conn){
    //console.log(msginfo);
    var typeArr = ["txt","img","audio","","video","","file","groupchat","","","location","system","invitee"];
    var parseMsgData = {errorMsg:true,data:[]};
    var dataJson ={};
    var msgType = '',msgId ='',index='',cmdName='',errMsg='',xmlns='';

    var msgReceived = msginfo.getElementsByTagName("received"); 
    if(msgReceived&&msgReceived.length){
        //消息是否发送成功报文情况
        msgType = msgReceived[0].getAttribute('type');
        msgId = msgReceived[0].getAttribute('id'); 
        //消息回执情况
        xmlns = msgReceived[0].getAttribute('xmlns');
    }else{
        //被动接受消息的情况
        msgType = msginfo.getAttribute("type");
        msgId = msginfo.getAttribute('id');
    }
    //通过消息Id记录消息来源
    if(msgId){
        for(var i=0; i<cmdQueue.length; i++){
            if(msgId ==cmdQueue[i].id ){
                index = i;
                cmdName = cmdQueue[i].cmdName; 
                msg = cmdQueue[i].msg; 
            }
        }
        if(index != undefined){
            cmdQueue.splice(index,1);
        }
    }
    if(msgType == 'arrive'){ //消息发送成功
        processMessage.processArrive(msginfo,conn);
        parseMsgData.errorMsg = false;
        return parseMsgData;
    }else if(msgType == 'error'){//消息执行失败
        parseMsgData.errorMsg = true;
        parseMsgData.data = {
            bodyMsg: '执行'+cmdName+'命令失败！',
            type:LITTLEC_IM_CONNCTION_COMMOND_ERROR
        }
        if(msg){
           parseMsgData.data.bodyMsg += '消息：'+msg; 
        }
        return parseMsgData;
    }else if(xmlns && xmlns=='urn:xmpp:receipts'){  //已读消息回执
        processMessage.processReaded(msginfo,conn);
        parseMsgData.errorMsg = false;
        return parseMsgData;
    }
    dataJson.from = msginfo.getAttribute("from").split("#")[0]; //消息来源
    dataJson.to = msginfo.getAttribute("to").split("#")[0]; //消息去向
   // dataJson.sendtimestamp = msginfo.getAttribute("sendtimestamp");//消息服务器发送时间
    //dataJson.recvtimestamp = msginfo.getAttribute("recvtimestamp");//消息服务器接收时间
    dataJson.guid = msginfo.getAttribute("guid");
    dataJson.time = guidToTime(dataJson.guid);
    //如果是群消息，则解析群消息中from 字段的昵称
    if(msgType == 'groupchat'){
        var from = msginfo.getAttribute("from");
        if(from.indexOf('/') != -1){
            dataJson.fromNickName = from.substring(from.indexOf(' ')+1,from.length);
            dataJson.fromUserName = from.substring(from.indexOf('/')+1,from.indexOf(' '));      
        }
    }
    var msgBodies = msginfo.getElementsByTagName("body");
    var msgX = msginfo.getElementsByTagName("x");
    var msgItem = msginfo.getElementsByTagName("item");
    var forward = msginfo.getAttribute("forward");//针对单聊
    var fromFullJID = msginfo.getAttribute("fromFullJID");//针对群聊、群组管理消息
    if(forward){ //伙伴终端发过来的消息
        dataJson.forward = forward.split("#")[0];
        dataJson.isFriendTerminal = true;
    }
    if(fromFullJID){
        var resource = fromFullJID.substring(fromFullJID.indexOf("/")+1);
        var userId = fromFullJID.split("@")[0];
        if( (resource != conn.resource) && (userId == conn.context.userId)){//伙伴终端资源名且用户名是自己
            dataJson.isFriendTerminal = true;
        }else if((resource == conn.resource) && (userId == conn.context.userId)){//过滤自己资源名且用户名是自己
            parseMsgData.errorMsg = true;
            parseMsgData.data.bodyMsg = "过滤自己";
            return parseMsgData;
        }
    }
    if(msgBodies){
        for (var i=0;i<msgBodies.length;i++){
            var msgBody = msgBodies[i];
            var childNodes = msgBody.childNodes;
            if(childNodes && childNodes.length>0){
                var childNode = msgBody.childNodes[0];
                if(childNode.nodeType==Strophe.ElementType.TEXT){
                    var jsondata = childNode.nodeValue;
                    jsondata = jsondata.replace('\n','<br>');
                    try{
                        var str = childNode.nodeValue;
                        // 验证str字符串是否是json格式 如果不是JSON就默认是三方软件发来的聊天记录
                        // 自己拼装成web端一致的JSON格式
                        var data;
                        if(testJson(str)){
                            data = eval("("+str+")");
                        }else{
                            dataJson["bodies"] = [];
                            dataJson["bodies"][0]={"type":"txt","msg":str};//暂时支持文本格式，‘txt’，联调时候修改获取
                            data = dataJson;
                        };
                        parseMsgData.errorMsg = false;
                        parseMsgData.data = [data];
                    }catch(e){

                    }
                }
            }
        }
        var delayTags = msginfo.getElementsByTagName("delay");
        if(delayTags && delayTags.length>0){
            var delayTag = delayTags[0];
            var delayMsgTime = delayTag.getAttribute("stamp");
            if(delayMsgTime){
                parseMsgData.delayTimeStamp = delayMsgTime;
            }
        }
    } 
    if(msgX&&msgX.length){
        for (var i=0;i<msgX.length;i++){
            if(msgX[i].getAttribute('xmlns') == 'roomcreated'){ //创建群消息
                dataJson["bodies"] = [];
                var items = msgX[i].getElementsByTagName("item");
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];
                var occupants = [];
                for(var j=0; j<items.length;j++){
                    occupants.push({
                        name:items[j].getAttribute('jid').split('#')[0],
                        nick:items[j].getAttribute('nick'),
                        affiliation:items[j].getAttribute('affiliation')
                    })
                }
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:CREATE_ROOM,//建群
                    item:{
                        roomId: msginfo.getAttribute("from").split('#')[0],
                        roomName: msginfo.getElementsByTagName("groupname")[0].textContent,
                        occupants: occupants,
                        createUserName:actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid')
                    }
                };
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'inviting'){//入群邀请信息  
                dataJson["bodies"] = [];             
                var inviteMsg = msgX[i].getElementsByTagName("invite")[0];
                dataJson["bodies"][0]={type:typeArr[12]};
                dataJson["bodies"][0].inviteeType = INVITEE;//邀请
                dataJson["bodies"][0].item = {
                    inviteeUserName:inviteMsg.getAttribute('from').split('#')[0],//邀请者用户名
                    inviteeNickName:inviteMsg.getAttribute('nick'),//邀请者昵称
                    roomId:msginfo.getAttribute("from").split('#')[0],//群id
                    roomName:inviteMsg.getAttribute('roomName')
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'invitationaccepted'){//同意入群信息
                dataJson["bodies"] = [];
                var acceptMsg = msgX[i].getElementsByTagName("accept")[0]; 
                dataJson["bodies"][0]={type:typeArr[12]};
                dataJson["bodies"][0].inviteeType = ACCEPT;//同意
                dataJson["bodies"][0].item = {
                    acceptUserName:acceptMsg.getAttribute('from').split('#')[0],//同意者用户名
                    acceptNickName:acceptMsg.getAttribute('nick')//同意者昵称
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'newmember'){//新成员接收邀请广播入群信息
                dataJson["bodies"] = [];
                var itemInfo = msgX[i].getElementsByTagName("item");
                var actorInfo = msgX[i].getElementsByTagName("actor");
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:REQUEST_MEMBER
                };
                dataJson["bodies"][0].item = {members:[]};
                for(var j=0; j<itemInfo.length; j++){
                    dataJson["bodies"][0].item.members.push({
                        newMemberUserName:itemInfo[j].getAttribute('jid').split('#')[0],//新入群者用户名
                        newMemberNickName:itemInfo[j].getAttribute('nick'),//新入群者昵称
                    })
                }
                if(actorInfo.length > 0){
                    dataJson["bodies"][0].item.applyUserName = actorInfo[0].getAttribute('jid').split('#')[0]|| actorInfo.getAttribute('jid'),//邀请者用户名
                    dataJson["bodies"][0].item.applyUserNick = actorInfo[0].getAttribute('nick') ||''//邀请者昵称
                    dataJson["bodies"][0].groupType = APPL_MEMBER;
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'newowner'){//老群主退群后，某成员成为新群主
                dataJson["bodies"] = [];
                var itemInfo = msgX[i].getElementsByTagName("item")[0];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:BE_NEWOWNER
                };
                dataJson["bodies"][0].item={
                    newOwnerUserName:itemInfo.getAttribute('jid').split('#')[0],//新群主用户名
                    newOwnerNickName:itemInfo.getAttribute('nick'),//新群主昵称  
                }
               
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'invitationdeclined'){//拒绝入群信息
                dataJson["bodies"] = [];
                var declineMsg = msgX[i].getElementsByTagName("decline")[0]; 
                dataJson["bodies"][0]={type:typeArr[12]};
                dataJson["bodies"][0].inviteeType = DECLINE;//拒绝
                dataJson["bodies"][0].item = {
                    declineUserName:declineMsg.getAttribute('from').split('#')[0],//拒绝者用户名
                    declineNickName:declineMsg.getAttribute('nick')//拒绝者昵称
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'bekicked'){//踢人出群信息
                dataJson["bodies"] = [];
                var itemInfo = msgX[i].getElementsByTagName("item")[0];
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];                
                dataJson["bodies"][0] = {
                    type:typeArr[7],
                    groupType:KICK_MEMBER //群主踢人
                };
                dataJson["bodies"][0].item = {
                    kickUserName:actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid'),//踢人者用户名
                    kickNickName:actorInfo.getAttribute('nick') || '',//踢人者昵称
                    kickedUserName:itemInfo.getAttribute('jid').split('#')[0],//被踢者用户名
                    kickedNickName:itemInfo.getAttribute('nick') ||'',//被踢者昵称                    
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'exited'){//退群信息
                dataJson["bodies"] = [];
                var itemInfo = msgX[i].getElementsByTagName("item")[0];               
                dataJson["bodies"][0] = {
                    type:typeArr[7],
                    groupType:DROP_ROOM //退群
                };
                dataJson["bodies"][0].item = {
                    dropUserName:itemInfo.getAttribute('jid').split('#')[0],//退群者用户名
                    dropNickName:itemInfo.getAttribute('nick'),//退群者昵称                   
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'ownerbehandover'){//群主转让信息
                dataJson["bodies"] = [];
                var itemInfo = msgX[i].getElementsByTagName("item")[0];
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];                
                dataJson["bodies"][0] = {
                    type:typeArr[7],
                    groupType:ROOM_OWENER //群主转让
                };
                dataJson["bodies"][0].item = {
                    oldOwnerUserName:actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid'),//旧群主用户名
                    oldOwnerNickName:actorInfo.getAttribute('nick') || '',//旧群主昵称
                    newOwnerUserName:itemInfo.getAttribute('jid').split('#')[0],//新群主用户名
                    newOwnerNickName:itemInfo.getAttribute('nick'),//新群主昵称                   
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:fileMessageExtention'){ //文件类型的消息
                dataJson["bodies"] = [];
                var $getNodeValue = function(nodeName){
                    return this.getElementsByTagName(nodeName) && this.getElementsByTagName(nodeName).length && this.getElementsByTagName(nodeName)[0].childNodes[0] && this.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
                };
                msgX[i].$getNodeValue = $getNodeValue;
                var fileType = msgX[i].$getNodeValue("fileType"),
                    fileName = msgX[i].$getNodeValue("fileName"),
                    original_link = msgX[i].$getNodeValue("original_link"),
                    middle_link = msgX[i].$getNodeValue("middle_link"),
                    small_link = msgX[i].$getNodeValue("small_link"),
                    fileLength = msgX[i].$getNodeValue("fileLength"),
                    width = msgX[i].$getNodeValue("width"),
                    height = msgX[i].$getNodeValue("height"),
                    duration = msgX[i].$getNodeValue("duration"),
                    latitude = msgX[i].$getNodeValue('latitude');
                    longitude = msgX[i].$getNodeValue('longitude');
                    location_desc = msgX[i].$getNodeValue('location_desc');
                if(fileType == -1){
                   fileType = 1; 
                }
                msgX[i].$getNodeValue = null;
                dataJson["bodies"][0]={
                    "type":typeArr[fileType],
                    "original_link":original_link,
                    "middle_link":middle_link,
                    "small_link":small_link,
                    "filename":fileName,
                    "fileType":fileType,
                    "fileLength":fileLength,
                    "width":width,
                    "height":height,
                    "duration":duration,
                    "latitude":latitude,
                    "longitude":longitude,
                    "location_desc":location_desc,
                };
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'set-natural-name'){//修改群名称
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:MODIFY_ROOMNAME
                };
                var actor = msgX[i].getElementsByTagName("actor")[0];
                dataJson["bodies"][0].item={
                    modifyUserName:actor.getAttribute("jid").split("#")[0] || actorInfo.getAttribute('jid'),//修改者用户名
                    modifyNickName:actor.getAttribute("nick") || "",//修改者昵称
                    newName:msgX[i].getElementsByTagName("newNaturalName")[0].textContent//群新名字
                }
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'http://jabber.org/protocol/muc#user'){
                msgItem = msgX[i].getElementsByTagName("item");
                msgInvite = msgX[i].getElementsByTagName("invite");//入群邀请信息
                msgAccept = msgX[i].getElementsByTagName("accept");//同意入群信息
                msgDecline = msgX[i].getElementsByTagName("decline");//拒绝入群信息
                dataJson["bodies"] = [];
                if(msgItem&&msgItem.length){ 
                    dataJson["bodies"][0]={type:typeArr[7]};
                    var jidItem,affiliation,oldaffiliation,item={members:[]};
                    for(var j=0;j<msgItem.length;j++){
                        //jidItem = msgItem[j].getAttribute('jid').split(' ');
                        jidItem = msgItem[j].getAttribute('jid');
                        affiliation = msgItem[j].getAttribute('affiliation');
                        oldaffiliation = msgItem[j].getAttribute('oldaffiliation');
                        nick = msgItem[j].getAttribute('nick');
                        if(affiliation == 'member' && oldaffiliation == 'none'){
                            item.members.push({
                                name:jidItem.substring(jidItem.indexOf('/')+1,jidItem.indexOf(' ')),//被邀请者用户名
                                nick:jidItem.substring(jidItem.indexOf(' ')+1,jidItem.length)//被邀请者昵称
                            })
                            item.applyUserName = dataJson.fromUserName;//邀请者用户名
                            item.applyNickName = dataJson.fromNickName;//邀请者昵称
                            dataJson["bodies"][0].groupType = APPL_MEMBER; //邀请群成员
                            dataJson["bodies"][0].item = item;
                        }else if(affiliation == 'none' && (oldaffiliation == 'member'||oldaffiliation == 'owner')){
                            var actor = msgX[i].getElementsByTagName('actor')
                            var jidActor = actor[0].getAttribute('jid');
                            if(jidActor.split('/')[0] == msgItem[j].getAttribute('jid').split('/')[0]){
                                dataJson["bodies"][0].groupType = DROP_ROOM; //退群
                                dataJson["bodies"][0].item = {
                                    dropUserName:dataJson.fromUserName,//退群者用户名
                                    dropNickName:dataJson.fromNickName//退群者昵称
                                }
                            }else{
                                actorNick = actor[0].getAttribute('nick');
                                msgItemjNick = msgItem[j].getAttribute('nick');
                                dataJson["bodies"][0].groupType = KICK_MEMBER; //群主踢人
                                dataJson["bodies"][0].item = {
                                    kickUserName:actorNick.substring(0,actorNick.indexOf(' ')),//踢者用户名
                                    kickNickName:actorNick.substring(actorNick.indexOf(' ')+1,actorNick.length),//踢者昵称
                                    kickedUserName:msgItemjNick.substring(0,msgItemjNick.indexOf(' ')),//被踢者用户名
                                    kickedNickName:msgItemjNick.substring(msgItemjNick.indexOf(' ')+1,msgItemjNick.length)//被踢者昵称
                                }
                            }
                        }else if(affiliation == 'owner' && oldaffiliation == 'member'){
                            dataJson["bodies"][0].groupType = ROOM_OWENER; //被推选为新群主
                            dataJson["bodies"][0].item = {
                                ownerName:jidItem.split('#')[0],//群主用户名
                                ownerNick:nick.substring(nick.indexOf(' ')+1,nick.length)//群主昵称
                            }
                        }
                    }
                    parseMsgData.errorMsg = false;
                    parseMsgData.data = [dataJson];
                }else if(msgInvite&&msgInvite.length){
                    var nick = msgInvite[0].getAttribute('nick');
                    dataJson["bodies"][0]={type:typeArr[12]};
                    dataJson["bodies"][0].inviteeType = INVITEE;//邀请
                    dataJson["bodies"][0].item = {
                        inviteeUserName:msgInvite[0].getAttribute('from').split('#')[0],//邀请者用户名
                        inviteeNickName:nick.substring(nick.indexOf(' ')+1,nick.length),//邀请者昵称
                    }
                    parseMsgData.errorMsg = false;
                    parseMsgData.data = [dataJson];
                }else if(msgAccept&&msgAccept.length){
                    var nick = msgAccept[0].getAttribute('nick');
                    dataJson["bodies"][0]={type:typeArr[12]};
                    dataJson["bodies"][0].inviteeType = ACCEPT;//同意
                    dataJson["bodies"][0].item = {
                        acceptUserName:msgAccept[0].getAttribute('from').split('#')[0],//同意者用户名
                        acceptNickName:nick.substring(nick.indexOf(' ')+1,nick.length),//同意者昵称
                    }
                    parseMsgData.errorMsg = false;
                    parseMsgData.data = [dataJson];
                }else if(msgDecline&&msgDecline.length){
                    var nick = msgDecline[0].getAttribute('nick');
                    dataJson["bodies"][0]={type:typeArr[12]};
                    dataJson["bodies"][0].inviteeType = DECLINE;//拒绝
                    dataJson["bodies"][0].item = {
                        declineUserName:msgDecline[0].getAttribute('from').split('#')[0],//拒绝者用户名
                        declineNickName:nick.substring(nick.indexOf(' ')+1,nick.length),//拒绝者昵称
                    }
                    parseMsgData.errorMsg = false;
                    parseMsgData.data = [dataJson];
                }
            }else if(msgX[i].getAttribute('xmlns') == 'nicknamechanged'){
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var actor = msgX[i].getElementsByTagName("actor")[0];        
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:MODIFY_NICKNAME_IN_ROOM
                };
                dataJson["bodies"][0].item={
                    //userName: msgItem.getAttribute("jid").split("#")[0],//用户名
                    newNickname:msgItem.getAttribute("nick"),//新昵称
                    modifyUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    modifyNickName:actor.getAttribute("nick"),//修改者昵称
                }                  
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];                              
            }else if(msgX[i].getAttribute('xmlns') == 'roomdestroyed'){   
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];         
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:DESTROY_ROOM
                };
                dataJson["bodies"][0].item={
                    roomOwnerUserName: actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid'),//被解散群群主用户名
                    roomOwnerNickname: actorInfo.getAttribute('nick') ||''//被解散群群主昵称
                }             
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];                              
            }else if(msgX[i].getAttribute('xmlns') == 'cmcc:offline:pushpull:count'){
                dataJson["bodies"][0].isOffline = true;
                dataJson["bodies"][0].count = msgX[i].textContent;
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson]; 
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:SystemMessageExtention'){//系统消息
                dataJson["bodies"] = [];
                var $getNodeValue = function(nodeName){
                    return this.getElementsByTagName(nodeName) && this.getElementsByTagName(nodeName).length && this.getElementsByTagName(nodeName)[0].childNodes[0] && this.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
                };
                msgX[i].$getNodeValue = $getNodeValue;
                dataJson["bodies"][0]={
                        type:typeArr[11],
                        title:msgX[i].$getNodeValue('title'),
                        content:msgX[i].$getNodeValue('content')
                    };
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:message:extraData'){//消息扩展
                dataJson["bodies"][0].extraData = msgX[i].textContent;
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson]; 
            }else if(msgX[i].getAttribute('xmlns') == 'beadmin'){//指定管理员
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var actor = msgX[i].getElementsByTagName("actor")[0];  
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:SET_ADMIN
                };
                dataJson["bodies"][0].item={
                    adminUserName: msgItem.getAttribute("jid").split("#")[0],//管理员用户名
                    adminNickname:msgItem.getAttribute("nick"),//管理员昵称
                    actorUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    actorNickName:actor.getAttribute("nick"),//修改者新昵称
                }                  
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];    
            }else if(msgX[i].getAttribute('xmlns') == 'admincanceled'){//取消管理员
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var actor = msgX[i].getElementsByTagName("actor")[0];  
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:CANCEL_ADMIN
                };
                dataJson["bodies"][0].item={
                    adminUserName: msgItem.getAttribute("jid").split("#")[0],//管理员用户名
                    adminNickname:msgItem.getAttribute("nick"),//管理员昵称
                    actorUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    actorNickName:actor.getAttribute("nick"),//修改者新昵称
                }                  
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];    
            }else if(msgX[i].getAttribute('xmlns') == 'joinrequest'){//申请入群
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var joinreason = msgX[i].getElementsByTagName("joinreason")[0];  
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:JOIN_REQUEST
                };
                dataJson["bodies"][0].item={
                    requestUserName: msgItem.getAttribute("jid").split("#")[0],//申请者用户名
                    requestNickname:msgItem.getAttribute("nick"),//申请者昵称
                    joinReason:joinreason.textContent,//加入原因
                }                  
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];    
            }else if(msgX[i].getAttribute('xmlns') == 'beapproved'){//申请通过
                var actorItem = msgX[i].getElementsByTagName("actor")[0];
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:BE_APPROVED
                };
                dataJson["bodies"][0].item={
                    actorUserName: actorItem.getAttribute("jid").split("#")[0],//审批者用户名
                    actorNickname:actorItem.getAttribute("nick"),//审批者者昵称
                }                  
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];    
            }else if(msgX[i].getAttribute('xmlns') == 'berefused'){//申请拒绝
                var actorItem = msgX[i].getElementsByTagName("actor")[0];
                dataJson["bodies"] = [];
                dataJson["bodies"][0]={
                    type:typeArr[7],
                    groupType:BE_REFUSED
                };
                dataJson["bodies"][0].item={
                    actorUserName: actorItem.getAttribute("jid").split("#")[0],//审批者用户名
                    actorNickname:actorItem.getAttribute("nick"),//审批者者昵称
                    refuseReason:msgX[i].getElementsByTagName("refusereason")[0].textContent //拒绝原因
                }                  
                parseMsgData.errorMsg = false;
                parseMsgData.data = [dataJson];    
            }
        }
        return parseMsgData;
    }
    return parseMsgData;
};
//不同消息处理
var processMessage ={
    //消息送达处理
    processArrive : function(msginfo,conn){
        msgReceived = msginfo.getElementsByTagName("received")
        var dataJson = {};
        dataJson.type = 'chat';
        dataJson.from = parseJid(msginfo.getAttribute("from"));
        dataJson.to = parseJid(msginfo.getAttribute('to'));
        var sendtimestamp = msginfo.getAttribute("sendtimestamp");
        dataJson.time = new Date(parseFloat(sendtimestamp)).format("yyyy-MM-dd hh:mm:ss");
        dataJson.receivedItem = {type:'arrive'};
        dataJson.receivedItem.id = msgReceived[0].getAttribute('id');
        dataJson.receivedItem.guid = guidToTime(msgReceived[0].getAttribute('guid'));
        dataJson.forward = parseJid(msginfo.getAttribute('to'));
        // if((dataJson.from == dataJson.to) && !dataJson.forward){//如果接收到自己的已读回执，并且不是伙伴终端

        // }
        if(conn){
           conn.onArriveMessage(dataJson); 
        }
        return;
    },
    //消息已读处理
    processReaded:function(msginfo,conn){
        msgReceived = msginfo.getElementsByTagName("received");
        var dataJson = {};
        dataJson.type = msginfo.getAttribute('type');
        dataJson.forward = parseJid(msginfo.getAttribute("forward")) || ""; //0620
        dataJson.isFriendTerminal = dataJson.forward ? true : false; //0620
        dataJson.from = parseJid(msginfo.getAttribute("from"));
        dataJson.to = parseJid(msginfo.getAttribute('to'));
        var guid = guidToTime(msginfo.getAttribute("guid"));
        dataJson.time = guid ? new Date(guid).format("yyyy-MM-dd hh:mm:ss"):'';
        dataJson.receivedItem = {type:'readed'};
        dataJson.receivedItem.guid = guidToTime(msgReceived[0].getAttribute('guid'));
        if(conn){
           conn.onReadedMessage(dataJson); 
        }
        return;
    }
}
var parseResponseMessageforHm = function(msginfo){
    var typeArr = ["txt","emotion","img","audio","file","location","video","system",'invitee'];
    var parseMsgData = {errorMsg:true,data:[]};
    var dataJson ={};
    var type = msginfo.getAttribute('type');
    var msgX = msginfo.getElementsByTagName('x');
    var msgBodies = msginfo.getElementsByTagName('body');
    var msgItem = msginfo.getElementsByTagName("item");
    dataJson.type = type;
    dataJson.guid = msginfo.getAttribute('guid');
    dataJson.time = new Date(parseFloat(guidToTime(dataJson.guid))).format("yyyy-MM-dd hh:mm:ss");
    var $getNodeValue = function(nodeName){
        return this.getElementsByTagName(nodeName) && this.getElementsByTagName(nodeName).length && this.getElementsByTagName(nodeName)[0].childNodes[0] && this.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
    };
    //如果是群消息，则解析群消息中from 字段的昵称
    var from = msginfo.getAttribute("from");

    if(type == 'groupchat'){
        if(from.indexOf('/') != -1){
            dataJson.fromNickName = from.substring(from.indexOf(' ')+1,from.length);
            dataJson.fromUserName = from.substring(from.indexOf('/')+1,from.indexOf(' '));    
        }
    }else if(type == 'chat'){
        dataJson.to = msginfo.getAttribute("to").split('#')[0];   
    }
    dataJson.from = from.split('#')[0];
    if(msgBodies){
        for (var i=0;i<msgBodies.length;i++){
            var msgBody = msgBodies[i];
            var childNodes = msgBody.childNodes;
            if(childNodes && childNodes.length>0){
                var childNode = msgBody.childNodes[0];
                if(childNode.nodeType==Strophe.ElementType.TEXT){
                    var jsondata = childNode.nodeValue;
                    jsondata = jsondata.replace('\n','<br>');
                    try{
                        var str = childNode.nodeValue;
                        // 验证str字符串是否是json格式 如果不是JSON就默认是三方软件发来的聊天记录
                        // 自己拼装成web端一致的JSON格式
                        var data;
                        if(testJson(str)){
                            data = eval("("+str+")");
                        }else{
                            dataJson.msgType = typeArr[0];
                            // var message = parseTextMessageFn(msgBodies[0].textContent);//转换文本消息，判断是否有表情
                            // if(message.isemotion){
                            //     dataJson.msgType = typeArr[1];
                            //     dataJson.data = message.body;
                            // }else{
                            //     dataJson.data = message.body;
                            // }
                            dataJson.data = msgBodies[0].textContent;
                        };
                    }catch(e){

                    }
                }
            }
        }
    } 
    if(msgX&&msgX.length){
        for (var i=0;i<msgX.length;i++){
            if(msgX[i].getAttribute('xmlns') == 'roomcreated'){ //创建群消息
                var items = msgX[i].getElementsByTagName("item");
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];
                var occupants = [];
                for(var j=0; j<items.length;j++){
                    occupants.push({
                        name:items[j].getAttribute('jid').split('#')[0],
                        nick:items[j].getAttribute('nick'),
                        affiliation:items[j].getAttribute('affiliation')
                    })
                }
                dataJson.groupType = CREATE_ROOM,//建群
                dataJson.item ={
                    roomId: msginfo.getAttribute("from").split('#')[0],
                    roomName: msginfo.getElementsByTagName("groupname")[0].textContent,
                    occupants: occupants,
                    createUserName:actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid')
                }
            }else if(msgX[i].getAttribute('xmlns') == 'inviting'){//入群邀请信息             
                var inviteMsg = msgX[i].getElementsByTagName("invite")[0];
                dataJson.inviteeType = INVITEE;//邀请
                dataJson.item = {
                    inviteeUserName:inviteMsg.getAttribute('from').split('#')[0],//邀请者用户名
                    inviteeNickName:inviteMsg.getAttribute('nick'),//邀请者昵称
                    roomId:msginfo.getAttribute("from").split('#')[0],//群id
                    roomName:inviteMsg.getAttribute('roomName')
                }
            }else if(msgX[i].getAttribute('xmlns') == 'invitationaccepted'){//同意入群信息
                var acceptMsg = msgX[i].getElementsByTagName("accept")[0]; 
                dataJson.inviteeType = ACCEPT;//同意
                dataJson.item = {
                    acceptUserName:acceptMsg.getAttribute('from').split('#')[0],//同意者用户名
                    acceptNickName:acceptMsg.getAttribute('nick')//同意者昵称
                }
            }else if(msgX[i].getAttribute('xmlns') == 'newmember'){//新成员接收邀请广播入群信息
                var itemInfo = msgX[i].getElementsByTagName("item");
                var actorInfo = msgX[i].getElementsByTagName("actor");
                dataJson.groupType=REQUEST_MEMBER;
                dataJson.item = {members:[]};
                for(var j=0; j<itemInfo.length; j++){
                    dataJson.item.members.push({
                        newMemberUserName:itemInfo[j].getAttribute('jid').split('#')[0],//新入群者用户名
                        newMemberNickName:itemInfo[j].getAttribute('nick'),//新入群者昵称
                    })
                }
                if(actorInfo.length > 0){
                    dataJson.item.applyUserName = actorInfo[0].getAttribute('jid').split('#')[0] || actorInfo[0].getAttribute('jid'),//邀请者用户名
                    dataJson.item.applyUserName = actorInfo[0].getAttribute('nick') ||''//邀请者昵称
                    dataJson.groupType = APPL_MEMBER;
                }
            }else if(msgX[i].getAttribute('xmlns') == 'newowner'){//老群主退群后，某成员成为新群主
                var itemInfo = msgX[i].getElementsByTagName("item")[0];
                dataJson.groupType=BE_NEWOWNER;
                dataJson.item = {
                    newOwnerUserName:itemInfo.getAttribute('jid').split('#')[0],//新群主用户名
                    newOwnerNickName:itemInfo.getAttribute('nick'),//新群主昵称      
                }
            }else if(msgX[i].getAttribute('xmlns') == 'invitationdeclined'){//拒绝入群信息
                var declineMsg = msgX[i].getElementsByTagName("decline")[0]; 
                dataJson.inviteeType = DECLINE;//拒绝
                dataJson.item = {
                    declineUserName:declineMsg.getAttribute('from').split('#')[0],//拒绝者用户名
                    declineNickName:declineMsg.getAttribute('nick')//拒绝者昵称
                }
            }else if(msgX[i].getAttribute('xmlns') == 'bekicked'){//踢人出群信息
                var itemInfo = msgX[i].getElementsByTagName("item")[0];
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];                
                dataJson.groupType = KICK_MEMBER; //群主踢人
                dataJson.item = {
                    kickUserName:actorInfo.getAttribute('jid').split('#')[0],//踢者用户名
                    kickNickName:actorInfo.getAttribute('nick'),//踢者昵称
                    kickedUserName:itemInfo.getAttribute('jid').split('#')[0],//被踢者用户名
                    kickedNickName:itemInfo.getAttribute('nick'),//被踢者昵称                    
                }
            }else if(msgX[i].getAttribute('xmlns') == 'exited'){//退群信息
                var itemInfo = msgX[i].getElementsByTagName("item")[0];               
                dataJson.groupType = DROP_ROOM; //退群
                dataJson.item = {
                    dropUserName:itemInfo.getAttribute('jid').split('#')[0],//退群者用户名
                    dropNickName:itemInfo.getAttribute('nick'),//退群者昵称
                    dropAffiliation:itemInfo.getAttribute('affiliation'),//退群者角色
                    dropOldAffiliation:itemInfo.getAttribute('oldaffiliation')//退群者原角色                    
                }
            }else if(msgX[i].getAttribute('xmlns') == 'ownerbehandover'){//群主转让信息
                var itemInfo = msgX[i].getElementsByTagName("item")[0];
                var actorInfo = msgX[i].getElementsByTagName("actor")[0];                
                dataJson.groupType = ROOM_OWENER; //群主转让
                dataJson.item = {
                    oldOwnerUserName:actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid'),//旧群主用户名
                    oldOwnerNickName:actorInfo.getAttribute('nick') || '',//旧群主昵称
                    newOwnerUserName:itemInfo.getAttribute('jid').split('#')[0],//新群主用户名
                    newOwnerNickName:itemInfo.getAttribute('nick'),//新群主昵称                   
                }
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:fileMessageExtention'){ //文件类型的消息
                var $getNodeValue = function(nodeName){
                    return this.getElementsByTagName(nodeName) && this.getElementsByTagName(nodeName).length && this.getElementsByTagName(nodeName)[0].childNodes[0] && this.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
                };
                msgX[i].$getNodeValue = $getNodeValue;
                var fileType = msgX[i].$getNodeValue('fileType');
                if( fileType == 1 || fileType == -1){
                    dataJson.msgType = typeArr[2];
                    dataJson.fileName = msgX[i].$getNodeValue('fileName');
                    dataJson.original_link = msgX[i].$getNodeValue('original_link');
                    dataJson.middle_link = msgX[i].$getNodeValue('middle_link');
                    dataJson.small_link = msgX[i].$getNodeValue('small_link');
                    dataJson.fileLength = msgX[i].$getNodeValue('fileLength');
                    dataJson.width = msgX[i].$getNodeValue('width');
                    dataJson.height = msgX[i].$getNodeValue('height');
                }else if(fileType == 2){
                    dataJson.msgType = typeArr[3];
                    dataJson.fileName = msgX[i].$getNodeValue('fileName');
                    dataJson.original_link = msgX[i].$getNodeValue('original_link');
                    dataJson.duration = msgX[i].$getNodeValue('duration');
                }else if(fileType == 4){
                    dataJson.msgType = typeArr[6];
                    dataJson.fileName = msgX[i].$getNodeValue('fileName');
                    dataJson.original_link = msgX[i].$getNodeValue('original_link');
                    dataJson.middle_link = msgX[i].$getNodeValue('middle_link');
                    dataJson.fileLength = msgX[i].$getNodeValue('fileLength');
                    dataJson.width = msgX[i].$getNodeValue('width');
                    dataJson.height = msgX[i].$getNodeValue('height');
                    dataJson.duration = msgX[i].$getNodeValue('duration');
                }else if(fileType == 6){
                    dataJson.msgType = typeArr[4];
                    dataJson.fileName = msgX[i].$getNodeValue('fileName');
                    dataJson.original_link = msgX[i].$getNodeValue('original_link');
                    dataJson.fileLength = msgX[i].$getNodeValue('fileLength');
                }else if(fileType == 10){
                    dataJson.msgType = typeArr[5];
                    dataJson.fileName = msgX[i].$getNodeValue('fileName');
                    dataJson.original_link = msgX[i].$getNodeValue('original_link');
                    dataJson.middle_link = msgX[i].$getNodeValue('middle_link');
                    dataJson.small_link = msgX[i].$getNodeValue('small_link');
                    dataJson.fileLength = msgX[i].$getNodeValue('fileLength');
                    dataJson.width = msgX[i].$getNodeValue('width');
                    dataJson.height = msgX[i].$getNodeValue('height');
                    dataJson.latitude = msgX[i].$getNodeValue('latitude');
                    dataJson.longitude = msgX[i].$getNodeValue('longitude');
                    dataJson.location_desc = msgX[i].$getNodeValue('location_desc');
                }
            }else if(msgX[i].getAttribute('xmlns') == 'set-natural-name'){//修改群名称
                dataJson.groupType = MODIFY_ROOMNAME;
                var actor = msgX[i].getElementsByTagName("actor")[0];
                dataJson.item={
                    modifyUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    modifyNickName:actor.getAttribute("nick")||"",//修改者昵称
                    newName:msgX[i].getElementsByTagName("newNaturalName")[0].textContent//群新名字
                }
            }else if(msgX[i].getAttribute('xmlns') == 'http://jabber.org/protocol/muc#user'){
                msgItem = msgX[i].getElementsByTagName("item");
                msgInvite = msgX[i].getElementsByTagName("invite");//入群邀请信息
                msgAccept = msgX[i].getElementsByTagName("accept");//同意入群信息
                msgDecline = msgX[i].getElementsByTagName("decline");//拒绝入群信息
                if(msgItem&&msgItem.length){
                    var jidItem,affiliation,oldaffiliation,item={members:[]};
                    for(var j=0;j<msgItem.length;j++){
                        //jidItem = msgItem[j].getAttribute('jid').split(' ');
                        jidItem = msgItem[j].getAttribute('jid');
                        affiliation = msgItem[j].getAttribute('affiliation');
                        oldaffiliation = msgItem[j].getAttribute('oldaffiliation');
                        nick = msgItem[j].getAttribute('nick');
                        if(affiliation == 'member' && oldaffiliation == 'none'){
                            item.members.push({
                                name:jidItem.substring(jidItem.indexOf('/')+1,jidItem.indexOf(' ')),//被邀请者用户名
                                nick:jidItem.substring(jidItem.indexOf(' ')+1,jidItem.length)//被邀请者昵称
                            })
                            item.applyUserName = dataJson.fromUserName;//邀请者用户名
                            item.applyNickName = dataJson.fromNickName;//邀请者昵称
                            dataJson.groupType = APPL_MEMBER; //邀请群成员
                            dataJson.item = item;
                        }else if(affiliation == 'none' && (oldaffiliation == 'member'||oldaffiliation == 'owner')){
                            var actor = msgX[i].getElementsByTagName('actor')
                            var jidActor = actor[0].getAttribute('jid');
                            if(jidActor.split('/')[0] == msgItem[j].getAttribute('jid').split('/')[0]){
                                dataJson.groupType = DROP_ROOM; //退群
                                dataJson.item = {
                                    dropUserName:dataJson.fromUserName,//退群者用户名
                                    dropNickName:dataJson.fromNickName//退群者昵称
                                }
                            }else{
                                actorNick = actor[0].getAttribute('nick');
                                dataJson.groupType = KICK_MEMBER; //群主踢人
                                dataJson.item = {
                                    kickUserName:actorNick.substring(0,actorNick.indexOf(' ')),//踢者用户名
                                    kickNickName:actorNick.substring(actorNick.indexOf(' ')+1,actorNick.length),//踢者昵称
                                    kickedUserName:msgItemjNick.substring(0,msgItemjNick.indexOf(' ')),//被踢者用户名
                                    kickedNickName:msgItemjNick.substring(msgItemjNick.indexOf(' ')+1,msgItemjNick.length)//被踢者昵称
                                }
                            }
                        }else if(affiliation == 'owner' && oldaffiliation == 'member'){
                            dataJson.groupType = ROOM_OWENER; //被推选为新群主
                            dataJson.item = {
                                ownerName:jidItem.split('#')[0],//群主用户名
                                ownerNick:nick.substring(nick.indexOf(' ')+1,nick.length)//群主昵称
                            }
                        }
                    }
                }else if(msgInvite&&msgInvite.length){
                    var nick = msgInvite[0].getAttribute('nick');
                    dataJson.inviteeType = INVITEE;//邀请
                    dataJson.item = {
                        inviteeUserName:msgInvite[0].getAttribute('from').split('#')[0],//邀请者用户名
                        inviteeNickName:msgInvite[0].getAttribute('nick').split(' ')[1],//邀请者昵称
                    }
                }else if(msgAccept&&msgAccept.length){
                    var nick = msgAccept[0].getAttribute('nick');
                    dataJson.type = 'invitee';
                    dataJson.from=from.split('#')[0];
                    dataJson.to = msginfo.getAttribute('to').split('#')[0];
                    dataJson.inviteeType = ACCEPT;//同意
                    dataJson.item = {
                        acceptUserName:msgAccept[0].getAttribute('from').split('#')[0],//同意者用户名
                        acceptNickName:nick.substring(nick.indexOf(' ')+1,nick.length),//同意者昵称
                    }
                    delete dataJson.fromUserName;
                    delete dataJson.fromNickName;
                }else if(msgDecline&&msgDecline.length){
                    var nick = msgDecline[0].getAttribute('nick');
                    dataJson.inviteeType = DECLINE;//拒绝
                    dataJson.item = {
                        declineUserName:msgDecline[0].getAttribute('from').split('#')[0],//拒绝者用户名
                        declineNickName:nick.substring(nick.indexOf(' ')+1,nick.length),//拒绝者昵称
                    }
                }
            }else if(msgX[i].getAttribute('xmlns') == 'nicknamechanged'){
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var actor = msgX[i].getElementsByTagName("actor")[0];    
                dataJson.groupType = MODIFY_NICKNAME_IN_ROOM;
                dataJson.item={
                   // userName: msgItem.getAttribute("jid").split("#")[0],//用户名
                    newNickname:msgItem.getAttribute("nick"),//新昵称
                    modifyUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    modifyNickName:actor.getAttribute("nick"),//修改者新昵称
                }
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:roomdestroyed'){
                dataJson.groupType = DESTROY_ROOM;
                var actorInfo = msgX[i].getElementsByTagName("actor")[0]; 
                dataJson.item={
                    roomOwnerUserName: actorInfo.getAttribute('jid').split('#')[0] || actorInfo.getAttribute('jid'),//被解散群群主用户名
                    roomOwnerNickname: actorInfo.getAttribute('nick') ||''//被解散群群主昵称
                }                                                                 
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:SystemMessageExtention'){//系统消息
                var $getNodeValue = function(nodeName){
                    return this.getElementsByTagName(nodeName) && this.getElementsByTagName(nodeName).length && this.getElementsByTagName(nodeName)[0].childNodes[0] && this.getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
                };
                msgX[i].$getNodeValue = $getNodeValue;
                dataJson.msgType = typeArr[7];
                dataJson.title = msgX[i].$getNodeValue('title');
                dataJson.content = msgX[i].$getNodeValue('content');
            }else if(msgX[i].getAttribute('xmlns') == 'jabber:x:message:extraData'){//消息扩展
                dataJson.extraData = msgX[i].textContent;
            }else if(msgX[i].getAttribute('xmlns') == 'beadmin'){//指定管理员
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var actor = msgX[i].getElementsByTagName("actor")[0];  
                dataJson.groupType = SET_ADMIN;
                dataJson.item={
                    adminUserName: msgItem.getAttribute("jid").split("#")[0],//管理员用户名
                    adminNickname:msgItem.getAttribute("nick"),//管理员昵称
                    actorUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    actorNickName:actor.getAttribute("nick"),//修改者新昵称
                }         
            }else if(msgX[i].getAttribute('xmlns') == 'admincanceled'){//取消管理员
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var actor = msgX[i].getElementsByTagName("actor")[0];  
                dataJson.groupType = CANCEL_ADMIN;
                dataJson.item={
                    adminUserName: msgItem.getAttribute("jid").split("#")[0],//管理员用户名
                    adminNickname:msgItem.getAttribute("nick"),//管理员昵称
                    actorUserName:actor.getAttribute("jid").split("#")[0],//修改者用户名
                    actorNickName:actor.getAttribute("nick"),//修改者新昵称
                }      
            }else if(msgX[i].getAttribute('xmlns') == 'joinrequest'){//申请入群
                var msgItem = msgX[i].getElementsByTagName("item")[0];
                var joinreason = msgX[i].getElementsByTagName("joinreason")[0];
                dataJson.groupType = JOIN_REQUEST;
                dataJson.item={
                    requestUserName: msgItem.getAttribute("jid").split("#")[0],//申请者用户名
                    requestNickname:msgItem.getAttribute("nick"),//申请者昵称
                    joinReason:joinreason.textContent,//加入原因
                }                  
            }else if(msgX[i].getAttribute('xmlns') == 'beapproved'){//申请通过
                var actorItem = msgX[i].getElementsByTagName("actor")[0];
                dataJson.groupType = BE_APPROVED;
                dataJson.item={
                    actorUserName: actorItem.getAttribute("jid").split("#")[0],//审批者用户名
                    actorNickname:actorItem.getAttribute("nick"),//审批者者昵称
                }                   
            }else if(msgX[i].getAttribute('xmlns') == 'berefused'){//申请拒绝
                var actorItem = msgX[i].getElementsByTagName("actor")[0];
                dataJson.groupType = BE_REFUSED;
                dataJson.item={
                    actorUserName: actorItem.getAttribute("jid").split("#")[0],//审批者用户名
                    actorNickname:actorItem.getAttribute("nick"),//审批者者昵称
                    refuseReason:msgX[i].getElementsByTagName("refusereason")[0].textContent //拒绝原因
                }                    
            }
        }
    }
    return dataJson;
};
var parseReadedMessageforHm = function(msginfo){
    msgReceived = msginfo.getElementsByTagName("received");
    var dataJson = {};
    dataJson.type = msginfo.getAttribute('type');
    dataJson.from = parseJid(msginfo.getAttribute("from"));
    dataJson.to = parseJid(msginfo.getAttribute('to'));
    var guid = guidToTime(msginfo.getAttribute("guid"));
    dataJson.time = guid ? new Date(guid).format("yyyy-MM-dd hh:mm:ss"):'';
    dataJson.receivedItem = {type:'readed'};
    dataJson.receivedItem.guid = guidToTime(msgReceived[0].getAttribute('guid'));
    return dataJson;
}
var parseFriendFn = function(queryTag){
    var rouster = [];
    var items = queryTag.getElementsByTagName("item");
    if(items){
        for(var i=0;i<items.length;i++){
            var item = items[i];
            var jid = item.getAttribute('jid');
            if(!jid){
                continue;
            }
            var subscription = item.getAttribute('subscription');
            var phone = item.getAttribute('phone');
            var friend = {
                name:parseNameFromJidFn(jid)
            };
            if(subscription){
                 friend.subscription = subscription;
            }
            if(phone || phone == ''){
                friend.phone = phone;
            }
            var ask = item.getAttribute('ask');
            if(ask){
                //friend.ask = ask;
            }
            var nick = item.getAttribute('name');
            if(nick || nick == ''){
                friend.nick = nick;
            }
            if(subscription == "both" || subscription== "from" || subscription == "to"){
                rouster.push(friend);
            }
            // } else {
            //  var n = parseNameFromJidFn(jid).split('#')[0];
            //  friend.nick = n;
            // }
            // var groups = [];
            // Strophe.forEachChild(item, 'group',function(group){
            //  groups.push(Strophe.getText(group));
            // });
            // friend.groups = groups;
        }
    }
    return rouster;
};
var parseFriendFnForMute = function(queryTag){
    var rouster = [];
    var items = queryTag.getElementsByTagName("item");
    if(items){
        for(var i=0;i<items.length;i++){
            var item = items[i];
            var jid = item.getAttribute('jid');
            if(!jid){
                continue;
            }
            var friend = {
                name:parseNameFromJidFn(jid)
            };
            rouster.push(friend);
        }
    }
    return rouster;
};
var parseRoomFn = function(result){
    var rooms = [];
    var items = result.getElementsByTagName("item");
    if(items){
        for(var i=0;i<items.length;i++){
            var item = items[i];
            var roomJid = item.getAttribute('jid');
            var tmp = roomJid.split("#")[0];
            var silentFlag = item.getAttribute('silent');
            var room = {
                    name : item.getAttribute('roomName'),
                    roomId : tmp,
                    mute : silentFlag == "true" ? true :false
                };
            rooms.push(room);
        }
    }
    return rooms;
};
var parseJid = function(jid){
    if(jid){
        return jid.split('#')[0];
    }
    return '';
}
var parseRoomOccupantsFn = function(result){
    var occupants = [];
    var items = result.getElementsByTagName("item");
    if(items){
        for(var i=0;i<items.length;i++){
            var item = items[i];
            var room = {
                    jid : item.getAttribute('jid'),
                    name : item.getAttribute('name')
                };
            occupants.push(room);
        }
    }
    return occupants;
}
var login2UserGrid = function(options){
    options = options || {};
    var appKey = options.appKey || '';
    var devInfos = appKey.split('#');
    if(devInfos.length!=2){
        error({
            type : LITTLEC_IM_CONNCTION_OPEN_USERGRID_ERROR,
            msg : '请指定正确的开发者信息(appKey)'
        });
        return false;
    }
    var orgName = devInfos[0];
    var appName = devInfos[1];
    if(!orgName){
        error({
            type : LITTLEC_IM_CONNCTION_OPEN_USERGRID_ERROR,
            msg : '请指定正确的开发者信息(appKey)'
        });
        return false;
    }
    if(!appName){
        error({
            type : LITTLEC_IM_CONNCTION_OPEN_USERGRID_ERROR,
            msg : '请指定正确的开发者信息(appKey)'
        });
        return false;
    }
    var suc = options.success || emptyFn;
    var error = options.error || emptyFn;
    var user = options.user || '';
    var pwd = options.pwd || '';
    return dologin2UserGrid(user,pwd,orgName,appName,suc,error);
};
var dologin2UserGrid = function(user,pwd,orgName,appName,suc,error) {
    //var loginUrl = 'http://a1.LITTLEC.com/' + orgName + '/' + appName + '/token';
    var loginJson = {
        grant_type : 'password',
        username : user,
        password : pwd
    };
    var loginfo = JSON.stringify(loginJson);
    
    var options = {
        url : loginUrl,
        dataType : 'json',
        data : loginfo,
        success : suc || emptyFn,
        error : error || emptyFn
    };
    var param = doAjaxRequest(options);
    return param;
};
var innerCheck = function(options,conn){
    if (conn.isOpened() || conn.isOpening()) {
        conn.onError({
            type : LITTLEC_IM_CONNCTION_REOPEN_ERROR,
            msg : '重复打开连接,请先关闭连接再打开'
        });
        return false;
    }
    options = options || {};
    
    var user = options.user || '';

    if (options.user == '') {
        conn.onError({
            type : LITTLEC_IM_CONNCTION_USER_NOT_ASSIGN_ERROR,
            msg : '未指定用户'
        });
        return false;
    }
    var jid = user+conn.appKey + "@" + conn.domain;
    var resource = conn.resource;
    if(resource != ""){
        jid = jid + "/" + resource;
    }
    conn.context.jid = jid;
    conn.context.userId = user+conn.appKey;
    return true;
};
 /**
 * 
 * @param status
 * @param msg
 * @param conn
 */
var login2ImCallback = function (status,msg,conn){
    if (status == Strophe.Status.CONNFAIL){
      conn.onError({
            type : LITTLEC_IM_CONNCTION_OPEN_ERROR,
            msg : '登录失败,'+msg
        });
    } else if ((status == Strophe.Status.ATTACHED) || (status == Strophe.Status.CONNECTED)){
        var handleMessage = function(msginfo){
            conn.handleMessage(msginfo);
            return true;
        };
        var handlePresence = function(msginfo){
            conn.handlePresence(msginfo);
            return true;
        };
        var handlePing = function(msginfo){
            conn.handlePing(msginfo);
            return true;
        };
        var handleIq = function(msginfo){
            conn.handleIq(msginfo);
            return true;
        };
        var handleStreamError = function(msginfo){
            conn.handleStreamError(msginfo);
            return true;
        };
        conn.addHandler(handleMessage, null, 'message', null, null,  null);
        conn.addHandler(handlePresence, null, 'presence', null, null,  null);
        conn.addHandler(handlePing, "urn:xmpp:ping", 'iq', "get", null,  null);
        conn.addHandler(handleIq, "jabber:iq:roster", 'iq', "set", null,  null);
        conn.addHandler(handleIq, "jabber:client", 'iq', "error", null,  null); //add 20160615 for add roster repeat
        conn.addHandler(handleStreamError, null, 'stream:error', null, null,  null);
        conn.context.status = STATUS_OPENED;
        var supportRecMessage = [
               LITTLEC_IM_MESSAGE_REC_TEXT,
               LITTLEC_IM_MESSAGE_REC_EMOTION,
               LITTLEC_IM_MESSAGE_REC_GROUPCHAT
           ];
        if (isCanDownLoadFile) {
            supportRecMessage.push(LITTLEC_IM_MESSAGE_REC_PHOTO);
            supportRecMessage.push(LITTLEC_IM_MESSAGE_REC_AUDIO_FILE);
        }
        var supportSedMessage = [ LITTLEC_IM_MESSAGE_SED_TEXT ];
        if (isCanUploadFile) {
            supportSedMessage.push(LITTLEC_IM_MESSAGE_REC_PHOTO);
            supportSedMessage.push(LITTLEC_IM_MESSAGE_REC_AUDIO_FILE);
        }
        //就绪
        conn.setPresence();
        conn.onOpened({
            canReceive : supportRecMessage,
            canSend : supportSedMessage,
            accessToken : conn.context.accessToken
        });
    } else if (status == Strophe.Status.DISCONNECTING) {
        if(conn.isOpened()){// 不是主动关闭
            conn.context.status = STATUS_CLOSING;
            conn.onError({
                type : LITTLEC_IM_CONNCTION_SERVER_CLOSE_ERROR,
                msg : "服务器断开连接"
            });
        }
    } else if (status == Strophe.Status.DISCONNECTED) {
        conn.context.status = STATUS_CLOSED;
        conn.clear();
        conn.onClosed(msg);
    } else if (status == Strophe.Status.AUTHFAIL){
        conn.onError({
            type : LITTLEC_IM_CONNCTION_AUTH_ERROR,
            msg : '登录失败,请输入正确的用户名和密码'
        });
        conn.clear();
    } else if(status == Strophe.Status.ERROR){
        conn.onError({
            type : LITTLEC_IM_CONNCTION_SERVER_ERROR,
            msg : msg || '服务器异常'
        });
    } else if(status == Strophe.Status.NETWORKERR){
        if(msg == '网络中断或服务器异常导致断开连接，请重新登录！'){
            conn.context.status = STATUS_CLOSED;
            conn.clear();
            conn.close();
            //重新获取配置
            conn.queryServiceIp(conn.appKey.substring(1));
        }
        conn.onError({
            type : LITTLEC_IM_CONNCTION_NETWORK_ERROR,
            msg : msg || '网络异常'
        });
    }   
};
var getJid = function(options,conn){
    var jid = '';
    if(options.to){
        jid = options.to + conn.appKey + "@"+conn.domain;
        if(options.type == 'groupchat'){
            jid = options.to +conn.appKey+'@group.' + conn.domain;
        }
        if(options.resource){
            jid += "/" + options.resource;
        }
    }
    return jid;
};

var handleIqError = function(ele){
    var iqType = ele.getAttribute("type");
    var errInfo = {};
    if(iqType == "error"){
        var errorTag = ele.getElementsByTagName("error")[0];
        errInfo.type = ele.getElementsByTagName("error")[0].getAttribute("code");
        var descTag = errorTag.getElementsByTagName("desc")[0];
        errInfo.msg = descTag.textContent;
    }else{
        errInfo.type = "-1";
        errInfo.msg = "unknown msg";
    }
    return errInfo;
}

var parseUserBaseInfo = function(ele){
    var userInfo = {};
    var textContent = ele.firstChild.textContent;
    userInfo.creationDate = new Date(parseInt(ele.getAttribute("creationDate"))).format("yyyy-MM-dd hh:mm:ss");
    userInfo.userName = textContent.split("#")[0];
    userInfo.nick = textContent.substring(textContent.indexOf("/")+1);
    return userInfo;
}
//参数校验
var paramValid = {
    //处理好友的有关接口
    checkSubcribe:function(options,conn){
        return this.checkSubCommon(options,conn);
    },
    checkSubcribed:function(options,conn){
        return this.checkSubCommon(options,conn);
    },
    checkUnSubcribe:function(options,conn){
        return this.checkSubCommon(options,conn);
    },
    checkUnSubcribed:function(options,conn){
       return this.checkSubCommon(options,conn);
    },
    checkRemoveRoster:function(options,conn){
       return this.checkSubCommon(options,conn);
    },
    checkSubCommon:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var regName = /^[a-zA-Z0-9_]{1,50}$/;
            var paramMsg = {flag:false};
            if(!options){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"输入参数为空！"
                })
                return paramMsg;
            }
            if(!options.to){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"to字段不能为空！"
                })
                return paramMsg;
            }
            if(!regName.test(options.to)){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"to字段不合法！"
                })
                return paramMsg;
            }
            var userNameId = options.to +conn.appKey;
            if(userNameId == conn.context.jid.split('@')[0]){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"to字段不能为自己的用户名！"
                })
                return paramMsg;
            }
            paramMsg.flag = true;
            paramMsg.toJid = getJid(options,conn);
            paramMsg.message = options.message;
            paramMsg.nick = options.nick;
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }

    },
    //处理发送文本、多媒体消息有关接口
    checkSendText:function(options,conn,isSMS){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkMsgCommon(options,conn,true);
            if(paramMsg.flag){
                if(options.msg===undefined || options.msg===null || options.msg ===''){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"msg字段不能为空！"
                    })
                    paramMsg.flag = false;
                    return paramMsg;
                }
                if(isSMS&&options.msg.length > 1000){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"msg内容不能超过1000个字！"
                    })
                    paramMsg.flag = false;
                    return paramMsg;
                }
                paramMsg.msg = options.msg;
            }
            return paramMsg;  
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },   
    checkSendPicture:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
           var paramMsg = this.checkMsgCommon(options,conn,true);
            if(paramMsg.flag){
                paramMsg = this.checkMsgFile(options,conn,'pic',paramMsg);
            }
            return paramMsg; 
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        } 
    },
    checkSendAudio:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
             var paramMsg = this.checkMsgCommon(options,conn,true);
            if(paramMsg.flag){
                paramMsg = this.checkMsgFile(options,conn,'aud',paramMsg);
            }
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        } 
    },
    checkSendVideo:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
             var paramMsg = this.checkMsgCommon(options,conn,true);
            if(paramMsg.flag){
                paramMsg = this.checkMsgFile(options,conn,'video',paramMsg);
            }
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        } 
    },
    checkSendFile:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
             var paramMsg = this.checkMsgCommon(options,conn,true);
            if(paramMsg.flag){
                paramMsg = this.checkMsgFile(options,conn,'file',paramMsg);
            }
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkSendMsgReaded:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkMsgCommon(options,conn);
            if(paramMsg.flag){
                var reg = /^[0-9]*$/;
                if(options.guid === undefined || options.guid === null || options.guid === ""){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"guid字段不能为空！"
                    })
                    paramMsg.flag = false;
                    return paramMsg;
                }
                if(!reg.test(options.guid)){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"guid字段不合法！"
                    })
                    paramMsg.flag = false;
                    return paramMsg;
                }
                paramMsg.guid =options.guid; 
            }
            return paramMsg;  
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkMsgCommon:function(options,conn,isForMsgSend){
        var error = options.error || options.onFileUploadError || emptyFn;
        var regName = /^[a-zA-Z0-9_]{1,50}$/;
        var regRoomId1 = /^[a-zA-Z][0-9]{16,16}$/;
        var regRoomId2 = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
        var paramMsg = {flag:false};
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.to){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"to字段不能为空！"
            })
            return paramMsg;
        }
        if(!options.type){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"type字段不能为空！"
            })
            return paramMsg;
        }
        if(options.type == 'chat'){
            if(isForMsgSend){   //除了发消息时需要用到这个验证方法，别的时候也会用到
                var tempUserNameArray = options.to;   
                if(!(tempUserNameArray instanceof Array)){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"to字段的类型只能是数组."
                    })
                    return paramMsg;
                }else{
                    for(var i=0; i<tempUserNameArray.length;i++){
                        tempUserNameArray[i] = strTrim(tempUserNameArray[i]);
                        if(!regName.test(tempUserNameArray[i])){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"to["+i+"]字段不合法."
                            }) 
                            return paramMsg;
                        }else if(!tempUserNameArray[i]){
                             error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"to["+i+"]字段为空."
                            })
                            return paramMsg; 
                        }
                        var tempOptions = {};
                        tempOptions.to = tempUserNameArray[i];
                        tempOptions.type = 'chat';
                        tempUserNameArray[i] = getJid(tempOptions,conn);
                    }
                }      
                paramMsg.toJid = tempUserNameArray;                
            }
            else{
                if(!regName.test(options.to) ) {
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"to字段不合法！"
                    })
                    return paramMsg;
                }
                paramMsg.toJid = getJid(options,conn);
            }


            //var userNameId = options.to +conn.appKey;
            // if(userNameId == conn.context.jid.split('@')[0]){
            //     error({
            //         type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
            //         msg:"to字段不能为自己的用户名！"
            //     })
            //     return paramMsg;
            // }
        } else if(options.type == 'groupchat'){
            if(!(options.to instanceof Array)){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"to字段的类型只能是数组."
                })
                return paramMsg;
            }       
            if(options.to.length != 1){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"群聊时数组to的长度只能为1."
                })
                return paramMsg;
            }                 
            if((!regRoomId1.test(options.to[0])) && (!regRoomId2.test(options.to[0]))){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"to字段不合法！"
                })
                return paramMsg;
            }
            var tempOptions = options;
            tempOptions.to = options.to[0];
            paramMsg.toJid = [];
            paramMsg.toJid[0] = getJid(tempOptions,conn);
        }else{
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"type字段不合法！"
            })
            return paramMsg;
        }
        if(options.isExtra === true){
            if(!(options.extraData && typeof options.extraData=='string'&& options.extraData.constructor==String)){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"expandData字段为有值的字符串！"
                })
                return paramMsg;
            }
            paramMsg.isExtra = true;
            paramMsg.extraData = options.extraData;
        }else{
            if(!(options.isExtra === undefined) && !(options.isExtra === false)){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"isExtra字段不合法！"
                })
                return paramMsg;   
            }
            paramMsg.isExtra = false;
            paramMsg.extraData = options.extraData;
        }
        paramMsg.flag = true;
        return paramMsg;
    },
    checkMsgFile:function(options,conn,checkType,paramMsg){
        var error = options.error || options.onFileUploadError || emptyFn;
        paramMsg.flag = false;
        if(!options.fileInputId){
            error({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '文件id为空,请选择文件！'
            });
            return paramMsg;
        }
        if(!document.getElementById(options.fileInputId)){
            error({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '上传文件错误，文件不存在！'
            });
            return paramMsg;
        }
        var file = getFileUrlFn(options.fileInputId);
        if(!file.filetype){
            error({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '上传文件错误，文件为空！'
            });
            return paramMsg;
        }
        options.fileInfo = file;
        var fileSize = getFileSizeFn(options.fileInputId);
        if(fileSize > 10485760){
            error({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '上传文件超过服务器大小限制(10M)'
            });
            return paramMsg;
        }else if(fileSize <= 0){
            error({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '上传文件大小为0'
            });
            return paramMsg;
        }
        if(!isCanUploadFile){
            error({
                type : LITTLEC_IM_UPLOADFILE_BROWSER_ERROR,
                msg : '当前浏览器不支持异步上传文件,请换用其他浏览器'
            });
            return paramMsg;
        } 
        if(checkType == 'pic'){
            if(!(options.fileInfo.filetype.toLowerCase() in picType)){
                error({
                    type : LITTLEC_IM_UPLOADFILE_ERROR,
                    msg : '上传图片错误，该格式不支持'
                });
                return paramMsg;
            }
        }else if(checkType == 'aud'){
            if(!(options.fileInfo.filetype.toLowerCase() in audType)){
                error({
                    type : LITTLEC_IM_UPLOADFILE_ERROR,
                    msg : '上传音频错误，该格式不支持'
                });
                return paramMsg;
            }
        }else if (checkType == 'file') {
            if(!(options.fileInfo.filetype.toLowerCase() in filesType)){
                error({
                    type : LITTLEC_IM_UPLOADFILE_ERROR,
                    msg : '上传文件错误，该格式不支持'
                });
                return paramMsg;
            }
        }else if (checkType == 'video') {
            if(!(options.fileInfo.filetype.toLowerCase() in videoType)){
                error({
                    type : LITTLEC_IM_UPLOADFILE_ERROR,
                    msg : '上传文件错误，该格式不支持'
                });
                return paramMsg;
            }
        } else{
            error({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '上传文件错误，未知错误'
            });
            return paramMsg;
        }
        paramMsg.flag = true;
        paramMsg.fileInputId = options.fileInputId;
        paramMsg.fileInfo = file;
        paramMsg.fileInfo.size =fileSize;
        return paramMsg;
    },
    //处理获取历史消息相关接口
    checkHmChat:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkMsgCommon(options,conn); 
            if(paramMsg.flag){
                return this.checkHmCommon(options,conn,paramMsg);
            }else{
                return paramMsg;
            }
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkHmGroupChat:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkRoomId(options,conn); 
            if(paramMsg.flag){
                return this.checkHmCommon(options,conn,paramMsg);
            }else{
                return paramMsg;
            }
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkHmCommon:function(options,conn,paramMsg){
        var error =  options.error || emptyFn;
        var limit = options.limit;  
        paramMsg.flag = false;
        var reg = /^[0-9]*$/;
        if(options.direction && options.direction!= 0 &&options.direction!=1){
            error({
                type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                msg : '查询方向direction值不正确！'
            });
            return paramMsg;
        }
        if(options.includebegin&&options.includebegin!=0&&options.includebegin!=1){
            error({
                type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                msg : 'includebegin值不正确！'
            });
            return paramMsg;
        }
        if(!limit){
            error({
                type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                msg : 'limit字段不能为空！'
            });
            return paramMsg;
        }else{
            if(limit>100 || limit<=0 || isNaN(limit)){
                error({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : 'limit字段不合法！'
                });
                return paramMsg;
            }
        }
        if(options.begin){
            if(!reg.test(options.begin)){
                error({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : 'begin字段不合法!'
                });
                return paramMsg;
            }
        }
        paramMsg.flag = true;
        paramMsg.from =conn.context.userId.split('@')[0];
        paramMsg.limit = options.limit;
        if(options.direction || options.direction == 0){
            paramMsg.direction = options.direction;
        }
        if(options.begin){
            paramMsg.begin = options.begin;
        }
        if(options.includebegin || options.includebegin == 0){
            paramMsg.includebegin = options.includebegin;
        }
        if(options.end){
            paramMsg.end = options.end;
        }
        return paramMsg;
    },
    checkRoomId:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = {flag:false};
            var regRoomId = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
            if(!options){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"输入参数为空！"
                })
                return paramMsg;
            }
            if(!options.roomId){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"roomId字段不能为空！"
                })
                return paramMsg;
            }
            // if(!regRoomId.test(options.roomId)){
            //     error({
            //         type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
            //         msg:"roomId字段不合法！"
            //     })
            //     return paramMsg;
            // }
            paramMsg.flag = true;
            paramMsg.roomId = options.roomId+conn.appKey;
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkTo:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var regName = /^[a-zA-Z0-9_]{1,50}$/;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.to){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"to字段不能为空！"
            })
            return paramMsg;
        }
        if(!regName.test(options.to)){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"to字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        var userNameId = options.to +conn.appKey;
        paramMsg.toJid = userNameId+"@"+conn.domain;
        return paramMsg;
    },
    checkUserName:function(options,conn,paramMsg,selfFlag){
        var error = options.error || emptyFn;
        var regName = /^[a-zA-Z0-9_]{1,50}$/;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.userName){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"用户名字段不能为空！"
            })
            return paramMsg;
        }
        if(!regName.test(options.userName)){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"用户名字段不合法！"
            })
            return paramMsg;
        }
        var userNameId = options.userName +conn.appKey;
        if(userNameId == conn.context.jid.split('@')[0] && !selfFlag){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"userName字段不能为自己的用户名！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        paramMsg.toJid = userNameId+"@"+conn.domain;
        return paramMsg;
    },
    checkNickName:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        var nick = options.nick;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!nick){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"昵称字段不能为空！"
            })
            return paramMsg;
        }
        if(nick.length>50){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"昵称字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        paramMsg.nick = nick;
        return paramMsg;
    },
    checkRoomName:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var regName = /^[*]{1,50}$/;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.roomName){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"roomName字段不能为空！"
            })
            return paramMsg;
        }
        //options.roomName = strTrim(options.roomName);
        if(options.roomName.length > 50){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"roomName字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        paramMsg.roomName =options.roomName;
        return paramMsg;
    },
    checkReason:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.reason){
            options.reason = "";
        }
        if(options.reason && options.reason.length > 50){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"reason字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        paramMsg.reason =options.reason;
        return paramMsg;
    },
    checkApprovebyadmin:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.approvebyadmin){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"approvebyadmin字段不能为空！"
            })
            return paramMsg;
        }
        if(options.approvebyadmin != "yes" && options.approvebyadmin != "no"){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"approvebyadmin字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        paramMsg.approvebyadmin =options.approvebyadmin;
        return paramMsg;
    },
    //群操作接口
    checkCreateRoom:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkRoomName(options,conn);
            if(paramMsg.flag){
                var members = options.members;
                var tmpMembers = {roomMembers:[],roomInvitees:[]};
                var regName = /^[a-zA-Z0-9_]{1,50}$/;
                var repeat = false;
                var names = [];
                //options.ownerNick = strTrim(options.ownerNick);
                if(options.ownerNick && options.ownerNick.length > 50){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"ownerNick字段不合法！"
                    }) 
                    paramMsg.flag = false;
                    return paramMsg; 
                }else if(!options.ownerNick){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"ownerNick字段为空！"
                    })
                    paramMsg.flag = false;
                    return paramMsg; 
                }
                if(members && (members instanceof Array)){
                    for(var i=0; i<members.length;i++){
                        //members[i].memberName = strTrim(members[i].memberName);
                        //members[i].memberNick = strTrim(members[i].memberNick);
                        if(!regName.test(members[i].memberName)){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberName字段不合法！"
                            }) 
                            paramMsg.flag = false;
                            return paramMsg;
                        }else if(!members[i].memberName){
                             error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberName字段为空！"
                            })
                            paramMsg.flag = false;
                            return paramMsg; 
                        }
                        if(members[i].memberNick && members[i].memberNick.length > 50){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberNick字段不合法！"
                            }) 
                            paramMsg.flag = false;
                            return paramMsg; 
                        }else if(!members[i].memberNick){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberNick字段为空！"
                            })
                            paramMsg.flag = false;
                            return paramMsg; 
                        }
                        if(members[i].memberName == conn.context.jid.split('#')[0]){
                            continue;
                        }else{
                            for(var j=0;j<names.length;j++){
                                if(members[i].memberName == names[j]){
                                    repeat = true;
                                    break;
                                }
                            }
                            if(!repeat){
                                var tmpMember = members[i];
                                if(tmpMember.isInvitee === undefined ||tmpMember.isInvitee === false || tmpMember.isInvitee === 0){
                                    tmpMember.isInvitee = false;
                                    tmpMembers.roomMembers.push(tmpMember);
                                }else if(tmpMember.isInvitee === 1 || tmpMember.isInvitee === true){
                                    tmpMembers.roomInvitees.push(tmpMember);
                                }else{
                                    error({
                                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                        msg:"members["+i+"].isInvitee字段非法！"
                                    })
                                    paramMsg.flag = false;
                                    return paramMsg; 
                                }
                                names.push(tmpMember.memberName);
                            }
                            repeat = false;
                        }
                    }
                    //var membersLength = tmpMembers.roomMembers.length + tmpMembers.roomInvitees.length;
                    // if(membersLength<2){
                    //     var resaon = '群成员人数必须大于2人';
                    //     if(repeat){
                    //         resaon +=',群成员中有重复';
                    //     }
                    //     error({
                    //         type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    //         msg:resaon
                    //     }) 
                    //     paramMsg.flag = false;
                    //     return paramMsg;
                    // }
                }else{
                   paramMsg.flag = false;
                   error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"members字段不合法！"
                   }) 
                   return paramMsg;
                }
                paramMsg.members = tmpMembers;
                paramMsg.ownerNick = options.ownerNick;
            }
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkApplyMember:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkRoomId(options,conn);
            if(paramMsg.flag){
                var members = options.members;
                var tmpMembers = {roomMembers:[],roomInvitees:[]};
                var regName = /^[a-zA-Z0-9_]{1,50}$/;
                var repeat = false;
                var names = [];
                if(members && (members instanceof Array)){
                    for(var i=0; i<members.length;i++){
                        // members[i].memberName = strTrim(members[i].memberName);
                        // members[i].memberNick = strTrim(members[i].memberNick);
                        if(!regName.test(members[i].memberName)){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberName字段不合法！"
                            }) 
                            paramMsg.flag = false;
                            return paramMsg;
                        }else if(!members[i].memberName){
                             error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberName字段为空！"
                            })
                            paramMsg.flag = false;
                            return paramMsg; 
                        }
                        if(members[i].memberNick && members[i].memberNick.length > 50){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberNick字段不合法！"
                            }) 
                            paramMsg.flag = false;
                            return paramMsg; 
                        }else if(!members[i].memberNick){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberNick字段为空！"
                            })
                            paramMsg.flag = false;
                            return paramMsg; 
                        }
                        if(members[i].memberName == conn.context.jid.split('#')[0]){
                            continue;
                        }else{
                            for(var j=0;j<names.length;j++){
                                if(members[i].memberName == names[j]){
                                    repeat = true;
                                    break;
                                }
                            }
                            if(!repeat){
                                var tmpMember = members[i];
                                if(tmpMember.isInvitee === undefined ||tmpMember.isInvitee === false || tmpMember.isInvitee === 0){
                                    tmpMember.isInvitee = false;
                                    tmpMembers.roomMembers.push(tmpMember);
                                }else if(tmpMember.isInvitee === 1 || tmpMember.isInvitee === true){
                                    tmpMembers.roomInvitees.push(tmpMember);
                                }else{
                                    error({
                                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                        msg:"members["+i+"].isInvitee字段非法！"
                                    })
                                    paramMsg.flag = false;
                                    return paramMsg; 
                                }
                                names.push(tmpMember.memberName);
                            }
                            repeat = false;
                        }
                    }
                    var membersLength = tmpMembers.roomMembers.length + tmpMembers.roomInvitees.length;
                    if(membersLength<1){
                        error({
                            type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                            msg:'邀请成员至少1人'
                        }) 
                        paramMsg.flag = false;
                        return paramMsg;
                    }
                }else{
                   paramMsg.flag = false;
                   error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"members字段不合法！"
                   }) 
                   return paramMsg;
                }
                paramMsg.members = tmpMembers;
            }
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkKickMember:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkRoomId(options,conn); 
            if(paramMsg.flag){
                return this.checkUserName(options,conn,paramMsg);
            }else{
                return paramMsg;
            }
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    checkModifyRoomName:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkRoomId(options,conn); 
            if(paramMsg.flag){
                return this.checkRoomName(options,conn,paramMsg);
            }else{
                return paramMsg;
            }
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },

    checkMuteFlag:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        paramMsg.silent = null;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if( typeof(options.mute) == 'boolean' ){
            if(options.mute == true){
                paramMsg.silent = '1';
            }else if(options.mute == false){
                paramMsg.silent = '0';
            }
        }
        else{
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"mute字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.flag = true;
        return paramMsg;        
    },
    checkHandleAdmin:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkRoomId(options,conn);
            if(paramMsg.flag){
                var members = options.members;
                var regName = /^[a-zA-Z0-9_]{1,50}$/;
                var repeat = false;
                var names = [];
                if(members && (members instanceof Array)){
                    for(var i=0; i<members.length;i++){
                        if(!regName.test(members[i])){
                            error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"]字段不合法！"
                            }) 
                            paramMsg.flag = false;
                            return paramMsg;
                        }else if(!members[i]){
                             error({
                                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                                msg:"members["+i+"].memberName字段为空！"
                            })
                            paramMsg.flag = false;
                            return paramMsg; 
                        }
                        if(members[i] == conn.context.jid.split('#')[0]){
                            continue;
                        }else{
                            for(var j=0;j<names.length;j++){
                                if(members[i] == names[j]){
                                    repeat = true;
                                    break;
                                }
                            }
                            if(!repeat){
                                names.push(members[i]);
                            }
                            repeat = false;
                        }
                    }
                    if(names.length<1){
                        error({
                            type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                            msg:'指定管理员至少1人'
                        }) 
                        paramMsg.flag = false;
                        return paramMsg;
                    }
                }else{
                   paramMsg.flag = false;
                   error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"members字段不合法！"
                   }) 
                   return paramMsg;
                }
                paramMsg.members = names;
            }
            return paramMsg;
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    },
    // checkJoinRoom:function(){
    //     var error = options.error || emptyFn;
    //     if(conn.isOpened()){
    //         var paramMsg = this.checkRoomId(options,conn);
    //         if(paramMsg.flag){
    //            checkNickName
    //         }
    //         return paramMsg;
    //     }else{
    //         error({
    //             type : LITTLEC_IM_CONNCTION_ERROR,
    //             msg : '未连接，请登录您的账号'  
    //         })
    //         return {flag:false};
    //     }
    // },
    //修改手机号 
    checkModifyUserPhone:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkPhone(options,conn); 
            if(paramMsg.flag){
                return this.checkPhoneCode(options,conn,paramMsg);
            }else{
                return paramMsg;
            }
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        } 
    },
    checkPhone:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var regPhone = /^(1[0-9]{10})$/;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        var phone = options.phone;
        if(!phone){
            error({
                type : LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg : 'phone字段为空'  
            })
            return paramMsg;
        }
        if(!regPhone.test(phone)){
            error({
                type : LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg : 'phone字段不合法'  
            })
            return paramMsg;  
        }
        paramMsg.flag = true;
        paramMsg.phone = phone;
        return paramMsg; 
    },
    checkPhoneCode:function(options,conn,paramMsg){
        var error = options.error || emptyFn;
        var regPhonecode = /^([0-9]{4})$/;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        var phonecode = options.phonecode;
        if(!phonecode){
            error({
                type : LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg : 'phoneCode字段为空'  
            })
            return paramMsg;
        }
        if(!regPhonecode.test(phonecode)){
            error({
                type : LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg : 'phoneCode字段不合法'  
            })
            return paramMsg;  
        }
        paramMsg.flag = true;
        paramMsg.phonecode = phonecode;
        return paramMsg; 
    },
    //获取账号密码
    checkUserNameForPassword:function(options){
        var error = options.error || emptyFn;
        var regName = /^[a-zA-Z0-9_]{1,50}$/;
        var paramMsg = paramMsg || {flag:false};
        paramMsg.flag = false;
        if(!options){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"输入参数为空！"
            })
            return paramMsg;
        }
        if(!options.userName){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"用户名字段不能为空！"
            })
            return paramMsg;
        }
        if(!regName.test(options.userName)){
            error({
                type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                msg:"用户名字段不合法！"
            })
            return paramMsg;
        }
        paramMsg.userName= options.userName;
        paramMsg.flag = true;
        return paramMsg; 
    },
    //修改账号密码
    checkModifyUserPassword:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = {flag:false};
            var reg = /^[A-Za-z0-9`~!@#$%\^\&*()-=_+:;,.<>\'\"\|{}\[\]\\?\/]{6,32}$/;
            if(!options){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"输入参数为空！"
                })
                return paramMsg;
            }
            if(!options.oldPassword){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"oldPassword字段不能为空！"
                })
                return paramMsg;
            }
            if(!options.newPassword){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"newPassword字段不能为空！"
                })
                return paramMsg;
            }
            if(!reg.test(options.oldPassword)){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"oldPassword字段不合法！"
                })
                return paramMsg;
            }
            if(!reg.test(options.newPassword)){
                error({
                    type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                    msg:"newPassword字段不合法！"
                })
                return paramMsg;
            }
            paramMsg.oldPassword= options.oldPassword;
            paramMsg.newPassword= options.newPassword;
            paramMsg.flag = true;
            return paramMsg; 
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false}; 
        }
    },
    //设置联系人免打扰
    checkMuteNotifications:function(options,conn){
        var error = options.error || emptyFn;
        if(conn.isOpened()){
            var paramMsg = this.checkUserName(options,conn,null,true);
            if(paramMsg.flag){
                if(options.mute === undefined){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"mute字段不能为空！"
                    })
                    paramMsg.flag = false;
                    return paramMsg;
                }
                if(!(options.mute === true || options.mute === false)){
                    error({
                        type:LITTLEC_IM_CONNCTION_PARAM_ERROR,
                        msg:"mute字段不合法！"
                    })
                    paramMsg.flag = false;
                    return paramMsg;
                }
                paramMsg.mute =options.mute ? 1:0;  
                paramMsg.flag = true; 
                return paramMsg;        

            }else{
                return paramMsg;
            }
        }else{
            error({
                type : LITTLEC_IM_CONNCTION_ERROR,
                msg : '未连接，请登录您的账号'  
            })
            return {flag:false};
        }
    }   
};

//连接状态
tempIndex = 0;
var STATUS_INIT = tempIndex++;
var STATUS_DOLOGIN_USERGRID = tempIndex++;
var STATUS_DOLOGIN_IM = tempIndex++;
var STATUS_OPENED = tempIndex++;
var STATUS_CLOSING = tempIndex++;
var STATUS_CLOSED = tempIndex++;
//连接对象
var connection = function() {
}
connection.prototype.init = function(options) {
   if(options == undefined || options == null){
        console.log('输入参数为空！');
        return;
    }
    this.isOpenDelay = options.isOpenDelay || true;
    this.wait = options.wait || 60;
    this.hold = options.hold || 1;
    this.domain = options.domain || "li726-26";
    this.resource = options.resource || "web";
    this.inactivity = options.inactivity || 60;
    this.maxRetries = options.maxRetries || 5;
    this.pollingTime = options.pollingTime || 200;
    this.stropheConn = false;
    if(options.route){
        this.route = options.route;
    }
    this.onOpened = options.onOpened || emptyFn;
    this.onClosed = options.onClosed || emptyFn;
    this.onTextMessage = options.onTextMessage || emptyFn;
    // this.onEmotionMessage = options.onEmotionMessage || emptyFn;
    this.onPictureMessage = options.onPictureMessage || emptyFn;
    this.onAudioMessage = options.onAudioMessage || emptyFn;
    this.onFileMessage = options.onFileMessage || emptyFn;
    this.onLocationMessage = options.onLocationMessage || emptyFn;
    this.onVideoMessage = options.onVideoMessage || emptyFn;
    this.onGroupChatMessage = options.onGroupChatMessage || emptyFn;
    this.onSystemMessage = options.onSystemMessage || emptyFn;
    this.onOfflineMessage = options.onOfflineMessage || emptyFn;
    this.onArriveMessage = options.onArriveMessage || emptyFn;
    this.onReadedMessage = options.onReadedMessage || emptyFn;
    this.onInviteeMessage = options.onInviteeMessage || emptyFn;

    this.onPresence = options.onPresence || emptyFn;
    this.onRoster = options.onRoster || emptyFn;
    this.onReciveApply = options.onReciveApply || emptyFn;
    this.onReciveDropout = options.onReciveDropout || emptyFn;
    this.onError = options.onError || emptyFn;
    this.context = {
        status : STATUS_INIT
    };
    this.roomName = '';
    this.roomMembers= [];
    this.options = {};
    if(!options.appKey){
        this.appKey = '';
    }else{
        var reg=/^[\d]{6}[A-Za-z]{2}$/;
        if(!reg.test(options.appKey)){
            alert('您的appKey不合法，请重新初始化！')
            return;
        }
        this.equalAppkey(options.appKey);
        this.appKey = options.appKey.indexOf('#') > -1 ? options.appKey:'#'+options.appKey;
    }
    if(!this.hasConfig()){
        this.queryServiceIp(options.appKey);
    }
}
// user, pwd, appKey, resource
connection.prototype.open = function(options) {
    if(options == undefined || options == null){
        console.log('输入参数为空！');
        return;
    }
    var pass = innerCheck(options,this);
    if(pass == false)return;

    var pwd = options.pwd || '';

    var conn = this;
    conn.context.status = STATUS_DOLOGIN_IM;

    conn.url = config.imServerIP+":"+config.imServerPort+"/http-bind/";
    var stropheConn = new Strophe.Connection(conn.url,{
                    inactivity : conn.inactivity,
                    maxRetries : conn.maxRetries,
                    pollingTime : conn.pollingTime
    });
    var callback = function(status,msg){
        login2ImCallback(status,msg,conn);
    };
    var jid = conn.context.jid;
    conn.context.stropheConn = stropheConn;

    if(conn.route){
        stropheConn.connect(jid,pwd,callback,conn.wait,conn.hold,conn.route);
    } else {
        stropheConn.connect(jid,pwd,callback,conn.wait,conn.hold);
    }
    conn.context.status = STATUS_DOLOGIN_USERGRID;
};
connection.prototype.attach = function(options) {
    if(options == undefined || options == null){
        console.log('输入参数为空！');
        return;
    }
    var pass = innerCheck(options,this);
    if(pass == false)
        return;
    options = options || {};
    
    var accessToken = options.accessToken || '';
    if(accessToken == ''){
        this.onError({
            type : LITTLEC_IM_CONNCTION_ATTACH_USERGRID_ERROR,
            msg : '未指定用户的accessToken'
        });
        return;
    }

    var sid = options.sid || '';
    if(sid == ''){
        this.onError({
            type : LITTLEC_IM_CONNCTION_ATTACH_ERROR,
            msg : '未指定用户的会话信息'
        });
        return;
    }
    
    var rid = options.rid || '';
    if(rid == ''){
        this.onError({
            type : LITTLEC_IM_CONNCTION_ATTACH_ERROR,
            msg : '未指定用户的消息id'
        });
        return;
    }
    
    var stropheConn = new Strophe.Connection(this.url,{
                        inactivity : this.inactivity,
                        maxRetries : this.maxRetries,
                        pollingTime : this.pollingTime
    });
    
    this.context.accessToken = accessToken;
    this.context.stropheConn = stropheConn;
    this.context.status = STATUS_DOLOGIN_IM;
    
    var conn = this;
    var callback = function(status,msg){
        login2ImCallback(status,msg,conn);
    };
    var jid = this.context.jid;
    var wait = this.wait;
    var hold = this.hold;
    var wind = this.wind || 5;
    stropheConn.attach(jid, sid, rid, callback, wait, hold, wind);
};
connection.prototype.close = function() {
    var status = this.context.status;
    if (status==STATUS_INIT) {
        return;
    }
    if(this.isClosed() || this.isClosing()){
        return;
    }
    this.context.status = STATUS_CLOSING;
    this.context.stropheConn.disconnect();
};
// see stropheConn.addHandler
connection.prototype.addHandler = function (handler, ns, name, type, id, from, options){
    this.context.stropheConn.addHandler(handler, ns, name, type, id, from, options);
};
connection.prototype.handlePresence = function(msginfo){
    if(this.isClosed()){
        return;
    }
    var from = msginfo.getAttribute('from') || '';
    var to = msginfo.getAttribute('to') || '';
    var type = msginfo.getAttribute('type') || '';
    var fromUser = parseNameFromJidFn(from);
    var toUser = parseNameFromJidFn(to);
    var info = {
        from: fromUser,
        to : toUser,
        // fromJid : from,
        // toJid : to,
        type : type
    };
    var showTags = msginfo.getElementsByTagName("show");
    if(showTags && showTags.length>0){
        var showTag = showTags[0];
        info.show = Strophe.getText(showTag);
    }
    var statusTags = msginfo.getElementsByTagName("status");
    if(statusTags && statusTags.length>0){
        var statusTag = statusTags[0];
        info.message = Strophe.getText(statusTag);
    }
    
    var priorityTags = msginfo.getElementsByTagName("priority");
    // if(priorityTags && priorityTags.length>0){
    //     var priorityTag = priorityTags[0];
    //     info.priority  = Strophe.getText(priorityTag);
    // }
    if(info.type =="unsubscribed" || info.type =="subscribe" || info.type =="subscribed" || info.type =="unsubscribe"){
        this.onPresence(info,msginfo);
    }
};
connection.prototype.handlePing = function(e) {
    if(this.isClosed()){
        return;
    }
    var id = e.getAttribute('id');
    var from = e.getAttribute('from');
    var to = e.getAttribute('to');
    var dom = $iq({
                from : to,
                to : from,
                id : id,
                type : 'result'
    });
    this.sendCommand(dom.tree());
};
connection.prototype.handleIq = function(e) {
    var id = e.getAttribute('id');
    var from = e.getAttribute('from') || '';
    var name = parseNameFromJidFn(from);
    var curJid = this.context.jid;
    var curUser = this.context.userId;
    if (from !== "" && from != curJid && curUser != name)
        return true;
        
    var iqresult = $iq({type: 'result', id: id, from: curJid});
    this.sendCommand(iqresult.tree());
    
    var msgBodies = e.getElementsByTagName("query");
    if(msgBodies&&msgBodies.length>0){
        var queryTag = msgBodies[0];
        var rouster = parseFriendFn(queryTag);
        this.onRoster(rouster);
    }
    if(e.getAttribute("type") == "error"){
        funcError(handleIqError(e));
    }
    return true;
};
connection.prototype.handleStreamError = function(e) {
    if(this.isClosed()){
        return;
    }
    var errorTag = e.childNodes[0].nodeName;
    if(errorTag == 'not-authorized'){
        conn.onError({
            type : LITTLEC_IM_USER_REMOVE,
            msg : '用户被删除'
        });
    }
    if(errorTag == 'conflict'){
        conn.onError({
            type : LITTLEC_IM_USER_CONFLICT,
            msg : '用户在其它登录'
        });
    }
};
connection.prototype.handleMessage = function(msginfo){
    if(this.isClosed()){
        return;
    }
    var parseMsgData = parseResponseMessageFn(msginfo,this);
    if(parseMsgData.errorMsg){
        if(parseMsgData.data.bodyMsg == "过滤自己"){
            return;
        }
        this.onError({
            msg:parseMsgData.data.bodyMsg,
            type:parseMsgData.data.type
        })
        return;
    }
    var msgDatas = parseMsgData.data;
    if(msgDatas&& msgDatas.length >0){
        for(var i in msgDatas){
            var msg = msgDatas[i];
            var from = msg.from;
            var too = msg.to;
            var guid = msg.guid;
            var fromNickName = msg.fromNickName;
            var fromUserName = msg.fromUserName;
            var forward = msg.forward;
            var isFriendTerminal = msg.isFriendTerminal;
            var fromFullJID = msg.fromFullJID;
            var time = msg.time ?  new Date(msg.time).format("yyyy-MM-dd hh:mm:ss"):'';
            msg.id =  msginfo.getAttribute("id");
            var chattype;
            if(msginfo.attributes['type']){
               chattype =  msginfo.attributes['type'].value || 'chat';
            }
            var msgBodies = msg.bodies;
            if(!msgBodies || msgBodies.length==0){
                continue;
            }
            var msgBody = msg.bodies[0];
            var type = msgBody.type;
            var isOffline = msgBody.isOffline;
            //用户开启回执功能的时候 发送接收回执给服务器 edit by  lim
            if(this.isOpenDelay){
                this.sendRecieveCall(msg);
            }
            if ("txt" == type) {
                var receiveMsg = msgBody.msg;
                // var emotionsbody = parseTextMessageFn(receiveMsg);
                var msgto = {type : chattype,from : from,to : too, time:time,guid:guid};
                if(fromNickName){
                    msgto.fromNickName = fromNickName;
                }
                if(fromUserName){
                    msgto.fromUserName = fromUserName;
                }
                if(msgBody.extraData){
                    msgto.extraData = msgBody.extraData;
                }
                if(forward){
                    msgto.forward = forward;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                msgto.data = escape(receiveMsg);
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onTextMessage(msgto);
                }  
            }else if ("img" == type) {
                var msgto = {
                    type : chattype,
                    from : from,
                    to : too,
                    time:time,
                    guid:guid,
                    original_link : msgBody.original_link,
                    middle_link:msgBody.middle_link,
                    small_link:msgBody.small_link,
                    fileName : msgBody.filename,
                    fileLength : msgBody.fileLength||'',
                    width : msgBody.width,
                    height : msgBody.height,
                };
                if(fromNickName){
                    msgto.fromNickName = fromNickName;
                }
                if(fromUserName){
                    msgto.fromUserName = fromUserName;
                }
                if(msgBody.extraData){
                    msgto.extraData = msgBody.extraData;
                }
                if(forward){
                    msgto.forward = forward;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onPictureMessage(msgto); 
                }
            }else if ("audio" == type) {
                var msgto = {
                    type : chattype,
                    from : from,
                    to : too,
                    time:time,
                    guid:guid,
                    original_link : msgBody.original_link,
                    fileName : msgBody.filename,
                    duration:msgBody.duration
                }
                if(fromNickName){
                    msgto.fromNickName = fromNickName;
                }
                if(fromUserName){
                    msgto.fromUserName = fromUserName;
                }
                if(msgBody.extraData){
                    msgto.extraData = msgBody.extraData;
                }
                if(forward){
                    msgto.forward = forward;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onAudioMessage(msgto);
                }
            }else if ("file" == type) {
                var msgto = {
                    type : chattype,
                    from : from,
                    to : too,
                    time:time,
                    guid:guid,
                    original_link : msgBody.original_link,
                    fileName : msgBody.filename,
                    fileLength : msgBody.fileLength,
                }
                if(fromNickName){
                    msgto.fromNickName = fromNickName;
                }
                if(fromUserName){
                    msgto.fromUserName = fromUserName;
                }
                if(msgBody.extraData){
                    msgto.extraData = msgBody.extraData;
                }
                if(forward){
                    msgto.forward = forward;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onFileMessage(msgto);
                }
            }else if("location" == type){
                var msgto = {
                    type : chattype,
                    from : from,
                    to : too,
                    time:time,
                    guid:guid,
                    original_link : msgBody.original_link,
                    middle_link:msgBody.middle_link,
                    small_link:msgBody.small_link,
                    filename : msgBody.filename,
                    fileLength : msgBody.fileLength||'',
                    width : msgBody.width,
                    height : msgBody.height,
                    latitude : msgBody.latitude,
                    longitude : msgBody.longitude,
                    location_desc : msgBody.location_desc
                };
                if(fromNickName){
                    msgto.fromNickName = fromNickName;
                }
                if(fromUserName){
                    msgto.fromUserName = fromUserName;
                }
                if(msgBody.extraData){
                    msgto.extraData = msgBody.extraData;
                }
                if(forward){
                    msgto.forward = forward;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onLocationMessage(msgto);
                }
            }else if("video" == type){
                var msgto = {
                    type : chattype,
                    from : from,
                    to : too,
                    time:time,
                    guid:guid,
                    original_link : msgBody.original_link,
                    picture_link : msgBody.middle_link,
                    filename : msgBody.filename,
                    fileLength : msgBody.fileLength,
                    width : msgBody.width,
                    height : msgBody.height,
                    duration : msgBody.duration
                }
                if(fromNickName){
                    msgto.fromNickName = fromNickName;
                }
                if(fromUserName){
                    msgto.fromUserName = fromUserName;
                }
                if(msgBody.extraData){
                    msgto.extraData = msgBody.extraData;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(forward){
                    msgto.forward = forward;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onVideoMessage(msgto);
                }
            }else if("groupchat" == type){
                var msgto = {
                    type: chattype,
                    from: from,
                    to: too,
                    time:time,
                    guid:guid
                }
                if(msgBody.item != undefined){
                    msgto.item = msgBody.item;
                }
                if(msgBody.groupType != undefined){
                    msgto.groupType = msgBody.groupType;
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onGroupChatMessage(msgto)
                }
            }else if("system" == type){
                this.onSystemMessage({
                    from : msg.from,
                    to : too,
                    time:time,
                    guid:guid,
                    type:'system',
                    title : msgBody.title,
                    content:msgBody.content
                });
            }else if("invitee" == type){
                var msgto = {
                    from : msg.from,
                    to : too,
                    time:time,
                    guid:guid,
                    type:'invitee',
                    inviteeType: msgBody.inviteeType,
                    item:msgBody.item
                }
                if(isFriendTerminal){
                    msgto.isFriendTerminal = isFriendTerminal;
                }
                if(isOffline){
                    msgto.count = msgBody.count;
                    this.onOfflineMessage(msgto);
                }else{
                    this.onInviteeMessage(msgto)
                }
            }
        } 
    }
};
/* @author limin
 发送接收消息回执给服务器
 */
connection.prototype.sendRecieveCall = function(msg) {
    var toJid = this.domain;
    var fromJid = msg.from;
    var sendId = this.getUniqueId();
    var dom = $msg({
        id: sendId ,
        to : toJid,
        from : fromJid
    }).c("received", {
            xmlns: "urn:cmcc:xmpp:receipts",
            id:msg.id
        });
    this.sendCommand(dom.tree());
};
/* @author xiayefeng
 发送已读回执消息回执给服务器
 */
connection.prototype.sendMsgReaded = function(options) {
    if(options){
        options.type = 'chat';
    }
    var paramMsg = paramValid.checkSendMsgReaded(options,this);
    if(!paramMsg.flag)return;
    var uniqueId = this.getUniqueId();
    var dom = $msg({
        id: uniqueId,
        to : paramMsg.toJid,
        type:'chat',
        from : this.context.jid
    }).c("received", {
            xmlns: "urn:xmpp:receipts",
            type:"readed",
            guid:paramMsg.guid
        });
    this.sendCommand(dom.tree());
};
connection.prototype.sendCommand = function(dom) {
    if(this.isOpened()){
        this.context.stropheConn.send(dom);
    } else {
        this.onError({
            type : LITTLEC_IM_CONNCTION_OPEN_ERROR,
            msg : '连接还未建立,请先登录或等待登录处理完毕'
        });
    }
};
connection.prototype.getUniqueId = function (prefix){
    var Num = '';
    for(var i=0;i<8;i++) { 
        Num+=Math.floor(Math.random()*10); 
    }
    if (typeof(prefix) == "string" || typeof(prefix) == "number") {
        return prefix+"_"+Num;
    } else {
        return 'WEBIM_'+Num;
    }
};
connection.prototype.sendTextMessage = function(options) {
    var paramMsg = paramValid.checkSendText(options,this);
    if(!paramMsg.flag)return;

    var uniqueId = this.getUniqueId();

    if(paramMsg.toJid.length == 1){    //单聊或群聊
        var dom = $msg({
            to : paramMsg.toJid[0],
            type : options.type || 'chat',
            id : uniqueId,
            xmlns : "jabber:client"
        }).c("body").t(paramMsg.msg).up();
        if(paramMsg.isExtra){
            dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(paramMsg.extraData).up();
        }       
    }else{ //群发 
        var dom = $msg({
            id : uniqueId,
            to : this.domain,
            type : 'chat'
        }).c("body").t(paramMsg.msg).up()
        .c('addresses',{xmlns:'http://jabber.org/protocol/address'});

        for(var i=0;i<paramMsg.toJid.length;i++){
            dom.c('address',{type:'bcc',jid:paramMsg.toJid[i]}).up();
        }
        dom.up();
    }

    dom.c("request",{"xmlns":Strophe.NS.RECEIPTS,'type':'arrive|readed'}); 
    cmdQueue.push({id:uniqueId,cmdName:"发送消息：["+paramMsg.msg+"]"}); 
    this.sendCommand(dom.tree());
};
connection.prototype.sendPicture = function(options) {
    var paramMsg = paramValid.checkSendPicture(options,this);
    if(!paramMsg.flag) return;
    var conn = this;
    var onFileUploadComplete = options.onFileUploadComplete || emptyFn;
    var myUploadComplete = function(data) {
        data.height = options.height;
        data.width = options.width;
        onFileUploadComplete(data);
        var opt = {};
        opt.to = paramMsg.toJid || "";
        opt.filename = paramMsg.fileInfo.filename || "";
        opt.type = options.type || "";
        opt.middle_link = data.middle_link || "";
        opt.original_link = data.original_link || "";
        opt.small_link = data.small_link || "";
        opt.filelength = paramMsg.fileInfo.size || "";
        opt.height = options.height || "";
        opt.width = options.width || "";
        opt.isExtra = paramMsg.isExtra || false;
        opt.extraData = paramMsg.extraData || '';
        conn.sendPictureMessage(opt);
    };
    options.onFileUploadComplete = myUploadComplete;
    options.onFileUploadError = options.onFileUploadError|| this.onError || emptyFn;
    var image = new Image();
    var imageLoadFn = function() {
        image.onload = null;
        if (!this.readyState || this.readyState == 'loaded'
                || this.readyState == 'complete') {
            var heigth = image.height;
            var width = image.width;
            options.height = heigth;
            options.width = width;
            options.appName = conn.context.appName || '';
            options.orgName = conn.context.orgName || '';
            options.accessToken = conn.context.accessToken || '';
            uploadFn(options);
        };
    };
    image.onerror = function() {
        image.onerror = function(){
            image.onerror = null;
            options.onFileUploadError({
                type : LITTLEC_IM_UPLOADFILE_ERROR,
                msg : '指定的图片不存在或者不是一个图片格式文件'
            });
        };
        image.src = document.getElementById(options.fileInputId).value;
    };
    if("onload" in image){
        image.onload = imageLoadFn;
    } else {
        image.onreadystatechange = imageLoadFn;
    }
    if (!paramMsg.fileInfo.url) {
        options.onFileUploadError({
            type : LITTLEC_IM_UPLOADFILE_NO_FILE,
            msg : '未选择上传文件'
        });
    } else {
        image.src = paramMsg.fileInfo.url;
    }
};
connection.prototype.sendPictureMessage = function(options) {
    var dom,
        fileType,
        uniqueId = this.getUniqueId(),
        nameLength = options.filename.length,
        picType = options.filename.substring(nameLength-4,nameLength);
    fileType = picType == '.gif' ? -1:1;  
    if(options.type == 'chat'){
        // var tmplink = options.original_link.replace(/(\/original\/)/,'$1real\/');
        if(options.to.length == 1){    //单聊或群聊
            dom = $msg({
                type : 'chat',
                to : options.to[0],
                id : uniqueId
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c0").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(fileType).up()
            .c("original_link").t(options.original_link).up()
            .c("middle_link").t(options.middle_link).up()
            .c("small_link").t(options.small_link).up()
            .c("fileLength").t(options.filelength).up()
            .c("width").t(options.width).up()
            .c("height").t(options.height).up().up();
            if(options.isExtra){
                dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
            }
        }else{ //群发 
            dom = $msg({
                id : uniqueId,
                to : this.domain,
                type : 'chat'
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c0").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(fileType).up()
            .c("original_link").t(tmplink).up()
            .c("middle_link").t(options.original_link).up()
            .c("small_link").t(options.small_link).up()
            .c("fileLength").t(options.filelength).up()
            .c("width").t(options.width).up()
            .c("height").t(options.height).up().up()
            .c('addresses',{xmlns:'http://jabber.org/protocol/address'});

            for(var i=0;i<options.to.length;i++){
                dom.c('address',{type:'bcc',jid:options.to[i]}).up();
            }
            dom.up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS,'type':'arrive|readed'});
    }else if(options.type == 'groupchat'){
        dom = $msg({
            type : 'groupchat',
            to : options.to[0],
            id : uniqueId
        }).c("body").t("file msg").up()
        .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
        .c("fileName").t(options.filename).up()
        .c("fileType").t(fileType).up()
        .c("original_link").t(options.original_link).up()
        .c("middle_link").t(options.middle_link).up()
        .c("small_link").t(options.small_link).up()
        .c("fileLength").t(options.filelength).up()
        .c("width").t(options.width).up()
        .c("height").t(options.height).up().up();
        if(options.isExtra){
            dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS});
    }
    cmdQueue.push({id:uniqueId,cmdName:"发送图片消息：[文件名："+options.filename+"]"});
    this.sendCommand(dom.tree());
};
connection.prototype.sendAudio = function(options) {
    var paramMsg = paramValid.checkSendAudio(options,this);
    if(!paramMsg.flag) return;
    var conn = this;
    var onFileUploadComplete = options.onFileUploadComplete || emptyFn;
    var myonComplete = function(data){
        onFileUploadComplete(data);
        var opt = {};
        opt.to = paramMsg.toJid || "";
        opt.filename = paramMsg.fileInfo.filename || "";
        opt.type = options.type || "";
        opt.original_link = data.original_link || "";
        opt.duration = data.duration || "";
        opt.isExtra = paramMsg.isExtra || false;
        opt.extraData = paramMsg.extraData || '';
        conn.sendAudioMessage(opt);
    };
    options.appName = this.context.appName || '';
    options.orgName = this.context.orgName || '';
    options.accessToken = this.context.accessToken || '';
    options.onFileUploadComplete = myonComplete;

    uploadFn(options, this);
};
connection.prototype.sendAudioMessage = function(options) {
    var dom;
    var uniqueId = this.getUniqueId();
    if(options.type == 'chat'){
        if(options.to.length == 1){    //单聊或群聊
            dom = $msg({
                type : 'chat',
                to : options.to[0],
                id : uniqueId
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c1").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(2).up()
            .c("original_link").t(options.original_link).up()
            .c("duration").t(options.duration).up().up();

            if(options.isExtra){
                dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
            } 
        }else{ //群发 
            dom = $msg({
                id : uniqueId,
                to : this.domain,
                type : 'chat'
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c1").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(2).up()
            .c("original_link").t(options.original_link).up()
            .c("duration").t(options.duration).up().up()
            .c('addresses',{xmlns:'http://jabber.org/protocol/address'});

            for(var i=0;i<options.to.length;i++){
                dom.c('address',{type:'bcc',jid:options.to[i]}).up();
            }
            dom.up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS,'type':'arrive|readed'});
    }else if(options.type == 'groupchat'){
        dom = $msg({
            type : 'groupchat',
            to : options.to[0],
            id : uniqueId
        }).c("body").t("file msg").up()
        .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
        .c("fileName").t(options.filename).up()
        .c("fileType").t(2).up()
        .c("original_link").t(options.original_link).up()
        .c("duration").t(options.duration).up().up();
        if(options.isExtra){
            dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS});
    }
    cmdQueue.push({id:uniqueId,cmdName:"发送音频消息：[文件名："+options.filename+"]"});
    this.sendCommand(dom.tree());
};
connection.prototype.sendVideo = function(options) {
    var paramMsg = paramValid.checkSendVideo(options,this);
    if(!paramMsg.flag) return;
    var conn = this;
    var onFileUploadComplete = options.onFileUploadComplete || emptyFn;
    options.onFileUploadError = options.onFileUploadError|| this.onError || emptyFn;
    var myonComplete = function(data){
        onFileUploadComplete(data);
        var opt = {};
        opt.to = paramMsg.toJid || "";
        opt.filename = paramMsg.fileInfo.filename || "";
        opt.type = options.type || "";
        opt.original_link = data.original_link || "";
        opt.middle_link = data.middle_link || "";
        opt.duration = data.duration || "";
        opt.filelength = data.size ||paramMsg.fileInfo.size;
        opt.isExtra = paramMsg.isExtra || false;
        opt.extraData = paramMsg.extraData || '';
        if(!opt.middle_link){
            opt.height = 0;
            opt.width = 0;
            conn.sendVideoMessage(opt);
            return;
        }
        var imageLoadFn = function() {
            image.onload = null;
            if (!this.readyState || this.readyState == 'loaded'
                    || this.readyState == 'complete') {
                opt.height = image.height;
                opt.width = image.width;
                conn.sendVideoMessage(opt);
            };
        };
        var image = new Image();
        if("onload" in image){
            image.src =  opt.middle_link;
            image.onload = imageLoadFn;
        } else {
            image.onreadystatechange = imageLoadFn;
        }
    };
    options.onFileUploadComplete = myonComplete;
    uploadFn(options, this);
};
connection.prototype.sendVideoMessage = function(options) {
    var dom;
    var uniqueId = this.getUniqueId();
    if(options.type == 'chat'){
        if(options.to.length == 1){    //单聊或群聊
            dom = $msg({
                type : 'chat',
                to : options.to[0],
                id : uniqueId
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c1").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(4).up()
            .c("original_link").t(options.original_link).up()
            .c("middle_link").t(options.middle_link).up()
            .c("fileLength").t(options.filelength).up()
            .c("width").t(options.width).up()
            .c("height").t(options.height).up()
            .c("duration").t(options.duration).up().up();
            if(options.isExtra){
                dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
            } 
        }else{ //群发 
            dom = $msg({
                id : uniqueId,
                to : this.domain,
                type : 'chat'
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c1").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(4).up()
            .c("original_link").t(options.original_link).up()
            .c("middle_link").t(options.middle_link).up()
            .c("fileLength").t(options.filelength).up()
            .c("width").t(options.width).up()
            .c("height").t(options.height).up()
            .c("duration").t(options.duration).up().up()
            .c('addresses',{xmlns:'http://jabber.org/protocol/address'});

            for(var i=0;i<options.to.length;i++){
                dom.c('address',{type:'bcc',jid:options.to[i]}).up();
            }
            dom.up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS,'type':'arrive|readed'});
    }else if(options.type == 'groupchat'){
        dom = $msg({
            type : 'groupchat',
            to : options.to[0],
            id : uniqueId
        }).c("body").t("file msg").up()
        .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
        .c("fileName").t(options.filename).up()
        .c("fileType").t(4).up()
        .c("original_link").t(options.original_link).up()
        .c("middle_link").t(options.middle_link).up()
        .c("fileLength").t(options.filelength).up()
        .c("width").t(options.width).up()
        .c("height").t(options.height).up()
        .c("duration").t(options.duration).up().up();
        if(options.isExtra){
            dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS});
    }
    cmdQueue.push({id:uniqueId,cmdName:"发送视频消息：[文件名："+options.filename+"]"});
    this.sendCommand(dom.tree());
};
connection.prototype.sendFile = function(options) {
    var paramMsg = paramValid.checkSendFile(options,this);
    if(!paramMsg.flag) return;
    var conn = this;
    var onFileUploadComplete = options.onFileUploadComplete || emptyFn;
    var myonComplete = function(data) {
       // onFileUploadComplete(data);
        var opt = {};
        opt.to = paramMsg.toJid || "";
        opt.filename = paramMsg.fileInfo.filename || "";
        opt.type = options.type || "";
        opt.original_link = data.original_link || "";
        opt.filelength = getFileSizeFn(options.fileInputId) || "";
        opt.isExtra = paramMsg.isExtra || false;
        opt.extraData = paramMsg.extraData || '';
        conn.sendFileMessage(opt);
        onFileUploadComplete(data);
    };
    options.appName = this.context.appName || '';
    options.orgName = this.context.orgName || '';
    options.accessToken = this.context.accessToken || '';
    options.onFileUploadComplete = myonComplete;
    uploadFn(options, this);
};
connection.prototype.sendFileMessage = function(options) {
    var dom;
    var uniqueId = this.getUniqueId();
    if(options.type == 'chat'){
        if(options.to.length == 1){    //单聊或群聊
            dom = $msg({
                type : 'chat',
                to : options.to[0],
                id : uniqueId
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c2").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(6).up()
            .c("original_link").t(options.original_link).up()
            .c("fileLength").t(options.filelength).up().up();
            if(options.isExtra){
                dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
            }
        }else{ //群发 
            dom = $msg({
                id : uniqueId,
                to : this.domain,
                type : 'chat'
            }).c("body").t("file msg").up()
            .c("thread").t("db77976d-de65-42f3-bbc6-c064327287c2").up()
            .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
            .c("fileName").t(options.filename).up()
            .c("fileType").t(6).up()
            .c("original_link").t(options.original_link).up()
            .c("fileLength").t(options.filelength).up().up()
            .c('addresses',{xmlns:'http://jabber.org/protocol/address'});

            for(var i=0;i<options.to.length;i++){
                dom.c('address',{type:'bcc',jid:options.to[i]}).up();
            }
            dom.up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS,'type':'arrive|readed'});
    }else if(options.type == 'groupchat'){
        dom = $msg({
            type : 'groupchat',
            to : options.to[0],
            id : uniqueId
        }).c("body").t("file msg").up()
        .c("x",{"xmlns":Strophe.NS.FILEMSGEX})
        .c("fileName").t(options.filename).up()
        .c("fileType").t(6).up()
        .c("original_link").t(options.original_link).up()
        .c("fileLength").t(options.filelength).up().up();
        if(options.isExtra){
            dom.c("x",{"xmlns":"jabber:x:message:extraData"}).t(options.extraData).up();
        }
        dom.c("request",{"xmlns":Strophe.NS.RECEIPTS});
    }
    cmdQueue.push({id:uniqueId,cmdName:"发送文件消息：[文件名："+options.filename+"]"});
    this.sendCommand(dom.tree());
};
connection.prototype.sendLocationMessage = function(options) {
    var appKey = this.context.appKey || '';
    var toJid =options.to + "@"
            + this.domain;
    if(options.resource){
        toJid = toJid + "/" + options.resource;
    }
    var json = {
                from : this.context.userId || '',
                to :    options.to,
                bodies :[{
                        type : "loc",
                        addr : options.addr,
                        lat : options.lat,
                        lng : options.lng
                }]
    };
    var jsonstr = JSON.stringify(json);
    var dom = $msg({
                type : 'chat',
                to : toJid,
                id : this.getUniqueId(),
                xmlns : "jabber:client"
    }).c("body").t(jsonstr);
    this.sendCommand(dom.tree());
};
 /**
* add by xiayefeng 2015-05-25
* 发送好友短信
* @param options to,msg,success,error
*/
connection.prototype.sendTextSMS = function(options) {
    var paramMsg = paramValid.checkSendText(options,this,true);
    if(!paramMsg.flag)return;
    var uniqueId = this.getUniqueId();

    if(paramMsg.toJid.length == 1){    //单聊
        var dom = $msg({
            from: this.context.jid,
            to : paramMsg.toJid[0],
            type : options.type || 'chat',
            id : uniqueId,
            xmlns : "jabber:client"
        }).c('message-biz',{xmlns:'sms'}).up()
        .c("body").t(paramMsg.msg);       
    }else{ //群发 
        var dom = $msg({
            id : uniqueId,
            from: this.context.jid,            
            to : this.domain,
            type : 'chat'
        }).c('message-biz',{xmlns:'sms'}).up()
        .c("body").t(paramMsg.msg).up()
        .c('addresses',{xmlns:'http://jabber.org/protocol/address'});

        for(var i=0;i<paramMsg.toJid.length;i++){
            dom.c('address',{type:'bcc',jid:paramMsg.toJid[i]}).up();
        }
    }

    cmdQueue.push({id:uniqueId,cmdName:"发送短信：["+paramMsg.msg+"]"});
    this.sendCommand(dom.tree());
};

connection.prototype.addRoster = function(options){
    if(options == undefined || options == null){
        console.log('输入参数为空！');
        return;
    }
    var jid = getJid(options,this);
    var name = options.name || '';
    var groups = options.groups || '';

    var iq = $iq({type : 'set'});
    iq.c("query",{xmlns:'jabber:iq:roster'});
    iq.c("item",{jid: jid ,name : name});
    
    if(groups){
        for (var i = 0; i < groups.length; i++){
            iq.c('group').t(groups[i]).up();
        }
    }
    var suc = options.success || emptyFn;
    var error = options.error || emptyFn;
    this.context.stropheConn.sendIQ(iq.tree(),suc,error);
};
connection.prototype.removeRoster = function(options){
    var paramMsg = paramValid.checkRemoveRoster(options,this);
    if(!paramMsg.flag)return;
    var err = options.error || emptyFn;
    var suc = options.success || emptyFn;
    var iq = $iq({type: 'set'}).c('query', {xmlns : "jabber:iq:roster"}).c('item', {jid: paramMsg.toJid,subscription: "remove"});
    var completeFn = function(result){
        if(result.getAttribute('type') == 'result'){
           suc({
                msg:"成功删除好友："+options.to
           });
        }
    };
    var onError = function(ele){
        err(handleIqError(ele));
        return;
    };
    this.context.stropheConn.sendIQ(iq,completeFn,onError);
};
connection.prototype.getRoster = function(options) {
    if(!options){
        console.log('输入参数为空！');
        return;
    }
    var error = options.error || this.onError;
    if(!this.isOpened()){
        error({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;
    }
    var conn = this;
    var dom  = $iq({
        type: 'get'
    }).c('query', {xmlns: 'jabber:iq:roster'});

    options = options || {};
    var suc = options.success || emptyFn; 
    var completeFn = function(ele){
        var rouster = [];
        var msgBodies = ele.getElementsByTagName("query");
        if(msgBodies&&msgBodies.length>0){
            var queryTag = msgBodies[0];
            rouster = parseFriendFn(queryTag);
        }
        suc(rouster,ele);
    };
    var failFn = function(ele){
        error({
            type : LITTLEC_IM_CONNCTION_GETROSTER_ERROR,
            msg : '获取联系人信息失败',
            data : ele
        });
    };
    if(this.isOpened()){
        this.context.stropheConn.sendIQ(dom.tree(),completeFn,failFn);
    } else {
        error({
            type : LITTLEC_IM_CONNCTION_OPEN_ERROR,
            msg : '连接还未建立,请先登录或等待登录处理完毕'
        });
    }
};
connection.prototype.subscribe = function(options) {
    var paramMsg = paramValid.checkSubcribe(options,this);
    if(!paramMsg.flag)return;
    if(funcError) funcError = options.error || emptyFn;
    var pres = $pres({to: paramMsg.toJid, type: "subscribe"});
    if (paramMsg.message) {
        pres.c("status").t(paramMsg.message).up();
    }
    if (paramMsg.nick) {
        pres.c('nick', {'xmlns': "http://jabber.org/protocol/nick"}).t(paramMsg.nick);
    }
    this.sendCommand(pres.tree());
};
connection.prototype.subscribed = function(options) {
    var paramMsg = paramValid.checkSubcribed(options,this);
    if(!paramMsg.flag)return;
     if(funcError) funcError = options.error || emptyFn;
    var pres = $pres({to : paramMsg.toJid, type : "subscribed"});
    pres.c("status").t('接受好友请求').up();
    this.sendCommand(pres.tree());
};
connection.prototype.unsubscribe = function(options) {
    var paramMsg = paramValid.checkUnSubcribe(options,this);
    if(!paramMsg.flag)return;
     if(funcError) funcError = options.error || emptyFn;
    var pres = $pres({to : paramMsg.toJid, type : "unsubscribe"});
    if (options.message) {
        pres.c("status").t(options.message);
    }
    this.sendCommand(pres.tree());
};
connection.prototype.unsubscribed = function(options) {
    var paramMsg = paramValid.checkUnSubcribed(options,this);
    if(!paramMsg.flag)return;
    if(funcError) funcError = options.error || emptyFn;
    pres = $pres({to : paramMsg.toJid, type : "unsubscribed"});
    pres.c("status").t('[REFUSE]').up();
    this.sendCommand(pres.tree());
 };
connection.prototype.join = function(options){
    var roomJid = options.roomId+'@conference.' + this.domain;
    var room_nick = roomJid+"/"+this.context.userId;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var errorFn = function (ele){
        err({
            type : LITTLEC_IM_CONNCTION_JOINROOM_ERROR,
            msg : '加入房间失败',
            data : ele
        });
    }
    var iq = $pres({
        from: this.context.jid,
        to: room_nick
    }).c("x", {
        xmlns: Strophe.NS.MUC
    });
    this.context.stropheConn.sendIQ(iq.tree(), suc, errorFn);
};
/*author lim
 开启回执方法  此方法用于用户接收消息时候发送回执给用户的开关  默认关闭
 */
connection.prototype.reqSendDelay = function(options) {
    var iq;
    iq = $iq({
        //id:this.getUniqueId(),
        to:this.domain,
        from: this.context.jid,
        type: "set"
    }).c("request", {
            xmlns: "urn:cmcc:xmpp:receipts"
        });
    var suc =options.success || emptyFn;
    var completeFn = function(result){
        suc(result);
        setValue("isOpenDelay","true");
    }
    var err =  options.error || emptyFn;
    var errorFn = function (ele){
        err({
            type : "",
            msg : '发送开启回执机制请求失败',
            data : ele
        });
        setValue("isOpenDelay","error");
    };
    var iqPre = iq.tree();
    //iqPre = iq.tree().removeAttribute("xmlns");
    this.context.stropheConn.sendIQ(iqPre, completeFn, errorFn);
};
 /**
* add by xiayefeng 2015-07-29
* 创建群
* @param options 选项：ownerNick,roomMembers,roomName, success, error
*/
connection.prototype.createRoom = function(options) {
    var paramMsg = paramValid.checkCreateRoom(options,this);
    if(!paramMsg.flag) return;
    var suc = options.success || emptyFn;
    var err = options.error || emptyFn;
    // var roomId = createRoomId(); 
    var members = paramMsg.members;
    var uniqueId = this.getUniqueId();
    var domain = this.domain;
    var roomiq = $iq({
        id: uniqueId,
        // to: roomId + this.appKey+'@conference.' + domain,
        to: 'group.' + domain,
        type: "set"
    }).c("query", {xmlns: 'createroom'
    }).c("x", {xmlns: "jabber:x:data",type: "submit"
    }).c("field",{var:'roomName',type:'text-single'
    }).c("value").t(paramMsg.roomName).up().up()
      .c("field",{var:'appkey',type:'text-single'
    }).c("value").t( this.appKey.substr(1,8) ).up().up()  //appkey: #111111aa => 111111aa
      .c("field",{var:'owner',type:'jid-multi'
    }).c("value").t(this.context.userId+'@'+domain+"/"+paramMsg.ownerNick).up().up();
    if(members.roomMembers.length > 0){
        roomiq = roomiq.c("field",{var:'members',type:'jid-multi'});
        for(var i=0; i<members.roomMembers.length; i++){
            roomiq = roomiq.c('value').t(members.roomMembers[i].memberName+this.appKey+'@'+domain+'/'+paramMsg.members.roomMembers[i].memberNick).up();
        }
    }
    
    if(members.roomInvitees.length > 0){
        if(members.roomMembers.length > 0){
            roomiq = roomiq.up().c("field",{var:'invitees',type:'jid-multi'});
        }else{
            roomiq = roomiq.c("field",{var:'invitees',type:'jid-multi'});
        }
        for(var i=0; i<members.roomInvitees.length; i++){
            roomiq = roomiq.c('value').t(members.roomInvitees[i].memberName+this.appKey+'@'+domain+'/'+paramMsg.members.roomInvitees[i].memberNick).up();
        }
    }
    // roomiq = roomiq.up().c("field",{var:'muc#roomconfig_type',type:'text-single'
    // }).c('value').t(0);
    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getElementsByTagName('uri')[0].textContent.split('#')[0];
            receiveMsg.msg = '建群成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }
    var err =  options.error || emptyFn;
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    return this.context.stropheConn.sendIQ(roomiq.tree(), completeFn, errorFn);
};

/**
* add by xiayefeng 2015-08-10
* 同意邀请入群
* @param options 选项：roomId,userName, success, error
*/
connection.prototype.acceptRoom = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    paramMsg = paramValid.checkUserName(options,this,paramMsg);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var domain = this.domain;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          to: paramMsg.roomId+'@group.'+domain,
          type: "set"
        }).c("query", {
          xmlns: "acceptinvitation"
        }).c('accept',{to:paramMsg.toJid});
    var completeFn = function(result){
       var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '入群成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }
    var err =  options.error || emptyFn;
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-08-10
* 拒绝邀请入群
* @param options 选项：roomId,userName, success, error
*/
connection.prototype.declineRoom = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    paramMsg = paramValid.checkUserName(options,this,paramMsg);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var domain = this.domain;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          to: paramMsg.roomId+'@group.' + domain,
          type: "set"
        }).c("query", {
          xmlns: "declineinvitation"
        }).c('decline',{to:paramMsg.toJid});
    var completeFn = function(result){
       var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '拒绝入群成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }
    var err =  options.error || emptyFn;
    var errorFn = function (ele){
        var error = ele.getElementsByTagName('error');
        var errorCode = error ? error[0].getAttribute('code') : '';
        var errorDesc = ele.getElementsByTagName('desc')[0].textContent;
        err({
            type : errorCode,
            msg : errorDesc
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
connection.prototype.listRooms = function(options) {
    var err =  options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;
    }
    var iq;
    iq = $iq({
      to: 'group.li726-26',
      from: this.context.jid,
      type: "get",
      id: this.getUniqueId()
    }).c("query", {
      xmlns:"getroomlist"
    });
    var suc =options.success || emptyFn;
    var completeFn = function(result){
        var rooms = [];
        rooms = parseRoomFn(result);
        suc(rooms);
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(),completeFn, errorFn);
};
/**
* add by xiayefeng 2014-12-24
* 获取群主信息
* @param options 选项：roomId, success, error
*/
connection.prototype.queryRoomOwner = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;

    var domain = this.domain;
    var roomId = options.roomId;
    var iq= $iq({
          id: this.getUniqueId(),
          to : paramMsg.roomId+'@group.' + domain,
          type : 'get'
        }).c('query', {
            xmlns: "getroomowner"
        })
    var completeFn = function(result){
         var owner = {};
        var item = result.getElementsByTagName('item')[0];
        if(item){
            var owner = {};
            owner.name = item.getAttribute('jid').split('#')[0];
            owner.nick = item.getAttribute("nick");
            owner.affiliation = item.getAttribute("affiliation");
        }
        suc(owner);
    }
    var errorFn = function (ele){
        err(handleIqError(ele))
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* modify by xiayefeng 2014-12-24
* 获取群组成员信息
* @param options 选项：roomId, success, error
*/
connection.prototype.queryRoomMember = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var domain = this.domain;
    var members = [];
    var iq= $iq({
          id: this.getUniqueId(),
          to : paramMsg.roomId+'@group.' + domain,
          type : 'get'
        }).c('query', {
            xmlns: "getroommembers"
        });
    var completeFn = function(result){
        var items = result.getElementsByTagName('item');
        if(items){
            for(var i=0;i<items.length;i++){
                var item = items[i];
                var mem = {};
                mem.name = item.getAttribute('jid').split('#')[0];
                var nick = item.getAttribute('nick');
                mem.nick = nick ? nick.substring(nick.indexOf(' ')+1,nick.length):'';
                mem.affiliation = 'member';
                members.push(mem);
            }
        }
        suc(members);
    }
    var errorFn = function (ele){
        var error = ele.getElementsByTagName('error');
        var errorCode = error ? error[0].getAttribute('code') : '';
        if(errorCode == 401){
            err({
                type : LITTLEC_IM_CONNCTION_GETROOMMEMBER_ERROR,
                msg : '获取群组成员失败,群id错误'
            });
        }else{
            err({
                type : LITTLEC_IM_CONNCTION_GETROOMMEMBER_ERROR,
                msg : '获取群组成员失败,未知错误'
            });
        }
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* modify by xiayefeng 2014-12-25
* 获取群信息
* @param options 选项：roomId, success, error
*/
connection.prototype.queryRoomInfo = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    var suc = options.success || emptyFn;
    var err = options.error || emptyFn;
    var domain = this.domain;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          to: paramMsg.roomId+"@group." + domain,
          type: "get"
        }).c("query", {
          xmlns: "getroomproperties"
        });
    var completeFn = function(result){
        var fields = result.getElementsByTagName('field');
        var roomInfo = {};
        if(fields){
            for(var i=0;i<fields.length;i++){
                var attVar = fields[i].getAttribute('var');
                if(attVar == "roomName"){
                    roomInfo.name = fields[i].firstChild.textContent;
                }else if(attVar == "creationDate"){
                    roomInfo.creationDate =  new Date(parseInt(fields[i].firstChild.textContent)).format("yyyy-MM-dd hh:mm:ss");
                }else if(attVar == "maxNum"){
                    roomInfo.maxNum = fields[i].firstChild.textContent;
                }else if(attVar == "owner"){
                    roomInfo.owner =parseUserBaseInfo(fields[i].firstChild);
                }else if(attVar == "members"){
                    roomInfo.members = [];
                    var values = fields[i].getElementsByTagName("value");
                    for(var j=0; j<values.length; j++){
                        roomInfo.members.push(parseUserBaseInfo(values[j]));
                    }
                }else if(attVar == "admin"){
                    roomInfo.adminMembers = [];
                    var values = fields[i].getElementsByTagName("value");
                    for(var j=0; j<values.length; j++){
                        roomInfo.adminMembers.push(parseUserBaseInfo(values[j]));
                    }
                }
            }
        }
        suc(roomInfo);
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* modify by xiayefeng 2014-12-25
* 获取群名称
* @param options 选项：roomId, success, error
*/
connection.prototype.queryRoomName = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    var suc = options.success || emptyFn;
    var err = options.error || emptyFn;
    var domain = this.domain;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          to: paramMsg.roomId+"@group." + domain,
          type: "get"
        }).c("query", {
          xmlns: "getroomname"
        });
    var completeFn = function(result){
        var fields = result.getElementsByTagName('field');
        var roomInfo = {};
        if(fields){
            for(var i=0;i<fields.length;i++){
                var attVar = fields[i].getAttribute('var');
                if(attVar == "roomName"){
                    roomInfo.name = fields[i].firstChild.textContent;
                }
            }
        }
        suc(roomInfo);
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* modify by xiayefeng 2015-02-03
* 获取群所有成员
* @param options 选项：roomId, success, error
*/
// connection.prototype.queryRoomOccupants = function(options) {
//     var paramMsg = paramValid.checkRoomId(options,this);
//     if(!paramMsg.flag) return;
//     var suc =options.success || emptyFn;
//     var err =  options.error || emptyFn;
//     var occupants = [];
//     var conn = this;
//     conn.queryRoomOwner({
//         roomId: options.roomId,
//         success: function(owner) {
//             if (owner) {
//                 occupants.push(owner);
//             };
//             conn.queryRoomMember({
//                 roomId: options.roomId,
//                 success: function(members) {
//                     if (members) {
//                         for (var i = 0; i < members.length; i++) {
//                             occupants.push(members[i]);
//                         }
//                     }
//                     suc(occupants);
//                 },
//                 error: function(e) {
//                     err(e);
//                     return;
//                 }
//             });
//         },
//         error: function(e) {
//             err(e);
//             return;
//         }
//     })
//   };

/**
*add by wangyangyang 2015-08-10
*用户修改其群中昵称
*@param options 选项：roomId,nick,success,error
*/
connection.prototype.modifyNicknameInRoom = function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    paramMsg = paramValid.checkNickName(options,this,paramMsg);
    if(!paramMsg.flag) return;    
    var domain = this.domain;
    var userName = this.context.jid.split('@')[0];
    var iq = $iq({
            id : this.getUniqueId(),
            to : paramMsg.roomId+'@group.' + domain,
            type : 'set'
        }).c('query', {
            xmlns: 'changenick'
        }).c('item',{
            jid : this.context.jid
        }).t(paramMsg.nick);

    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '修改昵称成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }    

    var errorFn = function (ele){
        err(handleIqError(ele))
    }

    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};

/**
*add by wangyangyang 2015-08-19
*指定新群主
*@param options 选项：roomId,userName,success,error
*/
connection.prototype.handOverOwner = function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    paramMsg = paramValid.checkUserName(options,this,paramMsg);
    if(!paramMsg.flag) return;    
    var domain = this.domain;

    var iq = $iq({
            id : this.getUniqueId(),
            to : paramMsg.roomId+'@group.' + domain,
            type : 'set'
        }).c('query', {
            xmlns: 'handoverowner'
        }).c('item',{
            jid : paramMsg.toJid
        });

    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '指定新群主成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }    
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};

/**
*add by wangyangyang 2015-08-19
*群主解散群
*@param options 选项：roomId,success,error
*/
connection.prototype.destroyRoom = function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    var domain = this.domain;
    var iq = $iq({
            id : this.getUniqueId(),
            to : paramMsg.roomId+'@group.' + domain,
            type : 'set'
        }).c('query', {
            xmlns:'destroyroom'
        });

    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '解散群成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }    
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};

/**
*add by wangyangyang 2015-08-20
*群聊消息免打扰
*@param options 选项：roomId,mute,success,error
*/
connection.prototype.muteRoomNotice = function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    paramMsg = paramValid.checkMuteFlag(options,this,paramMsg);
    if(!paramMsg.flag) return;    
    var domain = this.domain;

    var iq = $iq({
            id : this.getUniqueId(),
            from: this.context.jid,
            to : paramMsg.roomId+"@group." + domain,
            type : "set"
        }).c("query", {
            xmlns:"mucsilent"
        }).c("item",{
            silent : paramMsg.silent,
            jid : this.context.jid
        });
    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            if(paramMsg.silent =='1'){
                receiveMsg.msg = '群聊消息免打扰设置成功';
            }else{
                receiveMsg.msg = '群聊消息免打扰取消成功';
            }
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }    

    var errorFn = function (ele){
        err(handleIqError(ele))
    }

    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};

/**
* add by xiayefeng 2014-12-24
* 退出群聊
* @param options 选项：roomId, success, error
*/
connection.prototype.dropOutRoom = function(options){
    var paramMsg = paramValid.checkRoomId(options,this);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var domain = this.domain;
    var resource = options.resource || this.resource;

    var iq= $iq({
          id: this.getUniqueId(),
          to : paramMsg.roomId+'@group.' + domain,
          type : 'set'
        }).c('query', {
            xmlns: 'exit'
        }).c('item',{
            affiliation:'none',
            jid: this.context.jid
        });    
    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '退群成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-05-26
* 群主踢人
* @param options 选项：roomId, userName,success, error
*/
connection.prototype.kickMemberFromRoom = function(options){
    //如果用户名是自己，则调用退群接口
    if(options && options.userName && options.userName == this.context.jid.split('#')[0]){
        this.dropOutRoom(options);
        return;
    }
    var paramMsg = paramValid.checkKickMember(options,this);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn; 
    var domain = this.domain;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          // from : this.context.userId+'@'+domain+"/"+this.resource,
          to : paramMsg.roomId+'@group.' + domain,
          type : 'set'
        }).c('query', {
            xmlns: 'kickout'
        }).c('item',{
            affiliation:'none',
            jid: paramMsg.toJid
        });    
    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '踢人成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2014-12-24
* 邀请其他人
* @param options 选项：roomId, success, error
*/
connection.prototype.applyMember = function(options){
    var paramMsg = paramValid.checkApplyMember(options,this);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn; 
    var domain = this.domain;
    var uniqueId = this.getUniqueId();
    var members = paramMsg.members;
    var conn = this;
    var iq= $iq({
        id: uniqueId,
        to : paramMsg.roomId+'@group.' + domain,
        type : 'set'
        }).c('query', {
            xmlns:'addmember'
        });
    for(var i=0; i<members.roomMembers.length; i++){
        var username = members.roomMembers[i].memberName;
        iq = iq.c('item',{
            affiliation: "member",
            jid: username+conn.appKey+'@'+domain+'/'+members.roomMembers[i].memberNick
        }).up();
    }
    if(members.roomInvitees.length > 0){
        for(var i=0; i<members.roomInvitees.length; i++){
            var username = members.roomInvitees[i].memberName;
            iq = iq.c('item',{
                affiliation: "member",
                jid: username+conn.appKey+'@'+domain+'/'+members.roomInvitees[i].memberNick,
                invitee:'true'
            }).up();
        }
    }
    var completeFn = function(result){
        var receiveMsg = {};
        if(result){
            receiveMsg.roomId = result.getAttribute('from').split('#')[0];
            receiveMsg.msg = '邀请成功';
            receiveMsg.type = LITTLEC_IM_CONNCTION_COMMOND_SUCCESS;
        }
        suc(receiveMsg);
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    conn.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-01-21
* 查找联系人
* @param options 选项：name, success, error
*/
connection.prototype.queryRoster = function(options){
    if(options == undefined || options == null){
        console.log('输入参数为空！');
        return;
    }
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;    
    }
    var domain = this.domain;
    var name = options.name;
    var reg = /^[a-zA-Z0-9_]{1,50}$/;
    if(!name){
        err({
            type : LITTLEC_IM_CONNCTION_QUERYROSTER_ERROR,
            msg : '查找联系人失败,用户名为空！'
        });
        return;
    }else if(!reg.test(name)){
        err({
            type : LITTLEC_IM_CONNCTION_QUERYROSTER_ERROR,
            msg : '查找联系人失败,用户名不合法！'
        });
        return;
    }
    var iq= $iq({
          id: this.getUniqueId(),
          to : 'search.li726-26',
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:search'
        }).c('x',{
            xmlns:'jabber:x:data',
            type:'submit'
        }).c('field',{var:'FORM_TYPE',type:'hidden'}).c('value').t('jabber:iq:search').up().up()
        . c('field',{var:'search',type:'text-single'}).c('value').t(name+"%"+this.appKey).up().up()
        . c('field',{var:'Username',type:'boolean'}).c('value').t(1).up().up()
        . c('field',{var:'Name',type:'boolean'}).c('value').t(1)
    
    var completeFn = function(result){
        var x = result.getElementsByTagName('x');
        if(x[0].getAttribute('type') == 'result'){
            var itemsDom = result.getElementsByTagName('item');
            var items = [];
            if(itemsDom && itemsDom.length > 0){
                for(var i=0; i<itemsDom.length; i++){
                    var item = {};
                    item.nick = itemsDom[i].getElementsByTagName('field')[0].textContent;
                    //item.email = itemsDom[i].getElementsByTagName('field')[1].textContent;
                    item.name =parseNameFromJidFn(itemsDom[i].getElementsByTagName('field')[2].textContent);
                    //item.jid = itemsDom[i].getElementsByTagName('field')[3].textContent;
                    items.push(item);
                }
            }
            suc(items);
        }
    }
    var errorFn = function (ele){
        err({
            type : LITTLEC_IM_CONNCTION_QUERYROSTER_ERROR,
            msg : '查找联系人失败',
            data : ele
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-06-23
* 获取自己信息
* @param options 选项：name, success, error
*/
connection.prototype.queryUserInfo = function(options){
    if(options == undefined || options == null){
        console.log('输入参数为空！');
        return;
    }
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;    
    }
    var domain = this.domain;
    var iq= $iq({
          id: this.getUniqueId(),
          type : 'get'
        }).c('query', {
            xmlns: 'jabber:iq:userinfo'
        })
    var completeFn = function(result){
        var type = result.getAttribute('type');
        if(type == 'result'){
            result.$getNodeValue = $getNodeValue;
            var info = {
                userName:result.$getNodeValue('username').split('#')[0],
                appkey:result.$getNodeValue('appkey'),
                phone:result.$getNodeValue('phone'),
            };
            info.nick = result.$getNodeValue('name') ? result.$getNodeValue('name') : info.userName;
            info.email = result.$getNodeValue('email') ? result.$getNodeValue('email') : '';
            info.phone = result.$getNodeValue('phone') ? result.$getNodeValue('phone') : '';
            info.createDate = result.$getNodeValue('creationDate') ? new Date(parseInt(result.$getNodeValue('creationDate'))).format("yyyy-MM-dd hh:mm:ss"):'';
            info.modifyDate = result.$getNodeValue('modificationDate') ? new Date(parseInt(result.$getNodeValue('modificationDate'))).format("yyyy-MM-dd hh:mm:ss"):'';
            suc(info);
        }
    }
    var errorFn = function (ele){
        err({
            type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
            msg : '获取用户信息失败'
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-06-23
* 修改当前账号手机号第一步
* @param options 选项：phone, success, error
*/
connection.prototype.modifyUserPhoneforCode = function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;    
    }
    var paramMsg = paramValid.checkPhone(options,this);
    if(!paramMsg.flag) return;
    var iq= $iq({
          id: this.getUniqueId(),
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:userphone'
        }).c('phone').t(paramMsg.phone);
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"手机验证码已经发送，请注意查收"
        });
    }
    var errorFn = function (ele){
        var type = ele.getAttribute('type');
        if(type == 'error'){
            ele.$getNodeValue = $getNodeValue;
            var error_code = ele.$getNodeValue('error_code');
            var reason = ele.$getNodeValue('reason');
            if(error_code == 1004){
                reason = '该用户的手机号已经存在'
            }
            err({
                type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
                msg : reason
            });
            return;
        }
        err({
            type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
            msg : '未知错误'
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-06-23
* 修改当前账号手机号第二步
* @param options 选项：phone, phonecode,success, error
*/
connection.prototype.modifyUserPhone = function(options){
    var paramMsg = paramValid.checkModifyUserPhone(options,this);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    var iq= $iq({
          id: this.getUniqueId(),
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:userphone'
        }).c('phone').t(paramMsg.phone).up()
        .c('p', {xmlns:'jabber:x:data',type:'submit'})
        .c('field',{var:'phonecode',type:'text-single',label:'Phone Code'})
        .c('value').t(paramMsg.phonecode)
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"修改成功"
        });
    }
    var errorFn = function (ele){
        var type = ele.getAttribute('type');
        if(type == 'error'){
            ele.$getNodeValue = $getNodeValue;
            var error_code = ele.$getNodeValue('error_code');
            var reason = ele.$getNodeValue('reason');
            if(error_code == 1001){
                reason = '验证码不合法';
            }else if(error_code == 1004){
                reason = '该用户的手机号已经存在';
            }else{
                reason = '修改失败，未知错误';
            }
            err({
                type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
                msg : reason
            });
            return;
        }
        err({
            type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
            msg : '修改失败，未知错误'
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-06-23
* 修改用户昵称
* @param options 选项：phone, success, error
*/
connection.prototype.modifyUserNick= function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;    
    }
    var paramMsg = paramValid.checkNickName(options,this);
    if(!paramMsg.flag) return;
    var iq= $iq({
          id: this.getUniqueId(),
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:name'
        }).c('name').t(paramMsg.nick);
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"修改昵称成功"
        });
    }
    var errorFn = function (ele){
        var type = ele.getAttribute('type');
        if(type == 'error'){
            ele.$getNodeValue = $getNodeValue;
            var error_code = ele.$getNodeValue('error_code');
            var reason = ele.$getNodeValue('reason');
            if(error_code == 1003){
                reason = '该用户不存在'
            }
            err({
                type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
                msg : reason
            });
            return;
        }
        err({
            type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
            msg : '未知错误'
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-03-16
* 修改群名称
* @param options roomId,roomName,success, error
*/
connection.prototype.modifyRoomName = function(options) {
    var paramMsg = paramValid.checkModifyRoomName(options,this);
    if(!paramMsg.flag) return;
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq = $iq({
            to : paramMsg.roomId+'@group.'+domain,
            type :'set',
            id : uniqueId
        }).c("query",{xmlns:"setnaturalname"})
        .c("x",{xmlns:"set-natural-name"}).t(paramMsg.roomName);
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"修改群名称成功"
        });
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2016-02-17
* 指定管理员
* @param options roomId,members,success, error
*/
connection.prototype.setAdmin = function(options) {
    var paramMsg = paramValid.checkHandleAdmin(options,this);
    if(!paramMsg.flag) return;
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq = $iq({
            to : paramMsg.roomId+'@group.'+domain,
            type :'set',
            id : uniqueId
        }).c("query",{xmlns:"setadmin"});
    for(var i=0; i<paramMsg.members.length; i++){
        iq = iq.c('item',{jid: paramMsg.members[i]+this.appKey+'@'+domain}).up();
    }
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"指定管理员成功"
        });
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2016-02-17
* 取消管理员
* @param options roomId,members,success, error
*/
connection.prototype.cancelAdmin = function(options) {
    var paramMsg = paramValid.checkHandleAdmin(options,this);
    if(!paramMsg.flag) return;
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq = $iq({
            to : paramMsg.roomId+'@group.'+domain,
            type :'set',
            id : uniqueId
        }).c("query",{xmlns:"canceladmin"});
    for(var i=0; i<paramMsg.members.length; i++){
        iq = iq.c('item',{jid: paramMsg.members[i]+this.appKey+'@'+domain}).up();
    }
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"取消管理员成功"
        });
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};

/**
* add by xiayefeng 2016-02-17
* 主动入群
* @param options roomId,reason,approvebyadmin,success, error
*/
connection.prototype.joinRoom = function(options) {
    var paramMsg1 = paramValid.checkRoomId(options,this);
    if(!paramMsg1.flag) return;
    var paramMsg2 = paramValid.checkNickName(options,this);
    if(!paramMsg2.flag) return; 
    var paramMsg3 = paramValid.checkReason(options,this);
    if(!paramMsg3.flag) return; 
    var paramMsg4 = paramValid.checkApprovebyadmin(options,this);
    if(!paramMsg4.flag) return;

    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq = $iq({
            to : paramMsg1.roomId+'@group.'+domain,
            type :'set',
            id : uniqueId
        }).c("query",{xmlns:"joingroup"})
        .c("item",{jid:this.context.jid,nick:options.nick}).up()
        .c("joinreason").t(options.reason).up()
        .c("approvebyadmin").t(options.approvebyadmin)
    var completeFn = function(result){
        var msg = "鉴权成功，等待审批";
        if(options.approvebyadmin == "no"){
            msg = "进群成功"
        }
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:msg
        });
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2016-02-17
* 申请通过
* @param options roomId,userName,success, error
*/
connection.prototype.approveJoin = function(options) {
    var paramMsg1 = paramValid.checkRoomId(options,this);
    if(!paramMsg1.flag) return;
    var paramMsg2 = paramValid.checkUserName(options,this);
    if(!paramMsg2.flag) return; 
     
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq = $iq({
            to : paramMsg1.roomId+'@group.'+domain,
            type :'set',
            id : uniqueId
        }).c("query",{xmlns:"approvejoin"})
        .c("item",{jid:paramMsg2.toJid})
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"申请通过成功"
        });
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2016-02-17
* 申请拒绝
* @param options roomId,reason,userName,success, error
*/
connection.prototype.refusejoin = function(options) {
    var paramMsg1 = paramValid.checkRoomId(options,this);
    if(!paramMsg1.flag) return;
    var paramMsg2 = paramValid.checkUserName(options,this);
    if(!paramMsg2.flag) return;
    var paramMsg3 = paramValid.checkReason(options,this);
    if(!paramMsg3.flag) return; 
     
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq = $iq({
            to : paramMsg1.roomId+'@group.'+domain,
            type :'set',
            id : uniqueId
        }).c("query",{xmlns:"refusejoin"})
        .c("item",{jid:paramMsg2.toJid}).up()
        .c("refusereason").t(options.reason);
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"申请拒绝成功"
        });
    }
    var errorFn = function (ele){
        err(handleIqError(ele));
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-03-06
* 用户注册第一步，获取手机验证码
* @param options username, phone,password,name,success, error
*/
connection.prototype.registerUserForCode = function(options){
    if(options == undefined || options == null){
        console.log('注册失败，输入参数为空！');
        return;
    }
    var suc = options.success || emptyFn;
    var err = options.error || emptyFn;

    var isSuccess = true;
    var erroMsg = '';

    var username = options.username;
    if(this.isOpened()){
        erroMsg = '账号处于登录状态，请退出后再试';
        err({
            type : LITTLEC_IM_REGISTER_ERROR,
            msg : "注册失败，"+erroMsg
        })
        return;
    }
    if(!username){
        isSuccess = false;
        erroMsg = '用户名为空！';
    }
    var phone = options.phone;
    if(!phone){
        isSuccess = false;
        erroMsg = erroMsg+'手机号为空！';
    }
    var password = options.password;
    if(!password){
        isSuccess = false;
        erroMsg = erroMsg+'密码为空!';
    }
    var reg = /^[a-zA-Z0-9_]{1,50}$/;
    if(!reg.test(username)){
        isSuccess = false;
        erroMsg = erroMsg+'用户名不合法！';
    }
    reg = /^(1[0-9]{10})$/;
    if(!reg.test(phone)){
        isSuccess = false;
        erroMsg = erroMsg+'用户手机号不合法！';
    }
    reg = /^[a-zA-Z0-9\`\~!\@\#\$\%\^\&\*\(\)-=_+\[\]{}\|\\\;\:\'\",.\/\<\>?]{6,32}$/;
    if(!reg.test(password)){
        isSuccess = false;
        erroMsg = erroMsg+'用户密码不合法！';
    }
    var name = options.name;
    //reg = /^[a-zA-Z0-9_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5\s]{1,48}[a-zA-Z0-9_\u4e00-\u9fa5]$/;
    //reg = /^{1,50}/;
    var reg = /[\r\b\f\n\t\v]/;
    if(!name){
        name = username;
    }else if(name.length > 50){
        isSuccess = false;
        erroMsg = erroMsg+'用户昵称不合法！';
    }else if(reg.test(name)){
        isSuccess = false;
        erroMsg = erroMsg+'用户昵称不合法！';
    }
    if(!isSuccess){
        err({
            type : LITTLEC_IM_REGISTER_ERROR,
            msg : "注册失败，"+erroMsg
        })
        return;
    }
    var domain = this.domain;
    var appKey = this.appKey;
    var conn = this;
    var iq= $iq({
          id: this.getUniqueId(),
          to : this.domain,
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:register'
        }).c('appid').t(appKey.substring(1)).up()
        . c('username').t(username).up()
        . c('phone').t(phone).up()
        . c('password').t(password).up()
        . c('name').t(name)
    var completeFn = function(result){
        if(result.getAttribute('type') == 'result'){
            suc("手机验证码已经发送，请注意查收");
        }
        conn.close();
    }
    var errorFn = function (ele){
        if(ele.getAttribute('type') == 'error'){
            var errocode = ele.getElementsByTagName('error_code')[0].textContent;
            var msg = '';
            if(errocode == "1004"){
                msg = "手机号和appid已经存在，注册失败";
            }else if(errocode == "1005"){
                msg = "该用户已经被注册";
            }
            err({
                type : LITTLEC_IM_REGISTER_ERROR,
                msg : msg,
                data : ele
            });
        }
        conn.close();
    }
    conn.context.status = STATUS_DOLOGIN_IM;
    var register = function(port){
        conn.url = config.imServerIP+":"+config.imServerPort+"/http-bind/";
        var stropheConn = new Strophe.Connection(conn.url,{
                            inactivity : conn.inactivity,
                            maxRetries : conn.maxRetries,
                            pollingTime : conn.pollingTime
        });
        conn.context.stropheConn = stropheConn;
        stropheConn.connectforRegister(null,conn.domain,conn.wait,conn.hold);
        stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
    };
    conn.queryPort(register);
};
/**
* add by xiayefeng 2015-03-06
* 用户注册第二步
* @param options username, phone,password,name,phonecode,success, error
*/
connection.prototype.registerUser = function(options){
    if(options == undefined || options == null){
        console.log('注册失败，输入参数为空！');
        return;
    }
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;

    var isSuccess = true;
    var erroMsg = '';
    var username = options.username;
    if(this.isOpened()){
        erroMsg = '账号处于登录状态，请退出后再试';
        err({
            type : LITTLEC_IM_REGISTER_ERROR,
            msg : "注册失败，"+erroMsg
        })
        return;
    }
    if(!username){
        isSuccess = false;
        erroMsg = '用户名为空！';
    }
    var phone = options.phone;
    if(!phone){
        isSuccess = false;
        erroMsg = erroMsg+'手机号为空！';
    }
    var password = options.password;
    if(!password){
        isSuccess = false;
        erroMsg = erroMsg+'密码为空!';
    }
    var reg = /^[a-zA-Z0-9_]{1,50}$/;
    if(!reg.test(username)){
        isSuccess = false;
        erroMsg = erroMsg+'用户名不合法！';
    }
    reg = /^(1[0-9]{10})$/;
    if(!reg.test(phone)){
        isSuccess = false;
        erroMsg = erroMsg+'用户手机号不合法！';
    }
    reg = /^[a-zA-Z0-9\`\~!\@\#\$\%\^\&\*\(\)-=_+\[\]{}\|\\\;\:\'\",.\/\<\>?]{6,32}$/;
    if(!reg.test(password)){
        isSuccess = false;
        erroMsg = erroMsg+'用户密码不合法！';
    }
    var name = options.name;
    var reg = /[\r\b\f\n\t\v]/;
    if(!name){
        name = username;
    }else if(name.length > 50){
        isSuccess = false;
        erroMsg = erroMsg+'用户昵称不合法！';
    }else if(reg.test(name)){
        isSuccess = false;
        erroMsg = erroMsg+'用户昵称不合法！';
    }
    var phonecode = options.phonecode;
    if(!phonecode){
        isSuccess = false;
        erroMsg = erroMsg+'验证码为空！';
    }
    if(!isSuccess){
        err({
            type : LITTLEC_IM_REGISTER_ERROR,
            msg : "注册失败,"+erroMsg
        })
        return;
    }
    var domain = this.domain;
    var appKey = this.appKey;
    var conn = this;
    var iq= $iq({
          id: this.getUniqueId(),
          to : this.domain,
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:register'
        }).c('appid').t(appKey.substring(1)).up()
        . c('username').t(username).up()
        . c('phone').t(phone).up()
        . c('password').t(password).up()
        . c('name').t(name).up()
        .c('p',{
            xmlns: 'jabber:x:data',
            type:'submit'
        })
        .c('field',{
            var:'phonecode',
            type:'text-single',
            label:'Phone Code'
        })
        .c('value').t(phonecode);
    var completeFn = function(result){
        if(result.getAttribute('type') == 'result'){
            suc({
                type: LITTLEC_IM_REGISTER_SUCCESS,
                msg:"注册成功！"
            })
        }
        conn.close();
    }
    var errorFn = function (ele){
        var msg='';
        if(ele.getAttribute('type') == 'error' && ele.getElementsByTagName('error_code').length > 0){
            var errocode = ele.getElementsByTagName('error_code')[0].textContent;
            if(errocode == "1001"){
                msg = "手机验证码长度不匹配";
            }else if(errocode == "1002"){
                msg = "验证码不匹配";
            }else if(errocode == "1004"){
                msg = "手机号和appid已经存在，注册失败";
            }else if(errocode == "1005"){
                msg = "该用户已经被注册";
            }
            err({
                type : LITTLEC_IM_REGISTER_ERROR,
                msg : msg,
                data : ele
            });
        }else if(ele.getElementsByTagName('error') && ele.getElementsByTagName('error')[0].getAttribute('code') == '500'){
            err({
                type : LITTLEC_IM_REGISTER_ERROR,
                msg : "请先填写正确信息，获取验证码!",
                data : ele
            });
        }
        conn.close();
    }
    conn.context.status = STATUS_DOLOGIN_IM;
    conn.url = config.imServerIP+":"+config.imServerPort+"/http-bind/";
    var stropheConn = new Strophe.Connection(conn.url,{
                        inactivity : conn.inactivity,
                        maxRetries : conn.maxRetries,
                        pollingTime : conn.pollingTime
    });
    conn.context.stropheConn = stropheConn;
    stropheConn.connectforRegister(null,conn.domain,conn.wait,conn.hold);
    stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-03-26
* 用户注册无需短信验证码
* @param options username,password,name,success, error
*/
connection.prototype.registerUserWithoutPhoneCode = function(options){
    if(options == undefined || options == null){
        console.log('注册失败，输入参数为空！');
        return;
    }
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;

    var isSuccess = true;
    var erroMsg = '';
    var username = options.username;
    if(this.isOpened()){
        erroMsg = '账号处于登录状态，请退出后再试';
        err({
            type : LITTLEC_IM_REGISTER_ERROR,
            msg : "注册失败，"+erroMsg
        })
        return;
    }
    if(!username){
        isSuccess = false;
        erroMsg = '用户名为空!';
    }
    var password = options.password;
    if(!password){
        isSuccess = false;
        erroMsg = erroMsg+'密码为空!';
    }
    var reg = /^[a-zA-Z0-9_]{1,50}$/;
    if(!reg.test(username)){
        isSuccess = false;
        erroMsg = erroMsg+'用户名不合法！';
    }
    reg = /^[a-zA-Z0-9\`\~!\@\#\$\%\^\&\*\(\)-=_+\[\]{}\|\\\;\:\'\",.\/\<\>?]{6,32}$/;
    if(!reg.test(password)){
        isSuccess = false;
        erroMsg = erroMsg+'用户密码不合法！';
    }
    var name = options.name;
    var reg = /[\r\b\f\n\t\v]/;
    if(!name){
        name = username;
    }else if(name.length > 50){
        isSuccess = false;
        erroMsg = erroMsg+'用户昵称不合法！';
    }else if(reg.test(name)){
        isSuccess = false;
        erroMsg = erroMsg+'用户昵称不合法！';
    }
    if(!isSuccess){
        err({
            type : LITTLEC_IM_REGISTER_ERROR,
            msg : "注册失败,"+erroMsg
        })
        return;
    }
    var domain = this.domain;
    var appKey = this.appKey;
    var conn = this;
    var iq= $iq({
          id: this.getUniqueId(),
          to : this.domain,
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:register'
        }).c('appid').t(appKey.substring(1)).up()
        . c('username').t(username).up()
        . c('password').t(password).up()
        . c('name').t(name)
    var completeFn = function(result){
        if(result.getAttribute('type') == 'result'){
            suc({
                type: LITTLEC_IM_REGISTER_SUCCESS,
                msg:"注册成功！"
            })
        }
        conn.close();
    }
    var errorFn = function (ele){
        var msg='';
        if(ele.getAttribute('type') == 'error' && ele.getElementsByTagName('error_code').length > 0){
            var errocode = ele.getElementsByTagName('error_code')[0].textContent;
            if(errocode == "1001"){
                msg = "手机验证码长度不匹配";
            }else if(errocode == "1002"){
                msg = "验证码不匹配";
            }else if(errocode == "1004"){
                msg = "手机号和appid已经存在，注册失败";
            }else if(errocode == "1005"){
                msg = "该用户已经被注册";
            }
            err({
                type : LITTLEC_IM_REGISTER_ERROR,
                msg : msg,
                data : ele
            });
        }else if(ele.getElementsByTagName('error') && ele.getElementsByTagName('error')[0].getAttribute('code') == '500'){
            err({
                type : LITTLEC_IM_REGISTER_ERROR,
                msg : "请先填写正确信息，获取验证码!",
                data : ele
            });
        }
        conn.close();
    }
    conn.context.status = STATUS_DOLOGIN_IM;
    conn.url = config.imServerIP+":"+config.imServerPort+"/http-bind/";
    var stropheConn = new Strophe.Connection(conn.url,{
                        inactivity : conn.inactivity,
                        maxRetries : conn.maxRetries,
                        pollingTime : conn.pollingTime
    });
    conn.context.stropheConn = stropheConn;
    stropheConn.connectforRegister(null,conn.domain,conn.wait,conn.hold);
    stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-03-22
* 获取好友聊天记录
* @param options
* requried: options.to,options.limit,option.success 
* optional: options.begin,options.options.end,options.direction,option.error
*/
connection.prototype.queryChat = function(options){
    var suc =options.success || emptyFn;
    var err = options.error || emptyFn;
    options.type = 'chat';
    var paramMsg = paramValid.checkHmChat(options,this);
    if(!paramMsg.flag) return;
    var sendData = {};
    for (var p in paramMsg){
        if(p == 'flag')
            continue;
        if(p == 'toJid'){
           sendData.to = paramMsg[p].split('@')[0]; 
           continue;
        }
        sendData[p] = paramMsg[p];
    }
    $.ajax({
        type:'POST',
        url:config.hmServerIP+"/hms/manage/selectchat",
        data:JSON.stringify(sendData),
        dataType:'json',
        success:function(retData){
            if(retData instanceof Array){
                if(retData.length >0){
                    var xmlDom = strToXml(retData.join(''),"hms");
                    var hms = xmlDom.getElementsByTagName("hms")[0].childNodes;
                    var msgs = [];
                    for(var i=0; i<hms.length; i++){
                        var message = parseResponseMessageforHm(hms[i]);
                        if(message){
                            msgs.push(message); 
                        }
                    }
                    suc(msgs);
                }else{
                    console.log('无消息记录！');
                    suc([]);
                }
            }else if(retData.status == '200002'){
                err({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : '查询好友历史消息失败,'+retData.reason
                });
            }else{
                err({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : '查询好友历史消息失败,未知错误'
                });
            }
        },
        error:function(e){
            err({
                type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                msg : '查询好友历史消息失败,'+e
            });
            return;
        }
    })
}
/**
* add by xiayefeng 2015-03-22
* 获取群聊天记录
* @param options
* requried: options.from,options.roomId,options.limit,option.success    
* optional: options.begin,options.options.end,options.direction,option.error
*/
connection.prototype.queryGroup = function(options){
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
     options.type = 'chat';
    var paramMsg = paramValid.checkHmGroupChat(options,this);
    if(!paramMsg.flag) return;
    var sendData = {};
    for (var p in paramMsg){
        if(p == 'flag')
            continue;
        if(p == 'roomId'){
           sendData.group = paramMsg[p]; 
           continue;
        }
        sendData[p] = paramMsg[p];
    }
    $.ajax({
        type:'POST',
        url:config.hmServerIP+"/hms/manage/selectgroup",
        data:JSON.stringify(sendData),
        dataType:'json',
        success:function(retData){
            if(retData instanceof Array){
                if(retData.length >0){
                    var xmlDom = strToXml(retData.join(''),"hms");
                    var hms = xmlDom.getElementsByTagName("hms")[0].childNodes;
                    var msgs = [];
                    for(var i=0; i<hms.length; i++){
                        var message = parseResponseMessageforHm(hms[i]);
                        if(message){
                            msgs.push(message); 
                        }
                    }
                    suc(msgs);
                }else{
                    console.log('无消息记录！');
                    suc([]);
                } 
            }else if(retData.status == '200002'){
                err({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : '查询群历史消息失败,'+retData.reason
                });
            }else{
                err({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : '查询群历史消息失败,未知错误'
                });
            }
        },
        error:function(e){
            err({
                type : LITTLEC_IM_CONNCTION_QUERYGROUP_ERROR,
                msg : '查询好友历史消息失败,'+e
            });
            return;
        }
    })
}
/**
* add by xiayefeng 2015-06-04
* 获取已读回执历史消息
* @param options
* requried: option.success    
* optional: options.from,option.error
*/
connection.prototype.queryReaded = function(options){
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;   
    }
    var paramMsg={flag:true};
    if(options && typeof(options.to)!= 'undefined'){
        //options.userName = options.to;
        paramMsg = paramValid.checkTo(options,this);
    }
    if(!paramMsg.flag) return;
    var sendData={from:this.context.jid.split('@')[0]}
    if(options.to){
        sendData.to = paramMsg.toJid.split('@')[0];
    }
    $.ajax({
        type:'POST',
        url:config.hmServerIP+"/hms/manage/selectreceived",
        data:JSON.stringify(sendData),
        dataType:'json',
        success:function(retData){
            if(retData instanceof Array){
                if(retData.length >0){
                    var xmlDom = strToXml(retData.join(''),"hms");
                    var hms = xmlDom.getElementsByTagName("hms")[0].childNodes;
                    var msgs = [];
                    for(var i=0; i<hms.length; i++){
                        var message = parseReadedMessageforHm(hms[i]);
                        if(message){
                            msgs.push(message); 
                        }
                    }
                    suc(msgs);
                }else{
                    console.log('无消息记录！');
                    suc([]);
                } 
            }else if(retData.status == '200002'){
                err({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : '查询群已读回执消息失败,'+retData.reason
                });
            }else{
                err({
                    type : LITTLEC_IM_CONNCTION_QUERYCHAT_ERROR,
                    msg : '查询群已读回执消息失败,未知错误'
                });
            }
        },
        error:function(e){
            err({
                type : LITTLEC_IM_CONNCTION_QUERYGROUP_ERROR,
                msg : '查询群已读回执消息失败,'+e
            });
            return;
        }
    })
}
/**
* add by xiayefeng 2015-04-21
* 获取端口号
*/
connection.prototype.queryPort = function(callback){
     $.ajax({
        type:'get',
        url:config.adapterIP+"/imadapter/client/ofport",
        data:{
            appkey:this.appKey.substring(1),
            httpbind: true
        },
        dataType:'text',
        success:function(retData){
            if(retData){
                callback(retData);
            }else{
                alert('获取端口号失败，无法登录！');
            }
        },
        error:function(e){
            console.log(e);
            alert('获取端口号失败，无法登录！');
            return;
        }
    })
}

/**
* add by xiayefeng 2015-06-16
* 获取服务器地址
*/
connection.prototype.queryServiceIp = function(appkey,queryparam){
    var reg=/^[\d]{6}[A-Za-z]{2}$/;
    if(!reg.test(appkey)){
        console.log('appKey不合法');
        return;
    }
    var postData = {appkey:appkey,httpbind:true};
    if(queryparam){
        postData.param = queryparam;
    }
    $.ajax({
        type:'get',
        url:config.adapterIP+"/imadapter/client/params",
        data:postData,
        dataType:'text',
        success:function(retData){
            if(retData){
                var retData = $.parseJSON(retData);
                config.imServerIP = "http://"+retData['cmcc-bosh-service-mrs'].split(':')[0];
                config.hmServerIP = "http://"+retData['cmcc-im-service-hms'];
                config.pafsIP = "http://"+retData['cmcc-im-service-pafs'];
                config.imServerPort = retData['cmcc-bosh-service-mrs'].split(':')[1];
                config.imServiceIP = "http://"+retData['cmcc-openfire-service-mrs'];
                localStorage.setItem('appKey',appkey);
                localStorage.setItem('imServerIP',config.imServerIP);
                localStorage.setItem('hmServerIP',config.hmServerIP);
                localStorage.setItem('pafsIP',config.pafsIP);
                localStorage.setItem('imServerPort',config.imServerPort);
                localStorage.setItem('imServiceIP',config.imServiceIP);
            }else{
                 console.log('获取服务器配置失败');
            }
        },
        error:function(e){
            console.log(e);
            return;
        }
    })
}
/**
* add by xiayefeng 2015-08-24
* 获取密码
*/
connection.prototype.queryUserPassword = function(options){
    var paramMsg = paramValid.checkUserNameForPassword(options);
    if(!paramMsg.flag) return;
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    //var urlStr = config.imServiceIP+'/plugins/openservice/userv2?action=getPassword';
    var urlStr ='http://im.bizz.cmccim.com:9090/plugins/openservice/userv2?action=getPassword&apppkey='+this.appKey.split('#')[0];
    $.ajax({
        type:'get',
        url:urlStr,
        data:{
            appkey:this.appKey.substring(1),
            username: paramMsg.userName,
        },
        success:function(retData){
            retData = $.parseJSON(retData);
            if(retData.errcode == 0){
                suc('获取密码成功！');
            }else if(retData.errcode == 20001){
                err('获取失败，用户名不能为空！');
            }else if(retData.errcode == 20008){
                err('获取失败，用户不存在！');
            }else if(retData.errcode == 20012){
                err('获取失败，用户手机号未注册！');
            }else{
                err('获取失败，未知错误！');
            }
        },
        error:function(e){
            if(e.status == 200){
                var retData = $.parseJSON(e.responseText);
                if(retData.errcode == 0){
                    suc('获取密码成功！');
                }
            }else{
                err('获取失败，服务器异常！');
            }
            return;
        }
    })
}
/**
* add by xiayefeng 2015-08-24
* 修改账号密码
* @param options oldPassword,newPassword,success, error
*/
connection.prototype.modifyUserPassword = function(options) {
    var paramMsg = paramValid.checkModifyUserPassword(options,this);
    if(!paramMsg.flag) return;
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          type : 'set'
        }).c('query', {
            xmlns: 'jabber:iq:changepassword'
        }).c('oldPassword').t(paramMsg.oldPassword).up()
        .c('newPassword').t(paramMsg.newPassword).up();
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"修改用户密码成功"
        });
    }
    var errorFn = function (ele){
        var error = ele.getElementsByTagName('error');
        if(error && error.length > 0){
            ele.$getNodeValue = $getNodeValue;
            var error_code = ele.$getNodeValue('error_code');
            var reason = ele.$getNodeValue('reason');
            if(error_code == 2008){
                reason = '该用户不存在';
            }else if(error_code == 21001){
                reason = '原密码错误';
            }else if(error_code == 21002){
                reason = '新密码不合法';
            }
            err({
                type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
                msg : reason
            });
            return;
        }
        err({
            type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
            msg : '未知错误'
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-08-24
* 设置单聊免打扰
* @param options userName,mute,success, error
*/
connection.prototype.muteNotifications = function(options) {
    var paramMsg = paramValid.checkMuteNotifications(options,this);
    if(!paramMsg.flag) return;
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          from:this.context.userId,
          to:'silentpush1@pushsilence.li726-26',
          type :'set',
        }).c('query', {
            xmlns: 'http://jabber.org/protocol/pushsilence'
        }).c('item',{silent:paramMsg.mute,jid:paramMsg.toJid});
    var completeFn = function(result){
        suc({
            type:LITTLEC_IM_CONNCTION_COMMOND_SUCCESS,
            msg:"设置成功"
        });
    }
    var errorFn = function (ele){
        var error = ele.getElementsByTagName('error');
        if(error && error.length > 0){
            ele.$getNodeValue = $getNodeValue;
            var error_code = ele.$getNodeValue('error_code');
            var reason = ele.$getNodeValue('reason');
            err({
                type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
                msg : reason
            });
            return;
        }
        err({
            type : LITTLEC_IM_CONNCTION_QUERYUSERINFO_ERROR,
            msg : '未知错误'
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};
/**
* add by xiayefeng 2015-08-24
* 拉取静默联系人
* @param options success, error
*/
connection.prototype.getMuteContacts = function(options) {
    var domain = this.domain || '';
    var suc =options.success || emptyFn;
    var err =  options.error || emptyFn;
    if(!this.isOpened()){
        err({
            type : LITTLEC_IM_CONNCTION_ERROR,
            msg : '未连接，请登录您的账号'  
        })
        return;
    }
    var uniqueId = this.getUniqueId();
    var iq= $iq({
          id: uniqueId,
          type :'get',
        }).c('query', {
            xmlns: 'jabber:iq:silence'
        });
    var completeFn = function(result){
        var rouster = [];
        var msgBodies = result.getElementsByTagName("query");
        if(msgBodies&&msgBodies.length>0){
            var queryTag = msgBodies[0];
            rouster = parseFriendFnForMute(queryTag);
        }
        suc(rouster);
    }
    var errorFn = function (ele){
        err({
            type : LITTLEC_IM_CONNCTION_GETROSTER_ERROR,
            msg : '获取静默联系人失败',
            data : ele
        });
    }
    this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
};


connection.prototype.setUserSig = function(desc) {
    var dom = $pres({xmlns : 'jabber:client'});
    desc = desc || "";
    dom.c("status").t(desc);
    this.sendCommand(dom.tree());
};
connection.prototype.setPresence = function() {
    var dom = $pres({
        xmlns : 'jabber:client',
        id : this.getUniqueId()
    }).c("priority").t(8);
    this.sendCommand(dom.tree());
};
connection.prototype.getPresence = function() {
    var dom = $pres({xmlns : 'jabber:client'});
    var conn = this;
    this.sendCommand(dom.tree());
};
connection.prototype.ping = function(options) {
    options = options || {};
    var jid = getJid(options,this);
    var dom = $iq({
        from : this.context.jid || '',
        to: jid,
        type: "get"
    }).c("ping", {xmlns: "urn:xmpp:ping"});

    suc = options.success || emptyFn;
    error = options.error || this.onError;
    var failFn = function(ele){
        error({
            type : LITTLEC_IM_CONNCTION_PING_ERROR,
            msg : 'ping失败',
            data : ele
        });
    };
    if(this.isOpened()){
        this.context.stropheConn.sendIQ(dom.tree(),suc,failFn);
    } else {
        error({
            type : LITTLEC_IM_CONNCTION_OPEN_ERROR,
            msg : '连接还未建立,请先登录或等待登录处理完毕'
        });
    }
    return;
};
connection.prototype.isOpened = function() {
    var status = this.context.status;
    return status==STATUS_OPENED;
};
connection.prototype.isOpening = function() {
    var status = this.context.status;
    return (status==STATUS_DOLOGIN_USERGRID) || (status==STATUS_DOLOGIN_IM);
};
connection.prototype.isClosing = function() {
    var status = this.context.status;
    return (status==STATUS_CLOSING);
};
connection.prototype.isClosed = function() {
    var status = this.context.status;
    return status == STATUS_CLOSED;
};
connection.prototype.clear = function() {
    this.context = {
        status : STATUS_INIT
    };
};
connection.prototype.equalAppkey = function(appkey){
    var localAppkey =   localStorage.getItem('appKey');
    if(appkey != localAppkey ){
        this.queryServiceIp(appkey);
    }
}
connection.prototype.hasConfig = function(){
    if(localStorage.getItem('imServerIP')&&localStorage.getItem('hmServerIP')&&
        localStorage.getItem('pafsIP')&&localStorage.getItem('imServerPort')&&
        localStorage.getItem('imServiceIP')){
        config.imServerPort = localStorage.getItem('imServerPort');
        config.imServerIP = localStorage.getItem('imServerIP');
        config.pafsIP = localStorage.getItem('pafsIP');
        config.hmServerIP = localStorage.getItem('hmServerIP');
        config.imServiceIP = localStorage.getItem('imServiceIP');
        return true;
    }else{
        return false;
    }   
}
Littlec.im.Connection = connection;

if (typeof Littlec.im.Helper == 'undefined') {
    Littlec.im.Helper = {};
    
    // method
    Littlec.im.Helper.getFileUrl = getFileUrlFn;
    Littlec.im.Helper.upload = uploadFn;
    Littlec.im.Helper.download = downloadFn;
    Littlec.im.Helper.getFileSize = getFileSizeFn;
    Littlec.im.Helper.xhr = doAjaxRequest;
    // Littlec.im.Helper.parseTextMessage = parseTextMessageFn;
    Littlec.im.Helper.login2UserGrid = login2UserGrid;
    Littlec.im.Helper.convertEmojiUnicodeToImage = convertEmojiUnicodeToImage;
    Littlec.im.Helper.convertCodePointsToUnicode = convertCodePointsToUnicode;
    Littlec.im.Helper.getInCommonUseEmojiList = getInCommonUseEmojiList;

    // attritue
    Littlec.im.Helper.isCanUploadFile = isCanUploadFile;
    Littlec.im.Helper.isCanDownLoadFile = isCanDownLoadFile;
    Littlec.im.Helper.hasSetRequestHeader = hasSetRequestHeader;
    Littlec.im.Helper.hasOverrideMimeType = hasOverrideMimeType;
    
    // object
    Littlec.im.Helper.Base64 = innerBase64;
}
})(jQuery)
}