(function(jlyUser) {

	//用户密码登录
	jlyUser.login = function(requestInfo, successCallback, errorCallback) {
		var requestData = {
			login: requestInfo.login,
			passWord: requestInfo.passWord
		};
		abyServer.getDataFromServer('index/login', requestData, function(responeData) {
			responeData = JSON.parse(responeData);
			if(responeData.code == 0) {
				jlyUser.setLocalUserData(responeData);
				successCallback && successCallback(true);
			} else {
				jlyUser.clear();
				errorCallback && errorCallback(responeData.msg);
			}
		}, function(error) {
			jlyUser.clear();
			errorCallback && errorCallback(error);
		});
	};

	//用户自动登录
	jlyUser.autoLogin = function(successCallback, errorCallback) {
		var requestData = {
			token: jlyUser.token()
		};
		abyServer.getDataFromServer('index/login', requestData, function(responeData) {
			if(responeData.code == 0) {
				jlyUser.setLocalUserData(responeData);
				successCallback && successCallback(responeData);
			} else {
				jlyUser.clear();
				errorCallback && errorCallback(responeData.msg);
			}
		}, function(error) {
			jlyUser.clear();
			errorCallback && errorCallback(error);
		});
	};
	
	//判断是否登录
	jlyUser.isLogin = function(successCallback, errorCallback){
		var requestData = {
			uid: jlyUser.uid(),
			token: jlyUser.token(),
		};
		abyServer.getDataFromServer('index/isLogin', requestData, function(responeData) {
			responeData = JSON.parse(responeData);
			if(responeData.state == 1) {
				successCallback && successCallback(true);
			} else {
				successCallback && successCallback(false);
			}
		}, function(error) {
			errorCallback && errorCallback(error);
		});
	};

	/**********************私有方法 start******************************/
	//设置用户信息
	jlyUser.setLocalUserData = function(responeData) {
		if(responeData) {
			plus.storage.setItem('userData', responeData);
		}
	};

	//清除登录信息
	jlyUser.clear = function(sucessCallback, errorCallback) {
		try {
			plus.storage.removeItem('userData');
			sucessCallback && sucessCallback(true);
		} catch(e) {
			errorCallback && errorCallback(false);
		}

	};

	//用户令牌
	jlyUser.token = function() {
		var userData = JSON.parse(plus.storage.getItem('userData'));
		if(userData) {
			return userData.token;
		} else {
			return null;
		}
	};
	
	//用户id
	jlyUser.uid = function() {
		var userData = JSON.parse(plus.storage.getItem('userData'));
		if(userData) {
			return userData.uid;
		} else {
			return null;
		}
	};
	
	//用户id
	jlyUser.userName = function() {
		var userData = JSON.parse(plus.storage.getItem('userData'));
		if(userData) {
			return userData.userData.name;
		} else {
			return '驾来也学员';
		}
	};
	
	/**********************私有方法 end******************************/
})(window.jlyUser = {});