/*
 	created by NiePengfei at 2017/11/12
 	用户详情-基本信息
 */

import React from 'react'
import { Spin, Button, Modal, message, Popover, Row, Col } from 'antd'
import "./userBase.css"
import getUrl from "../util.js"
import $ from 'jquery'
import { dataString } from '../commonData.js'
import userImg from '../../assets/images/user.png'
const confirm = Modal.confirm;
export default class UserBase extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfor: {},		//用户详情页的数据对象
            loading: true,
            pageSizes: 20,
            flag: false
        }
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {

    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount() {
        this.getUserInfor();
    }

    getUserInfor() {
        this.setState({
            loading: true
        })
        var theUid = this.props.uid;

        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.userDetail" + "&content=" + JSON.stringify({
                "uid": theUid
            }) + dataString
        })
            .then( (response) =>{
                console.log(response);
                return response.json();
            })
            .then( (response) => {
                console.log(response);
                if (response.status == 1) {
                    if (response.data == '') {
                        this.setState({
                            loading: false,
                        })
                        message.error('该用户不存在');
                        return;
                    }
                    var theDatas = response.data;

                    if (theDatas.userAvatar == "" || theDatas.userAvatar == null) {
                        $(".ubPic").css({ "backgroundImage": "url(" + userImg + ")" })
                    } else {
                        $(".ubPic").css({ "backgroundImage": "url(" + theDatas.userAvatar + ")" })
                    }


                    if (response.data.gender == "MALE") {
                        response.data.gender = "男"
                    } else if (response.data.gender == "FEMALE") {
                        response.data.gender = "女"
                    } else if (response.data.gender == "" || response.data.gender == null) {
                        response.data.gender = "-"
                    }

                    if (response.data.userType == "NORMAL") {
                        response.data.userType = "普通用户"
                    } else if (response.data.userType == "VIP") {
                        response.data.userType = "会员"
                    } else if (response.data.userType == "EXCEPTION") {
                        response.data.userType = "被封号的用户"
                    } else if (response.data.userType == "" || response.data.userType == null) {
                        response.data.userType = "-"
                    }

                    if (response.data.otherPlatformLoginInfo == "" || response.data.otherPlatformLoginInfo == null) {
                        response.data.otherPlatformLoginInfo = "-"
                    } else if (response.data.otherPlatformLoginInfo == "QQ") {
                        response.data.otherPlatformLoginInfo = "QQ　"
                    } else if (response.data.otherPlatformLoginInfo == "WEIXIN") {
                        response.data.otherPlatformLoginInfo = "微信　"
                    } else if (response.data.otherPlatformLoginInfo == "SINA") {
                        response.data.otherPlatformLoginInfo = "微博　"
                    } else if (response.data.otherPlatformLoginInfo == "QQ,WEIXIN") {
                        response.data.otherPlatformLoginInfo = "QQ,　微信　"
                    } else if (response.data.otherPlatformLoginInfo == "WEIXIN,QQ") {
                        response.data.otherPlatformLoginInfo = "微信,　QQ　"
                    } else if (response.data.otherPlatformLoginInfo == "SINA,QQ") {
                        response.data.otherPlatformLoginInfo = "微博,　QQ　"
                    } else if (response.data.otherPlatformLoginInfo == "QQ,SINA") {
                        response.data.otherPlatformLoginInfo = "QQ,　微博　"
                    } else if (response.data.otherPlatformLoginInfo == "WEIXIN,SINA") {
                        response.data.otherPlatformLoginInfo = "微信,　微博　"
                    } else if (response.data.otherPlatformLoginInfo == "SINA,WEIXIN") {
                        response.data.otherPlatformLoginInfo = "微博,　微信　"
                    }

                    else if (response.data.otherPlatformLoginInfo == "QQ,SINA,WEIXIN") {
                        response.data.otherPlatformLoginInfo = "QQ,　微博,　微信　"
                    } else if (response.data.otherPlatformLoginInfo == "QQ,WEIXIN,SINA") {
                        response.data.otherPlatformLoginInfo = "QQ,　微信,　微博　"
                    } else if (response.data.otherPlatformLoginInfo == "SINA,WEIXIN,QQ") {
                        response.data.otherPlatformLoginInfo = "微博,　微信,　QQ　"
                    } else if (response.data.otherPlatformLoginInfo == "SINA,QQ,WEIXIN") {
                        response.data.otherPlatformLoginInfo = "微博,　QQ,　微信　"
                    } else if (response.data.otherPlatformLoginInfo == "WEIXIN,QQ,SINA") {
                        response.data.otherPlatformLoginInfo = "微信,　QQ,　微博　"
                    } else if (response.data.otherPlatformLoginInfo == "WEIXIN,SINA,QQ") {
                        response.data.otherPlatformLoginInfo = "微信,　微博,　QQ　"
                    } else if (response.data.otherPlatformLoginInfo == "" || response.data.otherPlatformLoginInfo == null) {
                        response.data.otherPlatformLoginInfo = "-"
                    }




                    else if (response.data.otherPlatformLoginInfo == "QQ,WEIXIN,SINA") {
                        response.data.otherPlatformLoginInfo = "QQ,　微信,　微博　"
                    }

                    if (response.data.address == "" || response.data.address == null) {
                        response.data.address = "-"
                    }
                    if (response.data.childrenAmount == "" || response.data.childrenAmount == null) {
                        response.data.childrenAmount = "-"
                    }
                    if (response.data.mobile == "" || response.data.mobile == null) {
                        response.data.mobile = "-"
                    }
                    if (response.data.lastBuyBookName == "" || response.data.lastBuyBookName == null) {
                        response.data.lastBuyBookName = "-"
                    }
                    this.setState({
                        userInfor: theDatas,
                        loading: false,
                        flag: true
                    })
                } else {
                    message.error(response.message);
                    this.setState({
                        loading: false,
                    })
                }
            })
    }

    //时间转化
    toDate(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if (secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime >= 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "" + parseInt(secondTime) > 0 ? parseInt(secondTime) + "秒" : '';

        if (minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "分" + result;
        }
        if (hourTime > 0) {
            result = "" + parseInt(hourTime) + "小时" + result;
        }
        return result;
    }

    //第一个参数是UID，第二个是要执行的操作
    VIPno(theUid, caoZuo) {

        let caoZuoDetail;
        if (caoZuo == 0) {
            caoZuoDetail = "lockVip";
            confirm({
                title: '确定要取消该用户会员资格吗?',
                content: '一旦取消将失去VIP权限',
                onOk() {
                    fetch(getUrl.url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: "method=ella.operation.updateUserState" + "&content=" + JSON.stringify({
                            "uid": theUid,
                            "lockType": caoZuoDetail
                        }) + dataString
                    })
                        .then(function (response) {
                            console.log(response);
                            return response.json();
                        })
                        .then(function (response) {
                            console.log(response);
                            const modal = Modal.success({
                                title: '操作成功！',
                                content: '',
                            });
                            setTimeout(() => modal.destroy(), 1000);
                        })
                },
                onCancel() { },
            });

        } else if (caoZuo == 1) {
            caoZuoDetail = "lockUser";
            confirm({
                title: '确定要对该用户进行封号吗?',
                content: '用户一旦被封号将无法登陆App',
                onOk() {
                    fetch(getUrl.url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: "method=ella.operation.updateUserState" + "&content=" + JSON.stringify({
                            "uid": theUid,
                            "lockType": caoZuoDetail
                        }) + dataString
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (response) {
                            const modal = Modal.success({
                                title: '操作成功！',
                                content: '',
                            });
                            setTimeout(() => modal.destroy(), 1000);
                        })
                },
                onCancel() { },
            });
        } else if (caoZuo == 2) {
            caoZuoDetail = "releaseVip";
            confirm({
                title: '确定要恢复该用户会员资格吗?',
                content: '一旦恢复用户将获得VIP权限',
                onOk() {
                    fetch(getUrl.url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: "method=ella.operation.updateUserState" + "&content=" + JSON.stringify({
                            "uid": theUid,
                            "lockType": caoZuoDetail
                        }) + dataString
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (response) {
                            const modal = Modal.success({
                                title: '操作成功！',
                                content: '',
                            });
                            setTimeout(() => modal.destroy(), 1000);
                        })
                },
                onCancel() { },
            });
        } else if (caoZuo == 3) {
            caoZuoDetail = "releaseUser";
            confirm({
                title: '确定要对解除该用户封号状态吗?',
                content: '一旦解除用户将可以登陆App',
                onOk() {
                    fetch(getUrl.url, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: "method=ella.operation.updateUserState" + "&content=" + JSON.stringify({
                            "uid": theUid,
                            "lockType": caoZuoDetail
                        }) + dataString
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (response) {
                            console.log(response);
                            const modal = Modal.success({
                                title: '操作成功！',
                                content: '',
                            });
                            setTimeout(() => modal.destroy(), 1000);
                        })
                },
                onCancel() { },
            });
        }
    }

    render() {
        let { userInfor } = this.state;
        return (
            <div className="userBase">
                <Spin spinning={this.state.loading} size="large">
                    <div className="ubInfor">
                        <div style={{ display: 'flex', flexDirection: 'column', float: 'left', margin: '20px 0 0 20px' }}>
                            <div className="ubPic"></div>
                            <span style={{ marginTop: '20px', textAlign: 'center' }}>{userInfor.nickName}</span>
                        </div>
                        <ul className="ubDetailLeft">
                            <li><title>用户ID:</title><span>{this.props.uid}</span></li>
                            <li><title>账号:</title><span>{userInfor.mobile}</span></li>
                            <li><title>性别:</title><span>{userInfor.gender}</span></li>
                            <li><title>地域:</title><span>{userInfor.address}</span></li>
                            <li><title>注册渠道:</title><span>{userInfor.registerChannel}</span></li>

                        </ul>
                        <ul className="ubDetailRight">
                            <li><title>孩子个数:</title><span>{userInfor.childrenAmount}</span></li>
                            <li><title>用户类型:</title><span>{userInfor.userType}</span></li>
                            <li><title>第三方登录:</title><span>{userInfor.otherPlatformLoginInfo}</span></li>
                            <li><title>注册时间:</title><span>{userInfor.registerTime}</span></li>
                        </ul>
                        <Button type='danger' style={{ width: 120 }} onClick={() => { this.VIPno(this.props.uid, 0) }}>取消会员资格</Button><br /><br />
                        <Button type='danger' style={{ width: 120 }} onClick={() => { this.VIPno(this.props.uid, 1) }}>强制封号</Button>
                    </div>

                    <div className="ubDo">
                        <Row style={{ width: '100%' }}>
                            <Col span={8}>
                                <div className="ubBox moneyBox">
                                    <div className="udBoxTitle">余额记录</div>
                                    <ul>
                                        <li><title>帐户余额(Android):</title><span>{userInfor.balance}</span></li>
                                        <li><title>帐户余额(IOS):</title><span>{userInfor.iosBalance}</span></li>
                                        <li><title>充值总金额:</title><span>{userInfor.payCoinAmount}</span></li>
                                        <li><title>红包数(可用/已用):</title><span>{userInfor.validCoupon}/{userInfor.usedCoupon}</span></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ubBox buyBox" style={{ margin: '0 20px' }}>
                                    <div className="udBoxTitle">购书记录</div>
                                    <ul>
                                        <li><title>购书总金额:</title><span>{userInfor.payBookAmount}</span></li>
                                        <li><title>购买总本数:</title><span>{userInfor.buyBookAmount}</span></li>
                                        <li style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <title>最近购买图书:</title>
                                            <Popover
                                                placement="top"
                                                title={null}
                                                content={userInfor.lastBuyBookName}
                                            >
                                                <span>{userInfor.lastBuyBookName}</span>
                                            </Popover>
                                        </li>
                                        <li>
                                            <title>最近购书价格:</title>
                                            <span>{this.state.flag && userInfor.orderHeader && (typeof userInfor.orderHeader.payAmount == 'number' || !userInfor.orderHeader.payAmount) ? userInfor.orderHeader.payAmount : '-'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ubBox redBox">
                                    <div className="udBoxTitle">阅读记录</div>
                                    <ul>
                                        <li><title>阅读总时长:</title><span>{userInfor.readTimeAmount != '0' ? this.toDate(userInfor.readTimeAmount) : '0'}</span></li>
                                        <li><title>阅读总本数:</title><span>{userInfor.readBookAmount}</span></li>
                                        <li style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}><title>最近阅读图书:</title>
                                            {/* <span>{userInfor.lastReadBookName}</span> */}
                                            <Popover
                                                placement="top"
                                                title={null}
                                                content={userInfor.lastReadBookName}
                                            >
                                                <span >{userInfor.lastReadBookName}</span>
                                            </Popover>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ubBox redBox">
                                    <div className="udBoxTitle">积分记录</div>
                                    <ul>
                                        <li><title>获得总积分:</title><span>{userInfor.pointsSum}</span></li>
                                        <li><title>已用积分:</title><span>{userInfor.pointsBalance}</span></li>
                                        <li><title>积分购买总本书:</title><span>{userInfor.buyPointsBookSum}</span></li>
                                        <li style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}><title>最近积分购买图书:</title>
                                            <Popover
                                                placement="top"
                                                title={null}
                                                content={userInfor.orderPointsName}
                                            >
                                                <span>{userInfor.orderPointsName }</span>
                                            </Popover>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ubBox redBox" style={{ margin: '0 20px' }}>
                                    <div className="udBoxTitle">任务记录</div>
                                    <ul>
                                        <li><title>接取任务总数:</title><span>{userInfor.tasksReceived}</span></li>
                                        <li><title>完成任务总数:</title><span>{userInfor.taskPerform}</span></li>
                                        <li><title>进行中任务:</title><span>{userInfor.tasksOngoing}</span></li>
                                        <li><title>过期未完成任务:</title><span>{userInfor.tasksOverdue}</span></li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        );
    }
}
