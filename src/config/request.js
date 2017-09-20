import Vue from 'vue';
import axios from 'axios';

	var host_ = 'http://172.10.4.119';
	// var host_ = 'http://' + window.location.hostname + (window.location.port == "" ? "" : ":" + window.location.port);
	var username_ = $.cookie("username") || '';
	var password_ = $.cookie("password") || '';
	var appkey_ = getKey();
	var appsceret_= getSecret();
	var mac_ = util.getMac();
	var projectVersion_ = '1.0';
	var projectName_ = 'Easy4ip';

	function request(requestCivil, method, httpMethod, data, sucFn, tokenFlag, errFn) {
		var path = requestCivil ? '/civil/api/' + method : '/device/' + method;
		var clientType = 'web';
		var content = {
			'method' : method,
			'clientType' : clientType,
			'clientMac' : mac_,
			'clientPushId' : '',
			'project' : projectName_,
			'data' : data
		};
		var contentmd5 = algor.md5(JSON.stringify(content));
		var date = util.dateFormat(new Date());
		var nonce = util.randomString(10);
		var digest = algor.md5(nonce + date + password_);
		var auth = 'user=' + username_ + ',nonce=' + nonce + ',digest=' + digest;
		var stringToSign = httpMethod + '\n' +
			path + '\n' +
			'x-hs-apiver:' + projectVersion_ + '\n' +
			'x-hs-contentmd5:' + contentmd5 + '\n' +
			'x-hs-date:' + date + '\n' +
			'x-hs-auth:' + auth + '\n' +
			appsceret_ + '\n';
		var appkey = 'key=' + appkey_ + ',sign=' + algor.md5(stringToSign);
		var civilRequest = axios.create({
			baseURL : host_
		});
		var config = {
			headers : {
				'Content-Type' : 'application/' + requestCivil ? 'json' : 'xml' + '; charset=UTF-8',
				'x-hs-apiver' : projectVersion_,
				'x-hs-contentmd5' : contentmd5,
				'x-hs-date' : date,
				'x-hs-auth' : auth,
				'x-hs-appkey' : appkey
			},
			responseType : requestCivil ? 'json' : 'xml'
		}
		var url = encodeURI(path) + (requestCivil ? '?t=' + new Date().getTime() : '');
		data = requestCivil ? JSON.stringify(content) : data;
		var type = httpMethod.toLowerCase();
		civilRequest[type](url, data, config).then((res) => {
			var result = res.data;
			if (requestCivil) {
				if (result.code === 1000) {
					sucFn(result.data);
				} else {
					errFn(result);
				}
			} else {
				sucFn(result);
			}
		}).catch((err) => {
			//服务器响应码不在2xx范围内
			//调用全局配置错误回调
			// console.log(err.message);
			// console.log(err.response);
			var result = err.data;
			if (requestCivil) {
				switch (err.status) {
					case 401 :
						// $.cookie("password", null);
						// window.location.href="/";
						//throw new Error("civil-" + method + "-error:401-用户名密码认证失败");
						break;
				}
			} else {
				cbError && cbError(err);
			}
		});
	};

	// 新Dms请求函数
	function requestDmsJSON(method, httpMethod, data, sucFn, errFn) {
		var path = '/device/' + method;
		var nonce = util.randomString(32);
		var dateStr = util.dateFormat(new Date());
		var passwordDigest = algor.b64_sha1(nonce + dateStr + password_);
		var wsse = "UsernameToken"
				+ " Username=\"" + username_ + "\","
				+ " PasswordDigest=\"" + passwordDigest + "\","
				+ " Nonce=\"" + nonce + "\","
				+ " Created=\"" + dateStr + "\"";
		var dmsRequest = axios.create({
			baseURL : host_,
			headers : {
				common : {
					"Authorization" : "WSSE profile=\"UsernameToken\"",
					"X-WSSE" : wsse,
					"X-HSPV" : "1.00.00",
					"Content-Type" : "application/json; charset=UTF-8"
				}
			}
		});
		var url = host_ + path + '&t=' + new Date().getTime();
		data = _.isEmpty(data) ? "" : JSON.stringify(data);
		var type = httpMethod.toLowerCase();
		dmsRequest[type](url, data).then((res) => {
			var result = res.data;
			sucFn && sucFn(result);
		}).catch((err) => {
			var result = err.data;
			if (err.status === 401) {
				// $.cookie("password", null);
				// window.location.href="/";
			}
			if (result&&result.status === 200) {
				sucFn && sucFn(result);
			} else {
				errFn && errFn(err);
			}
		});
	}


	function getKey() {
		return util.getKey();
	};

	function getSecret() {
		return util.getSecret();
	};

	// Civil请求函数
	function requestCivil(method, data, sucFn, errFn) {
		request(true, method, 'POST', data, sucFn, true, errFn);
		// request.call(this, true, method, 'post', data, sucFn, true, errFn);
	};

	// 老Dms请求函数
	function requestDmsXml(method, httpMethod, data, sucFn, errFn) {
		request(false, method, httpMethod, data, sucFn, errFn);
		// request.call(this, false, method, httpMethod, data, sucFn, true, errFn);
	};



export default {

	// 读写主机地址
	host(data) {
		if (typeof data === 'string') {
			host_ = data;
		} else {
			return host_;
		}
	},

	// 读写用户名
	username(data) {
		if (typeof data === 'string') {
			username_ = data;
		} else {
			return username_;
		}
	},

	// 读写密码（md5过的数据）
	password(data) {
		if (typeof data === 'string') {
			password_ = data;
		} else {
			return password_;
		}
	},

	// 读写唯一标示
	mac(data) {
		if (typeof data === 'string') {
			mac_ = data;
		} else {
			return mac_;
		}
	},

	// 读写项目版本
	projectVersion(data) {
		if (typeof data === 'string') {
			projectVersion_ = data;
		} else {
			return projectVersion_;
		}
	},

	// 读写项目名称
	projectName(data) {
		if (typeof data === 'string') {
			projectName_ = data;
		} else {
			return projectName_;
		}
	},



	// ---------------- 外部接口-Dms ----------------

	getTransferStream(options, cbSuccess, cbError) {
		options = options || {};

		var method = "trans-url/" + options.deviceId + options.requestUrl;

		var data = {};

		requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
	},

	queryRecordNum(options, cbSuccess, cbError) {
		options = options || {};

		var method = "record-num/" + options.deviceId;

		var data = {
			ID : options.channelId,
			Type : options.type,
			BeginTime : options.beginTime,
			EndTime : options.endTime
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	queryRecords(options, cbSuccess, cbError) {
		options = options || {};

		var method = "records/" + options.deviceId;

		var data = {
			ID : options.channelId,
			Type : options.type,
			BeginTime : options.beginTime,
			EndTime : options.endTime,
			Need : options.need
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	queryRecordBitmap(options, cbSuccess, cbError) {
		options = options || {};

		var method = "record-bitmap/" + options.deviceId;

		var data = {
			ID : options.channelId,
			Year : options.year,
			Month : options.month
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	getAlarmEffect(options, cbSuccess, cbError) {
		options = options || {};

		var method = "alarm-effect/" + options.deviceId + "/" + options.channelId;

		var data = {};

		requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
	},

	setAlarmEffect(options, cbSuccess, cbError) {
		options = options || {};

		var method = "alarm-effect/" + options.deviceId + "/" + options.channelId;

		var data = {
			Sound : options.sound
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	connectWifi(options, cbSuccess, cbError) {
		options = options || {};

		var method = "wifi-link/" + options.deviceId;

		var data = {
			SSID : options.SSID,
			BSSID : options.BSSID,
			LinkEnable : options.linkEnable,
			Password : options.password
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	enableWifi(options, cbSuccess, cbError) {
		options = options || {};

		var method = "wifi-on/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	disableWifi(options, cbSuccess, cbError) {
		options = options || {};

		var method = "wifi-off/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	getWifiStatus(options, cbSuccess, cbError) {
		options = options || {};

		var method = "wifi/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
	},

	getWifiCurrent(options, cbSuccess, cbError) {
		options = options || {};

		var method = "wifi-current/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, "GET", data, cbSuccess, cbError);
	},

	getUpgradeProgress(options, cbSuccess, cbError) {
		options = options || {};

		var method = "upgrade-progress/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
	},

	upgradeDevice(options, cbSuccess, cbError) {
		options = options || {};

		var method =  "upgrade/" + options.deviceId;

		var data = {
			Package : options.package
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	controlPTZ(options, cbSuccess, cbError) {
		options = options || {};

		var method = "ptz-control/" + options.deviceId + "/" + options.channelId;

		var data = {
			Operation : options.operation,
			H : options.h,
			V : options.v,
			Z : options.z,
			Duration : options.duration
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	getPilotStatus(options, cbSuccess, cbError) {
		options = options || {};

		var method = "pilot-status/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
	},

	setPilotStatus(options, cbSuccess, cbError) {
		options = options || {};

		var method = "pilot-status/" + options.deviceId;

		var data = {
			Status : options.status
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	getFrameParams(options, cbSuccess, cbError) {
		options = options || {};

		var method = "frame-params/" + options.deviceId + "/" + options.channelId;

		var data = {};

		requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
	},

	setFrameParams(options, cbSuccess, cbError) {
		options = options || {};

		var method = "frame-params/" + options.deviceId + "/" + options.channelId;

		var data = {
			Direction : options.direction
		};

		requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
	},

	querySDCardStatus(options, cbSuccess, cbError) {
		options = options || {};

		var method = "sdcard-status/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, "POST", data,  cbSuccess, cbError);
	},

	initSDCard(options, cbSuccess, cbError) {
		options = options || {};

		var method = "sdcard-init/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, "POST", data, cbSuccess, cbError);
	},

	getDeviceVolume(options, cbSuccess, cbError) {
		options = options || {};

		var method = "sound-level/" + options.deviceId;

		var data = {};

		requestDmsJSON(method, "GET", data, cbSuccess, cbError);
	},

	setDeviceVolume(options, cbSuccess, cbError) {
		options = options || {};

		var method = "sound-level/" + options.deviceId;

		var data = {
			Sound : options.Sound
		};

		requestDmsJSON(method, "POST", data, cbSuccess, cbError);
	},

	subscribeZBDeviceDiscovery(options, cbSuccess, cbError) {
		options = options || {};

		var method = options.deviceId + options.requestUrl;

		var data = "<?xml version='1.0' encoding='UTF-8'?>"
				+ "<body>"
				+ "<SubscribeID>" + options.subscribeId + "</SubscribeID>"
				+ "<TimeoutPeriod>" + options.timeoutPeriod + "</TimeoutPeriod>"
				+ "</body>";

		requestDmsXml(method, 'POST', data, cbSuccess, cbError);
	},

	unsubscribeZBDeviceDiscovery(options, cbSuccess, cbError) {
		options = options || {};

		var method = options.deviceId + options.requestUrl;

		var data = "<?xml version='1.0' encoding='UTF-8'?>"
				+ "<body>"
				+ "<SubscribeID>" + options.subscribeId + "</SubscribeID>"
				+ "</body>";

		requestDmsXml(method, 'POST', data, cbSuccess, cbError);
	},



	// ---------------- 外部接口-civil.device ----------------

	getDeviceList(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			mode : options.mode || '',
			filter : options.filter || [],
			userId : options.userId || 0,
			deviceType : options.deviceType || []
		};

		requestCivil('civil.device.GetDeviceListEx', data, cbSuccess, cbError);
	},

	modifyDeviceName(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : isNaN(options.channelId) ? '' : options.channelId,
			name : options.name || ''
		};

		requestCivil('civil.device.ModifyDeviceName', data, cbSuccess, cbError);
	},

	bindDevice(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || ''
		};

		requestCivil('civil.device.BindDevice', data, cbSuccess, cbError);
	},

	checkDeviceBind(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || ''
		};

		requestCivil('civil.device.CheckDeviceBindOrNot', data, cbSuccess, cbError);
	},

	unbindDevice(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			deleteCloudRecords : options.deleteCloudRecords || true
		};

		requestCivil('civil.device.UnbindDevice', data, cbSuccess, cbError);
	},

	setDeviceShare(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			shareInfos : options.shareInfos || []
		};

		requestCivil('civil.device.SetDeviceShare', data, cbSuccess, cbError);
	},

	getDeviceShare(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			type : options.type || 0
		};

		requestCivil('civil.device.GetDeviceShare', data, cbSuccess, cbError);
	},

	getAlarmPlanConfig(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || ''
		};

		requestCivil('civil.device.GetAlarmPlanConfig', data, cbSuccess, cbError);
	},

	setAlarmPlanConfig(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channels : options.channels || []
		};

		requestCivil('civil.device.SetAlarmPlanConfig', data, cbSuccess, cbError);
	},

	getDeviceUpgradeVersion(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceIds : options.deviceIds || []
		};

		requestCivil('civil.device.GetDeviceUpgradeVersion', data, cbSuccess, cbError);
	},

	getDeviceBindInfos(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceIds : options.deviceIds || []
		};

		requestCivil('civil.device.GetDeviceBindInfos', data, cbSuccess, cbError);
	},

	getHeatMap(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceCodes : options.deviceCodes || [],
			startTime : options.startTime || '',
			endTime : options.endTime || ''
		};

		requestCivil('civil.device.GetHeatMap', data, cbSuccess, cbError);
	},

	getFormCount(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceCodes : options.deviceCodes || [],
			formType : options.formType || '',
			beginTime : options.beginTime || '',
			endTime : options.endTime || ''
		};

		requestCivil('civil.device.GetFormCount', data, cbSuccess, cbError);
	},

	uploadDeviceCoverPicture(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId,
			channelId : options.channelId,
			pictureType : options.pictureType,
			pictureData : options.pictureData
		};

		requestCivil('civil.device.UploadDeviceCoverPicture', data, cbSuccess, cbError);
	},

	searchDevice(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			keywords : options.keywords || "",
			pageNo : options.pageNo || 0,
			pageSize : options.pageSize || 0
		};

		requestCivil('civil.device.SearchDeviceEx', data, cbSuccess, cbError);
	},

	// ---------------- 外部接口-civil.message ----------------

	getSystemMessage(options, cbSuccess, cbError) {
		options = options || {};

		var data = {};

		options = options || {};
		data.count = options.count || 10;
		data.msgId = options.msgId || -1;

		requestCivil('civil.message.GetSystemMessage', data, cbSuccess, cbError);
	},

	postFeedback(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			type : options.type || 0,
			content : options.content || ''
		};

		requestCivil('civil.message.PostFeedback', data, cbSuccess, cbError);
	},

	getAllAlarmMessage(options, cbSuccess, cbError) {
		options = options || {};

		var data = {};

		requestCivil('civil.message.GetAllAlarmMessage', data, cbSuccess, cbError);
	},

	getAlarmMessage(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || '',
			count : options.count || 10,
			readFlag : options.readFlag || -1,
			alarmId : options.alarmId || -1,
			beginTime : options.beginTime || 0,
			endTime : options.endTime || 0
		};

		requestCivil('civil.message.GetAlarmMessage', data, cbSuccess, cbError);
	},


	getOnlineMessage(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || '',
			count : options.count || 10,
			alarmId : options.alarmId || -1,
			deviceCode : options.deviceCode || '',
			channelSeq : options.channelSeq || '',
			channelSort : options.channelSort || ''
		};

		requestCivil('civil.message.GetOnlineMessage', data, cbSuccess, cbError);
	},

	markAlarmMessage(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || '',
			markAction : options.markAction || 1,
			markIds : options.markIds || [],
			beginTime : options.beginTime || 0,
			endTime : options.endTime || 0
		};

		requestCivil('civil.message.MarkAlarmMessage', data, cbSuccess, cbError);
	},

	deleteAlarmMessage(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || '',
			readFlag : options.readFlag || -1,
			deleteIds : options.deleteIds || [],
			beginTime : options.beginTime || 0,
			endTime : options.endTime || 0
		};

		requestCivil('civil.message.DeleteAlarmMessage', data, cbSuccess, cbError);
	},

	getAppVersionInfo(options, cbSuccess, cbError) {
		options = options || {};

		var data = {};

		requestCivil('civil.message.GetAppVersionInfo', data, cbSuccess, cbError);
	},

	getMesAddress(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			videoState : options.videoState || 0
		};

		requestCivil('civil.message.GetMesAddress', data, cbSuccess, cbError);
	},

	getOCXVersionInfo(options, cbSuccess, cbError) {
		options = options || {};

		var data = {};

		requestCivil('civil.message.GetOCXVersionInfo', data, cbSuccess, cbError);
	},

	// ---------------- 外部接口-civil.square ----------------

	getVideoShareInfos(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			pageNo : options.pageNo || 0,
			pageCount : options.pageCount || 0,
			types : options.types || [],
			category : options.category || "",
			queryCondition : options.queryCondition || []
		};

		requestCivil('civil.square.GetVideoShareInfos', data, cbSuccess, cbError);
	},

	getVideoShareDetail(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			 shareVideoId : options.shareVideoId || "",
			 commentId : options.commentId || "",
			 commentPageNo : options.commentPageNo || 0,
			 commentPageSize : options.commentPageSize || 0,
			 userName : options.userName || ""
		};

		requestCivil('civil.square.GetVideoShareDetail', data, cbSuccess, cbError);
	},

	updatePrize(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			sharedVideoId : options.sharedVideoId || "",
			type : options.type || 0
		};

		requestCivil('civil.square.UpdatePrize', data, cbSuccess, cbError);
	},

	getWxcsHeadAndBottom(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			params : options.params || ""
		};

		requestCivil('civil.square.GetWxcsHeadAndBottom', data, cbSuccess, cbError);
	},

	addComment(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			sharedVideoId : options.sharedVideoId || "",
			content : options.content || "",
			replayCommentId : options.replayCommentId || ""
		};

		requestCivil('civil.square.AddComment', data, cbSuccess, cbError);
	},

	getComments(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			shareVideoId : options.shareVideoId || "",
			commentPageSize : options.commentPageSize || 10,
			commentId : options.commentId || -1
		};

		requestCivil('civil.square.GetComments', data, cbSuccess, cbError);
	},

	deleteShareVideo(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			shareVideoId : options.shareVideoId || ""
		};

		requestCivil('civil.square.DeleteShareVideo', data, cbSuccess, cbError);
	},

	getVideoShareUrl(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			shareVideoId : options.shareVideoId || ""
		};

		requestCivil('civil.square.GetVideoShareUrl', data, cbSuccess, cbError);
	},

	addVideoShare(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			title : options.title || "",
			description : options.description || "",
			deviceId : options.deviceId || "",
			channelId : options.channelId || "0",
			shareStartTime : options.shareStartTime || 0,
			shareEndTime : options.shareEndTime || 0,
			videoStartTime : options.videoStartTime || "",
			videoEndTime : options.videoEndTime || "",
			type : options.type || 0,
			category : options.category || 0,
			picUrl : options.picUrl || ""
		};

		requestCivil('civil.square.AddVideoShare', data, cbSuccess, cbError);
	},

	isVideoSharedOrNot(options, cbSuccess, cbError) {
		options = options || {};
		var data = {
			deviceId : options.deviceId || "",
			channelId : options.channelId || 0
		};
		requestCivil('civil.square.IsVideoSharedOrNot', data, cbSuccess, cbError);
	},


	// ---------------- 外部接口-civil.storage ----------------

	getStorageStrategyList(options, cbSuccess, cbError) {
		options = options || {};

		var data = {};

		requestCivil('civil.storage.GetStorageStrategyList', data, cbSuccess, cbError);
	},

	getStorageStrategy(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0
		};

		requestCivil('civil.storage.GetStorageStrategy', data, cbSuccess, cbError);
	},

	setStorageStrategy(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			strategyId : options.strategyId || -1
		};

		requestCivil('civil.storage.SetStorageStrategy', data, cbSuccess, cbError);
	},

	queryCloudRecordBitmap(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			year : options.year || '',
			month : options.month || ''
		};

		requestCivil('civil.storage.QueryCloudRecordBitmap', data, cbSuccess, cbError);
	},

	queryCloudRecordNum(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			beginTime : options.beginTime || '',
			endTime : options.endTime || ''
		};

		requestCivil('civil.storage.QueryCloudRecordNum', data, cbSuccess, cbError);
	},

	queryCloudRecords(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			beginTime : options.beginTime || '',
			endTime : options.endTime || '',
			need : options.need || ''
		};

		requestCivil('civil.storage.QueryCloudRecords', data, cbSuccess, cbError);
	},

	queryCloudRecordsEx(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			channelId : options.channelId || 0,
			beginTime : options.beginTime || '',
			endTime : options.endTime || '',
			need : options.need || ''
		};

		requestCivil('civil.storage.QueryCloudRecordsEx', data, cbSuccess, cbError);
	},

	cloudRecordPathOfAlarm(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceCode: options.deviceCode,
			alarmTime: options.alarmTime
		};

		requestCivil('civil.storage.CloudRecordPathOfAlarm', data, cbSuccess, cbError);
	},

	cloudRecordPathOfAlarmEx(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceCode: options.deviceCode,
			alarmTime: options.alarmTime
		};

		requestCivil('civil.storage.CloudRecordPathOfAlarmEx', data, cbSuccess, cbError);
	},

	getAlarmVideoUrl(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			alarmId : options.alarmId || 0
		};

		requestCivil('civil.message.GetAlarmVideoUrl', data, cbSuccess, cbError);
	},

	generatePicUrlByPath(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			recordPath : options.recordPath || ''
		};

		requestCivil('civil.storage.GeneratePicUrlByPath', data, cbSuccess, cbError);
	},

	getLocalRecordUrl(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || '',
			beginTime: options.beginTime || "",
			endTime: options.endTime || ""
		};

		requestCivil('civil.storage.GetLocalRecordUrl', data, cbSuccess, cbError);
	},

	// ---------------- 外部接口-civil.TVPanel ----------------

	getTVPanels(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			TVPanelId : options.TVPanelId || 0,
			TVPanelName : options.TVPanelName || '',
			memo : options.memo || '',
			isOpen : options.isOpen || -1,
			pageNo : options.pageNo || 0,
			pageSize : options.pageSize || 0
		};

		requestCivil('civil.TVPanel.GetTVPanels', data, cbSuccess, cbError);
	},

	queryTVPanelWithScreen(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			TVPanelId : options.TVPanelId || 0
		};

		requestCivil('civil.TVPanel.QueryTVPanelWithScreen', data, cbSuccess, cbError);
	},

	saveOrUpdateTVPanel(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			TVPanelId : options.TVPanelId || 0,
			TVPanelName : options.TVPanelName || '',
			memo : options.memo || '',
			isOpen : options.isOpen || 0,
			acrossNum : options.acrossNum || 0,
			uprightNum : options.uprightNum || 0,
			screenInfos : options.screenInfos || []
		};

		requestCivil('civil.TVPanel.SaveOrUpdateTVPanel', data, cbSuccess, cbError);
	},

	deleteTVPanel(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			TVPanelIds : options.TVPanelIds || []
		};

		requestCivil('civil.TVPanel.DeleteTVPanel', data, cbSuccess, cbError);
	},

	updateTVPanelState(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			TVPanelInfos : options.TVPanelInfos || []
		};

		requestCivil('civil.TVPanel.UpdateTVPanelState', data, cbSuccess, cbError);
	},

	TVPanelNameIsExist(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			TVPanelName : options.TVPanelName || ""
		};

		requestCivil('civil.TVPanel.TVPanelNameIsExist', data, cbSuccess, cbError);
	},

	checkNVDUsed(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			NVDDeviceId : options.NVDDeviceId || "",
			NVDChannelId : options.NVDChannelId || 0
		};

		requestCivil('civil.TVPanel.CheckNVDUsed', data, cbSuccess, cbError);
	},

	setNVDchannels(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			NVD : options.NVD || []
		};

		requestCivil('civil.TVPanel.SetNVDchannels', data, cbSuccess, cbError);
	},

	removeNVDchannels(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			screenInfo : options.screenInfo || []
		};

		requestCivil('civil.TVPanel.RemoveNVDchannels', data, cbSuccess, cbError);
	},

	// ---------------- 外部接口-civil.user ----------------

	getUserInfo(cbSuccess, cbError) {
		requestCivil('civil.user.GetUserInfo', {}, cbSuccess, cbError);
	},

	getLoginInfo(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			count : options.count || ''
		};

		requestCivil('civil.user.GetLoginInfo', data, cbSuccess, cbError);
	},

	login(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			appId : options.appId || '',
			clientName : options.clientName || '',
			validCode : options.validCode
		};

		requestCivil('civil.user.UserLogin', data, cbSuccess, cbError);
	},

	logout(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			appId : options.appId || '',
			clientName : options.clientName || ''
		};

		requestCivil('civil.user.UserLogout', data, cbSuccess, cbError);
	},

	isUserExists(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			usernameOrPhoneNumber : options.usernameOrPhoneNumber || ''
		};

		requestCivil('civil.user.IsUserExists', data, cbSuccess, cbError);
	},

	verifyValidCode(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			phoneNumber : options.phoneNumber || '',
			validCode : options.validCode || ''
		};

		requestCivil('civil.user.VerifyValidCode', data, cbSuccess, cbError);
	},

	getValidCodeToPhone(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			phoneNumber : options.phoneNumber || ''
		};

		requestCivil('civil.user.GetValidCodeToPhone', data, cbSuccess, cbError);
	},

	getValidPic(options, cbSuccess, cbError) {
		options = options || {};

		var data = {};

		requestCivil('civil.user.GetValidPic', data, cbSuccess, cbError);
	},

	addUser(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			username : options.username || '',
			phoneNumber : options.phoneNumber || '',
			password : options.password || '',
			validCode : options.validCode || '',
			registerType : options.registerType || 2,
			groupId : options.groupId || 0
		};

		requestCivil('civil.user.AddUser', data, cbSuccess, cbError);
	},

	resetPassword(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			phoneNumber : options.phoneNumber || '',
			newPassword : options.newPassword || '',
			validCode : options.validCode || ''
		};

		requestCivil('civil.user.ResetPassword', data, cbSuccess, cbError);
	},

	// 由于返回结果只能为成功或者失败，本接口只支持单个子账户的添加！
	addChildUsen(options, cbSuccess, cbError){
		var data = {
			childUsers : options.childUsers || []
		};

		requestCivil('civil.user.AddChildUser', data, cbSuccess, cbError, function(resp) {
			try {
				var username = options.childUsers[0];

				for( var i in resp.data.results) {
					if (resp.data.results[i].username === username.username
						&& resp.data.results[i].resultCode === 0) {
						return true;
					}
				}
			} catch (err) {
				return false;
			}

			return false;
		});
	},

	getChildUser(cbSuccess, cbError) {
		requestCivil('civil.user.GetChildUser', {}, cbSuccess, cbError);
	},

	// 由于返回结果只能为成功或者失败，本接口只支持单个子账户的删除！
	deleteChildUser(options, cbSuccess, cbError) {
		var data = {
			childUsers : options.childUsers || []
		};

		requestCivil('civil.user.DeleteChildUser', data, cbSuccess, cbError, function(resp) {
			try {
				var username = options.childUsers[0];

				for (var i in resp.data.results) {
					if (resp.data.results[i].username === username
						&& resp.data.results[i].resultCode === 0) {
						return true;
					}
				}
			} catch (err) {
				return false;
			}

			return false;
		});
	},

	modifyChildUsen(options, cbSuccess, cbError){
		// var data = {
		// 	username : options.username || '',
		// 	password : options.password || '',
		// 	phoneNumber : options.phoneNumber || '',
		// 	remark : options.remark || ''
		// };
		var data = options;

		requestCivil('civil.user.ModifyChildUser', data, cbSuccess, cbError);
	},

	// 由于返回结果只能为成功或者失败，本接口只支持单个子账户的冻结和授权！
	controlChildUser(options, cbSuccess, cbError) {
		var data = {
			childUsers : options.childUsers || []
		};

		requestCivil('civil.user.ControlChildUser', data, cbSuccess, cbError, function(resp) {
			try {
				var username = options.childUsers[0].username;

				for (var i in resp.data.results) {
					if (resp.data.results[i].username === username
						&& resp.data.results[i].resultCode === 0) {
						return true;
					}
				}
			} catch (err) {
				return false;
			}

			return false;
		});
	},

	getChildUserDeviceList(options, cbSuccess, cbError) {
		var data = {
			childUsername : options.childUsername || ''
		};

		requestCivil('civil.user.GetChildUserDeviceList', data, cbSuccess, cbError);
	},

	modifyPassword(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			newPassword : options.newPassword || ''
		};

		requestCivil('civil.user.ModifyPassword', data, cbSuccess, cbError);
	},

	modifyPhoneNumber(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			phoneNumber : options.phoneNumber || '',
			validCode : options.validCode || ''
		};

		requestCivil('civil.user.ModifyPhoneNumber', data, cbSuccess, cbError);
	},

	updateUserIcon(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			pic : options.pic || ''
		};

		requestCivil('civil.user.UpdateUserIcon', data, cbSuccess, cbError);
	},

	getConfiguration(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			params : options.params || []
		};

		requestCivil('civil.user.GetConfiguration', data, cbSuccess, cbError);
	},

	// ---------------- 外部接口-civil.zb ----------------

	addZBDevice(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || "",
			zbDeviceId : options.zbDeviceId || "",
			zbDeviceName : options.zbDeviceName || ""
		};

		requestCivil('civil.zb.AddZBDevice', data, cbSuccess, cbError);
	},

	deleteZBDevice(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || "",
			channelId : options.channelId || 0,
			zbDeviceId : options.zbDeviceId || ""
		};

		requestCivil('civil.zb.DeleteZBDevice', data, cbSuccess, cbError);
	},

	renameZBDevice(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			deviceId : options.deviceId || "",
			channelId : options.channelId || 0,
			zbDeviceId : options.zbDeviceId || "",
			zbDeviceName : options.zbDeviceName || ""
		};

		requestCivil('civil.zb.RenameZBDevice', data, cbSuccess, cbError);
	},

	getDiscoveredZBDeviceList(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			subscribeID : options.subscribeID || "",
			deviceId : options.deviceId || ""
		};

		requestCivil('civil.zb.GetDiscoveredZBDeviceList', data, cbSuccess, cbError);
	},

	// ---------------- 外部接口-civil.news ----------------
	getNewsList(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			newsId : options.newsId || -1,
			count : options.count || 0,
			check : options.check || 0
		};

		requestCivil('civil.news.GetNewsList', data, cbSuccess, cbError);
	},

	getNewsDetail(options, cbSuccess, cbError) {
		options = options || {};

		var data = {
			newsId : options.newsId || -1
		};

		requestCivil('civil.news.GetNewsDetail', data, cbSuccess, cbError);
	}

};