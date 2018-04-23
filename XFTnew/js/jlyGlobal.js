//*******************************
//作用：全局变量和全部函数
//说明：_g开头是全局变量，_f开头是全局函数
//*******************************

/*======================================debug调试===========================================*/
/*输出内容*/
var _dLog = function(even) {
	console.log(JSON.stringify(even));
};
/*======================================全局变量===========================================*/
/*设备id*/
var _gDeviceid = function(){
	return plus.storage.getItem('deviceid');
};

/*版本号*/
var _gVersion = function(){
	return plus.storage.getItem('version');
};

/*窗口弹出样式*/
var _gShowAuto = 'auto';
var _gShowPop = 'pop-in';
var _gShowRight = 'slide-in-right';
var _gShowLeft = 'slide-in-left';
var _gShowBottom = 'slide-in-bottom';
var _gShowFade = 'fade-in';
var _gShowZoomOut = 'zoom-out';
var _gShowZoomFade = 'zoom-fade-out';

/*======================================全局函数部分===========================================*/

/**
 *获取界面元素
 * */
var _fGet = function(id) {
	return document.getElementById(id)
};
var _fGetTag = function(id, tag) {
	return document.getElementById(id).getElementsByTagName(tag)[0];
};

/**
 *获取窗口元素
 * */
var _fGetWin = function(id) {
	return plus.webview.getWebviewById(id);
};

/*判断是否包含某个class*/
var _fHasClass = function(elements, cName) {
	return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断 
}; 

/*添加单个class样式*/
var _fAddClass = function(elements, cName) {
	if(!_fHasClass(elements, cName)) {
		elements.className += " " + cName;
	};
};

/*删除单个class样式*/
var _fRemoveClass = function(elements, cName) {
	if(_fHasClass(elements, cName)) {
		elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换 
	};
};

/*日期转时间戳*/
var _fGetDateTimestamp = function(date){
	var timestamp2 = Date.parse(new Date(date));
	timestamp2 = timestamp2 / 1000;
	return timestamp2;
};

/*根据日期判断是否为今天*/
var _fGetIsToday = function(str) {
	var d = new Date(str.replace(/-/g,"/"));
    var todaysDate = new Date();
    if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        return true;
    } else {
        return false;
    }
};