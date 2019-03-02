import React from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message, Modal, Tooltip, Popconfirm, Layout, Spin, Upload, notification } from 'antd';
import getUrl from '../util';
import commonData from '../commonData.js';
import 'whatwg-fetch';
import './addPushIp.css';
var util = require('../util.js');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { CommonAddBook } from "../commonAddBook.js"
const { TextArea } = Input;

class addRecommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            visible: false,
            ipCode: '',

            fileList: [],
            previewVisible: false,
            bgUrl: '',

            ipName: '',
            ipDesc: '',

            coverImgFileList:[],
            coverUrl:'',
            coverImgPreviewVisible:false,

            bookList: [],
            oneClickBuyStatus: 'YES'
        }

    }
    ///////////////////////////////文本图片上传////////////////////////////////////////////
    handleCancel = (k) => this.setState({ [k]: false });

    handleChange = ({ fileList }, k, img) => {
        this.setState({ [k]: fileList, [img]: "" }, () => {
            if (fileList.length == 0) {
                return;
            }
            let thumbUrl = this.state[k][0].thumbUrl || null;

            if (this.state[k][0].percent == 100) {
                setTimeout(() => {
                    this.imageFetch(thumbUrl, img);
                    return;
                }, 0)

            } else {
            }
        });
    }
    convertBase64UrlToBlob = (urlData) => {
        var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
        //处理异常,将ascii码小于0的转换为大于0  
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        var type = urlData.split(',')[0].split(':')[1].split(';')[0];
        return new Blob([ab], { type: type });
    }
    imageFetch = async (url, img) => {
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");
        var data = await fetch(getUrl.upLoadUrl, {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({ [img]: data.data });
        }
    }

    componentDidMount() {
        var search = window.location.href;
        var type = search.split('type=')[1].split('&')[0];
        if (type == 'edit') {
            var ipCode = search.split('ipCode=')[1].split('&')[0];
            this.fetchEditModules(ipCode);
            this.setState({
                ipCode: ipCode,
                type: type
            })
        } else {
            this.setState({
                type: type
            })
        }
    }
    //编辑模块
    fetchEditModules(ipCode) {
        this.setState({
            loading: true
        });
        let param = {
            'ipCode': ipCode,
        }
        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getBookIPByIpCode" + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(res => res.json()).then((data) => {
            if (data.status == 1) {
                this.setState({
                    ipName: data.data.ipName,
                    ipDesc: data.data.ipDesc,
                    bookList: data.data.bookCodeList.bookList,
                    loading: false,
                    oneClickBuyStatus: data.data.oneClickBuyStatus
                })
                if (data.data.bgUrl == '' || data.data.bgUrl == null) {
                    this.setState({
                        fileList: [],
                    })
                } else {
                    this.setState({
                        bgUrl: data.data.bgUrl,
                        fileList: [{
                            uid: -1,
                            name: '图片.png',
                            status: 'done',
                            url: data.data.bgUrl,
                        }],
                    })
                }
                if (data.data.coverUrl == '' || data.data.coverUrl == null) {
                    this.setState({
                        coverImgFileList: [],
                    })
                } else {
                    this.setState({
                        coverUrl: data.data.coverUrl,
                        coverImgFileList: [{
                            uid: -2,
                            name: '封面图片.png',
                            status: 'done',
                            url: data.data.coverUrl,
                        }],
                    })
                }
            } else {
                message.error(data.message);
            }
        })
    }


    //保存
    fetchFn = () => {
        let param = {

        };
        if (this.state.bgUrl == '') {
            message.error("请添加图片");
            return;
        }
        if (this.state.coverUrl == '') {
            message.error("请添加封面图片");
            return;
        }
        if (this.state.ipName == '') {
            message.error("请填写IP名称");
            return;
        }
        if (this.state.ipDesc == '') {
            message.error("请填写简介");
            return;
        }
        if (this.state.bookList.length == 0) {
            message.error("请添加图书");
            return;
        }
        param.ipCode = this.state.ipCode;
        param.ipName = this.state.ipName;
        param.ipDesc = this.state.ipDesc;
        param.bgUrl = this.state.bgUrl;
        param.coverUrl = this.state.coverUrl;
        param.oneClickBuyStatus = this.state.oneClickBuyStatus;
        param.bookCodeList = this.state.bookList.map(item => item.bookCode) //最新最列表数据以及搜索添加的数据传给bookCodeList
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.saveAndUpdateBookIP" + "&content=" + JSON.stringify(param) + commonData.dataString
        })
            .then(res => res.json()).then(data => {
                if (data.status == 1) {
                    notification.success({
                        message: '保存成功',
                    })
                    var search = window.location.href;
                    var type = search.split('type=')[1].split('&')[0];
                    if (type == "add") {
                        window.history.back();
                    }
                } else {
                    message.error(data.message);
                }
            })

    }

    sortArr = (n) => {
        var data = this.state.bookList;
        data.unshift(data.splice(n, 1)[0]);
        this.setState({
            bookList: data,
            status3: this.state.status3 + 1,
        })
    }
    arrowDown = (n) => {
        if (n == this.state.bookList.length - 1) {
            message.error(`不可向下移！`);
        } else {
            var data = this.state.bookList;
            var arr1 = data[n];
            data[n] = data[n + 1];
            data[n + 1] = arr1;
            this.setState({
                bookList: data,
                status3: this.state.status3 + 1,
            })
        }
    }
    arrowUp = (n) => {
        if (n == 0) {
            message.error(`不可向上移！`);
        } else {
            var data = this.state.bookList;
            var arr1 = data[n - 1];
            data[n - 1] = data[n];
            data[n] = arr1;
            this.setState({
                bookList: data,
                status3: this.state.status3 + 1,

            })
        }
    }
    arrowDelete = (key) => {
        var data = this.state.bookList.filter(item => {
            if (item.bookCode !== key.bookCode) {
                return item
            }
        });
        this.setState({
            bookList: data
        })
    }

    //清空列表
    DeleteList = () => {
        this.setState({
            bookList: []
        })
    }


    //点添加图书，弹出模糊搜索的Modal
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.refs.addBooks.getInitList();
    }
    handleOk = (selectedRowKeys, selectedRows) => {
        var newDataSoure = this.state.bookList;
        newDataSoure.push(...selectedRows);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        newDataSoure = newDataSoure.reduce(function (item, next) {
            hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
            return item
        }, []);

        this.setState({
            visible: false,
            bookList: newDataSoure,

        })
    }
    modelCancle(msg) {
        this.setState({
            visible: msg
        });
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { previewVisible, fileList } = this.state;
        const dataSource = this.state.bookList;
        var columns = [
            {
                title: '序号',
                width: "25%",
                key: 'id',
                render: (text, record, index) => {
                    return (
                        <div>
                            {index + 1}
                        </div>
                    )
                }
            }, {
                title: '图书ID',
                width: "25%",
                dataIndex: 'bookCode',
                key: 'bookCode',
            }, {
                title: '图书名称',
                width: "25%",
                dataIndex: 'bookName',
                key: 'bookName',
                render: (text, record) => {
                    if (record.bookName == null) {
                        return (
                            <span>-</span>
                        )
                    } else {
                        return (
                            <span>{record.bookName}</span>
                        )
                    }
                }
            }, {
                title: '操作',
                width: "25%",
                key: 'action',
                render: (text, record, index) => {
                    return (
                        <div>
                            <span style={{ cursor: "pointer" }} onClick={() => { this.sortArr(index) }}>置顶</span>
                            <span className="ant-divider" />
                            <i className="i-action-ico i-up" onClick={() => { this.arrowUp(index) }}></i>
                            <span className="ant-divider" />
                            <i className="i-action-ico i-down" onClick={() => { this.arrowDown(index) }}></i>
                            <span className="ant-divider" />
                            <Popconfirm title="确定删除吗?" onConfirm={() => {
                                this.arrowDelete(record)
                            }}>
                                <i className="i-action-ico i-delete" ></i>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]

        return (
            <div>
                <p className="m-head">
                    <Link to="/featuredIP">
                        <Icon type="left" /> {this.state.type == 'add' ? '添加新的主推IP' : '编辑主推IP'}
                    </Link>
                </p>

                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <div className='pushIp'>
                        <div className='info'>
                            <p style={{ fontSize: '16px', fontWeight: '700' }}>主推IP基础信息设置</p>
                            <p>图标上传(86*86)：</p>
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={(file) => { this.setState({previewVisible:true})}}
                                onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList", "bgUrl") }}
                                onRemove={() => { this.setState({ bgUrl: "" }) }}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={() => { this.handleCancel("previewVisible") }}>
                                <img alt="example" style={{ width: '100%' }} src={this.state.bgUrl} />
                            </Modal>

                            <p style={{ marginTop: 20 }}>封面上传(240*240)：</p>
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                listType="picture-card"
                                fileList={this.state.coverImgFileList}
                                onPreview={(file) => { this.setState({coverImgPreviewVisible:true})}}
                                onChange={({ fileList }) => { this.handleChange({ fileList }, "coverImgFileList", "coverUrl") }}
                                onRemove={() => { this.setState({ coverUrl: "" }) }}
                            >
                                {this.state.coverImgFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal visible={this.state.coverImgPreviewVisible} footer={null} onCancel={() => { this.handleCancel("coverImgPreviewVisible") }}>
                                <img alt="example" style={{ width: '100%' }} src={this.state.coverUrl} />
                            </Modal>

                            <p style={{ marginTop: 20 }}>IP名称：</p>
                            <Input value={this.state.ipName} onChange={(e) => { this.setOneKV('ipName', e.target.value) }} />

                            <p style={{ marginTop: 20 }}>一键购买：</p>
                            <RadioGroup onChange={(e) => {
                                this.setState({
                                    oneClickBuyStatus: e.target.value
                                })
                            }}
                                value={this.state.oneClickBuyStatus}>
                                <Radio value="YES">支持</Radio>
                                <Radio value="NO">不支持</Radio>
                            </RadioGroup>

                            <p style={{ marginTop: 20 }}>简介：</p>
                            <TextArea placeholder='不能超过50个字符' maxLength={50} rows={4} value={this.state.ipDesc} onChange={(e) => { this.setOneKV('ipDesc', e.target.value) }} />

                        </div>
                        <i></i>
                        <div className='bookList'>
                            <p style={{ fontSize: '16px', fontWeight: '700' }}>主推IP图书列表配置</p>
                            <p style={{ textAlign: 'right' }}>列表总数：{dataSource.length}</p>
                            <div style={{ display: 'flex', marginBottom: 15 }}>
                                <Button onClick={this.DeleteList}>清空列表</Button>
                                <Button style={{ marginLeft: 'auto', marginRight: 30 }} onClick={this.showModal}><Icon type="plus" />添加图书</Button>
                                <CommonAddBook ref="addBooks" rowKey="bookCode" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)} />
                                <Button type="primary" onClick={() => { this.fetchFn() }}>保存为主推IP</Button>
                            </div>
                            <Table {...this.state} rowKey={(record, index) => index} columns={columns} dataSource={dataSource} pagination={false} scroll={{ y: (dataSource.length > 7 ? 330 : 0) }} />
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}

addRecommend = Form.create()(addRecommend)
export default addRecommend;
