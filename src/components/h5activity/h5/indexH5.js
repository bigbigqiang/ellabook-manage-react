import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, message, Input } from "antd";
import { Link } from 'react-router';
import getUrl from "../../util.js";
import "../../../main.css";
import "./indexH5.css";
const Search = Input.Search;
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
        }

    }
    render() {
        const buttonStyle = {
            textAlign: "center",
            backgroundColor: this.props.styleCss ? this.props.styleCss.indexButtonColor : null,
            // backgroundColor: "red",
            color: this.props.styleCss ? this.props.styleCss.indexFontColor : null
        }
        // console.log({ "asfd": this.props.styleCss.imgrc })
        const indexStyle = {
            width: 375,
            height: 675,
            backgroundImage: 'url(' + (this.props.styleCss ? this.props.styleCss.imgSrc : null) + ')'
            // backgroundImage: 'url("")'
        }
        const mainTitle = {
            color: this.props.styleCss ? this.props.styleCss.landMainTitleFontColor : null
        }
        const subTitle = {
            color: this.props.styleCss ? this.props.styleCss.landSubTitleFontColor : null
        }
        //TODO: 是land ->true 不是land->false
        let display = this.props.styleCss ? this.props.styleCss.display : null;
        console.log(this.props.styleCss)
        return <div id="h5Index">
            <Card className="card" hoverable style={indexStyle}>
                <div className="mainTitle" style={mainTitle}>
                    <span style={{}}>{this.props.styleCss ? this.props.styleCss.landMainTitleFont : null}</span>
                </div>
                <div className="subTitle" style={subTitle}>
                    <span style={{}}>{this.props.styleCss ? this.props.styleCss.landSubTitleFont : null}</span>
                </div>
                <div style={{ display: !display == true ? "none" : "block" }} className="subText">
                    <p style={{ color: this.props.styleCss.landText }}>需在【书房】下载</p>
                    <p style={{ color: this.props.styleCss.landText }}>您的登入账号为 XXXXXXXXXXX</p>
                </div>
                <div style={{ display: display == true ? "none" : "block" }} className="button_wrap button_wrap_1">
                    <span className="botton_span botton_span_1">请输入手机号码</span>
                    <span className="botton_span botton_span_3">获取验证码</span>
                    <span className="botton_span botton_span_2">|</span>
                </div>
                <div style={{ display: display == true ? "none" : "block" }} className="button_wrap button_wrap_2">
                    <span className="botton_span botton_span_4">输入验证码</span>
                </div>
                <div style={buttonStyle} className="button_wrap button_wrap_3">
                    <span className="botton_span botton_span_5">{this.props.styleCss ? this.props.styleCss.indexFont : null}</span>
                </div>
                <div style={{ display: display == true ? "block" : "none" }} className="button_wrap_4">
                    <span style={{ color: this.props.styleCss.landText }} >咿啦看书是一款专门为儿童打造的动画书阅读app</span>
                </div>
            </Card>
        </div>
    }
}