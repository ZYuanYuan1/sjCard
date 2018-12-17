//时间戳转换(单位：ms)
function formatTime(date) {
  var time=new Date(date);
  var year = time.getFullYear()+'-';
  var month = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1)+'-';
  var day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  var hour = time.getHours()+':';
  var minute = time.getMinutes()+':';
  var second = time.getSeconds();
  return year+ month+day;
}
function formatTiming(date) {
  var time = new Date(date);
  var year = time.getFullYear() + '/';
  var month = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '/';
  var day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();

  var hour = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':';
  var minute = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':';
  var second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  return year + month + day+" "+hour+minute+second;
}

function regexConfig() {
  var reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)\d{9}$/
  }
  return reg;
}
//远程图片没有找到的情况下调用-默认图片
function errImgFun(e, that) {
  var _errImg = e.target.dataset.errImg;
  var _errObj = {};
  _errObj[_errImg] = "../../images/daiding.jpg";
  console.log(e.detail.errMsg + "----" + "----" + _errImg);
  that.setData(_errObj);
}  
//得到URL里面的参数
function getQueryString (url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var subStr = url.split('?')[1];
  //console.error(subStr);
  var r = subStr.match(reg);
  if (r != null)
    return decodeURI(r[2]);
  return null;
}
//强制保留2位小数，如：2，会在2后面补上00.即2.00 
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}
//强制保留一位小数，，如：2，会在2后面补上0.即2.0 
function toDecimalone(x){
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 10) / 10;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 1) {
    s += '0';
  }
  return s;
}
//去除数组里相同的对象-browseHistory为array类型
function duplicate(browseHistory,id,storeName){
  var result = [], hash = {}, hash_ = {}
  for (var i = 0; i < browseHistory.length; i++) {
    var elem = browseHistory[i].id;//对象内的某个字段-
    var elem_ = browseHistory[i].storeName;//对象内的某个字段
    if (!hash[elem]) {
      if (!hash_[elem_]) {
        result.push(browseHistory[i]);
        hash_[elem_] = true;
      };
      hash[elem] = true;
    }
  };
}
//数组中是否包含某个对象
function arrayhavestr(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] ==obj) {
      return true;
    }
  }
  return false;
}
module.exports = {
  formatTime: formatTime,
  regexConfig: regexConfig,
  formatTiming: formatTiming,
  errImgFun:errImgFun,
  getQueryString: getQueryString,
  toDecimal2: toDecimal2,
  toDecimalone: toDecimalone,
  arrayhavestr: arrayhavestr
}