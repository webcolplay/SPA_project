(function (root, factory) {
	root.api = root.api || factory(jQuery);
})(this, function ($) {
	function ExportClass() {
		var host_ = 'http://172.10.4.119';
		// var host_ = 'http://' + window.location.hostname + (window.location.port == "" ? "" : ":" + window.location.port);
		var username_ = $.cookie("username") || '';
		var password_ = $.cookie("password") || '';
		var appkey_ = getKey();
 		var appsceret_= getSecret();
		var mac_ = util.getMac();
		var projectVersion_ = '1.0';
		var projectName_ = 'Easy4ip';

		function request(requestCivil, method, httpMethod, data, cbSuccess, cbError) {
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
			$.ajax({
				type : httpMethod,
				url : host_ + encodeURI(path) + (requestCivil ? '?t=' + new Date().getTime() : ''),
				data : requestCivil ? JSON.stringify(content) : data,
				dataType : requestCivil ? 'json' : 'xml',
				beforeSend : function (request) {
					request.setRequestHeader('Content-Type', 'application/' + requestCivil ? 'json' : 'xml' + '; charset=UTF-8');
					request.setRequestHeader('x-hs-apiver', projectVersion_);
					request.setRequestHeader('x-hs-contentmd5', contentmd5);
					request.setRequestHeader('x-hs-date', date);
					request.setRequestHeader('x-hs-auth', auth);
					request.setRequestHeader('x-hs-appkey', appkey);
				},
				success : function (result) {
					if (requestCivil) {
						if (result.code === 1000) {
							cbSuccess(result.data);
						} else {
							cbError(result);
						}
					} else {
						cbSuccess(result);
					}
				},
				error : function (result) {
					if (result.status === 401) {
						$.cookie("password", null);
						// window.location.href="/html/main/login.html";
					} if (result.status === 200) {
						cbSuccess && cbSuccess(result);
					} else {
						cbError && cbError(result);
					}
				}
			});
		}

		// 新Dms请求函数
		function requestDmsJSON(method, httpMethod, data, cbSuccess, cbError) {
			var path = '/device/' + method;
			var nonce = util.randomString(32);
			var dateStr = util.dateFormat(new Date());
			var passwordDigest = algor.b64_sha1(nonce + dateStr + password_);
			var wsse = "UsernameToken"
					+ " Username=\"" + username_ + "\","
					+ " PasswordDigest=\"" + passwordDigest + "\","
					+ " Nonce=\"" + nonce + "\","
					+ " Created=\"" + dateStr + "\"";
			$.ajax({
				type : httpMethod,
				url : host_+ path + '&t=' + new Date().getTime(),
				data : _.isEmpty(data) ? "" : JSON.stringify(data),
				dataType : 'json',
				beforeSend : function (request) {
					request.setRequestHeader("Authorization", "WSSE profile=\"UsernameToken\"");
        					request.setRequestHeader("X-WSSE", wsse);
        					request.setRequestHeader("X-HSPV", "1.00.00");
        					request.setRequestHeader("Content-Type","application/json; charset=UTF-8");
				},
				success : function (result) {
					cbSuccess && cbSuccess(result);
				},
				error : function (result) {
					if (result.status === 401) {
						$.cookie("password", null);
						// window.location.href="/html/main/login.html";
					} if (result.status === 200) {
						cbSuccess && cbSuccess(result);
					} else {
						cbError && cbError(result);
					}
				}
			});
		}
		function getKey() {
                        return util.getKey();
		}

            	function getSecret() {
               		return util.getSecret();
            	}

		// Civil请求函数
		function requestCivil(method, data, cbSuccess, cbError) {
			request(true, method, "POST", data, cbSuccess, cbError);
		}

		// 老Dms请求函数
		function requestDmsXml(method, httpMethod, data, cbSuccess, cbError) {
			request(false, method, httpMethod, data, cbSuccess, cbError);
		}

		// 读写主机地址
		this.host = function (data) {
			if (typeof data === 'string') {
				host_ = data;
			} else {
				return host_;
			}
		}

		// 读写用户名
		this.username = function (data) {
			if (typeof data === 'string') {
				username_ = data;
			} else {
				return username_;
			}
		}

		// 读写密码（md5过的数据）
		this.password = function (data) {
			if (typeof data === 'string') {
				password_ = data;
			} else {
				return password_;
			}
		}

		// 读写唯一标示
		this.mac = function (data) {
			if (typeof data === 'string') {
				mac_ = data;
			} else {
				return mac_;
			}
		}

		// 读写项目版本
		this.projectVersion = function (data) {
			if (typeof data === 'string') {
				projectVersion_ = data;
			} else {
				return projectVersion_;
			}
		}

		// 读写项目名称
		this.projectName = function (data) {
			if (typeof data === 'string') {
				projectName_ = data;
			} else {
				return projectName_;
			}
		}

		// ---------------- 外部接口-civil.device ----------------

		this.getDeviceList = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				mode : options.mode || '',
				filter : options.filter || [],
				userId : options.userId || 0,
				deviceType : options.deviceType || []
			};

			requestCivil('civil.device.GetDeviceListEx', data, cbSuccess, cbError);
		}

		this.modifyDeviceName = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : isNaN(options.channelId) ? '' : options.channelId,
				name : options.name || ''
			};

			requestCivil('civil.device.ModifyDeviceName', data, cbSuccess, cbError);
		}

		this.bindDevice = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || ''
			};

			requestCivil('civil.device.BindDevice', data, cbSuccess, cbError);
		}

		this.checkDeviceBind = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || ''
			};

			requestCivil('civil.device.CheckDeviceBindOrNot', data, cbSuccess, cbError);
		}

		this.unbindDevice = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				deleteCloudRecords : options.deleteCloudRecords || true
			};

			requestCivil('civil.device.UnbindDevice', data, cbSuccess, cbError);
		}

		this.setDeviceShare = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0,
				shareInfos : options.shareInfos || []
			};

			requestCivil('civil.device.SetDeviceShare', data, cbSuccess, cbError);
		}

		this.getDeviceShare = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0,
				type : options.type || 0
			};

			requestCivil('civil.device.GetDeviceShare', data, cbSuccess, cbError);
		}

		this.getAlarmPlanConfig = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || ''
			};

			requestCivil('civil.device.GetAlarmPlanConfig', data, cbSuccess, cbError);
		}

		this.setAlarmPlanConfig = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channels : options.channels || []
			};

			requestCivil('civil.device.SetAlarmPlanConfig', data, cbSuccess, cbError);
		}

		this.getDeviceUpgradeVersion = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceIds : options.deviceIds || []
			};

			requestCivil('civil.device.GetDeviceUpgradeVersion', data, cbSuccess, cbError);
		}

		this.getDeviceBindInfos = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceIds : options.deviceIds || []
			};

			requestCivil('civil.device.GetDeviceBindInfos', data, cbSuccess, cbError);
		}

		this.getHeatMap = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceCodes : options.deviceCodes || [],
				startTime : options.startTime || '',
				endTime : options.endTime || ''
			};

			requestCivil('civil.device.GetHeatMap', data, cbSuccess, cbError);
		}

		this.getFormCount = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceCodes : options.deviceCodes || [],
				formType : options.formType || '',
				beginTime : options.beginTime || '',
				endTime : options.endTime || ''
			};

			requestCivil('civil.device.GetFormCount', data, cbSuccess, cbError);
		}

		this.uploadDeviceCoverPicture = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId,
				channelId : options.channelId,
				pictureType : options.pictureType,
				pictureData : options.pictureData
			};

			requestCivil('civil.device.UploadDeviceCoverPicture', data, cbSuccess, cbError);
		}

		this.searchDevice = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				keywords : options.keywords || "",
				pageNo : options.pageNo || 0,
				pageSize : options.pageSize || 0
			}

			requestCivil('civil.device.SearchDeviceEx', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.message ----------------

		this.getSystemMessage = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {};

			options = options || {};
			data.count = options.count || 10;
			data.msgId = options.msgId || -1;

			requestCivil('civil.message.GetSystemMessage', data, cbSuccess, cbError);
		}

		this.postFeedback = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				type : options.type || 0,
				content : options.content || ''
			};

			requestCivil('civil.message.PostFeedback', data, cbSuccess, cbError);
		}

		this.getAllAlarmMessage = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {};

			requestCivil('civil.message.GetAllAlarmMessage', data, cbSuccess, cbError);
		}


		this.getAlarmMessage = function (options, cbSuccess, cbError) {
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
		}

		this.markAlarmMessage = function (options, cbSuccess, cbError) {
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
		}

		this.getOnlineMessage = function (options, cbSuccess, cbError) {
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
		}

		this.deleteAlarmMessage = function (options, cbSuccess, cbError) {
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
		}

		this.getAppVersionInfo = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {};

			requestCivil('civil.message.GetAppVersionInfo', data, cbSuccess, cbError);
		}

		this.getMesAddress = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				videoState : options.videoState || 0
			};

			requestCivil('civil.message.GetMesAddress', data, cbSuccess, cbError);
		}

		this.getOCXVersionInfo = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {};

			requestCivil('civil.message.GetOCXVersionInfo', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.square ----------------

		this.getVideoShareInfos = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				pageNo : options.pageNo || 0,
				pageCount : options.pageCount || 0,
				types : options.types || [],
				category : options.category || "",
				queryCondition : options.queryCondition || []
			};

			requestCivil('civil.square.GetVideoShareInfos', data, cbSuccess, cbError);
		}

		this.getVideoShareDetail = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				 shareVideoId : options.shareVideoId || "",
				 commentId : options.commentId || "",
				 commentPageNo : options.commentPageNo || 0,
				 commentPageSize : options.commentPageSize || 0,
				 userName : options.userName || ""
			};

			requestCivil('civil.square.GetVideoShareDetail', data, cbSuccess, cbError);
		}

		this.updatePrize = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				sharedVideoId : options.sharedVideoId || "",
				type : options.type || 0
			};

			requestCivil('civil.square.UpdatePrize', data, cbSuccess, cbError);
		}

		this.getWxcsHeadAndBottom = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				params : options.params || ""
			};

			requestCivil('civil.square.GetWxcsHeadAndBottom', data, cbSuccess, cbError);
		}

		this.addComment = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				sharedVideoId : options.sharedVideoId || "",
				content : options.content || "",
				replayCommentId : options.replayCommentId || ""
			};

			requestCivil('civil.square.AddComment', data, cbSuccess, cbError);
		}

		this.getComments = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				shareVideoId : options.shareVideoId || "",
				commentPageSize : options.commentPageSize || 10,
				commentId : options.commentId || -1
			};

			requestCivil('civil.square.GetComments', data, cbSuccess, cbError);
		}

		this.deleteShareVideo = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				shareVideoId : options.shareVideoId || ""
			};

			requestCivil('civil.square.DeleteShareVideo', data, cbSuccess, cbError);
		}

		this.getVideoShareUrl = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				shareVideoId : options.shareVideoId || ""
			};

			requestCivil('civil.square.GetVideoShareUrl', data, cbSuccess, cbError);
		}

		this.addVideoShare = function(options, cbSuccess, cbError) {
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
		}

		this.isVideoSharedOrNot = function(options, cbSuccess, cbError) {
			options = options || {};
			var data = {
				deviceId : options.deviceId || "",
				channelId : options.channelId || 0
			};
			requestCivil('civil.square.IsVideoSharedOrNot', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.storage ----------------

		this.getStorageStrategyList = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {};

			requestCivil('civil.storage.GetStorageStrategyList', data, cbSuccess, cbError);
		}

		this.getStorageStrategy = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0
			};

			requestCivil('civil.storage.GetStorageStrategy', data, cbSuccess, cbError);
		}

		this.setStorageStrategy = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0,
				strategyId : options.strategyId || -1
			};

			requestCivil('civil.storage.SetStorageStrategy', data, cbSuccess, cbError);
		}

		this.queryCloudRecordBitmap = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0,
				year : options.year || '',
				month : options.month || ''
			};

			requestCivil('civil.storage.QueryCloudRecordBitmap', data, cbSuccess, cbError);
		}

		this.queryCloudRecordNum = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0,
				beginTime : options.beginTime || '',
				endTime : options.endTime || ''
			};

			requestCivil('civil.storage.QueryCloudRecordNum', data, cbSuccess, cbError);
		}

		this.queryCloudRecords = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				channelId : options.channelId || 0,
				beginTime : options.beginTime || '',
				endTime : options.endTime || '',
				need : options.need || ''
			};

			requestCivil('civil.storage.QueryCloudRecords', data, cbSuccess, cbError);
		}

		this.getAlarmVideoUrl = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				alarmId : options.alarmId || 0
			};

			requestCivil('civil.message.GetAlarmVideoUrl', data, cbSuccess, cbError);
		}

		this.generatePicUrlByPath = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				recordPath : options.recordPath || ''
			};

			requestCivil('civil.storage.GeneratePicUrlByPath', data, cbSuccess, cbError);
		}

		this.getLocalRecordUrl = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || '',
				beginTime: options.beginTime || "",
				endTime: options.endTime || ""
			};

			requestCivil('civil.storage.GetLocalRecordUrl', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.TVPanel ----------------

		this.getTVPanels = function (options, cbSuccess, cbError) {
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
		}

		this.queryTVPanelWithScreen = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				TVPanelId : options.TVPanelId || 0
			};

			requestCivil('civil.TVPanel.QueryTVPanelWithScreen', data, cbSuccess, cbError);
		}

		this.saveOrUpdateTVPanel = function (options, cbSuccess, cbError) {
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
		}

		this.deleteTVPanel = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				TVPanelIds : options.TVPanelIds || []
			};

			requestCivil('civil.TVPanel.DeleteTVPanel', data, cbSuccess, cbError);
		}

		this.updateTVPanelState = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				TVPanelInfos : options.TVPanelInfos || []
			};

			requestCivil('civil.TVPanel.UpdateTVPanelState', data, cbSuccess, cbError);
		}

		this.TVPanelNameIsExist = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				TVPanelName : options.TVPanelName || ""
			};

			requestCivil('civil.TVPanel.TVPanelNameIsExist', data, cbSuccess, cbError);
		}

		this.checkNVDUsed = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				NVDDeviceId : options.NVDDeviceId || "",
				NVDChannelId : options.NVDChannelId || 0
			};

			requestCivil('civil.TVPanel.CheckNVDUsed', data, cbSuccess, cbError);
		}

		this.setNVDchannels = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				NVD : options.NVD || []
			};

			requestCivil('civil.TVPanel.SetNVDchannels', data, cbSuccess, cbError);
		}

		this.removeNVDchannels = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				screenInfo : options.screenInfo || []
			};

			requestCivil('civil.TVPanel.RemoveNVDchannels', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.user ----------------

		this.getUserInfo = function (cbSuccess, cbError) {
			requestCivil('civil.user.GetUserInfo', {}, cbSuccess, cbError);
		}

		this.getLoginInfo = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				count : options.count || ''
			};

			requestCivil('civil.user.GetLoginInfo', data, cbSuccess, cbError);
		}

		this.login = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				appId : options.appId || '',
				clientName : options.clientName || '',
				validCode : options.validCode
			};

			requestCivil('civil.user.UserLogin', data, cbSuccess, cbError);
		}

		this.logout = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				appId : options.appId || '',
				clientName : options.clientName || ''
			};

			requestCivil('civil.user.UserLogout', data, cbSuccess, cbError);
		}

		this.isUserExists = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				usernameOrPhoneNumber : options.usernameOrPhoneNumber || ''
			};

			requestCivil('civil.user.IsUserExists', data, cbSuccess, cbError);
		}

		this.verifyValidCode = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				phoneNumber : options.phoneNumber || '',
				validCode : options.validCode || ''
			};

			requestCivil('civil.user.VerifyValidCode', data, cbSuccess, cbError);
		}

		this.getValidCodeToPhone = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				phoneNumber : options.phoneNumber || ''
			};

			requestCivil('civil.user.GetValidCodeToPhone', data, cbSuccess, cbError);
		}

		this.getValidPic = function(options, cbSuccess, cbError) {
			options = options || {};

			var data = {};

			requestCivil('civil.user.GetValidPic', data, cbSuccess, cbError);
		}

		this.addUser = function (options, cbSuccess, cbError) {
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
		}

		this.resetPassword = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				phoneNumber : options.phoneNumber || '',
				newPassword : options.newPassword || '',
				validCode : options.validCode || ''
			};

			requestCivil('civil.user.ResetPassword', data, cbSuccess, cbError);
		}

		// 由于返回结果只能为成功或者失败，本接口只支持单个子账户的添加！
		this.addChildUser = function(options, cbSuccess, cbError){
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
		}

		this.getChildUser = function (cbSuccess, cbError) {
			requestCivil('civil.user.GetChildUser', {}, cbSuccess, cbError);
		}

		// 由于返回结果只能为成功或者失败，本接口只支持单个子账户的删除！
		this.deleteChildUser = function (options, cbSuccess, cbError) {
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
		}

		this.modifyChildUser = function(options, cbSuccess, cbError){
			// var data = {
			// 	username : options.username || '',
			// 	password : options.password || '',
			// 	phoneNumber : options.phoneNumber || '',
			// 	remark : options.remark || ''
			// };
			var data = options;

			requestCivil('civil.user.ModifyChildUser', data, cbSuccess, cbError);
		}

		// 由于返回结果只能为成功或者失败，本接口只支持单个子账户的冻结和授权！
		this.controlChildUser = function (options, cbSuccess, cbError) {
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
		}

		this.getChildUserDeviceList = function(options, cbSuccess, cbError) {
			var data = {
				childUsername : options.childUsername || ''
			};

			requestCivil('civil.user.GetChildUserDeviceList', data, cbSuccess, cbError);
		}

		this.modifyPassword = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				newPassword : options.newPassword || ''
			};

			requestCivil('civil.user.ModifyPassword', data, cbSuccess, cbError);
		}

		this.modifyPhoneNumber = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				phoneNumber : options.phoneNumber || '',
				validCode : options.validCode || ''
			};

			requestCivil('civil.user.ModifyPhoneNumber', data, cbSuccess, cbError);
		}

		this.updateUserIcon = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				pic : options.pic || ''
			};

			requestCivil('civil.user.UpdateUserIcon', data, cbSuccess, cbError);
		}

		this.getConfiguration = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				params : options.params || []
			};

			requestCivil('civil.user.GetConfiguration', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.zb ----------------

		this.addZBDevice = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || "",
				zbDeviceId : options.zbDeviceId || "",
				zbDeviceName : options.zbDeviceName || ""
			};

			requestCivil('civil.zb.AddZBDevice', data, cbSuccess, cbError);
		}

		this.deleteZBDevice = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || "",
				channelId : options.channelId || 0,
				zbDeviceId : options.zbDeviceId || ""
			};

			requestCivil('civil.zb.DeleteZBDevice', data, cbSuccess, cbError);
		}

		this.renameZBDevice = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				deviceId : options.deviceId || "",
				channelId : options.channelId || 0,
				zbDeviceId : options.zbDeviceId || "",
				zbDeviceName : options.zbDeviceName || ""
			};

			requestCivil('civil.zb.RenameZBDevice', data, cbSuccess, cbError);
		}

		this.getDiscoveredZBDeviceList = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				subscribeID : options.subscribeID || "",
				deviceId : options.deviceId || ""
			};

			requestCivil('civil.zb.GetDiscoveredZBDeviceList', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-civil.news ----------------
		this.getNewsList = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				newsId : options.newsId || -1,
				count : options.count || 0,
				check : options.check || 0
			};

			requestCivil('civil.news.GetNewsList', data, cbSuccess, cbError);
		}

		this.getNewsDetail = function (options, cbSuccess, cbError) {
			options = options || {};

			var data = {
				newsId : options.newsId || -1
			};

			requestCivil('civil.news.GetNewsDetail', data, cbSuccess, cbError);
		}

		// ---------------- 外部接口-Dms ----------------

		this.getTransferStream = function (options, cbSuccess, cbError) {
			options = options || {};

			var method = "trans-url/" + options.deviceId + options.requestUrl;

			var data = {};

			requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
		}

		this.queryRecordNum = function (options, cbSuccess, cbError) {
			options = options || {};

			var method = "record-num/" + options.deviceId;

			var data = {
				ID : options.channelId,
				Type : options.type,
				BeginTime : options.beginTime,
				EndTime : options.endTime
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.queryRecords = function (options, cbSuccess, cbError) {
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
		}

		this.queryRecordBitmap = function (options, cbSuccess, cbError) {
			options = options || {};

			var method = "record-bitmap/" + options.deviceId;

			var data = {
				ID : options.channelId,
				Year : options.year,
				Month : options.month
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.getAlarmEffect = function (options, cbSuccess, cbError) {
			options = options || {};

			var method = "alarm-effect/" + options.deviceId + "/" + options.channelId;

			var data = {};

			requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
		}

		this.setAlarmEffect = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "alarm-effect/" + options.deviceId + "/" + options.channelId;

			var data = {
				Sound : options.sound
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.connectWifi = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "wifi-link/" + options.deviceId;

			var data = {
				SSID : options.SSID,
				BSSID : options.BSSID,
				LinkEnable : options.linkEnable,
				Password : options.password
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.enableWifi = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "wifi-on/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.disableWifi = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "wifi-off/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.getWifiStatus = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "wifi/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
		}

		this.getWifiCurrent = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "wifi-current/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, "GET", data, cbSuccess, cbError);
		}

		this.getUpgradeProgress = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "upgrade-progress/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
		}

		this.upgradeDevice = function(options, cbSuccess, cbError) {
			options = options || {};

			var method =  "upgrade/" + options.deviceId;

			var data = {
				Package : options.pkg
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.controlPTZ = function(options, cbSuccess, cbError) {
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
		}

		this.getPilotStatus = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "pilot-status/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
		}

		this.setPilotStatus = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "pilot-status/" + options.deviceId;

			var data = {
				Status : options.status
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.getFrameParams = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "frame-params/" + options.deviceId + "/" + options.channelId;

			var data = {};

			requestDmsJSON(method, 'GET', data, cbSuccess, cbError);
		}

		this.setFrameParams = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "frame-params/" + options.deviceId + "/" + options.channelId;

			var data = {
				Direction : options.direction
			};

			requestDmsJSON(method, 'POST', data, cbSuccess, cbError);
		}

		this.querySDCardStatus = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "sdcard-status/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, "POST", data,  cbSuccess, cbError);
		}

		this.initSDCard = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "sdcard-init/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, "POST", data, cbSuccess, cbError);
		}

		this.getDeviceVolume = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "sound-level/" + options.deviceId;

			var data = {};

			requestDmsJSON(method, "GET", data, cbSuccess, cbError);
		}

		this.setDeviceVolume = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = "sound-level/" + options.deviceId;

			var data = {
				Sound : options.Sound
			};

			requestDmsJSON(method, "POST", data, cbSuccess, cbError);
		}

		this.subscribeZBDeviceDiscovery = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = options.deviceId + options.requestUrl;

			var data = "<?xml version='1.0' encoding='UTF-8'?>"
					+ "<body>"
					+ "<SubscribeID>" + options.subscribeId + "</SubscribeID>"
					+ "<TimeoutPeriod>" + options.timeoutPeriod + "</TimeoutPeriod>"
					+ "</body>";

			requestDmsXml(method, 'POST', data, cbSuccess, cbError);
		}

		this.unsubscribeZBDeviceDiscovery = function(options, cbSuccess, cbError) {
			options = options || {};

			var method = options.deviceId + options.requestUrl;

			var data = "<?xml version='1.0' encoding='UTF-8'?>"
					+ "<body>"
					+ "<SubscribeID>" + options.subscribeId + "</SubscribeID>"
					+ "</body>";

			requestDmsXml(method, 'POST', data, cbSuccess, cbError);
		}
	}

	return new ExportClass();
});
