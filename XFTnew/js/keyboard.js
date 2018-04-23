
;(function(exports){
	var KeyBoard = function(input, options){
		var body = document.getElementsByTagName('body')[0];
		var DIV_ID = options && options.divId || '__w_l_h_v_c_z_e_r_o_divid';
		
		if(document.getElementById(DIV_ID)){
			body.removeChild(document.getElementById(DIV_ID));
		}
		
		this.input = input;
		this.el = document.createElement('div');
		
		var self = this;
		var zIndex = options && options.zIndex || 1000;
		var width = options && options.width || '100%';
		var height = options && options.height || '39%';
		var fontSize = options && options.fontSize || '15px';
		var backgroundColor = options && options.backgroundColor || '#fff';
		var TABLE_ID = options && options.table_id || 'table_0909099';
		var mobile = typeof orientation !== 'undefined';
		
		this.el.id = DIV_ID;
		this.el.style.position = 'fixed';
		this.el.style.left = 0;
		this.el.style.right = 0;
		this.el.style.bottom = 0;
		this.el.style.zIndex = zIndex;
		this.el.style.width = width;
		this.el.style.height = height;
		this.el.style.backgroundColor = backgroundColor;
		
		//样式
		var cssStr = '<style type="text/css">';
		cssStr += '#' + TABLE_ID + '{text-align:center;width:100%;height:100%;background-color:#FFF;}';
		cssStr += '#' + TABLE_ID + ' td{width:25%;border-right:0;border-top:0;color:#000000;font-size:30px}';
//		cssStr +='#' + TABLE_ID + ' td:before {content: "";position: absolute;top: -50%;bottom: -50%;left: -50%;right: -50%;transform: scale(0.5);border:1px solid red;border-radius: 10px;}';
		if(!mobile){
			cssStr += '#' + TABLE_ID + ' td:hover{background-color:#1FB9FF;color:#FFF;}';
		}
		cssStr += '</style>';
		
		//Button
		var btnStr = '<div style="width:60px;height:28px;background-color:#1FB9FF;';
		btnStr += 'float:right;margin-right:5px;text-align:center;color:#fff;';
		btnStr += 'line-height:28px;border-radius:3px;margin-bottom:5px;cursor:pointer;">完成</div>';
		
		var divStr='<div class="a"></div>';
        divStr+='<div class="b"></div>';
        divStr+='<div class="A"></div>';
        divStr+='<div class="B"></div>';
        divStr+='<div class="C"></div>';
//      divStr+='<div class="D"></div>';
		
		//table
		var tableStr = '<table id="' + TABLE_ID + '" border="0" cellspacing="0" cellpadding="0">';
			tableStr += '<tr><td>1</td><td>2</td><td>3</td><td style="background-color:#D3D9DF;width:2rem;" rowspan="2"><img style="width:2rem;" src="../../images/del@3x.png" /></td></tr>';
			tableStr += '<tr><td>4</td><td>5</td><td>6</td><td></td></tr>';
			tableStr += '<tr><td>7</td><td>8</td><td>9</td><td id="confirm" title="1" style="background-color:#666;color:#fff" rowspan="2">确认</td></tr>';
			tableStr += '<tr><td></td><td>0</td>';
			tableStr += '<td>.</td><td></td></tr>';
			tableStr += '</table>';
		this.el.innerHTML = cssStr+ divStr + tableStr;
		
		function addEvent(e){
			var ev = e || window.event;
			var clickEl = ev.element || ev.target;
			var value = clickEl.textContent || clickEl.innerText;
			if(clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "" && value !== "确认" && clickEl.innerHTML.indexOf('img')<0){
				if(self.input.value=='0' && value!='.'){
					mui.alert('金额第一位为0时，0后只能输入“.”(小数点)！','温馨提示','','','div');	
					return;
				}
				if(self.input.value!='0.00'){
					var num=self.input.value.substring(self.input.value.indexOf('.'),parseInt(self.input.value.indexOf('.')+3));					
					if(self.input.value.indexOf('.')<0){
						if(self.input && self.input.value.length<5){
							self.input.value += value;
						}else{
							mui.alert('收款金额位数不能超过5位数金额！','温馨提示','','','div');
						}
					}else{
						if(num.length<3){
							self.input.value += value;
						}else{
							mui.alert('收款金额小数点后金额不能超过2位数金额！','温馨提示','','','div');
						}
					}
				}else {
					if(value.indexOf('.')==0){
						mui.alert('金额第一位请输入数字字符！','温馨提示','','','div');
						return;
					}else{						
						self.input.value=value;
					}
					document.getElementById('sk_money').style.color='#000000';
					document.getElementById('confirm').title=2;
					document.getElementById('confirm').style.backgroundColor='#FF5A00';					
				}
				
			}else if(clickEl.tagName.toLocaleLowerCase() === 'td' && value === "确认"){
				if(document.getElementById('confirm').title==2){
					if(parseFloat(self.input.value)<10){
						mui.alert('请输入大于10.00的数字金额！','提示','','','div');
						return;
					}
					if (plus.storage.getItem('uid')==null && plus.storage.getItem('token')==null) {
						mui.alert('你并未登录，请登录后再行此服务！','提示','','','div');
					}else{
						if(self.input.value!=''){
							var uid=plus.storage.getItem('uid');
							var token=plus.storage.getItem('token');
							mui.ajax('http://www.zhxft.com/app/index1/is_real_name',{
								async:false,
								data:{
									uid:uid,
									token:token,						
								},
								dataType:'JSON',//服务器返回json格式数据
								type:'post',//HTTP请求类型
								success:function(data){
									console.log(data);
									var arrParse = JSON.parse(data);
									if(arrParse.idCard==0){
										mui.confirm('你尚未实名认证，只有实名后放可支付，是否前往绑定实名！','提示',['是','否'],function(e){
											var i=e.index;
											if(i==0){
												mui.openWindow({
													url: '../user/id_authentication.html',
													id: 'id_authentication',
													show: {
														autoShow:false,
														aniShow: 'pop-in',
														duration:'350',
													},
													extras:{type:i},//额外扩展参数
													waiting: {
														autoShow: true
													}
												});
											}
										},'div');
									}else{
//										switch(type_id)
//										{
//										case 0:
										  	mui.openWindow({
												url: 'kj.html',
												id: 'kj',
												show: {
													autoShow:false,
													aniShow: 'pop-in',
													duration:'350',
												},
												extras:{pay:self.input.value},//额外扩展参数
												waiting: {
													autoShow: true
												}
											});
//									  	break;
//										case 1:
//										  	mui.openWindow({
//												url: 'wx.html',
//												id: 'wx',
//												show: {
//													autoShow:false,
//													aniShow: 'pop-in',
//													duration:'350',
//												},
//												extras:{pay:self.input.value},//额外扩展参数
//												waiting: {
//													autoShow: true
//												}
//											});
//										  	break;
//										case 2:										
//											mui.ajax('http://h.saomahuivip.com/app/index/pay',{
//												async:false,
//												data:{
//													uid:uid,
//													token:token,
//													type_id:'6',
//													pay:self.input.value
//												},
//												dataType:'JSON',//服务器返回json格式数据
//												type:'post',//HTTP请求类型
//												success:function(data){
//													console.log(data);
//													var arrParse = JSON.parse(data);
//													plus.runtime.openURL(arrParse.link_url);
//												},
//												error:function(xhr,error,errorThrown){
//													console.log(error);
//												}
//											});
	//										mui.openWindow({
	//											url: 'zfb_receivables.html',
	//											id: 'zfb_receivables',
	//											show: {
	//												autoShow:false,
	//												aniShow: 'pop-in',
	//												duration:'350',
	//											},
	//											extras:{pay:self.input.value},//额外扩展参数
	//											waiting: {
	//												autoShow: true
	//											}
	//										});
//											break;
//										case 3:
//											mui.openWindow({
//												url: 'qq_receivables.html',
//												id: 'qq_receivables',
//												show: {
//													autoShow:false,
//													aniShow: 'pop-in',
//													duration:'350',
//												},
//												extras:{pay:self.input.value},//额外扩展参数
//												waiting: {
//													autoShow: true
//												}
//											});
//											break;
//										}
									}	
								},
								error:function(xhr,error,errorThrown){
									console.log(error);
								}
							});
						}else{
							mui.alert('请输入收款的金额！','提示','','','div');
						}
					}
				}
//				body.removeChild(self.el);
			}else if(clickEl.tagName.toLocaleLowerCase() === 'td' && clickEl.innerHTML.indexOf('img')>0){
				if(self.input.value=='0.00'){
//					document.getElementById('sk_money').style.color='#000000';
//					document.getElementById('confirm').title=2;
//					document.getElementById('confirm').style.backgroundColor='#00A1FF';
//					self.input.value = '';
					return;
				}
				
				var num = self.input.value;
//				document.getElementById('sk_money').style.color='#000000';
//				document.getElementById('confirm').title=2;
//				document.getElementById('confirm').style.backgroundColor='#00A1FF';
				if(num){
					var newNum = num.substr(0, num.length - 1);
					self.input.value = newNum;
					if(self.input.value==''){
						document.getElementById('sk_money').style.color='#999999';
						document.getElementById('sk_money').value='0.00';					
						document.getElementById('confirm').title=1;
						document.getElementById('confirm').style.backgroundColor='#666';
					}
				}
			}else if(clickEl.tagName.toLocaleLowerCase() === 'img'){
				if(self.input.value=='0.00'){
//					document.getElementById('sk_money').style.color='#000000';
//					document.getElementById('confirm').title=2;
//					document.getElementById('confirm').style.backgroundColor='#00A1FF';
//					self.input.value = '';
					return;
				}
				
				var num = self.input.value;
//				document.getElementById('sk_money').style.color='#000000';
//				document.getElementById('confirm').title=2;
//				document.getElementById('confirm').style.backgroundColor='#00A1FF';
				if(num){
					var newNum = num.substr(0, num.length - 1);
					self.input.value = newNum;
					if(self.input.value==''){
						document.getElementById('sk_money').style.color='#999999';
						document.getElementById('sk_money').value='0.00';					
						document.getElementById('confirm').title=1;
						document.getElementById('confirm').style.backgroundColor='#666';
					}
				}
			}
		}
		
		if(mobile){
			this.el.ontouchstart = addEvent;
		}else{
			this.el.onclick = addEvent;
		}
		body.appendChild(this.el);
	}
	
	exports.KeyBoard = KeyBoard;

})(window);
