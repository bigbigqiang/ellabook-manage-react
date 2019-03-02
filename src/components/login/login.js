import React from 'react'
import { hashHistory } from 'react-router'
import "./login.css"
import util from "../util.js"
import $ from 'jquery'
import md5 from 'md5'
export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            passWord: '',
            showTuFlag: false
        }
        this.login = this.login.bind(this);
        this.keyup = this.keyup.bind(this);
    }

    alert(content, duration) {
        $(".alertMess").show();
        $(".alertMess").text(content);
        setTimeout(function () {
            $(".alertMess").hide();
        }, duration)
    }

    login() {
        $("#loginBtn").css({ "backgroundColor": "#23AD43", "color": "#03300D" });
        setTimeout(function () {
            $("#loginBtn").css({ "backgroundColor": "#26C14B", "color": "white" });
        }, 200)
        let phoneNum = document.getElementsByClassName("userName")[0].value;
        let passWord = document.getElementsByClassName("passWord")[0].value;
        if (phoneNum == '') {
            this.alert("手机号不能为空!", 1000);
            return false;
        } else if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(phoneNum)) {
            this.alert("手机号格式不正确!", 1000)
            return false;
        } else if (passWord == '') {
            this.alert("密码不能为空!", 1000)
            return false;
        } else if ((passWord != '') && (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(phoneNum))) {
            $(".alertMess").show();
            $(".alertMess").text("登陆中...");
            setTimeout(function () {
                $(".alertMess").text("系统繁忙，登陆失败！");
                setTimeout(function () {
                    $(".alertMess").hide();
                }, 5000)
            }, 5000)

            let thePassWord = md5(passWord);
            fetch(util.url, {
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                mode: 'cors',
                body: "method=ella.user.login" + "&content=" + JSON.stringify({
                    customerName: phoneNum,
                    password: thePassWord,
                    channelCode: "BSS"
                })
            }).then(res => res.json()).then((response) => {
                if (response.status == 1) {
                    let timestampNow = new Date().getTime();
                    localStorage.setItem("flag", "1");
                    localStorage.setItem("uid", response.data.uid);
                    localStorage.setItem("name", response.data.name);
                    localStorage.setItem("loginTime", timestampNow);
                    localStorage.setItem("token", response.data.token);
                    this.props.setUserNameP(response.data.uid, response.data.name);
                    this.alert("登陆成功!", 1000)
                    //这里跳转到首页
                    $(".loginContainer").hide();
                    hashHistory.push('/free');
                } else if (response.status == 0) {
                    if (response.code == "10001001") {
                        this.alert("用户名不存在!", 1000);
                    } else if (response.code == "10001002") {
                        this.alert("登录密码错误!", 1000);
                    } else if (response.code == "10001028") {
                        this.alert("该账号没有运营权限!", 1000);
                    }
                } else {
                    this.alert("服务繁忙，请重试!", 1000);
                }
            }).catch(e => {
                console.log(e.message)
            })
        }
    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount() {
        let oldLoginTime = 0;	//上次登录时间
        let theTimeNow = 0;		//当前的时间    s设置有效登录时间为24小时
        let theLoginFlag = localStorage.getItem("flag");
        if (theLoginFlag == "1") {
            oldLoginTime = parseInt(localStorage.getItem("loginTime"));
            theTimeNow = new Date().getTime() - 86400000;
            if (oldLoginTime > theTimeNow) {
                $(".loginContainer").hide();
            } else {
                $(".loginContainer").show();
                this.props.logout();
            }
            setInterval(() => {
                oldLoginTime = parseInt(localStorage.getItem("loginTime"));
                theTimeNow = new Date().getTime() - 86400000;
                if (oldLoginTime > theTimeNow) {
                    $(".loginContainer").hide();
                } else {
                    $(".loginContainer").show();
                    this.props.logout();
                    localStorage.setItem("flag", "0");
                    localStorage.setItem("uid", "");
                    localStorage.setItem("name", "");
                    localStorage.setItem("loginTime", "");
                    localStorage.setItem("token", "");
                }
            }, 60000)
        }
        setTimeout(() => {
            $("#loader").fadeOut(1000);
            this.setState({
                showTuFlag: true
            }, () => {
                $("#loginBtn").text("登录");
            })
        }, 1000);
    }

    keyup(e) {
        let keyNum = window.event ? e.keyCode : e.which;
        if (keyNum == 13 && $(".loginContainer").css("display") == "block") {
            this.login();
        }
    }

    render() {
        return (
            <div className="loginContainer" onKeyUp={this.keyup}>
                <div id="loader" className="m-wrap-loading">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
                <div className="main">
                    <div className="logo" ></div>
                    {
                        this.state.showTuFlag && <div className="inputOut" >
                            <input type="text" name="" className="userName" placeholder="账号" autoComplete="phone" maxLength="11" />
                        </div>
                    }
                    {
                        this.state.showTuFlag && <div className="inputOut" >
                            <input type="password" name="" className="passWord" placeholder="密码" autoComplete="new-password" />
                        </div>
                    }
                    <div className="inputOut" id="loginBtn" onClick={this.login}></div>

                </div>
                <div className="alertMess"></div>
            </div>
        );
    }
}
