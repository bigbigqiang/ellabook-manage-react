import React from 'react';
import { Row, Col, Card, Icon, Input, message, Select, Radio, DatePicker, Button, Table, Divider, Modal } from "antd";
import { Link } from 'react-router';
import commonData from '../../commonData.js';
import getUrl from '../../util.js';
const { MonthPicker, RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;
const Search = Input.Search;
export default class addGoods extends React.Component {

    constructor() {
        super()
        this.state = {
            isSubmit: true,
            visible: false,
            groupList: [],              //TODO:第一个框下拉列表
            targetType: '',             //第一个框下拉选择的值
            // targetPage: '',             //最终生成的网址


            RecommendBookList: [],      //推荐图书列表
            RecommendBookDataList: [],  //推荐图书数据列表
            recommendBookId: '',         //推荐图书id //TODO: 传 TODO:
            recommendTargetPage: '',     //地址

            SystemList: [],             //TODO:系统的一些参数
            SystemDataList: [],
            SystemId: '',               //TODO: 传 TODO:
            SystemTargetPage: '',

            H5TargetPage: '',               //TODO:H5的一些参数 //TODO: 传 TODO:

            BookDataList: [],               //TODO:搜索图书数据列表
            BookName: '',                   //          TODO: 传 TODO:
            TempBookName: '',                //临时储存BookName
            BookTargetPage: '',

            BookBagSearchList: [],           //TODO:搜索出来的图书包列表
            BookBagSearchDataList: [],
            BookBagName: '',                 //初始值 //TODO: 传 TODO:
            BookBagTargetPage: '',           //图书包跳转链接
        }
    }

    componentDidMount() {
        this.fetchGroup();
        this.fetchBookDetal();
        this.fetchSystem();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.submitData.key != this.props.submitData.key) {
            this.setState({
                targetType: this.props.submitData.targetType,
                recommendBookId: this.props.submitData.targetPage.recommendBookId,
                SystemId: this.props.submitData.targetPage.SystemId,
                H5TargetPage: this.props.submitData.targetPage.H5TargetPage,
                BookName: this.props.submitData.targetPage.BookName,
                BookBagName: this.props.submitData.targetPage.BookBagName
            })
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    getTargetPage() {
        var a = this.state.targetType;
        if (a == 'BOOK_LIST') return encodeURIComponent(this.state.recommendTargetPage);
        if (a == 'SYSTEM_INTERFACE') return encodeURIComponent(this.state.SystemTargetPage);
        if (a == 'H5') return encodeURIComponent(this.state.H5TargetPage);
        if (a == 'BOOK_DETAIL') return encodeURIComponent(this.state.BookTargetPage);
        if (a == 'BOOK_PACKAGE') return encodeURIComponent(this.state.BookBagTargetPage);
        return '';
    }
    // TODO:第一个框的数据
    async fetchGroup() {
        var doc = {
            groupId: "TARGET_PAGE"
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        this.setState({
            groupList: data.data.map((item) => {
                return <Option value={item.searchCode}>{item.searchName}</Option>
            })
        })

    }
    // TODO:推荐图书列表
    async fetchBookDetal() {
        var doc = {
            groupId: "BOOK_LIST"
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        // console.log(data)
        this.setState({
            RecommendBookList: data.data.map((item) => {
                return <Option value={item.searchId}>{item.searchName}</Option>
            }),
            RecommendBookDataList: data.data
        })
    }
    // TODO:获取系统跳转列表
    async fetchSystem() {
        var doc = {
            groupId: "SYSTEM_INTERFACE"
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log(data)
        this.setState({
            SystemList: data.data.map((item) => {
                return <Option value={item.searchId}>{item.searchName}</Option>
            }),
            SystemDataList: data.data
        })
    }
    // TODO:选书列表
    async fetchBookList(v) {

        var doc = {
            text: v,
            page: 0,
            pageSize: 1000,
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json())
        this.setState({
            BookDataList: data.data.bookList,
            visible: true

        }, () => {

        })
        console.log(data.data)
    }
    // TODO:获取图书包
    async fetchBookBagList(str) {
        var doc = {
            "goodsManageSearchType": "goodsName",
            "searchContent": str,
            "goodsState": "SHELVES_ON",
            "goodsType": "BOOK_PACKAGE",
            "availableBookPackage": "YES",
            "page": 0,
            "pageSize": 5
        }
        // TODO:地址连的mc的
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log({ "sdd": data.data })
        this.setState({
            BookBagSearchList: (data.data && data.data.list) ? data.data.list.map(item => <Option value={item.goodsCode}>{item.goodsName}</Option>) : [],
            BookBagSearchDataList: data.data.list
        })

    }
    async submitData() {
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        var submitData = this.props.submitData;
        if (submitData.adviceName == '') {
            message.error('通知名称未填写');
            return;
        };
        if (submitData.adviceName.length > 20) {
            message.error('通知名称长度过长');
            return;
        };
        if (submitData.adviceDescription == '') {
            message.error('通知描述未选择');
            return;
        };
        if (submitData.pushTarget == '') {
            message.error('目标用户未选择');
            return;
        };
        if (submitData.pushTarget == 'SINGLE_USER' && submitData.targetContent == '') {
            message.error('用户编码未填写');
            return;
        };
        // if (submitData.pushTimeType == 'SEND_ONTIME' && (submitData.startTime == '' || submitData.endTime == '')) {
        //     message.error('推送时间未填写');
        //     return;
        // };
        if (submitData.pushTimeType == 'SEND_ONTIME') {
            if (submitData.startTime == '' || submitData.endTime == '') {
                message.error('定时发布时间未填写');
                return;
            }
            if (CompareDate(submitData.startTime, submitData.endTime)) {

                message.error('时间设置不正确');
                return;
            }
        }
        if (submitData.countDown == '') {
            message.error('倒计时未填写');
            return;
        };
        //TODO:判断图片是否上传
        if (submitData.pushTarget == 'ANDROID_USER') {
            if (submitData.android_normal == '') {
                message.error('Android(16:9)图片未上传');
                return;
            };
            if (submitData.android_special_infinity_002 == '') {
                message.error('Android(17:9)图片未上传');
                return;
            };
            if (submitData.android_normal_infinity == '') {
                message.error('Android(18:9)图片未上传');
                return;
            };
            if (submitData.android_special_infinity_001 == '') {
                message.error('Android(18.5:9)图片未上传');
                return;
            };
        }
        if (submitData.pushTarget == 'IOS_USER') {
            if (submitData.ipad == '') {
                message.error('ipad图片未上传');
                return;
            };
            if (submitData.iphoneX == '') {
                message.error('iphoneX图片未上传');
                return;
            };
            if (submitData.iphonePlus == '') {
                message.error('iphonePlus图片未上传');
                return;
            };
            if (submitData.iphone == '') {
                message.error('iphone图片未上传');
                return;
            };
            if (submitData.iphoneSE == '') {
                message.error('iphoneSE图片未上传');
                return;
            };
             if (submitData.ipad_horizontal == '') {
                message.error('ipad横屏图片未上传');
                return;
            };
        }
        if (submitData.android_normal == '' && submitData.android_special_infinity_002 == '' && submitData.android_normal_infinity == '' && submitData.android_special_infinity_001 == '' && submitData.ipad == '' && submitData.iphoneX == '' && submitData.iphonePlus == '' && submitData.iphone == '' && submitData.iphoneSE == '' && submitData.ipad_horizontal == '') {
            message.error('请至少上传一张图片');
            return;
        }
        if (!this.getTargetPage() && !submitData.targetPage.url) {
            message.error('链接目标未选择');
            return;
        }
        if (this.state.targetType == 'H5' && !this.checkUrl(this.state.H5TargetPage)) {
            message.error('H5链接地址格式错误');
            return;
        }
        this.setOneKV('isSubmit', false);
        var doc = {
            startupCode: submitData.startupCode,
            adviceType: submitData.adviceType,
            adviceName: submitData.adviceName,
            adviceDescription: submitData.adviceDescription,
            pushTarget: submitData.pushTarget,
            targetContent: submitData.targetContent,
            pushTimeType: submitData.pushTimeType,
            startTime: submitData.startTime,
            endTime: submitData.endTime,
            pushFrequency: submitData.pushFrequency,
            pushTimes: submitData.pushTimes,
            targetType: this.state.targetType,
            countDown: submitData.countDown,
            targetPage: {
                url: this.getTargetPage() || encodeURIComponent(submitData.targetPage.url),
                recommendBookId: this.state.recommendBookId,
                SystemId: this.state.SystemId,
                H5TargetPage: encodeURIComponent(this.state.H5TargetPage),
                BookName: this.state.BookName,
                BookBagName: this.state.BookBagName
            },//TODO:暂时
            // createBy: localStorage.uid,
            attachList: [
                submitData.iphoneSE ? {
                    "attachName": "iphoneSE",
                    "attachUrl": submitData.iphoneSE
                } : null,
                submitData.iphone ? {
                    "attachName": "iphone",
                    "attachUrl": submitData.iphone
                } : null,
                submitData.iphoneX ? {
                    "attachName": "iphoneX",
                    "attachUrl": submitData.iphoneX
                } : null,
                submitData.iphonePlus ? {
                    "attachName": "iphonePlus",
                    "attachUrl": submitData.iphonePlus
                } : null,
                submitData.ipad ? {
                    "attachName": "ipad",
                    "attachUrl": submitData.ipad
                } : null,
                submitData.android_normal ? {
                    "attachName": "android_normal",
                    "attachUrl": submitData.android_normal
                } : null,
                submitData.android_normal_infinity ? {
                    "attachName": "android_normal_infinity",
                    "attachUrl": submitData.android_normal_infinity
                } : null,
                submitData.android_special_infinity_001 ? {
                    "attachName": "android_special_infinity_001",
                    "attachUrl": submitData.android_special_infinity_001
                } : null,
                submitData.android_special_infinity_002 ? {
                    "attachName": "android_special_infinity_002",
                    "attachUrl": submitData.android_special_infinity_002
                } : null,
                submitData.ipad_horizontal ? {
                    "attachName": "ipad_horizontal",
                    "attachUrl": submitData.ipad_horizontal
                } : null,
            ].filter((item) => item != null)

        }
        submitData.startupCode ? doc.updataBy = localStorage.uid : doc.createBy = localStorage.uid;
        var _this = this;
        confirm({
            title: submitData.startupCode
                ?
                <div>
                    请确认是否修改该闪屏广告
                </div>
                :
                <div>
                    请确认是否添加该闪屏广告
                </div>,
            // content: '点确定将提交后台',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.handleSubmit(doc, submitData);
            },
            onCancel() {
                _this.setState({
                    isSubmit: true
                })
            },
        });
        return;

        return
    }
    async handleSubmit(doc, submitData) {

        // console.log({ "createBy": doc.createBy });
        // console.log({ "updataBy": doc.updataBy });
        // console.log(doc);
        // console.log(localStorage.uid);
        // return;
        var method = submitData.startupCode ? 'ella.operation.updateAdvice' : 'ella.operation.insertAdvice';
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body: "method=ella.operation.insertAdvice" + "&content=" + JSON.stringify(doc)
            body: "method=" + method + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());

        console.log(data)
        if (data.status == 1) {
            message.success('添加成功');
            // window.history.back();
            // window.location.href = window.location.href.split('/messageList')[0] + '/messageList/back/STARTUP_AD';
        } else if (data.code == '10001001') {
            message.error('目标用户uid不存在');
            this.setOneKV('isSubmit', true);
        } else if (data.code == '70000001') {
            message.error('闪屏广告时间冲突');
            this.setOneKV('isSubmit', true);
        } else {
            message.error('添加失败');
            this.setOneKV('isSubmit', true);
        }
    }
    //TODO:判断网址
    checkUrl(urlString) {
        if (urlString != "") {
            var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (!reg.test(urlString)) {
                // console.log("不是正确的网址吧，请注意检查一下");
                return false;
            } else {
                return true;
            }
        }
    }
    render() {
        console.log(this.state.targetType)
        console.log(this.state)
        var columns = [
            {
                title: '图书标题',
                dataIndex: 'bookName',
                key: 'bookName',
            },
            {
                title: '图书编码',
                dataIndex: 'bookCode',
                key: 'bookCode',
            },
            {
                title: '出版时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
            },
        ];
        var rowSelection = {
            type: 'radio',
            onChange: (a, b) => {
                // console.log(a)
                console.log(b)
                this.setOneKV('TempBookName', b[0].bookName);

            }
        }
        return <div id='target'>
            <Row>
                <Col span={4}>
                    <Select value={this.state.targetType} style={{ width: 120 }} onChange={(v) => { this.setOneKV('targetType', v) }}>
                        {
                            this.state.groupList
                        }
                    </Select>
                </Col>


                {
                    this.state.targetType == 'BOOK_DETAIL'
                        ?
                        <Col span={8}>
                            <Search
                                placeholder=""
                                onSearch={value => { this.fetchBookList(value) }}
                                value={this.state.BookName}
                                onChange={(e) => { this.setOneKV('BookName', e.target.value) }}
                                enterButton
                            />
                            <Modal
                                title="添加图书"
                                visible={this.state.visible}
                                onOk={() => {
                                    var code = this.state.BookDataList.find(n => n.bookName == this.state.TempBookName).bookCode
                                    this.setState({
                                        visible: false,
                                        BookName: this.state.TempBookName,
                                        BookTargetPage: 'ellabook2://detail.book?bookCode=' + code + '&method=ella.book.getBookByCode'
                                    })
                                }}
                                onCancel={() => {
                                    this.setState({
                                        visible: false
                                    })
                                }}
                            >
                                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.BookDataList} />
                            </Modal>
                        </Col>
                        :
                        null
                }


                {
                    this.state.targetType == 'SYSTEM_INTERFACE'
                        ?
                        <Col span={3}>
                            <Select value={this.state.SystemId} style={{ width: 200 }} onChange={(v) => {
                                this.setState({
                                    SystemId: v,
                                    SystemTargetPage: this.state.SystemDataList.find(n => n.searchId == v).searchCode
                                })
                            }}>
                                {
                                    this.state.SystemList
                                }
                            </Select>
                        </Col>
                        :
                        null
                }

                {
                    this.state.targetType == 'H5'
                        ?
                        <Col span={8}>
                            <Input
                                onBlur={(e) => {
                                    console.log(12345)
                                    if (!this.checkUrl(e.target.value)) {
                                        message.error('H5链接地址格式错误');
                                    }
                                }}
                                value={this.state.H5TargetPage}
                                onChange={(e) => {
                                    this.setState({
                                        H5TargetPage: e.target.value
                                    })
                                }} />
                        </Col>
                        :
                        null
                }

                {
                    this.state.targetType == 'BOOK_LIST'
                        ?


                        <Col span={3}>
                            <Select value={this.state.recommendBookId} style={{ width: 200 }} onChange={(v) => {
                                this.setState({
                                    recommendBookId: v,
                                    recommendTargetPage: this.state.RecommendBookDataList.find(n => n.searchId == v).searchCode
                                })
                            }}>
                                {
                                    this.state.RecommendBookList
                                }
                            </Select>
                        </Col>
                        :
                        null
                }

                {
                    this.state.targetType == 'BOOK_PACKAGE'
                        ?
                        <Col span={6}>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="搜索一个图书包"
                                optionFilterProp="children"
                                onChange={(v) => {
                                    console.log('ellabook2://package.book?packageCode=' + v + '&method=ella.book.getBookPackageBookListInfo');
                                    this.setState({
                                        BookBagTargetPage: 'ellabook2://package.book?packageCode=' + this.state.BookBagSearchDataList.find(n => n.goodsCode == v).thirdCode + '&method=ella.book.getBookPackageBookListInfo',
                                        BookBagName: this.state.BookBagSearchDataList.find(n => n.goodsCode == v).goodsName
                                    })
                                }}
                                onFocus={() => { this.fetchBookBagList('') }}
                                onBlur={() => { }}
                                onSearch={(v) => { this.fetchBookBagList(v) }}
                                defaultValue={this.state.BookBagName}
                                dropdownStyle={
                                    this.state.BookBagSearchList.length ? {
                                        // placement: 'topCenter',
                                        // bottom: '0px'
                                        // minHeight: '255px'
                                    } : {
                                            // minHeight: '255px'
                                            // display: 'none'
                                        }
                                }
                            >
                                {
                                    this.state.BookBagSearchList
                                }
                            </Select>
                        </Col>
                        :
                        null
                }
            </Row>

            {
                <Row style={{ marginTop: '45px' }}>
                    <Col span={6}>
                        <Button
                            onClick={() => {
                                if (this.state.isSubmit) {
                                    this.submitData()
                                }
                            }}
                            type='primary'>保存</Button>
                    </Col>
                </Row>
            }
        </div>
    }
}