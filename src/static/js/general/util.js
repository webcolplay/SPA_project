(function (root, factory) {
	root.util = root.util || factory(jQuery);
})(this, function ($) {
	function ExportClass() {
		function setDay(value) {
			return value < 10 ? ('0' + value) : value;
		}

		// 是否为函数
		function isFunction_(o) {
			try {
				if (!o) {
					return false;
				}

				var str = Object.prototype.toString.call(o);

				return (str === '[object Function]');
			} catch (err) {
				return false;
			}
		}

		// 异步调用函数
		function async_(fn, cb, timeout) {
			if (!isFunction_(fn))
				return null;

			return function () {
				if (isFunction_(fn)) {
					var args = arguments;

					setTimeout(function () {
						var ret = fn.apply(null, args);

						if (isFunction_(cb)) {
							cb(ret);
						}
					}, timeout > 0 ? timeout : 0);
				}
			};
		}

		ExportClass.prototype.asyncCall = async_;

					/*********appkey和secret    start********/
					var key0_0 = ["f3b0"];
					var key0_1 = ["1065"];
					var key1 = ["b943"];
					var key2 = ["4dae"];
					var key3 = ["a38c"];
					var key4_0 = ["5b42"];
					var key4_1 = ["9f72"];
					var key4_2 = ["15bb"];
					function getKey0() {
							return [_.union(key0_0, key0_1).join("")];
					}
					function getKey1() {
							return key1;
					}
					function getKey2() {
							return key2
					}
					function getKey3() {
							return key3;
					}
					function getKey4() {
							return [_.union(key4_0, key4_1, key4_2).join("")];
					}

					var sec0 = ["fc71"];
					var sec1 = ["bbb7"];
					var sec2 = ["1984"];
					var sec3 = ["ee63"];
					var sec4 = ["b676"];
					var sec5 = ["859a"];
					var sec6 = ["f36d"];
					var sec7 = ["e97d"];
					function getSec0() {
							return sec0;
					}
					function getSec1() {
							return sec1;
					}
					function getSec2() {
							return sec2;
					}
					function getSec3() {
							return sec3;
					}
					function getSec4() {
							return sec4;
					}
					function getSec5() {
							return sec5;
					}
					function getSec6() {
							return sec6;
					}
					function getSec7() {
							return sec7;
					}
					/*********appkey和secret    end********/

		// ---------------- 外部接口 ----------------
		//浏览器语言切换
		this.lang = function() {
			var browserLanguage;
			if ($.cookie("language") && $.cookie("language") !== "null") {
				browserLanguage = $.cookie("language");
			} else {
				browserLanguage = (navigator.language || navigator.browserLanguage).toLowerCase();
				$.cookie("language", browserLanguage);
			}
			if (browserLanguage.indexOf("zh") > -1) {
				this.loadCss("/css/text_definition_chn.css");

			} else if (browserLanguage.indexOf("en") > -1) {
				this.loadCss("/css/text_definition_en.css");
				this.loadCss("/css/page_en.css");

				//屏蔽帮助
				//$("a[href='/html/main/support.html']").addClass("fn-hide").next("b.top-nav-line").addClass("fn-hide");
				//$("a[href='/html/main/support.html']").siblings(".login-icon-help").hide().siblings(".login-nav-line").hide();
			}
		}

		this.loadCss = function(path){
			if(!path){
				return false;
			}
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.href = path;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			head.appendChild(link);
		}

		this.loadJs = function(path){
			if(!path){
				return false;
			}
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.src = path;
			script.type = 'text/javascript';
			head.appendChild(script);
		}

		//是否移动端登录
		this.isMobile = function() {
			if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
				if (window.location.href.indexOf("?mobile") < 0){
					try {
						if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
							return true;
						} else {
							return false;
						}
					} catch(e) {}
				}
			} else {
				return false;
			}
		}

		//生成随机字符串
		this.randomString = function(len) {
			var str = "0123456789abcdef";
			var newStr = "";
			for(i = 0; i < len; i++) {
				newStr += str.charAt(Math.floor(Math.random() * 16));
			}
			return newStr;
		}

		//时间格式化成“2015-05-23T07:32:21Z”
		this.dateFormat = function(date) {
			return date.getUTCFullYear() + '-'
			 + setDay((date.getUTCMonth() + 1)) + '-' + setDay(date.getUTCDate()) + 'T'
			 + setDay(date.getUTCHours()) + ':' + setDay(date.getUTCMinutes()) + ':'
			 + setDay(date.getUTCSeconds()) + 'Z';
		}

		//时间戳(秒)格式化成“2015-05-23T07:32:21+08:00”
		this.unixToTimeZone = function(time) {
			var now = new Date(time * 1000);
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + setDay(month) + "-" + setDay(day) + "T" + setDay(hour) + ":" + setDay(minute) + ":" + setDay(second) + "+08:00";
		}
		//时间戳(秒)格式化成“2015-05-23”
		this.unixToDate = function(time) {
			var now = new Date(time * 1000);
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			return year + "-" + setDay(month) + "-" + setDay(day);
		}

		//时间戳(秒)格式化成“07:32:21”
		this.unixToTime = function(time) {
			var now = new Date(time * 1000);
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return setDay(hour) + ":" + setDay(minute) + ":" + setDay(second);
		}
		//时间戳(秒)格式化成“07:32”
		this.unixToTime2 = function(time) {
			var now = new Date(time * 1000);
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return setDay(hour) + ":" + setDay(minute);
		}
		//时间戳(秒)加60秒后格式化成“2015-05-23 07:32:21”
		this.endTimeLocal = function(time) {
			var now = new Date((time + 60) * 1000);
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + setDay(month) + "-" + setDay(day) + " " + setDay(hour) + ":" + setDay(minute) + ":" + setDay(second);
		}

		//“2015-05-23 (00:00:00)”格式化成时间戳(秒)
		this.beginTime = function(time) {
			time = time.replace(/-/g,'/');
			var d = new Date(time);
			var start = parseInt(d.getTime()/1000);
			return start;
		}

		//“2015-05-23 (23:59:59)”格式化成时间戳(秒)
		this.endTime = function(time) {
			time = time.replace(/-/g,'/');
			var d = new Date(time);
			d.setDate(d.getDate() + 1);
			var end = parseInt(d.getTime()/1000) - 1;
			return end;
		}

		//时间戳(秒)格式化成“2015-05-23 07:32:21”
		this.unixToDatetime = function(time) {
			var now = new Date(time * 1000);
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + setDay(month) + "-" + setDay(day) + " " + setDay(hour) + ":" + setDay(minute) + ":" + setDay(second);
		}

		//“2015-05-23 07:32:21”格式化成时间戳(秒)
		this.datetimeToUnix = function(date) {
			var d=new Date();
			d.setFullYear(date.substring(0, 4));
			d.setMonth(date.substring(5, 7) - 1);
			d.setDate(date.substring(8, 10));
			d.setHours(date.substring(11, 13));
			d.setMinutes(date.substring(14, 16));
			d.setSeconds(date.substring(17, 19));
			return Date.parse(d) / 1000;
		}
		//秒数格式化成“07:32:21”
		this.timeFormat = function(time) {
			var hour = parseInt(time / 3600);
			var minute = parseInt((time % 3600) / 60);
			var second = parseInt(time % 60);
			return setDay(hour) + ":" + setDay(minute) + ":" + setDay(second);
		}

		//获取当前日期"2016-03-23"
		this.getNowDay = function() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + setDay(month) + "-" + setDay(day);
		}
		//获取当前日期"07:22"
		this.timeFormat123=function (fmt, date, hour) {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return setDay(hour) + ":" + setDay(minute);
        }
		//获取当前日期"1"
		this.getNowHour = function() {
			var now = new Date();
			var hour = now.getHours();
			return this.toOneDigit(hour);
		}

		//传入日期2015-01-12和小时0，返回日期格式"2015011200"
		this.getDataStrand = function(day, hour) {
			var days = day.split("-");
			day = days[0] + days[1] + days[2];
			hour = this.toTwoDigit(hour);
			return day + hour;
		}

		//传入日期"2015011200"，返回日期2015-01-12和小时0
		this.analysisDayAndHour = function(date) {
			return {
				day : date.substr(0, 4) + "-" + date.substr(4, 2) + date.substr(6, 2),
				hour : this.toOneDigit(date.substr(8, 2))
			}
		}

		//传入日期"2015011200"，返回时间戳
		this.analysisDataStrand = function(date) {
			var d=new Date();
			d.setFullYear(date.substring(0, 4));
			d.setMonth(date.substring(4, 6) - 1);
			d.setDate(date.substring(6, 8));
			d.setHours(date.substring(8));
			d.setMinutes(0);
			d.setSeconds(0);
			return Date.parse(d) / 1000;
		}

		//返回两位数
		this.toTwoDigit = function(data) {
			return data < 10 ? "0" + data : data;
		}

		//返回一位数
		this.toOneDigit = function(data) {
			return parseInt(data);
		}

		this.timeInt2String = function(value) {
			return value < 10 ? ('0' + value) : value;
		}

		//获取AppKey
		this.getKey = function() {
				var arr = _.union(getKey0(), getKey1(), getKey2(), getKey3(), getKey4());
				return arr.join("-");
		}

		//获取AppSecret
		this.getSecret = function() {
				var arr = _.union(getSec0(), getSec1(), getSec2(), getSec3(), getSec4(), getSec5(), getSec6(), getSec7());
				return arr.join("");
		}

		this.getMac = function() {
			if (!$.cookie("mac")) {
				$.cookie("mac", _.chain(util.randomString(12)).groupBy(function(val, key) {return Math.floor(key / 2);}).values().map(function(val, key){return val[0] + val[1];}).value().join(':'), 1);
			}
			return $.cookie("mac");
		}

		//判断对象是否为空
		this.isEmptyObj = function(obj) {
			for (var index in obj) {
				return false;
			}
			return true;
		}

		var entityMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#x2F;'
		};

		//特殊字符转义
		this.escapeHtml = function(string) {
			return String(string).replace(/[&<>"'\/]/g, function (s) {
				return entityMap[s];
			});

		}

		this.getSearch = function(str) {
			var datas = {};
			var url = str ? str : window.location.href;
			if (url.indexOf("?") != -1) {
				var paramStr = url.split("?")[1];
				paramStr = paramStr.split("#")[0];
			} else {
				return false;
			}
			var params = paramStr.split("&");
			for (var i = 0; i < params.length; i ++) {
				if (params[i].indexOf("=")) {
					var index = params[i].split("=")[0];
					var val = params[i].split("=")[1];
				}
				datas[index] = val;
			}
			return datas;
		}

		//解析errorCode
		this.getErrorMessage = function(errorCode) {
			switch(errorCode) {
				case 1100 : {
					return textDeploy.util.t1;
				}break;
				case 1101 : {
					return textDeploy.util.t2;
				}break;
				case 1102 : {
					return textDeploy.util.t3;
				}break;
				case 1103 : {
					return textDeploy.util.t4;
				}break;
				case 1104 : {
					return textDeploy.util.t5;
				}break;
				case 1105 : {
					return textDeploy.util.t6;
				}break;
				case 1106 : {
					return textDeploy.util.t7;
				}break;
				 case 1107 : {
					return textDeploy.util.t8;
				}break;
				 case 1108 : {
					return textDeploy.util.t9;
				}break;
				 case 1109 : {
					return textDeploy.util.t10;
				}break;
				 case 1110 : {
					return textDeploy.util.t11;
				}break;
				 case 1111 : {
					return textDeploy.util.t12;
				}break;
				 case 1200 : {
					return textDeploy.util.t13;
				}break;
				 case 1301 : {
					return textDeploy.util.t14;
				}break;
				 case 1302 : {
					return textDeploy.util.t15;
				}break;
				 case 1303 : {
					return textDeploy.util.t16;
				}break;
				 case 1304 : {
					return textDeploy.util.t17;
				}break;
				 case 1305 : {
					return textDeploy.util.t18;
				}break;
				 case 1306 : {
					return textDeploy.util.t19;
				}break;
				 case 1307 : {
					return textDeploy.util.t20;
				}break;
				 case 1308 : {
					return textDeploy.util.t21;
				}break;
				 case 1309 : {
					return textDeploy.util.t22;
				}break;
				 case 1621 : {
					return textDeploy.util.t23;
				}break;
				 case 1701 : {
					return textDeploy.util.t24;
				}break;
				 case 1702 : {
					return textDeploy.util.t25;
				}break;
				 case 1703 : {
					return textDeploy.util.t26;
				}break;
				 case 1704 : {
					return textDeploy.util.t27;
				}break;
				 case 1705 : {
					return textDeploy.util.t28;
				}break;
				 case 2000 : {
					return textDeploy.util.t29;
				}break;
				 case 1207 : {
					return textDeploy.util.t30;
				}break;
				 case 2001 : {
					return textDeploy.util.t31;
				}break;
				case 3012 : {
					return textDeploy.util.t33;
				}break;
				case 3015 : {
					return textDeploy.util.t34;
				}break;
				case 3014 : {
					return textDeploy.util.t35;
				}break;
				default : {
					return textDeploy.util.t32;
				}break;
			}
		}

		this.filterDevice = function(deviceType, deviceModel, filters) {
			var hasSmartIPC =_.contains(filters, "SmartIPC");
			if (!hasSmartIPC) {
				return _.contains(filters, deviceType) || _.contains(filters, deviceModel);
			} else {
				//先把除SmartIPC以外符合其它条件的设备过滤出来
				var tempFilters = _.filter(filters, function(device) {
					return device != "SmartIPC";
				});
				var has1 = _.contains(tempFilters, deviceType) || _.contains(tempFilters, deviceModel);

				var exceptType = ["H1", "P2"];
				var isExcept = _.filter(exceptType, function(type) {
					return deviceType.indexOf(type) !== -1 || deviceModel.indexOf(type) !== -1;
				}).length > 0;
				var has2 = (deviceType.indexOf("IPC") !== -1 || deviceModel.indexOf("IPC") !== -1) && !isExcept;

				return has1 || has2;
			}
		}

		//“2015-05-23 07:32:21”格式化成xx分钟前/xx小时前/xx天前
		this.getCommentCreateTime = function(createTime) {
			var current = Date.parse(new Date()) / 1000;
			var create = this.datetimeToUnix(createTime);
			var delta = current - create;
			if (delta < 30) {
				return "刚刚";
			} else if (delta < 60) {
				return parseInt(delta) + "秒前";
			} else if (delta < 3600) {
				return parseInt(delta / 60) + "分钟前";
			} else if (delta < 3600 * 24) {
				return parseInt(delta / 3600) + "小时前";
			} else if (delta < 3600 * 24 * 3) {
				return parseInt(delta / (3600 * 24)) + "天前";
			} else {
				return createTime;
			}
		}

    //比较两个对象相等
    this.isObjectValueEqual = function(a, b){
      // Of course, we can do it use for in
      // Create arrays of property names
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);

      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length != bProps.length) {
        return false;
      }
      for (var i = 0; i < aProps.length; i++) {
          var propName = aProps[i];

          // If values of same property are not equal,
          // objects are not equivalent
          if (a[propName] !== b[propName]) {
              return false;
           }
       }
      }

		// 转化html特殊符号为转义符
		this.htmlToEscapeCharacter = function(str) {
			str = str || "";
			return str.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
		}
	}

	return new ExportClass();
});
