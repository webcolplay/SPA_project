(function (root, factory) {
	root.valid = root.valid || factory(jQuery);
})(this, function ($) {
	function ExportClass() {
		this.isPhoneNum = function(str) {
			/*此处正则式和ios客户端匹配规则一致*/
			/**
			* 手机号码
			* 移动：134[0-8],135,136,137,138,139,150,151,152,157,158,159,182,183,184,187,188,162,165,166,167,191,192,193,195,198,199,178,147
			* 联通：130,131,132,155,156,185,186,176
			* 电信：133,1349,153,180,189,177
			* 虚拟运营商：170
			* M2M号码:140,141,142,143,144(13位)
			*/
			var MOBILE = /^1(3[0-9]|5[0-35-9]|8[02-9])\d{8}$/,										
				CM = /^1(34[0-8]|(3[5-9]|5[0127-9]|8[2-478]|6[2567]|9[123589]|78|47)\d)\d{7}$/,		//移动
				CU = /^1(3[0-2]|5[56]|8[56]|76)\d{8}$/,												//联通
				CT = /^1((33|53|8[09])[0-9]|349|77[0-9])\d{7}$/,										//电信
				MVNO = /^170\d{8}$/,																	//虚拟运营商
				M2M = /^14[0-4]\d{10}$/;																//物联网机器通信号码
			
			if (typeof str === 'string') {
				var valid = MOBILE.test(str) || CM.test(str) || CU.test(str) || CT.test(str) || MVNO.test(str) || M2M.test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isEmail = function(str) {
			var EMAIL = /^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$/;
			if (typeof str === 'string') {
				var valid = EMAIL.test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isPassword = function(str) {
			if (typeof str === 'string') {
				//密码6-32位
				if (str.length < 6 || str.length > 32) {
					return false;
				}

				//密码包含大小写字母、数字、特殊符号（@_-!.）
				var strength = 0;
				if((/[0-9]/).test(str)) {
					strength++;
				}
				if((/[a-z]/).test(str)) {
					strength++;
				}
				if((/[A-Z]/).test(str)) {
					strength++;
				}
				if((/[@_\-!.]/).test(str)) {
					strength++;
				}
				//除去符合的字符外还有别的字符，则是不合法
				if(str.replace(/[0-9a-zA-Z@_\-!.]/g, "").length > 0) {
					return false;
				}
				if (strength < 3) {
					return false;
				}

				return true;
			} else {
				return false;
			}
		},

		this.isCode = function(str) {
			if (typeof str === 'string') {
				var valid = (/^[0-9]{6}$/).test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.pwdStrength = function(str) {
			if (typeof str === 'string') {
				var strength = 0;
				if((/[0-9]/).test(str)) {
					strength++;
				}
				if((/[a-z]/).test(str)) {
					strength++;
				}
				if((/[A-Z]/).test(str)) {
					strength++;
				}
				if(str.length <6) {
					strength = 1;
				}
				if(str.length >= 10 && strength < 2) {
					strength = 2;
				}
				return strength;
			} else {
				return false;
			}
		},

		this.isUsername = function(str) {
			if (typeof str === 'string') {
				//用户名6-32位
				if (str.length < 6 || str.length > 32) {
					return false;
				}

				//用户名可以包含大小写字母、数字、特殊符号（@_-!.）
				var strength = 0;
				if(!(/^[\w@_\-!.]*$/).test(str)) {
					return false;
				}

				return true;
			} else {
				return false;
			}
		},

		this.isDeviceName = function(str) {
			if (typeof str === 'string') {
				var valid = (/^([\w@_\-!.\u4E00-\u9FA5]){1,15}$/).test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isNotNum = function(str) {
			if (typeof str === 'string') {
				var valid = (/[^0-9]/).test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isLengthLargerThan = function(str, len) {
			if (typeof str === 'string') {
				return str.length > len;
			} else {
				return false;
			}
		},

		this.isTVWallName = function(str) {
			if (typeof str === 'string') {
				var valid = (/^([\w_,.\-@\u4E00-\u9FA5]){1,32}$/).test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isInteger = function(str) {
			if (typeof str === 'string') {
				var valid = (/^[0-9]*[1-9][0-9]*$/).test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isTVWallScreenName = function(str) {
			if (typeof str === 'string') {
				var valid = (/^([\w_,.\-@\u4E00-\u9FA5]){1,10}$/).test(str);
				return valid;
			} else {
				return false;
			}
		},

		this.isGroupNameStandard = function(str) {
			if (typeof str === 'string') {
				var valid = (/^([\w@_\-!.\u4E00-\u9FA5]){1,16}$/).test(str);
				return valid;
			} else {
				return false;
			}
		}
	}

	return new ExportClass();
});
