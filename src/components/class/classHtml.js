module.exports = {
    getIndex: function (img, title, des, content) {
        return "<!DOCTYPE html>" +
            "<html lang='en'>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "<meta http-equiv='X-UA-Compatible' content='ie=edge'>" +
            "<title>" + title + "</title>" +
            "    </head>" +
            "    <style>" +
            "* {" +
            "margin: 0;" +
            "padding: 0;" +
            "box-sizing: border-box;" +
            "}" +
            "img {max-width: 100%;}" +
            ".box {" +
            "width: '100%';" +
            "background-color: #f6f8fa;" +
            "}" +

            ".top img {" +
            "width: 100%;" +
            "display: block;" +
            "background-color: white;" +
            "}" +

            ".des {" +
            "padding: 15px 15px 10px 15px;" +
            "background-color: white;" +
            "}" +

            ".title {" +
            "font-size: 20px;" +
            "font-weight: bold;" +
            "line-height: 40px;" +
            "}" +

            ".words {" +
            "font-size: 14px;" +
            "line-height: 20px;" +
            "color: #999;" +
            // "word-break: keep-all;" +
            "}" +

            ".content {" +
            "width: 100%;" +
            "padding: 15px 15px 10px 15px;" +
            "marginTop: 10px;" +
            "background-color: white;" +
            "}" +

            ".footer {" +
            "width: 100%;" +
            "padding: 5px 15px 10px 15px;" +
            "marginTop: 20px;" +
            "color: #999;" +
            "font-size: 16px;" +
            "line-height: 40px;" +
            "}" +

            ".foot_word {" +
            "font-size: 12px;" +
            "line-height: 20px;" +
            "marginBottom: 10px;" +
            "}" +
            "    </style>" +

            "    <body>" +
            "<div class='box'>" +
            "<div class='top'>" +
            "<img id='img' src='" + img + "' alt=''>" +
            "</div>" +
            "<div class='des'>" +
            "<p class='title'>" +
            title +
            "</p>" +
            "<p class='words'>" +
            des +
            "</p>" +
            "</div>" +
            "<div class='content'>" +
            decodeURIComponent(content) +
            "</div>" +
            "<div class='footer'>" +
            "<p class='foot_title'>课程须知</p>" +
            "<p class='foot_word'>本课程为咿啦看书原创，对于内容的组织和相关的文字、内容拥有原创版权；</p>" +
            "<p class='foot_word'>本产品为付费产品「课程」。购买成功后即可阅读、使用课程的准备图文内容、课程所需要使用的动画绘本、课程的测评内容；</p>" +
            "<p class='foot_word'>课程所用图书版权归版权方所有，用户付费购买内容中已包含图书的单独购买费用；</p>" +
            "</div>" +
            "</div>" +
            "    </body>" +
            "    </html>" +
            "<script>" +
            "window.onload = function () {" +
            // "var start;" +
            // "document.querySelector('.box').addEventListener('touchstart', function (e) {var e = e || window.event;start = e.touches[0].pageY; });" +
            // "document.querySelector('.box').addEventListener('touchend', function (e) {var e = e || window.event;window.WebView.scrollDy(e.changedTouches[0].pageY - start); });" +
            // "document.querySelector('.box').addEventListener('touchmove', function (e) { var e = e || window.event; window.WebView.scrollDy(e.touches[0].pageY - start) });"+
            "if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) { window.onscroll = function () { window.WebView.scrollDy(document.body.scrollTop); }; };" +
            "}" +
            "</script>"
    }

}