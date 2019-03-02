import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Steps } from 'antd';
import { Link } from 'react-router';
const Step = Steps.Step;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './index.css';
import getUrl from "../../util.js";
import commonData from '../../commonData.js';
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            spinning: true,
            classData: [],          //班级数据
            areaData: [],         //领域数据
            areaData2: [],         //领域二级数据
            area1st: '',         //领域一级参数
            area2nd: '',         //领域二级参数
            themeData: [],        //主题数据
            encyclopediasData: [],
            picClassBoxList:[],

            book: {
                tags: [],//标签
                coreTags: [],//核心标签
            },
            bookGradeRelationList: [],//班级包括学龄阶段和年级
            bookWikiRelationList: [],//百科分类
            bookPictureClassList: [],//动画绘本馆图书分类
            bookDomainRelationList: [],//领域
            bookTopicRelationList: [],//分类主题
            visible: false,
            skipStep: '',
            initData: '',

        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {

        this.fetchDefaultData();
    }
    async fetchDefaultData() {
        var areaData = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.bookDomainClassList"
            }) + commonData.dataString
        }).then(res => res.json());
        var themeData = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.bookTopicClassList"
            }) + commonData.dataString
        }).then(res => res.json());
        var encyclopediasData = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.bookWikiClassList"
            }) + commonData.dataString
        }).then(res => res.json());
        var picClassBoxList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.getPicClassBoxList"
            }) + commonData.dataString
        }).then(res => res.json());
        this.setState({
            areaData: areaData.data,
            themeData: themeData.data,
            encyclopediasData: encyclopediasData.data,
            picClassBoxList: picClassBoxList.data
        }, () => {
            this.fetch(areaData.data);
        })
    }
    async fetch(arr) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getlabel" + "&content=" + JSON.stringify({
                "bookCode": window.location.href.split('bookCode=')[1].split('&')[0]
            }) + commonData.dataString
        }).then(res => res.json());

        let coreTags = data.data.book.coreTags;
        coreTags = coreTags.split(",").filter(item => item !== "").join(",");
        data.data.book.coreTags = coreTags;
        let tags = data.data.book.tags;
        tags = tags.split(",").filter(item => item !== "").join(",");
        data.data.book.tags = tags;
        this.setState({
            bookGradeRelationList: data.data.bookGradeRelationList,
            bookWikiRelationList: data.data.bookWikiRelationList,
            bookPictureClassList: data.data.bookPictureClassList,
            bookDomainRelationList: data.data.bookDomainRelationList,
            bookTopicRelationList: data.data.bookTopicRelationList,
            book: data.data.book,
            areaData2: this.state.areaData.filter(item => {
                // 防止报错
                if (data.data.bookDomainRelationList[0]) {
                    return item.parentCode == data.data.bookDomainRelationList[0].parentCode
                } else {
                    return false;
                }
            }),
            initData: data.data,
            spinning: false,
        })

    }
    async submitData(saveType) {

        const { bookGradeRelationList, bookWikiRelationList,bookPictureClassList, bookDomainRelationList, bookTopicRelationList, book } = this.state;
        var submitData = {
            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
            book,
            bookGradeRelationList,
            bookWikiRelationList,
            bookPicClassRelationList:bookPictureClassList,
            bookDomainRelationList,
            bookTopicRelationList
        }

        if (bookGradeRelationList.length == 0) { message.error('年级未选'); return; }
        if (bookDomainRelationList.length == 0 || bookDomainRelationList[0].domainCode == '') { message.error('领域未选'); return; }
        if (bookWikiRelationList.length == 0) { message.error('百科分类未选'); return; }
        if (bookTopicRelationList.length == 0) { message.error('主题分类未选'); return; }
        if (book.tags.length == 0) { message.error('标签未选'); return; }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updateBooklabel" + "&content=" + JSON.stringify(submitData) + commonData.dataString
        }).then(res => res.json());
        if (data.status == 1) {
            message.success("保存成功！")
            this.setState({
                visible: false
            });
            this.fetchDefaultData();
            if (saveType == "save") {

            } else if (saveType == "skepsave") {
                this.props.changePage(this.state.skipStep);
            }
        } else {
            message.error(data.message)
        }

    }
    skipStep(step) {
        this.setState({
            skipStep: step
        })
        const { bookGradeRelationList, bookWikiRelationList,bookPictureClassList, bookDomainRelationList, bookTopicRelationList, book } = this.state;
        console.log(bookDomainRelationList)
        if (bookGradeRelationList.map((item) => item.bookCode).join(",") != this.state.initData.bookGradeRelationList.map((item) => item.bookCode).join(",")) {
            this.setState({ visible: true })
            return;
        }
        console.log(bookDomainRelationList)
        if(bookDomainRelationList.length!=0&&this.state.initData.bookDomainRelationList.length!=0){
            if (bookDomainRelationList[0].parentCode != this.state.initData.bookDomainRelationList[0].parentCode) {
                this.setState({ visible: true })
                return;
            }
            if (bookDomainRelationList[0].domainCode != this.state.initData.bookDomainRelationList[0].domainCode) {
                this.setState({ visible: true })
                return;
            }
        }
        if(bookTopicRelationList.length!=0&&this.state.initData.bookTopicRelationList.length!=0){
            if (this.state.initData.bookTopicRelationList[0].classCode != bookTopicRelationList[0].classCode) {
                this.setState({ visible: true })
                return;
            }
        }
       
        if (bookWikiRelationList.map((item) => item.bookCode).join(",") != this.state.initData.bookWikiRelationList.map((item) => item.bookCode).join(",")) {
            this.setState({ visible: true })
            return;
        }
        if (bookPictureClassList.map((item) => item.bookCode).join(",") != this.state.initData.bookPictureClassList.map((item) => item.bookCode).join(",")) {
            this.setState({ visible: true })
            return;
        }

        if (book.coreTags != this.state.initData.book.coreTags) {
            this.setState({ visible: true })
            return;
        }

        if (book.tags != this.state.initData.book.tags) {
            this.setState({ visible: true })
            return;
        }
        this.props.changePage(step);

    }
    modalClick(type) {

        if (type == "leave") {
            this.fetchDefaultData();
            //不保存，直接离开
            this.setState({ visible: false }, () => {
                this.props.changePage(this.state.skipStep);
            });


        } else if (type == "save") {
            this.setState({ visible: false }, () => {
                this.submitData("skepsave");
            });

        }

    }
    render() {
        console.log(this.state)
        function bouncer(arr) {
            // Don't show a false ID to this bouncer.
            return arr.filter(function (val) {
                return !(!val || val === "");
            });
        }
        return <Spin spinning={this.state.spinning}>
            <div className="bookPart">
                <Row className='row'>
                    <Col style={{ fontSize: '20px', fontWeight: 'bold' }} span={8} offset={0}>分类标签:</Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={3} offset={0}>学龄阶段:</Col>
                    <Col>
                        <CheckboxGroup
                            value={
                                bouncer(
                                    this.state.bookGradeRelationList.map(item => {
                                        if (item.gradeCode != 'KINDERGARTEN') {
                                            return
                                        } else return item.gradeCode
                                    })
                                )
                            }
                            options={
                                [
                                    { label: '幼儿园', value: 'KINDERGARTEN' },
                                ]
                            }
                            onChange={(v) => {
                                //                              this.setState({
                                //                                  bookGradeRelationList: [
                                //                                      ...this.state.bookGradeRelationList.filter(item => {
                                //                                          return item.gradeCode != 'KINDERGARTEN'
                                //                                      }),
                                //                                      ...v.map(item => (
                                //                                          {
                                //                                              bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                //                                              parentCode: "KINDERGARTEN",
                                //                                              gradeCode: item
                                //                                          }
                                //                                      ))
                                //                                  ]
                                //                              })
                            }
                            } />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col span={3} offset={0} className="ant-form-item-required colTitle" style={{ "color": "rgba(0,0,0,.65)", "line-height": "28px", "text-indent": 0 }}>年级:</Col>

                    <CheckboxGroup
                        value={
                            bouncer(
                                this.state.bookGradeRelationList.map(item => {
                                    if (item.gradeCode == 'KINDERGARTEN') {
                                        return
                                    } else return item.gradeCode
                                })
                            )
                        }
                        options={
                            [
                                { label: '小班', value: '2' },
                                { label: '中班', value: '3' },
                                { label: '大班', value: '4' },
                            ]
                        }
                        onChange={(v) => {
                            this.setState({
                                bookGradeRelationList: [
                                    ...this.state.bookGradeRelationList.filter(item => {
                                        return item.gradeCode == 'KINDERGARTEN'
                                    }),
                                    ...v.map(item => (
                                        {
                                            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                            parentCode: "KINDERGARTEN",
                                            gradeCode: item
                                        }
                                    ))
                                ]
                            })
                        }} />
                </Row>
                <Row className='row'>
                    <Col span={3} offset={0} className="ant-form-item-required colTitle" style={{ "color": "rgba(0,0,0,.65)", "line-height": "28px", "text-indent": 0 }}>领域:</Col>
                    <Col span={5}>
                        <Select
                            value={this.state.bookDomainRelationList.length == 0 ? '' : this.state.bookDomainRelationList[0].parentCode}
                            style={{ width: "100%" }}
                            onChange={(v) => {
                                this.setState({
                                    bookDomainRelationList: [
                                        {
                                            ...this.state.bookDomainRelationList[0],
                                            parentCode: v,
                                            domainCode: '',
                                        }
                                    ],
                                    areaData2: this.state.areaData.filter(item => item.parentCode == v)
                                })
                            }}
                        >
                            {
                                this.state.areaData.map(item => {
                                    return item.parentCode == "0" ? <Select.Option value={item.domainCode}>{item.domainName}</Select.Option> : null
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={5} offset={1}>
                        <Select
                            value={this.state.bookDomainRelationList.length == 0 ? '' : this.state.bookDomainRelationList[0].domainCode}
                            style={{ width: "100%" }}
                            onChange={(v) => {
                                this.setState({
                                    bookDomainRelationList: [
                                        {
                                            ...this.state.bookDomainRelationList[0],
                                            domainCode: v
                                        }
                                    ],
                                })
                            }}
                        >
                            {
                                this.state.areaData2.map(item => <Select.Option value={item.domainCode}>{item.domainName}</Select.Option>)
                            }
                        </Select>
                    </Col>
                </Row>
                <Row className='row'>
                    <Col span={3} offset={0} className="ant-form-item-required colTitle" style={{ "color": "rgba(0,0,0,.65)", "line-height": "28px", "text-indent": 0 }}>主题分类:</Col>
                    <Col span={5}>
                        <Select
                            style={{ width: "100%" }}
                            value={this.state.bookTopicRelationList.length == 0 ? '' : this.state.bookTopicRelationList[0].classCode}
                            onChange={(v) => {
                                this.setState({
                                    bookTopicRelationList: [
                                        {
                                            classCode: v,
                                            bookCode: window.location.href.split('bookCode=')[1].split('&')[0]
                                        }
                                    ]
                                })
                            }}>
                            {
                                this.state.themeData.map(item => {
                                    return <Select.Option value={item.classCode}>{item.className}</Select.Option>
                                })
                            }
                        </Select>
                    </Col>
                </Row>

                <Row className='row'>
                    <Col span={3} offset={0} className="ant-form-item-required colTitle" style={{ "color": "rgba(0,0,0,.65)", "line-height": "28px", "text-indent": 0 }}>百科分类:</Col>
                    <Col span={11}>
                        <Select
                            mode="multiple"
                            value={this.state.bookWikiRelationList.map(item => this.state.encyclopediasData.find(_item => item.wikiCode == _item.wikiCode).wikiName)}
                            onChange={(v) => {
                                this.setState({
                                    bookWikiRelationList: v.map(item => (
                                        {
                                            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                            wikiCode: this.state.encyclopediasData.find(_item => item == _item.wikiName).wikiCode
                                        }
                                    ))
                                })
                            }}
                            style={{ width: '100%' }}
                        >
                            {
                                this.state.encyclopediasData.map(item => <Select.Option key={item.wikiName}>{item.wikiName}</Select.Option>)
                            }
                        </Select>

                    </Col>
                </Row>
                <Row className='row'>
                    <Col span={3} offset={0} className="colTitle" style={{ "color": "rgba(0,0,0,.65)", "line-height": "28px", "text-indent": 0 }}>动画绘本馆图书分类:</Col>
                    <Col span={11}>
                        <Select
                            mode="multiple"
                            value={this.state.bookPictureClassList.map(item => this.state.picClassBoxList.find(_item => item.picClassCode == _item.classCode).className)}
                            onChange={(v) => {
                                this.setState({
                                    bookPictureClassList: v.map(item => (
                                        {
                                            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                            picClassCode: this.state.picClassBoxList.find(_item => item == _item.className).classCode,
                                            pictureName: item
                                        }
                                    ))
                                })
                            }}
                            style={{ width: '100%' }}
                        >
                            {
                                this.state.picClassBoxList.map(item => <Select.Option key={item.className}>{item.className}</Select.Option>)
                            }
                        </Select>

                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={3} >核心标签:</Col>
                    <Col span={20}>
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            value={this.state.book.coreTags == '' ? [] : this.state.book.coreTags.split(',')}
                            onChange={(v) => {
                                console.log(v)
                                var cur = v.filter(item => item && item.trim())
                                console.log(cur)
                                this.setState({
                                    book: {
                                        ...this.state.book,
                                        coreTags: cur.join(',')
                                    }
                                })

                            }}
                            tokenSeparators={[',']}
                        >
                        </Select>
                    </Col>
                </Row>
                <Row className='row'>
                    <Col span={3} className="ant-form-item-required colTitle" style={{ "color": "rgba(0,0,0,.65)", "line-height": "28px", "text-indent": 0 }}>标签:</Col>
                    <Col span={20}>
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            value={this.state.book.tags == '' ? [] : this.state.book.tags.split(',')}
                            onChange={(v) => {
                                console.log(v);
                                var cur = v.filter(item => item.trim())
                                this.setState({
                                    book: {
                                        ...this.state.book,
                                        tags: cur.join(',')
                                    }
                                })

                            }}
                            tokenSeparators={[',']}
                        >
                        </Select>
                    </Col>
                </Row>
                <Row className='row' style={{ marginTop: '200px' }}>
                    <Col span={4} offset={6}>
                        <Button onClick={() => { this.skipStep(2) }} type='primary' style={{ width: 120 }}>上一步</Button>
                    </Col>
                    <Col span={4} offset={1}>
                        <Button onClick={() => { this.submitData("save") }} type='primary' style={{ width: 120 }}>保存</Button>
                    </Col>
                    <Col span={4} offset={1}>
                        <Button onClick={() => { this.skipStep(4) }} type='primary' style={{ width: 120 }}>下一步</Button>
                    </Col>
                </Row>

                <Modal
                    title="保存确认"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visible: false })}
                    footer={null}
                >
                    <h5 style={{ "text-align": "center", "fontSize": "16px" }}>您已修改了该页面的信息，请确认是否保存？</h5>
                    <p style={{ "text-align": "center", "marginBottom": "30px" }}>
                        <Icon type="warning" style={{ "marginRight": "3px" }} />
                        <span>所有必填信息填写完全才可保存</span>
                    </p>
                    <div style={{ "text-align": "center" }}>
                        <Button className="buttonWidth intervalRight" onClick={() => this.modalClick("leave")}>离开</Button>
                        <Button className="buttonWidth" onClick={() => this.modalClick("save")}>保存</Button>
                    </div>
                </Modal>
            </div>
        </Spin>
    }
}