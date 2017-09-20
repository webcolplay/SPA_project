/*
 * 局域网搜索设备
 *
*/
function sgnDeviceInfo(deviceInfos) {
	directory.addByLAN.getDeviceBindInfo(deviceInfos);
}


function sgnDeviceLoginResult(deviceId, result) {
	directory.addByLAN.deviceLoginResult(deviceId, result);
}

function sgnQueryDeviceResult(deviceId, result) {
	directory.addByLAN.queryDeviceResult(deviceId, result);
}

function sgnWebCloseVideo(deviceCode,channelSeq) {
	$(".playlist-" + deviceCode + "-" + channelSeq).find(".devicelist-playlist-playing").addClass('fn-hide');
	$(".playlist-" + deviceCode + "-" + channelSeq).find(".devicelist-playlist-play").removeClass('fn-hide');
}

function sgnWebSetThumbnail(devSN, channelID, picByteStr) {
	api.username($.cookie("username"));
	api.password($.cookie("password"));
	api.uploadDeviceCoverPicture({
			deviceId : devSN,
			channelId : channelID,
			pictureType : "jpeg",
			pictureData : picByteStr
		}, function(success) {
			//记得检查一下平台返回的picUrl有没有问题
			directory.devicelist.updateThumbnail(devSN, success.picUrl, channelID);
		}, function(error) {});
}

function sgnNotifyWebPlaybackInfo() {

}

function WebGetSelWndInfo() {

}
/*
 * 录像下载进度
 *
*/
function sgnDownLoadProgress(percent) {
	$("#dialogDownloadRecord").find(".download-progress-num").text(percent + "%");
	$("#dialogDownloadRecord").find(".download-progress-already").width(percent + "%");
	if(percent == 100) {
		ddsocx.StopDownLoad();
		$("#dialogDownloadRecord").find(".download-text").html('<span class="text-clear text-recordComplete"></span>');
	}
}
/*
 * 录像下载失败
 *
*/
function sgnDownloadFailed() {
	$("#dialogDownloadRecord").find(".download-text").html('<span class="text-clear text-recordFailed"></span>');
}
/*
 * 语音对讲
 *
*/
function sgnAudioTalk(index, deviceCode) {
	if(deviceCode) {
		var ability = devicesObject[deviceCode + "_" + '0'].ability;
		var protocol = devicesObject[deviceCode + "_" + '0'].protocol;
		if (protocol && protocol.split('.').length === 3) {
			var encryptStr = ability.indexOf("MediaEncrypt") > -1 ? "/encrypt" : "";
			var isEncrypt = ability.indexOf("MediaEncrypt") > -1 ? 1 : 0;
		} else {
			var encryptStr = ability.indexOf("HSEncrypt") > -1 ? "/encrypt" : "";
			var isEncrypt = ability.indexOf("HSEncrypt") > -1 ? 1 : 0;
		}
		api.getTransferStream({
				deviceId : deviceCode,
				requestUrl : "/talk" + encryptStr
			}, function(success) {
				var rtsp = success.RtspUrl;
				try{
					ddsocx.StartTalk(rtsp, isEncrypt, deviceCode, deviceCode, 0, ability);
				}catch(e){
					ddsocx = null;
				}
			}, function(error) {});
	}
}

function sgnSwitchStream(channelId, deviceId , type) {
	var ability = devicesObject[deviceId + "_" +channelId].ability;
	var protocol = devicesObject[deviceId + "_" +channelId].protocol;
	if (protocol && protocol.split('.').length === 3) {
		var encryptStr = devicesObject[deviceId + "_" +channelId].ability.indexOf("MediaEncrypt") > -1 ? "/encrypt" : "";
		var isEncrypt = devicesObject[deviceId + "_" +channelId].ability.indexOf("MediaEncrypt") > -1 ? 1 : 0;
	} else {
		var encryptStr = devicesObject[deviceId + "_" +channelId].ability.indexOf("HSEncrypt") > -1 ? "/encrypt" : "";
		var isEncrypt = devicesObject[deviceId + "_" +channelId].ability.indexOf("HSEncrypt") > -1 ? 1 : 0;
	}
	if (devicesObject[deviceId + "_" +channelId].functions.indexOf("configure") == -1) {
		ability = ability.replace(/PTZ/, "");
	}
	api.getTransferStream({
			deviceId : deviceId,
			requestUrl : "/real/" + channelId + "/" + type + encryptStr
		}, function(success) {
			var rtsp = success.RtspUrl;
			try{
				ddsocx.VideoRequest(rtsp, isEncrypt, deviceId, deviceId, deviceId, channelId, ability, type);
			}catch(e){
				ddsocx = null;
			}
		}, function(error) {});
}

/**
 * 播放视频
 */
function sgnWebOpenVideo(){

}

/**
 *  云台控制
 */
function sgnPtzMove(cameraId, nH, nV) {
	api.username($.cookie("username"));
	api.password($.cookie("password"));
	api.controlPTZ({
			deviceId : cameraId,
			channelId : 0,
			operation : "move",
			h : nH,
			v : nV,
			z : 1,
			duration : 500
		}, function(success) {
			//console.log(success);
		}, function(error) {});
}

function sgnPtzZoom(cameraId, fZoom) {
	api.username($.cookie("username"));
	api.password($.cookie("password"));
	api.controlPTZ({
			deviceId : cameraId,
			channelId : 0,
			operation : "move",
			h : 0,
			v : 0,
			z : fZoom,
			duration : 500
		}, function(success) {
			//console.log(success);
		}, function(error) {});
}

/**
 *  sd卡录像定位
 */
function sgnRtspSeek(cameraId, channelId, seekTime, endTime) {
	var seekTimeLocal = util.unixToDatetime(seekTime);
	var endTimeLocal = util.unixToDatetime(endTime);
	var ability = devicesObject[cameraId + "_" +channelId].ability;
	var protocol = devicesObject[cameraId + "_" +channelId].protocol;
	if (protocol && protocol.split('.').length === 3) {
		var encryptStr = ability.indexOf("MediaEncrypt") > -1 ? "/encrypt" : "";
	} else {
		var encryptStr = ability.indexOf("HSEncrypt") > -1 ? "/encrypt" : "";
	}
	api.getTransferStream({
			deviceId : cameraId,
			requestUrl : "/playback/" + channelId + "/" + seekTime + "-" + endTime + encryptStr
		}, function(success) {
			var rtsp = success.RtspUrl;
			try{
				ddsocx.RtspSeekPlayBack(rtsp, 1, cameraId, cameraId, ability);
			}catch(e){
				ddsocx = null;
			}
		}, function(error) {});
}

/**
 *  报警加密图片解密
 */
function sgnDecryptPic(alarmId, picName) {
	$(".alarmId-" + alarmId).children().attr("src", picName + "?storage=1");
}

/**
 * 通知当前热度统计的设备ID
 */
function sgnCurrentHeatStatisticsDevID(deviceId, channelNo) {
	directory.currentHeatStatisticsDevID = deviceId;
	directory.currentHeatStatisticsChannelNo = channelNo;
}

/**
 *  返回热度图的图片路径
 */
function sgnHeatStatisticsPicName(picName) {
	$("#heatStatisticsBase").attr("src", picName + "?storage=1").width(848);
}

/**
 *  报警消息推送
 */
function sgnAlarmMessage(alarmMsg) {
	var newAlarm = eval("(" + alarmMsg + ")");
	directory.informlist.addModel(newAlarm);
	if (!newAlarm.type) {
		directory.alarmlist.addNewAlarm(newAlarm);
	} else {
		directory.devicelist.refreshDeviceList();
	}
}

/**
 *  控件窗口选中，显示通道名称
 */
function sgnSelectDevice(deviceId, channelNo) {
	if (!deviceId) {
		$("#videoName").text("");
	} else {
		var device = devicesObject[deviceId + '_' + channelNo];
		$("#videoName").text(device.channelName);
	}
}

//视频短片分享到视频广场
function sgnShareVideo(deviceId, nChnlNo, picBase64, recordPath, title, intro, category) {
	api.addVideoShare({
		title : title,
		description : intro,
		deviceId : deviceId,
		channelId : nChnlNo,
		type : 0,
		category : category,
		picUrl : picBase64
	}, function(success) {
		var url = success.serverAdd;
		var videoId = success.shareVideoId;
		ddsocx.SetShareVideoUrl(deviceId, nChnlNo, recordPath, url, videoId + "", api.username(), api.password());
	},function(error) {
	});
}

function sgnUploadShareVideoResult(url, result) {
	//console.log(url, result);
}