import React from 'react';
import { Row, Col, Select, Input, message, Modal, Table } from 'antd';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';

import { dataString } from '../commonData.js'

moment.locale('zh-cn');
// const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;
import getUrl from "../util.js";
const Search = Input.Search;
export default class PriceSet extends React.Component {
    //此组件需要传入preverData{type:,v,target:};和获取组件返回值函数getdata;和一个key,key的改变会引起此组件的变化
    constructor(props) {
        super()
        this.state = {
            visible: false,
            groupList: [],
            type: props.preverData.type,
            // BOOK_DETAIL图书详情;默认值TempBookName和BookName同事赋值,还要赋值BookTargetPage
            TempBookName: props.preverData.type == 'BOOK_DETAIL' ? props.preverData.v : '',
            BookName: props.preverData.type == 'BOOK_DETAIL' ? props.preverData.v : '',               //TODO: 传 TODO:
            BookDataList: [],
            BookTargetPage: props.preverData.type == 'BOOK_DETAIL' ? props.preverData.target : '',

            // SYSTEM_INTERFACE系统;默认值:SystemId和SystemTargetPage
            SystemList: [],
            SystemDataList: [],
            SystemId: props.preverData.type == 'SYSTEM_INTERFACE' ? props.preverData.v : '',               //TODO: 传 TODO:
            SystemTargetPage: props.preverData.type == 'SYSTEM_INTERFACE' ? props.preverData.target : '',

            //H5
            H5TargetPage: props.preverData.type == 'H5' ? props.preverData.target : '',

            //BOOK_LIST推荐;默认值:recommendBookId,recommendTargetPage
            RecommendBookList: [],      //推荐图书列表
            RecommendBookDataList: [],  //推荐图书数据列表
            recommendBookId: props.preverData.type == 'BOOK_LIST' ? props.preverData.v : '',         //推荐图书id //TODO: 传 TODO: 如:P201712126TZJVS
            recommendTargetPage: props.preverData.type == 'BOOK_LIST' ? props.preverData.target : '',

            //BOOK_PACKAGE图书包;默认值BookBagName,BookBagTargetPage
            BookBagSearchList: [],           //TODO:搜索出来的图书包列表
            BookBagSearchDataList: [],
            BookBagName: props.preverData.type == 'BOOK_PACKAGE' ? props.preverData.v : '',                 //初始值 //TODO: 传 TODO:
            BookBagTargetPage: props.preverData.type == 'BOOK_PACKAGE' ? props.preverData.target : '',
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.key != nextProps.key) {
            let k = 'a';
            let k2 = 'b';
            let t = '';
            const { type, v, target } = nextProps.preverData;
            switch (type) {
                case 'BOOK_DETAIL':
                    k = 'TempBookName'; k2 = 'BookName'; t = 'BookTargetPage';
                    break;
                case 'SYSTEM_INTERFACE':
                    k = 'SystemId'; t = 'SystemTargetPage';
                    break;
                case 'H5':
                    t = 'H5TargetPage';
                    break;
                case 'BOOK_LIST':
                    k = 'recommendBookId'; t = 'recommendTargetPage';
                    break;
                case 'BOOK_PACKAGE':
                    k = 'BookBagName'; t = 'BookBagTargetPage';
                    break;
            }
            this.setState({
                type,
                [k]: v,
                [k2]: v,
                [t]: target
            })
        }
    }
    componentDidMount() {
        this.fetchGroup();
        this.fetchSystem();
        this.fetchBookDetal();
    }
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
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc)+dataString

        }).then(res => res.json());
        console.log(data.data)
        this.setState({
            groupList: data.data.map((item) => {
                return <Option value={item.searchCode}>{item.searchName}</Option>
            })
        })

    };
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

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc)+dataString

        }).then(res => res.json());
        console.log(data)
        this.setState({
            SystemList: data.data.map((item) => {
                return <Option value={item.searchId}>{item.searchName}</Option>
            }),
            SystemDataList: data.data
        })
    };
    // TODO:系统列表
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
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc)+dataString

        }).then(res => res.json())
        this.setState({
            BookDataList: data.data.bookList,
            visible: true

        }, () => {

        })
        console.log(data.data)
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
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc)+dataString

        }).then(res => res.json());
        // console.log(data)
        this.setState({
            RecommendBookList: data.data.map((item) => {
                return <Option value={item.searchId}>{item.searchName}</Option>
            }),
            RecommendBookDataList: data.data
        })
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

            body: "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(doc)+dataString

        }).then(res => res.json());
        // console.log({ "sdd": data.data })
        this.setState({
            BookBagSearchList: (data.data && data.data.list) ? data.data.list.map(item => <Option value={item.goodsCode}>{item.goodsName}</Option>) : [],
            BookBagSearchDataList: data.data.list
        })

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
        console.log(this.state)
        return <div>
            <Row>
                <Col span={4}>
                    <Select
                        value={this.state.type}
                        style={{ width: 120 }}
                        onChange={(type) => {
                            var v, target;
                            switch (type) {
                                case 'BOOK_DETAIL':
                                    v = this.state.bookName;
                                    target = this.state.BookTargetPage;
                                    break;
                                case 'SYSTEM_INTERFACE':
                                    v = this.state.SystemId;
                                    target = this.state.SystemTargetPage;
                                    break;
                                case 'H5':
                                    v = '';
                                    target = this.state.H5TargetPage;
                                    break;
                                case 'BOOK_LIST':
                                    v = this.state.recommendBookId;
                                    target = this.state.recommendTargetPage;
                                    break;
                                case 'BOOK_PACKAGE':
                                    v = this.state.BookBagName;
                                    target = this.state.BookBagTargetPage;
                                    break;
                            }
                            this.props.getdata(type, v, target);
                            this.setOneKV('type', type);
                        }}
                    >
                        {
                            this.state.groupList
                        }
                    </Select>
                </Col>
                {
                    this.state.type == 'BOOK_DETAIL' &&
                    <Col span={6}>
                        <Search
                            placeholder=""
                            onSearch={value => { this.fetchBookList(value) }}
                            value={this.state.BookName}
                            onChange={(e) => {
                                this.setOneKV('BookName', e.target.value)
                            }}
                            enterButton
                        />
                        <Modal
                            title="添加图书"
                            visible={this.state.visible}
                            onOk={() => {
                                var code = this.state.BookDataList.find(n => n.bookName == this.state.TempBookName) ? this.state.BookDataList.find(n => n.bookName == this.state.TempBookName).bookCode : '';
                                this.props.getdata('BOOK_DETAIL', this.state.TempBookName, 'ellabook2://detail.book?bookCode=' + code + '&method=ella.book.getBookByCode');
                                this.setState({
                                    visible: false,
                                    BookName: this.state.TempBookName,
                                    BookTargetPage: 'ellabook2://detail.book?bookCode=' + code + '&method=ella.book.getBookByCode'
                                })

                            }}
                            onCancel={() => {
                                this.setState({
                                    visible: false,
                                    BookName: this.state.TempBookName,
                                })
                            }}
                        >
                            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.BookDataList} />
                        </Modal>
                    </Col>
                }
                {
                    this.state.type == 'SYSTEM_INTERFACE' &&
                    <Col span={6}>
                        <Select value={this.state.SystemId} style={{ width: 120 }}
                            onChange={(v) => {
                                this.props.getdata('SYSTEM_INTERFACE', v, this.state.SystemDataList.find(n => n.searchId == v).searchCode);
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
                }
                {
                    this.state.type == 'H5' &&
                    <Col span={6}>
                        <Input
                            onBlur={(e) => {
                                console.log(12345)
                                if (!this.checkUrl(e.target.value)) {
                                    message.error('H5链接地址格式错误');
                                }
                            }}
                            value={this.state.H5TargetPage}
                            onChange={(e) => {
                                this.props.getdata('H5', '', e.target.value);
                                this.setState({
                                    H5TargetPage: e.target.value
                                })
                            }}
                        />
                    </Col>
                }
                {
                    this.state.type == 'BOOK_LIST' &&
                    <Col span={6}>
                        <Select
                            value={this.state.recommendBookId}
                            style={{ width: 200 }}
                            onChange={(v) => {
                                this.props.getdata('BOOK_LIST', v, this.state.RecommendBookDataList.find(n => n.searchId == v).searchCode);
                                this.setState({
                                    recommendBookId: v,
                                    recommendTargetPage: this.state.RecommendBookDataList.find(n => n.searchId == v).searchCode
                                })
                            }}
                        >
                            {
                                this.state.RecommendBookList
                            }
                        </Select>
                    </Col>
                }
                {
                    this.state.type == 'BOOK_PACKAGE' &&
                    <Col span={8}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="搜索一个图书包"
                            optionFilterProp="children"
                            onChange={(v) => {
                                // console.log('ellabook2://package.book?packageCode=' + v + '&method=ella.book.getBookPackageBookListInfo');
                                this.props.getdata('BOOK_PACKAGE', this.state.BookBagSearchDataList.find(n => n.goodsCode == v).goodsName, 'ellabook2://package.book?packageCode=' + this.state.BookBagSearchDataList.find(n => n.goodsCode == v).thirdCode + '&method=ella.book.getBookPackageBookListInfo');
                                this.setState({
                                    BookBagName: this.state.BookBagSearchDataList.find(n => n.goodsCode == v).goodsName,
                                    BookBagTargetPage: 'ellabook2://package.book?packageCode=' + this.state.BookBagSearchDataList.find(n => n.goodsCode == v).thirdCode + '&method=ella.book.getBookPackageBookListInfo',
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
                }
            </Row>
        </div>
    }
}