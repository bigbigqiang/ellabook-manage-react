
//检查该角色是否拥有此权限
function operationTypeCheck(type) {
	var operationType = localStorage.getItem('operationType');
	if (operationType) {
		var list = operationType.split(',');
		if (list.indexOf(type) != -1) {
			return true;
		} else {
			return false;
		}
	}

}

module.exports = {
	// url:'http://192.168.1.71:9000/rest/api/service',
	// upLoadUrl:'http://118.31.171.220:9000/rest/upload/avatar',
	// upLoadTeachUrl:'http://111.231.144.220:9000/rest/upload',
	// upFileUrl:'http://111.231.144.220:9000/rest/upload/document',


	// url: 'http://118.31.171.207:9000/rest/api/service',
	// upLoadUrl:'http://118.31.171.207:9000/rest/upload/avatar',
	// upLoadTeachUrl:'http://118.31.171.207:9000/rest/upload',
	// upFileUrl:'http://118.31.171.207:9000/rest/upload/document',
	// upLoadVideoUrl:'http://118.31.171.207:9000/rest/upload',

	// url: 'http://192.168.1.30:9000/rest/api/service',	//超本地
	// upLoadUrl: 'http://192.168.10.122:9000/rest/upload/avatar',	//超本地

	// upLoadUrl:'http://118.31.171.207:9000/rest/upload/avatar',
	// upFileUrl:'http://118.31.171.207:9000/rest/upload/document',
	// upLoadTeachUrl:'http://192.168.10.122:9000/rest/upload',
	// upLoadUrl:'http://118.31.171.207:9000/rest/upload/avatar',
	// upFileUrl:'http://118.31.171.207:9000/rest/upload/document',
	// upLoadTeachUrl:'http://192.168.10.122:9000/rest/upload',

	url:ip + '/rest/api/service',
	upLoadTemH5:ip + '/rest/upload/temH5',
	upLoadUrl:ip + '/rest/upload/avatar',
	upFileUrl:ip + '/rest/upload/document',
	upLoadTeachUrl:ip + '/rest/upload',
	upLoadVideoUrl:ip + '/rest/upload',
	//各种格式时间封装
	getYMD: function(dateTimeStamp, _type){
			var _now =  new Date(dateTimeStamp);
			var year = _now.getFullYear();
            var month= _now.getMonth()+1;
            month = (month < 10)? "0"+month:month;
            var date=_now.getDate();
            date = (date < 10)? "0"+date:date;
            var hour=_now.getHours();
            hour = (hour < 10)? "0"+hour:hour;
            var minute=_now.getMinutes();
            minute = (minute < 10)? "0"+minute:minute;

            switch (_type) {
                case 'ymdhm':
                    return year+"-"+month+"-"+date+" "+hour+":"+minute;
                    break;
                case 'ymdhmToday':
                    var today = new Date();
                    var yeargap = _now.getFullYear() - today.getFullYear();
                    var monthgap = _now.getMonth() - today.getMonth();
                    var dategap = _now.getDate() - today.getDate();
                    if (yeargap === 0 && monthgap === 0 && dategap === 0) {
                        return "今日 "+hour+":"+minute;
                    } else if (yeargap === 0 && monthgap === 0 && dategap === 1) {
                        return "明日 "+hour+":"+minute;
                    } else {
                        var datetimeStr = month+"-"+date+" "+hour+":"+minute;
                        if (yeargap === 0) {
                            return datetimeStr;
                        } else {
                            return year+"-"+datetimeStr;
                        }
                    }
                    break;
            	case 'mdhmChiness':
                    var today = new Date();
                    var yeargap = _now.getFullYear() - today.getFullYear();
                    var monthgap = _now.getMonth() - today.getMonth();
                    var dategap = _now.getDate() - today.getDate();
                    if (yeargap === 0 && monthgap === 0 && dategap === 0) {
                        return "今日 "+hour+":"+minute;
                    } else if (yeargap === 0 && monthgap === 0 && dategap === 1) {
                        return "明日 "+hour+":"+minute;
                    } else {
                        return month+"月"+date+"日 "+hour+":"+minute;
                    }
                    break;
                case 'dhmChiness':
                    var today = new Date();
                    var yeargap = _now.getFullYear() - today.getFullYear();
                    var monthgap = _now.getMonth() - today.getMonth();
                    var dategap = _now.getDate() - today.getDate();
                    if (yeargap === 0 && monthgap === 0 && dategap === 0) {
                        return "今日"+hour+":"+minute;
                    } else if ((_now.getTime() - today.getTime() < 86400000) && (_now.getTime() - today.getTime() > 0) || (yeargap === 0 && monthgap === 0 && dategap === 1)) {
                        return "明日"+hour+":"+minute;
                    } else {
                        return date+"号"+hour+":"+minute;
                    }
                    break;
                case 'm.dh:m':
                	return month+"."+date+'号'+" "+hour+":"+minute;
                case 'm.d-h:m':
                	return month+"月"+date+'号'+" "+hour+":"+minute;
                case 'ymd':
                    return year+"年"+month+"月"+date+'日';
                case 'y.m.d':
                	return year+"."+month+"."+date;
                case 'm-d':
                	return month+"-"+date;
                default:
                    return month+"-"+date+" "+hour+":"+minute;
            }
		},
	//公共接口调用
	API:(params,url)=>
		fetch(ip + '/rest/api/service', {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body:"method="+url + "&content=" + JSON.stringify(
		    	params
			) + '&uid='+localStorage.uid+'&token='+localStorage.token
		}),
		
	// url:'http://47.96.253.201:9000/rest/api/service',
	// upLoadUrl:'http://47.96.253.201:9000/rest/upload/avatar',
	// upLoadVideoUrl:'http://47.96.253.201:9000/rest/upload',
	// url:'http://47.96.253.201:9000/rest/api/service',
	// upLoadUrl:'http://47.96.253.201:9000/rest/upload/avatar',
	// upLoadTeachUrl:'http://47.96.253.201:9000/rest/upload',

	operationTypeCheck: operationTypeCheck
};
