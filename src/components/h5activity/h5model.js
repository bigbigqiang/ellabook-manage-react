module.exports = {
    indexFn: function (indexFont, indexFontColor, indexButtonColor, img2, title, subTitle, img1, isForceShare, createCode) {
        console.log(img1)
        // TODO:createCode还没有加进去
        return `<!DOCTYPE html>` +
            `<html lang='en'>` +

            `<head>` +
            `<meta charset='UTF-8'>` +
            `<title>` + title + `</title>` +
            `<link rel='stylesheet' href='http://ellabook.cn/ellabook/bookService1/common/css/reset.css'>` +
            `<link rel='stylesheet' href='http://ellabook.cn/ellabook/bookService1/common/css/index.css'>` +
            `<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />` +
            `<meta name='format-detection' content='telephone=no'>` +
            // `<script src='js/jquery-1.11.3.min.js'></script>` +
            `<script src='http://ellabook.cn/ellabook/bookService1/common/js/jquery-1.11.3.min.js'></script>` +
            // `<script src='js/zepto.min.js'></script>` +
            `<script src='http://ellabook.cn/ellabook/bookService1/common/js/zepto.min.js'></script>` +
            `<script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>` +
            `<script src='http://ellabook.cn/ellabook/bookService1/common/js/index.js'></script>` +
            // `<script src='js/index.js'></script>` +
            `</head>` +

            `<body>` +
            `<div id='loader' class='m-wrap-loading'>` +
            `<div class='rect1'></div>` +
            `<div class='rect2'></div>` +
            `<div class='rect3'></div>` +
            `<div class='rect4'></div>` +
            `<div class='rect5'></div>` +
            `</div>` +
            `<div style='background: url(` + img2 + `) center center no-repeat;background-size: 100% 100%;' class='g-wrap'>` +
            `<div class='m-form'>` +
            `<ul>` +
            `<li>` +
            `<input type='tel' class='u-txt-form u-txt-phone j-phoneNum' placeholder='输入手机号码' maxlength='11'>` +
            `<i class='division'></i>` +
            `<button class='u-btn-code j-getCode'>获取验证码</button>` +
            `<!-- <img class='theShadow' src='img/shadow.png' /> -->` +
            `</li>` +
            `<li>` +
            `<input type='tel' class='u-txt-form u-txt-code j-btn-get3' placeholder='输入验证码' maxlength='6' id='getCode'>` +
            `<!-- <img class='theShadow' src='img/shadow.png' /> -->` +
            `</li>` +
            `<li>` +
            `<button style='color:${indexFontColor};background-color:${indexButtonColor};' class='u-btn-lg get-btn' id='onMenuShare'>` + indexFont + `</button>` +
            `<!-- <img class='theShadow' src='img/shadow.png' /> -->` +
            `</li>` +
            `</ul>` +
            `</div>` +
            `<div class='j-pop' style='display: none;'>` +
            `<p></p>` +
            `</div>` +

            `</div>` +
            `<div style='display: none;'>` +
            `<script src='https://s22.cnzz.com/z_stat.php?id=1264998448&web_id=1264998448' language='JavaScript'></script>` +
            `</div>` +
            `<div>` +
            `<span id='wImg'>` + img1 + `</span>` +
            `<span id='wText'></span>` +
            `<span id='wTitle'>` + title + `</span>` +
            `<span id='WSmallTitle'>` + subTitle + `</span>` +
            `<span id='code'>` + createCode + `</span>` +
            `<span id='isForceShare'>` + isForceShare + `</span>` +
            `</div>` +
            `<div id="share">` +
            `<img src='http://ellabook.cn/ellabook/bookService1/common/img/share.png' />` +
            `</div>` +
            `</body>` +
            `<script>` +
            `$(window).load(function () {` +
            `$('#loader').fadeOut(1000);` +
            `});` +
            `page.init();` +
            `</script>` +

            `</html>`
    },
    landingFn: function (title, landMainTitleFont, landMainTitleFontColor, landSubTitleFont, landSubTitleFontColor, landButtonFont, landButtonFontColor, landButtonColor, landText, img3, img1, subTitle) {
        console.log(1233445);
        console.log(landSubTitleFontColor);
        return `<html lang='en'>` +

            `<head>` +
            `<meta charset='UTF-8'>` +
            `<title>` + title + `</title>` +
            `<link rel='stylesheet' href='http://ellabook.cn/ellabook/bookService1/common/css/reset.css'>` +
            `<link rel='stylesheet' href='http://ellabook.cn/ellabook/bookService1/common/css/index.css'>` +
            `<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />` +
            `<meta name='format-detection' content='telephone=no'>` +
            `</head>` +

            `<body>` +
            `<div class='g-wrap1' style='background: url(` + img3 + `) center center no-repeat;background-size: 100% 100%;'>` +
            `<!-- TODO:自动变化的内容 -->` +
            `<div class='d_index'>` +
            `<p id='d_index_title' style='color:${landMainTitleFontColor};' >` + landMainTitleFont + `</p>` +
            `</div>` +
            `<div class='d_s_index'>` +
            `<p id='d_index_s_title' style='color:${landSubTitleFontColor};'>` + landSubTitleFont + `</p>` +
            `</div>` +
            `<div class='m-mes'>` +
            `<p style='color:${landText};'>需在【书房-已购买】下载</p>` +
            `<p style='color:${landText};'>您的登录账号为` +
            `<span class='j-phone'></span>` +
            `</p>` +
            `</div>` +
            `<ul class='ul-down'>` +
            `<li>` +
            `<a class='down-btn' style='color:${landButtonFontColor};background-color:${landButtonColor};' href='http://a.app.qq.com/o/simple.jsp?pkgname=com.ellabook'>` +
            landButtonFont +
            `</a>` +
            `</li>` +
            `</ul>` +
            `<div class='foot-font'>` +
            `<span style='color:${landText};'>咿啦看书是一款专门为儿童打造的动画书阅读app</span>` +
            `</div>` +
            `</div>` +
            `<span id='wImg'>` + img1 + `</span>` +
            `<span id='wText'></span>` +
            `<span id='wTitle'>` + title + `</span>` +
            `<span id='WSmallTitle'>` + subTitle + `</span>` +
            `</body>` +
            `<script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>` +
            `<script src='http://ellabook.cn/ellabook/bookService1/common/js/jquery-1.11.3.min.js'></script>` +
            `<script src='http://ellabook.cn/ellabook/bookService1/common/js/index.js'></script>` +
            `<script>` +
            `(function () {` +
            `var search = window.location.search;` +
            `var phone= search.split('&state')[0].split('username=')[1]; ` +
            `console.log(search);` +
            `console.log(phone);` +
            `$('.j-phone').text(phone);` +
            `})();` +
            `page.init();` +

            `</script>` +

            `</html>`
    }
}