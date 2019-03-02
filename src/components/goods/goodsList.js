import React from 'react';
import { notification, Table, Form, Input, Select, Checkbox, DatePicker, Row, Col, Radio, Button, Modal, message, Pagination, Icon, Spin, InputNumber, Popover } from 'antd';
const { RangePicker } = DatePicker;
const Search = Input.Search;
import { Link } from 'react-router';
import './goods.css'
import getUrl from "../util.js";
import moment from 'moment';
import { dataString } from '../commonData.js'
class myForm extends React.Component {
    constructor() {
        super()
        this.state = {
            searchType: "categorySearch",
            startTime: '',
            endTime: '',
            dateType: "publishTime",
            channelCode: null,
            goodsState: null,
            goodsType: null,
            goodsManageSearchType: "goodsName",
            searchContent: "",
            defaultData: {
                dateTypeList: [],
                channel: [],
                goodsStateList: [],
                goodsTypeList: [],
            },
            searchResultData: [],
            total: 0,
            pageSize: 20,
            pageNow: 1,
            currentPage: 1,
            visible: false, //模态框显示关闭
            submitData: [],
            checkedItem: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], //多选列表
            allSubmitData: [],

            isShow: false,   //是否展示内容
            isConflict: false,
            loading: false,
            lowestPrice: '',
            highestPrice: ''
        }
    }
    //获取开始结束时间
    getStartOrEndData(value, dateString, str) {
        this.setState({
            [str]: dateString
        })
    }
    //获取渠道
    getSearchData(str, value) {
        this.setState({
            [str]: value
        })
    }
    //拉数据
    async fetchdata(fetchStr, stateStr, getStr) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": fetchStr }) + dataString
        }).then(res => res.json())
        this.setState({
            defaultData: {
                ...this.state.defaultData,
                dateTypeList: data.data.filter(item => item.remark == '时间类型'),
                goodsStateList: data.data.filter(item => item.remark == '商品状态'),
                goodsTypeList: data.data.filter(item => item.remark == '商品类型'),
            }
        })
    }
    async fetchSearchResultData(page, searchType, pageSize) {
        //精准检索和条目检索的参数
        var searchData = searchType == "categorySearch" ? {
            searchType,
            dateType: this.state.dateType,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            channelCode: this.state.channelCode,
            goodsState: this.state.goodsState,
            goodsType: this.state.goodsType,
            lowestPrice: this.state.lowestPrice,
            highestPrice: this.state.highestPrice,
            page,
            pageSize
        } : {
            searchType,
            searchContent: this.state.searchContent,
            goodsManageSearchType: this.state.goodsManageSearchType,
            page,
            pageSize
        }
        //TODO:比较时间大小
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        if (searchType == "categorySearch" && CompareDate(searchData.startTime, searchData.endTime)) {
            message.error('时间设置不正确');
            return;
        }

        if (this.state.lowestPrice > this.state.highestPrice) {
            message.error('最低价格不能大于最高价格');
            return;
        }

        this.setState({
            loading: true
        })
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(searchData) + dataString
        }).then(res => res.json())
            .then((d) => {
                const tableList = [];
                var list = d.data.list;
                for (let i = 0; i < list.length; i++) {
                    var goodsState = list[i].goodsState;
                    var goodsType = list[i].goodsType;
                    if (goodsState == 'SHELVES_OFF') {
                        goodsState = '已下架'
                    } else if (goodsState == 'SHELVES_WAIT') {
                        goodsState = '待上架'
                    } else if (goodsState == 'SHELVES_ON') {
                        goodsState = '已上架'
                    } else if (goodsState == 'SHELVES_OFF') {
                        goodsState = '已下架'
                    } else if (goodsState == 'PRE_SALE') {
                        goodsState = '预售'
                    } else if (goodsState == '' || goodsState == null) {
                        goodsState = '-'
                    }

                    if (goodsType == 'BOOK') {
                        goodsType = '图书'
                    } else if (goodsType == 'LIB') {
                        goodsType = '图书馆'
                    } else if (goodsType == 'BOOK_PACKAGE') {
                        goodsType = '图书包'
                    } else if (goodsType == 'ELLA_VIP') {
                        goodsType = '会员'
                    } else if (goodsType == 'ELLA_COIN') {
                        goodsType = '咿啦币'
                    } else if (goodsType == 'ELLA_COURSE') {
                        goodsType = '课程'
                    } else if (goodsType == '' || goodsType == null) {
                        goodsType = '-'
                    }
                    tableList.push({
                        goodsCode: (list[i].goodsCode == '' || list[i].goodsCode == null) ? '-' : list[i].goodsCode,
                        goodsName: (list[i].goodsName == '' || list[i].goodsName == null) ? '-' : list[i].goodsName,
                        goodsPrice: (list[i].goodsPrice == null) ? '-' : list[i].goodsPrice,
                        goodsState: goodsState,
                        goodsSubstance: (list[i].goodsSubstance == '' || list[i].goodsSubstance == null) ? '-' : list[i].goodsSubstance,
                        goodsType: goodsType,
                        thirdCode: (list[i].thirdCode == '' || list[i].thirdCode == null) ? '-' : list[i].thirdCode,
                        updateTime: (list[i].updateTime == '' || list[i].updateTime == null) ? '-' : list[i].updateTime,
                        shelvesOffNum: list[i].shelvesOffNum,
                        goodsSrcPrice: list[i].goodsSrcPrice
                    })
                }
                this.setState({
                    loading: false,
                    searchResultData: tableList,
                    currentPage: d.data.currentPage,
                    isLast: d.data.isLast,
                    total: d.data.total,
                    totalPage: d.data.totalPage
                })
            })

        this.resectCheckbox();
    }

    searchContent(name, value) {
        this.setState({
            [name]: value
        }, () => {
            this.fetchSearchResultData(0, 'accurateSearch', this.state.pageSize)
        })
    }

    componentDidMount() {
        this.fetchdata("GOODS_MANAGE_LIST");
        this.fetchChannelItem();
        this.fetchSearchResultData(0, this.state.searchType, this.state.pageSize);
    }
    //分页条(此时选的条目清零)
    changePage(pageNumber) {
        this.setState({
            submitData: [],
            pageNow: pageNumber
        })
        this.fetchSearchResultData(pageNumber - 1, this.state.searchType, this.state.pageSize);
        this.resectCheckbox();
    }
    //模态框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    getOriginalPrice(k, v) {
        if (v < 0) {
            message.error("筛选价格不能为负");
            return;
        }
        if (v != '') {
            var cur = parseFloat(Number(v).toFixed(2));
        } else {
            var cur = v;
        }

        this.setState({
            [k]: cur,
        });

    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    //多选改变
    changeCheckbox(index) {

        this.setState({
            checkedItem: this.state.checkedItem.map((item, _index) => index == _index ? !item : item)
        })
    }
    resectCheckbox() {
        this.setState({
            checkedItem: this.state.checkedItem.map(item => false),
            submitData: []
        })

    }
    checkAll(e, allSubmitData) {
        if (!e) allSubmitData = [];
        this.setState({
            checkedItem: this.state.checkedItem.map(item => e ? true : false),
            submitData: allSubmitData
        })
    }
    //物品批量上下架(这里的item已经是拉取得到的数据的每一项直接用就行了)
    goodsShelvesOrShelf(goodsState) {
        let arr = [];
        this.state.submitData.forEach(item => {
            arr.push(item.thirdCode);
        })
        const confirm = Modal.confirm;
        const _this = this;
        // TODO:上下架0条数据时
        if (arr.length == 0) {
            notification.error({
                message: `请选择${goodsState == "SHELVES_ON" ? "上架" : "下架"}商品`,
                description: '',
            })
            return
        }
        confirm({
            title: goodsState == "SHELVES_ON" ? '请确认是否批量上架已选中的商品' : '请确认是否批量下架已选中的商品?且相关联图书包将同时被下架',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                _this.submitGoods(arr.join(","), goodsState);
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }
    async submitGoods(thirdCode, goodsState) {

        var doc = this.state.isConflict ? {
            "goodsState": goodsState,
            thirdCode
        } : {
            "goodsState": goodsState,
            thirdCode
        }

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.goodsUpOrOff" + "&content=" + JSON.stringify(doc) + dataString
        }).then(res => res.json());
        if (data.code == "2000010010") {
            var error_message = "";
            data.data.forEach(item => {
                error_message = error_message + item.goodsName + "  "
            })
            // TODO:二次确认是否过滤
            const _this = this;
            const confirm = Modal.confirm;
            confirm({
                title: `已选商品记录中存在异常下架的图书包`,
                content: '确认提交后异常商品会被过滤',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk() {
                    _this.twoFetch(thirdCode, goodsState)
                },
                onCancel() {
                    _this.setState({
                        isConflict: false
                    })
                },
            })
            return
        }
        if (data.status == 1) {
            this.fetchSearchResultData(this.state.pageNow - 1, this.state.searchType, this.state.pageSize)

            notification.success({
                message: `${goodsState == "SHELVES_ON" ? "上架" : "下架"}操作成功`
            })
        } else {
            notification.error({
                message: `${goodsState == "SHELVES_ON" ? "上架" : "下架"}操作失败`
            })
        }
    }
    async twoFetch(thirdCode, goodsState) {
        var doc = {
            "goodsState": goodsState,
            thirdCode,
            isSureUpOrOff: "YES"
        };

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.goodsUpOrOff" + "&content=" + JSON.stringify(doc) + dataString
        }).then(res => res.json());
        if (data.status == 1) {
            this.fetchSearchResultData(this.state.pageNow - 1, this.state.searchType, this.state.pageSize)

            notification.success({
                message: data.data
            })
        }
    }
    changePageSize(current, size) {
        var arr = [];
        arr.length = size;
        arr.fill(false);
        this.setState({
            pageSize: size,
            submitData: [],
            checkedItem: arr
        });
        this.fetchSearchResultData(current - 1, this.state.searchType, size);
        this.resectCheckbox();
    }
    //如果没有权限就提示
    isUPDAT() {
        if (!getUrl.operationTypeCheck("UPDAT")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号");
            return
        }
    }
    //恢复默认设置
    clearSelect() {
        this.setState({
            startTime: '',
            endTime: '',
            dateType: "publishTime",
            goodsType: null,
            channelCode: null,
            goodsState: null,
            lowestPrice: '',
            highestPrice: ''

        })

    }
    //拉取渠道信息
    async fetchChannelItem() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                type: "AUTO_BOX",
                groupId: "operation.box.chanelList"
            }) + dataString
        }).then(res => res.json())
        this.setState({
            defaultData: {
                ...this.state.defaultData,
                channel: data.data
            }

        })
    }
    render() {
        // 用来储存全选时候的数据
        var allSubmitData = [];
        const columns = [
            {
                title: " ",
                dataIndex: 'ck',
                key: 'ck',
                render: (text, record, index) => {
                    // 这里可以看到拉取得到数据的每一项
                    allSubmitData.push(record);
                    return <Checkbox
                        value={record.goodsCode}
                        checked={this.state.checkedItem[index]}
                        onChange={(e) => {
                            this.changeCheckbox(index);
                            if (!e.target.checked) {
                                this.setState({ submitData: this.state.submitData.filter(item => item.goodsCode != record.goodsCode) });
                            } else {
                                this.setState({
                                    submitData: [
                                        ...this.state.submitData,
                                        record
                                    ]
                                })
                            }
                        }
                        }
                    ></Checkbox>
                },
                width: 50
            }, {
                title: '商品ID',
                dataIndex: 'goodsCode',
                key: 'goodsCode',
                width: 250
            }, {
                title: '商品类型',
                dataIndex: 'goodsType',
                key: 'goodsType',
                width: 100
            }, {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: 250,
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.goodsName
                            }
                        >
                            <span>{record.goodsName}</span>
                        </Popover>
                    )
                }
            }, {
                title: '商品更新日期',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 200
            }, {
                title: '优惠价',
                dataIndex: 'goodsPrice',
                key: 'goodsPrice',
                width: 100
            }, {
                title: '原价',
                dataIndex: 'goodsSrcPrice',
                key: 'goodsSrcPrice',
                width: 100
            }, {
                title: '商品状态',
                dataIndex: 'goodsState',
                key: 'goodsState',
                width: 200,
                render: (text, record, index) => {
                    return record.shelvesOffNum > 0 ? <span style={{ color: "red" }}>{"异常下架"}</span> : <span>{text}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'looklook',
                key: 'looklook',
                render: (text, record) => {
                    if (record.goodsType == "图书包") {
                        return <Link to={`/goodsGroup/edt/${record.goodsCode}`} target="_blank">商品详情</Link>
                    } else if (record.goodsType == "课程") {
                        return <Link to={`/addcourse/${record.goodsCode}/${record.goodsName}`} target="_blank">商品详情</Link>
                    } else {
                        return <Link target="_blank" onClick={() => { this.isUPDAT() }} to={getUrl.operationTypeCheck("UPDAT") ? `/seeDetails/${record.goodsCode}/${record.goodsType}/${record.goodsName}` : `/goodslist`}>商品详情</Link>
                    }
                },
                width: 150
            }
        ];
        const show = {
            display: "block",
            "marginLeft": "20px"

        }
        const not_show = {
            display: "none"
        }
        const data = getUrl.operationTypeCheck("RETRIEVE") ? this.state.searchResultData : [];
        return (
            <div className="goodsListBox">
                <p className="m-title">商品查询</p>
                <div className="rowPartWrap2">
                    <div className="rowPart">
                        <Button className="intervalRight" disabled={!getUrl.operationTypeCheck("CREATE")} id="goodsListAdd" type="primary" icon="plus" onClick={this.showModal}>新增商品</Button>
                        <Select defaultValue="goodsName" className="selectWidth intervalRight" onChange={(value) => { this.getSearchData("goodsManageSearchType", value) }}>
                            {/* <option value={''}>全部</option> */}
                            <Option value={"goodsCode"}>商品编码</Option>
                            <Option value={"goodsName"}>商品名称</Option>
                        </Select>
                        <Search placeholder="搜索" enterButton className="searchWidth intervalRight" onSearch={(value) => { this.setState({ searchType: "accurateSearch" }); this.searchContent("searchContent", value) }} />
                        <Button style={{ width: '120px' }} type="primary" onClick={() => { this.setState({ isShow: !this.state.isShow }) }}>展示更多{this.state.isShow ? <Icon type="up" /> : <Icon type="down" />}</Button>
                    </div>
                </div>

                <div style={this.state.isShow ? show : not_show}>
                    <div className="part">
                        <span className="u-txt">时间筛选:</span>
                        <Select value={this.state.dateType} className="selectWidth" onChange={(value) => { this.getSearchData("dateType", value) }}>
                            {
                                this.state.defaultData.dateTypeList.map((item, i)=> {
                                    return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="part">
                        <DatePicker
                            style={{ width: "180px" }}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder={['开始时间']}
                            onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "startTime") }}
                            value={this.state.startTime != '' ? moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss') : null}
                        />
                        <i> — </i>
                        <DatePicker
                            style={{ width: "180px" }}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder={['结束时间']}
                            onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "endTime") }}
                            value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : null}
                        />
                    </div>
                    <div className="part">
                        <span className="u-txt">原价区间:</span>
                        <InputNumber
                            style={{ width: "100px" }}
                            value={this.state.lowestPrice}
                            onBlur={(e) => { this.getOriginalPrice("lowestPrice", e.target.value) }}
                            onChange={(value) => { this.getOriginalPrice("lowestPrice", value) }}

                        />
                        <i> — </i>
                        <InputNumber
                            style={{ width: "100px" }}
                            value={this.state.highestPrice}
                            onBlur={(e) => { this.getOriginalPrice("highestPrice", e.target.value) }}
                            onChange={(value) => { this.getOriginalPrice("highestPrice", value) }}
                        />
                    </div>

                    <div className="part">
                        <span className="u-txt">销售渠道:</span>
                        <Select defaultValue="全部" value={this.state.channelCode} className="selectWidth" onChange={(value) => { this.getSearchData("channelCode", value) }}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.channel.map((item, i) => {
                                    return <Option value={item.code} key={i}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="part">
                        <span className="u-txt">商品类型:</span>
                        <Select defaultValue="全部" value={this.state.goodsType} className="selectWidth" onChange={(value) => { this.getSearchData("goodsType", value) }}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.goodsTypeList.map((item, i) => {
                                    return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="part">
                        <span className="u-txt">商品状态:</span>

                        <Select defaultValue="全部" value={this.state.goodsState} className="selectWidth" onChange={(value) => { this.getSearchData("goodsState", value) }}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.goodsStateList.map((item, i) => {
                                    return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <div style={{ "marginBottom": "20px" }}>
                        <Button

                            className="buttonWidth intervalRight"
                            disabled={!getUrl.operationTypeCheck("RETRIEVE")}
                            id="goodsListQuery" type="primary"
                            onClick={() => { this.setState({ searchType: "categorySearch" }); this.fetchSearchResultData(0, "categorySearch", this.state.pageSize) }}
                        >查询</Button>
                        <Button className="block buttonWidth" type="primary" onClick={() => this.clearSelect()}>恢复默认</Button>
                    </div>
                    <Modal
                        title="请选择需要增加的商品"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="确认"
                        cancelText="关闭"
                        className="goodsListModel"
                    >
                        <Row className="checkbuttonWrap">
                            <Col span={8}><Link to="/addGoods"><Button className="checkbutton" type="primary">图书</Button></Link></Col>
                            <Col span={8}><Link to="/goodsGroup/add"><Button className="checkbutton" type="primary">图书包</Button></Link></Col>
                            <Col span={8}><Link to="/addellagold"><Button className="checkbutton" type="primary">咿啦币</Button></Link></Col>
                            <Col className="last" span={8}><Link to="/addellavip"><Button className="checkbutton" type="primary">会员</Button></Link></Col>
                            <Col className="last" span={8}><Link to="/addcourse/0/0"><Button className="checkbutton" type="primary">课程</Button></Link></Col>
                        </Row>
                    </Modal>

                </div>
                <div className="rowPartWrap3">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table pagination={false} hideDefaultSelections={false} columns={columns} dataSource={data} scroll={{ y: data.length <= 13 ? 0 : 570 }} />
                    </Spin>
                    <Row style={{ padding: "30px 0px 20px 0px" }}>
                        <Col span={2}>
                            <div style={{ paddingLeft: "17%" }}>
                                <Checkbox className="checkall" onChange={(e) => { this.checkAll(e.target.checked, allSubmitData) }} checked={this.state.checkedItem.indexOf(false) == -1 ? true : false}>全选</Checkbox>
                            </div>
                        </Col>
                        <Col span={4}>
                            <Button disabled={!getUrl.operationTypeCheck("UPDAT")} id="goodsListAdd2" onClick={() => { this.goodsShelvesOrShelf("SHELVES_ON") }} type="primary">批量上架</Button>
                        </Col>
                        <Col span={4}>
                            <Button disabled={!getUrl.operationTypeCheck("UPDAT")} id="goodsListAdd3" onClick={() => { this.goodsShelvesOrShelf("SHELVES_OFF") }} type="primary">批量下架</Button>
                        </Col>
                        <Col style={{ textAlign: "right" }} span={14}>
                            {
                                getUrl.operationTypeCheck("RETRIEVE") ? <Pagination
                                    showQuickJumper
                                    pageSize={this.state.pageSize}
                                    current={this.state.currentPage}
                                    total={this.state.total}
                                    onChange={this.changePage.bind(this)}
                                    showTotal={total => `共 ${total} 条`}
                                    showSizeChanger
                                    pageSizeOptions={["20", "40", "60", "80", "100"]}
                                    onShowSizeChange={this.changePageSize.bind(this)} /> : null
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default myForm
