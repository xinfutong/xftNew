//消息推送
mui.plusReady(function() {
	var userData = JSON.parse(plus.storage.getItem('userData'));		
		
	_initAPP();
    // 监听点击消息事件
    plus.push.addEventListener( "click", function( msg ) {
    	geTuiFun();
    	plus.push.clear();
        var payload=(plus.os.name=='iOS')?msg.payload:JSON.parse(msg.payload);
//      alert(111)
//      switch( msg.payload ) {
//          case "LocalMSG":
//              alert( "点击本地创建消息启动：" );
//          break;
//          default:
//              alert( "点击离线推送消息启动：");
//          break;
//      }
//      alert(payload)
    }, false );

    // 监听在线消息事件
    var news=0;
    plus.push.addEventListener( "receive", function( msg ) {
//  	alert(111)
		setTimeout(function(){
			if(plus.os.name=="iOS"){
	        	logoutPushMsg( msg ); 
//	        	alert(2222)
	        }else{
	        	geTuiFun();
	        }
		},500);
    	
        plus.push.clear();
//      if ( msg.aps ) {  // Apple APNS message
//          alert( "接收到在线APNS消息：" );
//      } else {
//          alert( "接收到在线透传消息：" );
//          plus.push.clear();
//      }
    }, false );

});

//获取穿透参数
function logoutPushMsg( msg ) {
//	alert(msg.payload+'111')
    if ( msg.payload!='LocalMSG' ) {
        if ( typeof(msg.payload)=="string" ) {
            createLocalPushMsg(msg.content);
        } else {
            var data = JSON.parse(msg.payload);
            createLocalPushMsg(data.content);
        }
    } else {
        console.log( "payload: undefined" );
    }
}

//创建本地推送
function createLocalPushMsg(content){

    var options = {cover:false,};
    plus.push.createMessage(content, "LocalMSG", options );
//  if(plus.os.name=="iOS"){
//      alert('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
//  }

}
//初始化
var _initAPP = function(){
	/*设备id*/
	plus.storage.setItem('deviceid', plus.push.getClientInfo().clientid);

	/*版本号*/
	plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
		plus.storage.setItem('version', wgtinfo.version);
	});
};
//推送消息点击方法
var geTuiFun = function(){
	mui.openWindow({
		url:'../user/news.html',
		id:'news',
		show: {
			autoShow:false,
			aniShow: 'slide-in-right',
			duration:'350',
		},
		waiting:{
			autoShow:true,
		}
	});
	var userData = JSON.parse(plus.storage.getItem('userData'));
};