/*
 *
 *This is a wx & ali pay API simply function for APICloud.
 *
 */

//使用说明：

/*直接使用inspire函数，需要传五个值
    payStyle:1->'wxpay',2->'alipay';
    payOrder:订单号；
    payAmount:订单金额；
    payName:订单名称；
    payDescription:订单描述；
*/

//pay module
function inspire(payStyle,payOrder,payAmount,payName,payDescription){
  if(payStyle == 'wxpay'){
    var payAmount = String(parseFloat(payAmount)*100);    //微信支付金额这在里要处理一下
    WeChat(payDescription,payAmount,payOrder,function(ret){
      alert('支付成功！');
    });
  }else if(payStyle == 'alipay'){
    aliPay(payName,payDescription,payAmount,payOrder,function(ret){
      alert('支付成功！');
    });
  }
}
//wxpay API
function WeChat(description,total,orderid,fnSuc){
  var wxPay = api.require('wxPay');

  wxPay.config({
    apiKey: '',
    mchId: '',
    partnerKey: '',
    notifyUrl: ''
  }, function(ret, err){
    if(ret.status){
      wxPay.pay({
        description: description,
        totalFee: total,
        tradeNo: orderid,
        // spbillCreateIP: '196.168.1.1',
        // deviceInfo: '013467007045764',
        // detail: 'iPad mini 16G 白色',
        // attach: '说明',
        // feeType: 'CNY',
        // timeStart: '20091225091010',
        // timeExpire: '20091227091010',
        // goodsTag: 'WXG',
        // productId: '12235413214070356458058',
        // openId: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o'
      },function(ret, err){
        if(ret.status){
          fnSuc && fnSuc(ret.result);
        }else{
          if(err.code == -2) {
            alert('用户取消支付');
          }else{
            alert('支付失败，错误码：'+err.code+'信息:'+err.msg);
          }
        }
      });
    }else{
      alert('配置错误，错误码：'+err.code);
      }
  });
}
//alipay API
function aliPay(name,description,total,orderid,fnSuc){
  var aliPay = api.require('aliPay');
  aliPay.config({
    partner: '',
    seller: '',
    rsaPriKey: '',
    rsaPubKey: '',
    notifyURL: ''
  },function(ret,err){

  });
  aliPay.pay({
    subject:name, //交易商品名
    body:description,  //交易商品的简介
    amount:total,  //交易商品的价钱（单位为元，精确到分如：10.29元）
    tradeNO:orderid  //交易订单编号（由商家按自己的规则生成）
  },function(ret,err) {
    if(ret){
      switch(ret.code){
        case "9000":
          fnSuc && fnSuc(ret.code);
          break;
        case "4000":
          alert("系统异常");
          break;
        case "4001":
          alert("数据格式不正确");
          break;
        case "4003":
          alert("该用户绑定的支付宝账户被冻结或不允许支付");
          break;
        case "4004":
          alert("该用户已解除绑定");
          break;
        case "4005":
          alert("绑定失败或没有绑定");
          break;
        case "4006":
          alert("订单支付失败");
          break;
        case "4010":
          alert("重新绑定账户");
          break;
        case "6000":
          alert("支付服务正在进行升级操作");
          break;
        case "6001":
					alert("用户中途取消支付操作");
          break;
        case "0001":
          alert("缺少商户配置信息(商户id，支付公钥，支付密钥)");
          break;
        case "0002":
          alert("用户当前设备没有安装支付宝客户端(ios)或安全支付插件(Android)");
          break;
        case "0003":
          alert("签名错误（公钥私钥错误）");
          break;
        default:
          break;
      }
    }else{
      alert(err);
    }
  });
}
