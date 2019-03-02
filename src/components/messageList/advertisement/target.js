import React from 'react';
import { Row, Col, Card, Icon, Input, Select, Radio, DatePicker, Button, Table, Divider, Modal, message } from "antd";
import { Link } from 'react-router';
import getUrl from '../../util.js';
import commonData from '../../commonData.js';
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
        // console.log(nextProps);
        if (nextProps.submitData.key != this.props.submitData.key) {
            // console.log('bookName')
            // console.log(nextProps.submitData.targetPage.BookName)
            // console.log(this.props.submitData.targetPage.BookName)
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
            "pageSize": 20
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
        // console.log({ "sdd": data.data })
        this.setState({
            BookBagSearchList: (data.data && data.data.list) ? data.data.list.map(item => <Option value={item.goodsCode}>{item.goodsName}</Option>) : [],
            BookBagSearchDataList: data.data.list
        })

    }
    async showConfirm() {
        // window.location.href = window.location.href.split('/messageList')[0] + '/messageList/back/STARTUP_POPUP'
        // // hashHistory.push('/messageList/back/STARTUP_POPUP')
        // return;
        var submitData = this.props.submitData;
        
        console.log(this.props.submitData);
        console.log(this.props.submitData.intervalTime*86400)
        // TODO:比较时间大小
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        

        console.log(submitData.startupCode);
        // return;
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
        if (submitData.intervalTime== '') {
            message.error('间隔时间未填写');
            return;
        };

//      if (submitData.pushTimes== '') {
//          message.error('固定次数未填写');
//          return;
//      };

        if (submitData.intervalTime<=0) {
            message.error('间隔时间必须大于零');
            return;
        };

//      if (submitData.pushTimes<=0) {
//          message.error('固定次数必须大于零');
//          return;
//      };
        if (submitData.showStyle=="") {

            message.error('弹窗动画未选择');
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
        if (submitData.attachUrl == '') {
            message.error('图片未上传');
            return;
        };
        // TODO:暂时只判断添加
        if (!this.getTargetPage() && !submitData.targetPage.url) {
            message.error('目标链接未选择');
            return;
        };
        if (this.state.targetType == 'H5' && !this.checkUrl(this.state.H5TargetPage)) {
            message.error('H5链接地址格式错误');
            return;
        };
        this.setOneKV('isSubmit', false);
        var intervalTime=submitData.intervalTime*86400;
        
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
            targetType: this.state.targetType,

            showStyle:submitData.showStyle,
            intervalTime:intervalTime,
            pushTimes:1,
            pushFrequency:'FIXED_PUSH_INTERVALS_AND_TIMES',

            targetPage: {
                url: this.getTargetPage() || encodeURIComponent(submitData.targetPage.url),
                recommendBookId: this.state.recommendBookId,
                SystemId: this.state.SystemId,
                H5TargetPage: encodeURIComponent(this.state.H5TargetPage),
                BookName: this.state.BookName,
                BookBagName: this.state.BookBagName
            },//TODO:暂时
            // createBy: localStorage.uid,
            attach: {
                attachName: submitData.attachName,
                attachUrl: submitData.attachUrl
            }
        }
        submitData.startupCode ? doc.updataBy = localStorage.uid : doc.createBy = localStorage.uid;
        // console.log('提交数据');
        // console.log(localStorage.uid);
        // console.log(doc);
        console.log(doc.createBy);
        console.log(doc.updataBy);
        // return;
        var _this = this;
        confirm({
            title: submitData.startupCode
                ?
                <div>
                    请确认是否修改该启动弹窗
                </div>
                :
                <div>
                    请确认是添加该启动弹窗
                </div>
            ,
            // content: '点确定将提交后台',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.handleSubmit(doc, submitData)
            },
            onCancel() {
                _this.setState({
                    isSubmit: true
                })
            },
        });
        return;

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
            // window.location.href = window.location.href.split('/messageList')[0] + '/messageList/back/STARTUP_POPUP';

            // window.history.back();
        } else if (data.code == '10001001') {
            message.error('目标用户uid不存在');
            this.setOneKV('isSubmit', true);
        } else if (data.code == '70000001') {
            message.error('启动弹窗时间冲突');
            this.setOneKV('isSubmit', true);
        } else {
            message.error('添加失败');
            this.setOneKV('isSubmit', true);
        }
        // console.log(doc)
    }
    async handleSubmit(doc, submitData) {
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
            // window.location.href = window.location.href.split('/messageList')[0] + '/messageList/back/STARTUP_POPUP';

            // window.history.back();
        } else if (data.code == '10001001') {
            message.error('目标用户uid不存在');
            this.setOneKV('isSubmit', true);
        } else if (data.code == '70000001') {
            message.error('启动弹窗时间冲突');
            this.setOneKV('isSubmit', true);
        } else {
            message.error('添加失败');
            this.setOneKV('isSubmit', true);
        }
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
        // console.log(this.state.targetType)
        // console.log(this.state)
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
                        <Col span={8}>
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
                                    this.showConfirm()
                                }
                            }}
                            type='primary'>保存</Button>
                    </Col>
                </Row>
            }
        </div>
    }
}
