/**
 * Created by Administrator on 2018/3/20.
 */
/**
 * Created by Administrator on 2018/3/19.
 */
import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Icon, Spin, Row, Col, message, Modal, Radio, InputNumber,Checkbox } from 'antd';
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import './firstDetail.css';
const RadioGroup = Radio.Group;

const { Option, OptGroup } = Select;
const Search = Input.Search;

function onOk(value) {
   
}
export default class firstPartner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            tableData: [],
            //下拉框
            divideMoney: [],
            dividePercent: [],
            renewMoney: [],

            list: {
                businessUid: '',
                searchInfo: '',
                renewMoney: '',
                divideMoney: '',
                dividePercent: '',
                status: '',
                activeStartTime: '',
                activeEndTime: '',
                expireStartTime: '',
                expireEndTime: '',
                pageVo: {
                    page: 0,
                    pageSize: 20
                },
                searchType:'deviceNo'
            },
            pageMax: 0,
            current: 1,
            selectedRowKeys: [], // Check here to configure the default column

            //弹窗
            visible: false,
            otherRenewMoney: false,
            moreDividMoney: '',
            moreDividePercent: '',
            modalList: {
                renewMoney: '',
                divideType: 'AMOUNT_DIV',
                divideMoney: '',
                dividePercent: '',
                divideInfoDTOList: [],
            },
            value: 'AMOUNT_DIV',
            dividMoneyFlag: false,
            dividePercentFlag: false,
            odividMoneyFlag: true,
            odividePercentFlag: true,
            jine: '',
            fencheng: '',


            //批量修改
            batchVisible: false,
            batchotherRenewMoney: false,
            batchmoreDividMoney: '',
            batchmoreDividePercent: '',
            batchList: {
                renewMoney: '',
                divideType: 'AMOUNT_DIV',
                divideMoney: '',
                dividePercent: '',
                divideInfoDTOList: [],
            },
            batchvalue: 'AMOUNT_DIV',
            batchdividMoneyFlag: false,
            batchdividePercentFlag: false,
            batchodividMoneyFlag: true,
            batchodividePercentFlag: true,
            batchjine: '',
            batchfencheng: '',
            checkedItem: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], //多选列表
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
        this.divideTypeChange = this.divideTypeChange.bind(this);
        this.batchhideModal = this.batchhideModal.bind(this);
        this.batchshowModal = this.batchshowModal.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {

    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount() {
        var search = window.location.href;
       
        var uid = search.split('?uid=')[1].split('&_k=')[0];
      
        if (this.state.modalList.renewMoney == '') {
            this.setState({
                otherRenewMoney: true
            })
        } else {
            this.setState({
                otherRenewMoney: false
            })
        }
        if (this.state.value == 'AMOUNT_DIV') {
            this.setState({
                dividMoneyFlag: false,
                dividePercentFlag: true
            })
        } else if (this.state.value == 'PERCENT_DIV') {
            this.setState({
                dividMoneyFlag: true,
                dividePercentFlag: false
            })
        }

        if (this.state.batchList.renewMoney == '') {
            this.setState({
                batchotherRenewMoney: true
            })
        } else {
            this.setState({
                batchotherRenewMoney: false
            })
        }
        if (this.state.batchvalue == 'AMOUNT_DIV') {
            this.setState({
                batchdividMoneyFlag: false,
                batchdividePercentFlag: true
            })
        } else if (this.state.batchvalue == 'PERCENT_DIV') {
            this.setState({
                batchdividMoneyFlag: true,
                batchdividePercentFlag: false
            })
        }
        this.setState({
            list: {
                ...this.state.list,
                businessUid: uid
            },
            loading: false,
            expand: false,
        }, () => {
            this.detailListFn(this.state.list);
        })
        // this.selectFn();
    }
    //下拉接口
    async selectFn() {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body:"method=ella.business.addBusiness"+"&content="+JSON.stringify({"businessTrueName":businessTrueName,"businessName":businessName,"mobile":mobile,"businessCity":businessCity,"dealerAddress":dealerAddress,"bankName":bankName,"dealerInfo":dealerInfo,"bankNumber":bankNumber,"contractStartTime":contractStartTime,"contractEndTime":contractEndTime,"redCodePower":redCodePower,"divideType":divideType,"dividMoney":dividMoney,"dividePercent":dividePercent,"renewMoney":renewMoney})
            body: "method=ella.business.getBoxCombobox" + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
              
                if (d.status == 1) {
                    this.setState({
                        loading: false,
                        divideMoney: d.data.divideMoney,
                        dividePercent: d.data.dividePercent,
                        renewMoney: d.data.renewMoney,
                    })
                } else {
                    this.setState({
                        loading: false,
                    })
                }
            })
    }
    //列表
    async detailListFn(str) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body:"method=ella.business.addBusiness"+"&content="+JSON.stringify({"businessTrueName":businessTrueName,"businessName":businessName,"mobile":mobile,"businessCity":businessCity,"dealerAddress":dealerAddress,"bankName":bankName,"dealerInfo":dealerInfo,"bankNumber":bankNumber,"contractStartTime":contractStartTime,"contractEndTime":contractEndTime,"redCodePower":redCodePower,"divideType":divideType,"dividMoney":dividMoney,"dividePercent":dividePercent,"renewMoney":renewMoney})
            body: "method=ella.operation.searchBoxDevice" + "&content=" + JSON.stringify(str) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
              
                if (d.status == 1) {
                    const datalist = [];
                    const modifylist = [];
                    var list = d.data.DeviceDetailList;
                    for (var i = 0; i < list.length; i++) {
                        datalist.push({
                            deviceNo: (list[i].deviceNo == '' || list[i].deviceNo == null) ? null : list[i].deviceNo,
                            businessUid: (list[i].businessUid == '' || list[i].businessUid == null) ? null : list[i].businessUid,
                            kindergartenUid: (list[i].kindergartenUid == '' || list[i].kindergartenUid == null) ? null : list[i].kindergartenUid,
                            kindergartenTruename: (list[i].kindergartenTruename == '' || list[i].kindergartenTruename == null) ? '-' : list[i].kindergartenTruename,
                            renewMoney: (list[i].renewMoney == '' || list[i].renewMoney == null) ? '-' : list[i].renewMoney,
                            activeTime: (list[i].activeTime == '' || list[i].activeTime == null) ? '-' : list[i].activeTime,
                            expireTime: (list[i].expireTime == '' || list[i].expireTime == null) ? '-' : list[i].expireTime,
                            status: (list[i].status == '' || list[i].status == null) ? '-' : list[i].status,
                            divideType: list[i].divideType == 'AMOUNT_DIV' ? ((list[i].divideMoney == '' || list[i].divideMoney == null) ? '-' : list[i].divideMoney + '元') : ((list[i].dividePercent == '' || list[i].dividePercent == null) ? '-' : list[i].dividePercent * 100 + '%'),
                        })
                        // modifylist.push({
                        //     deviceNo:(list[i].deviceNo==''||list[i].deviceNo==null)?'null':list[i].deviceNo,
                        //     businessUid:(list[i].businessUid==''||list[i].businessUid==null)?'null':list[i].businessUid,
                        //     kindergartenUid:(list[i].kindergartenUid==''||list[i].kindergartenUid==null)?'null':list[i].kindergartenUid
                        // })
                    }
                    this.setState({
                        tableData: datalist,
                        // selectedRowKeys:modifylist,
                        loading: false,
                        pageMax: d.data.count,
                        pageLength: d.data.DeviceDetailList.length
                    })
                } else {
                    message.error('获取失败')
                    this.setState({
                        loading: false,
                    })
                }
            })
    }
    searchContent(searchInfo, value) {
        this.setState({
            list: {
                ...this.state.list,
                searchInfo: value
            }
        }, () => {
            this.detailListFn(this.state.list);
        })
    }
    pageChangeFun(pageNum) {
        this.setState({
            list: {
                ...this.state.list,
                pageVo: {
                    ...this.state.list.pageVo,
                    page: pageNum - 1,
                },
            },
            current: pageNum
        }, () => {
            this.detailListFn(this.state.list);
        });
    }

    pageSizeFun(current, pageSize) {
        this.setState({
            list: {
                ...this.state.list,
                pageVo: {
                    pageSize: pageSize,
                    page: current - 1,
                },
            },
            current: current
        }, () => {
            this.detailListFn(this.state.list);
        });
    }
    renewMoneyChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                renewMoney: value
            }
        })
    }
    divideMoneyChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                divideMoney: value
            }
        })
    }
    dividePercentChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                dividePercent: value
            }
        })
    }
    statusChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                status: value
            }
        })
    }
    activeStartTimeChange(value, dateString, str) {
        this.setState({
            list: {
                ...this.state.list,
                activeStartTime: dateString
            }
        })
    }
    activeEndTimeChange(value, dateString, str) {
        this.setState({
            list: {
                ...this.state.list,
                activeEndTime: dateString
            }
        })
    }
    expireStartTimeChange(value, dateString, str) {
        this.setState({
            list: {
                ...this.state.list,
                expireStartTime: dateString
            }
        })
    }
    expireEndTimeChange(value, dateString, str) {
        this.setState({
            list: {
                ...this.state.list,
                expireEndTime: dateString
            }
        })
    }
    query() {
        this.detailListFn(this.state.list);
    }

    toggle() {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    //修改续费和分成
    showModal(value) {
        this.setState({
            visible: true,
            modalList: {
                ...this.state.modalList,
                divideInfoDTOList: [{
                    deviceNo: value.deviceNo,
                    businessUid: value.businessUid,
                    kindergartenUid: value.kindergartenUid
                }],

            }
        })
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }
    modalRenewMoneyChange(value) {
        if (value === '') {
            this.setState({
                otherRenewMoney: true
            })
        } else {
            this.setState({
                otherRenewMoney: false,
                modalList: {
                    ...this.state.modalList,
                    renewMoney: value
                }
            })
        }
    }
    oRenewMoneyChange(value) {
        this.setState({
            oRenewMoney: value,
            modalList: {
                ...this.state.modalList,
                renewMoney: value
            }
        })
    }

    divideTypeChange(e) {
        var w = this;
        var dividePercent = this.state.fencheng;
        var divideMoney = this.state.jine;
        if (e.target.value == 'AMOUNT_DIV') {
            this.setState({
                dividMoneyFlag: false,
                dividePercentFlag: true,
                modalList: {
                    ...this.state.modalList,
                    dividePercent: '',
                    divideMoney: divideMoney,
                    divideType: e.target.value
                },
                value: e.target.value
            })
        } else if (e.target.value == 'PERCENT_DIV') {
            this.setState({
                dividMoneyFlag: true,
                dividePercentFlag: false,
                modalList: {
                    ...this.state.modalList,
                    divideMoney: '',
                    dividePercent: dividePercent,
                    divideType: e.target.value
                },
                value: e.target.value
            })
        } else {
            message.error('请选择合伙人分成类型');
        }
    }
    modalDividMoneyChange(value) {
        if (value === '') {
            this.setState({
                odividMoneyFlag: true
            })
        } else {
            this.setState({
                odividMoneyFlag: false,
                modalList: {
                    ...this.state.modalList,
                    divideMoney: value
                },
                jine: value
            })
        }
    }
    moreDividMoneyChange(value) {
        this.setState({
            moreDividMoney: value,
            modalList: {
                ...this.state.modalList,
                divideMoney: value
            }
        })
    }
    modalDividePercentChange(value) {
        if (value === '') {
            this.setState({
                odividePercentFlag: true,
                modalList: {
                    ...this.state.modalList,
                    dividePercent: 1
                },
            })
        } else {
            this.setState({
                odividePercentFlag: false,
                modalList: {
                    ...this.state.modalList,
                    dividePercent: value
                },
                fencheng: value
            })
        }
    }
    moreDividePercentChange(value) {
        this.setState({
            moreDividePercent: value,
            modalList: {
                ...this.state.modalList,
                dividePercent: value / 100
            }
        })
    }
    handleOk = (e) => {
        if (this.state.modalList.renewMoney == '') {
            message.warning('续费金额不能为空')
        } else if (this.state.modalList.renewMoney<0) {
            message.warning('续费金额不能为负数')
        } else if (this.state.modalList.divideType == '' || this.state.modalList.divideType == null) {
            message.warning('请选择分成类型')
        } else if (this.state.modalList.divideType == 'AMOUNT_DIV' && (this.state.modalList.divideMoney == '' || this.state.modalList.divideMoney == null)) {
            message.warning('分成金额不能为空')
        } else if (this.state.modalList.divideType == 'AMOUNT_DIV' && this.state.modalList.divideMoney < 0) {
            message.warning('分成金额不可为负数')
        }
        // else if (this.state.modalList.divideType == 'PERCENT_DIV' && (this.state.modalList.dividePercent == '' || this.state.modalList.dividePercent == null)) {
        //     message.warning('分成比例不能为空')
        // } 
        else {
            this.updateFn(this.state.modalList);
        }
        // this.setState({
        //     visible: false,
        // });
    }
    async updateFn(str) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.business.updateRenewMoney" + "&content=" + JSON.stringify(str) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                if (d.status == 1) {
                    message.success('修改成功');
                    this.setState({
                        loading: false,
                        visible: false,
                    });
                    this.detailListFn(this.state.list);
                } else {
                    message.error(d.message);
                    this.setState({
                        loading: false,
                    })
                }
            })
    }

    //多选、批量
    batchhideModal() {
        this.setState({
            batchVisible: false
        })
    }
    batchshowModal() {
        if(this.state.batchList.divideInfoDTOList.length<=0){
            message.warning('请选择设备');
        }else{
            this.setState({
                batchVisible: true
            })
        }
        
    }
    checkAll(e, allSubmitData) {
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        var list = [];
        for (let i = 0; i < selectedRows.length; i++) {
            list.push({
                deviceNo: selectedRows[i].deviceNo,
                businessUid: selectedRows[i].businessUid,
                kindergartenUid: selectedRows[i].kindergartenUid,
            })
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            batchList: {
                ...this.state.batchList,
                divideInfoDTOList: list
            }
        });
    }
    batchmodalRenewMoneyChange(value) {
        if (value === '') {
            this.setState({
                batchotherRenewMoney: true
            })
        } else {
            this.setState({
                batchotherRenewMoney: false,
                batchList: {
                    ...this.state.batchList,
                    renewMoney: value
                }
            })
        }
    }
    batchoRenewMoneyChange(value) {
        this.setState({
            batchoRenewMoney: value,
            batchList: {
                ...this.state.batchList,
                renewMoney: value
            }
        })
    }
    batchdivideTypeChange(e) {
        var w = this;
        var dividePercent = this.state.batchfencheng;
        var divideMoney = this.state.batchjine;
        if (e.target.value == 'AMOUNT_DIV') {
            this.setState({
                batchdividMoneyFlag: false,
                batchdividePercentFlag: true,
                batchList: {
                    ...this.state.batchList,
                    dividePercent: '',
                    divideMoney: divideMoney,
                    divideType: e.target.value
                },
                batchvalue: e.target.value
            })
        } else if (e.target.value == 'PERCENT_DIV') {
            this.setState({
                batchdividMoneyFlag: true,
                batchdividePercentFlag: false,
                batchList: {
                    ...this.state.batchList,
                    divideMoney: '',
                    dividePercent: dividePercent,
                    divideType: e.target.value
                },
                batchvalue: e.target.value
            })
        } else {
            message.error('请选择合伙人分成类型');
        }
    }
    batchmodalDividMoneyChange(value) {
        if (value === '') {
            this.setState({
                batchodividMoneyFlag: true
            })
        } else {
            this.setState({
                batchodividMoneyFlag: false,
                batchList: {
                    ...this.state.batchList,
                    divideMoney: value
                },
                jine: value
            })
        }
    }
    batchmoreDividMoneyChange(value) {
        this.setState({
            batchmoreDividMoney: value,
            batchList: {
                ...this.state.batchList,
                divideMoney: value
            }
        })
    }
    batchmodalDividePercentChange(value) {
        if (value === '') {
            this.setState({
                batchodividePercentFlag: true,
                batchList: {
                    ...this.state.batchList,
                    dividePercent: 1
                },
            })
        } else {
            this.setState({
                batchodividePercentFlag: false,
                batchList: {
                    ...this.state.batchList,
                    dividePercent: value
                },
                fencheng: value
            })
        }
    }
    batchmoreDividePercentChange(value) {
        this.setState({
            batchmoreDividePercent: value,
            batchList: {
                ...this.state.batchList,
                dividePercent: value / 100
            }
        })
    }
    batchhandleOk = (e) => {
        if (this.state.batchList.renewMoney == '') {
            message.warning('续费金额不能为空')
        } else if (this.state.batchList.renewMoney<0) {
            message.warning('续费金额不能为负数')
        } else if (this.state.batchList.divideType == '' || this.state.batchList.divideType == null) {
            message.warning('请选择分成类型')
        } else if (this.state.batchList.divideType == 'AMOUNT_DIV' && (this.state.batchList.divideMoney == '' || this.state.batchList.divideMoney == null)) {
            message.warning('分成金额不能为空')
        } else if (this.state.batchList.divideType == 'AMOUNT_DIV' && (this.state.batchList.divideMoney<0)) {
            message.warning('分成金额不可为负数')
        } 
        // else if (this.state.batchList.divideType == 'PERCENT_DIV' && (this.state.batchList.dividePercent == '' || this.state.batchList.dividePercent == null)) {
        //     message.warning('分成比例不能为空')
        // } 
        else {
            this.updateFn(this.state.batchList);
            this.setState({
                batchVisible: false,
                selectedRowKeys: []
            })
        }
        // this.setState({
        //     visible: false,
        // });
    }
    setType(value) {
        this.setState({
            list: {
                ...this.state.list,
                searchType: value
            }
        })
    }

    render() {
        var w = this;
        var allSubmitData = [];
        const columns = [
            {
                title: 'SN码',
                dataIndex: 'deviceNo',
                width: 250
            }, {
                title: '所属幼儿园',
                dataIndex: 'kindergartenTruename',
                width: 100
            }, {
                title: '续费金额',
                dataIndex: 'renewMoney',
                width: 250,
                sorter: (a, b) => a.renewMoney - b.renewMoney
            }, {
                title: '分成',
                dataIndex: 'divideType',
                width: 100
            }, {
                title: '激活时间',
                dataIndex: 'activeTime',
                width: 200,
                sorter: (a, b) => a.activeTime - b.activeTime
            },
            {
                title: '失效时间',
                dataIndex: 'expireTime',
                width: 200,
                sorter: (a, b) => a.expireTime - b.expireTime
            },
            {
                title: '设备状态',
                dataIndex: 'status',
                width: 200
            },
            {
                title: '操作',
                dataIndex: 'looklook',
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={() => w.showModal(record)} className="i-action-ico i-edit"></a>
                        </div>
                    )
                },
                width: 150
            },
        ];
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections:true,
            onSelection: this.onSelection,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="g-library">
                <p className="m-head">
                    <Link to="/firstPartner">
                        <Icon type="left" /> 动画图书馆设备
                    </Link>
                </p>
                <div className="m-library-bd">
                    <Row className="m-select">
                        <div className="m-inSel">
                            <Select defaultValue="deviceNo" style={{ width: 170 }}  onChange={(value) => { this.setType(value) }}>
                                <Option value="name">幼儿园名称</Option>
                                <Option value="deviceNo">设备SN码</Option>
                            </Select>
                        </div>
                        <div className="m-inSel">
                            {/*<Input  addonAfter={<Icon type="search" />} className="" placeholder="输入检索内容"/>*/}
                            <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={(value) => { this.searchContent("searchContent", value) }} />
                        </div>
                        <Button style={{ marginLeft: '64px' }} className="u-btn inline-block" onClick={() => { this.toggle() }}>更多条件<Icon type={this.state.expand ? 'up' : 'down'} /></Button>
                    </Row>
                    <div className="m-expand-box" style={{ display: this.state.expand ? 'block' : 'none' }}>
                        <div className="u-select"><span className="u-txt">续费金额</span><Select defaultValue={null} style={{ width: 170 }} onChange={(value) => this.renewMoneyChange(value)}>
                            <Option value={null}>全部</Option>
                            <Option value='880'>880</Option>
                            <Option value='1280'>1280</Option>
                            <Option value='1980'>1980</Option>
                            {/* {
                                this.state.renewMoney.map(item => {
                                    return <Option value={item}>{item}</Option>
                                })
                            } */}
                        </Select></div>
                        <div className="u-select"><span className="u-txt">分成金额</span><Select defaultValue={null} style={{ width: 170 }} onChange={(value) => this.divideMoneyChange(value)}>
                            <Option value={null}>全部</Option>
                            <Option value='440'>440</Option>
                            <Option value='840'>840</Option>
                            <Option value='1540'>1540</Option>
                            {/* {
                                this.state.divideMoney.map(item => {
                                    return <Option value={item}>{item}</Option>
                                })
                            } */}
                        </Select></div>
                        <div className="u-select"><span className="u-txt">分成比例</span><Select defaultValue={null} style={{ width: 170 }} onChange={(value) => this.dividePercentChange(value)}>
                            <Option value={null}>全部</Option>
                            {/* {
                                this.state.dividePercent.map(item => {
                                    return <Option value={item}>{item}</Option>
                                })
                            } */}
                            <Option value='0.1'>10%</Option>
                            <Option value='0.2'>20%</Option>
                            <Option value='0.3'>30%</Option>
                            <Option value='0.4'>40%</Option>
                            <Option value='0.5'>50%</Option>
                            <Option value='0.6'>60%</Option>
                            <Option value='0.7'>70%</Option>
                            <Option value='0.8'>80%</Option>
                            <Option value='0.9'>90%</Option>
                            <Option value='1'>100%</Option>
                        </Select></div>
                        <div className="u-select"><span className="u-txt">设备状态</span><Select defaultValue={null} style={{ width: 170 }} onChange={(value) => this.statusChange(value)}>
                            <Option value={null}>全部</Option>
                            <Option value='已激活'>已激活</Option>
                            <Option value='未激活'>未激活</Option>
                            <Option value='已失效'>已失效</Option>
                        </Select></div>
                        <div className="m-calendar"><span className="u-txt">激活时间</span>
                            <DatePicker
                                format="YYYY-MM-DD hh:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => this.activeStartTimeChange(value, dateString, "startTime")}
                                onOk={onOk}
                            /><i>—</i><DatePicker
                                format="YYYY-MM-DD hh:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => this.activeEndTimeChange(value, dateString, "endTime")}
                                onOk={onOk}
                            /></div>
                        <div className="m-calendar"><span className="u-txt">失效时间</span>
                            <DatePicker
                                format="YYYY-MM-DD hh:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => this.expireStartTimeChange(value, dateString, "startTime")}
                                onOk={onOk}
                            /><i>—</i><DatePicker
                                format="YYYY-MM-DD hh:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => this.expireEndTimeChange(value, dateString, "endTime")}
                                onOk={onOk}
                            /></div>
                        <div className="u-select"><Button className="u-btn block" onClick={this.query.bind(this)}>查询</Button></div>
                    </div>
                </div>
                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <Table rowSelection={rowSelection} className="m-library-table t-nm-tab show-select" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: (this.state.pageLength > 13) ? '640' : 0 }} />
                </Spin>
                <div className="m-pagination-box">
                    {/* <div>
                        <Checkbox className="checkall" onChange={(e) => { this.checkAll(e.target.checked, allSubmitData) }} checked={this.state.checkedItem.indexOf(false) == -1 ? true : false}>全选</Checkbox>
                    </div> */}
                    <Button type="primary" className="u-share" onClick={() => w.batchshowModal()}>批量修改</Button>
                    <Pagination pageSizeOptions={['20', '50', '100', '200', '500', '1000']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                </div>

                <Modal
                    visible={this.state.visible}
                    title='修改续费和分成'
                    onCancel={this.hideModal}
                    width={800}
                    className="detail-modal"
                    onOk={this.handleOk}
                >
                    <Row className="m-input">
                        <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">动画图书馆续费金额</span></Col>
                        <Col span={6}>
                            <Select defaultValue={this.state.modalList.renewMoney} style={{ width: 170 }} onChange={(value) => this.modalRenewMoneyChange(value)}>
                                <Option value="880">880</Option>
                                <Option value="1280">1280</Option>
                                <Option value="1980">1980</Option>
                                <Option value="">其他金额</Option>
                                {/* {
                                    this.state.renewMoney.map(item => {
                                        return <Option value={item}>{item}</Option>
                                    })
                                } */}
                            </Select>
                        </Col>
                        {this.state.otherRenewMoney == true ? <Col span={5}>{<Input value={this.state.oRenewMoney} onChange={(e) => this.oRenewMoneyChange(e.target.value)} style={{ width: 170 }} />}</Col> : null}
                    </Row>
                    <Row className="m-input">
                        <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">合伙人分成</span></Col>
                        <Col span={5}>
                            <RadioGroup onChange={(e) => this.divideTypeChange(e)} value={this.state.value}>
                                <Radio value="AMOUNT_DIV"></Radio>
                                分成金额
                                <Select disabled={this.state.dividMoneyFlag} defaultValue="" onChange={(value) => this.modalDividMoneyChange(value)} style={{ width: 100, marginLeft: 20 }}>
                                    {/* {
                                        this.state.divideMoney.map(item => {
                                            return <Option value={item}>{item}</Option>
                                        })
                                    } */}
                                    <Option value="440">440</Option>
                                    <Option value="840">840</Option>
                                    <Option value="1540">1540</Option>
                                    <Option value="">其他金额</Option>
                                </Select>
                                {this.state.odividMoneyFlag == true ? <InputNumber disabled={this.state.dividMoneyFlag} defaultValue={this.state.moreDividMoney} onChange={(value) => this.moreDividMoneyChange(value)} style={{ width: 170, marginLeft: 100 }} /> : null}
                                <br />
                                <Radio value="PERCENT_DIV"></Radio>
                                分成比例
                                <Select disabled={this.state.dividePercentFlag} defaultValue="" onChange={(value) => this.modalDividePercentChange(value)} style={{ width: 100, marginLeft: 20 }}>
                                    {/* {
                                        this.state.dividePercent.map(item => {
                                            return <Option value={item}>{item}</Option>
                                        })
                                    } */}
                                    <Option value="0">0%</Option>
                                    <Option value="0.1">10%</Option>
                                    <Option value="0.2">20%</Option>
                                    <Option value="0.3">30%</Option>
                                    <Option value="0.4">40%</Option>
                                    <Option value="0.5">50%</Option>
                                    <Option value="0.6">60%</Option>
                                    <Option value="0.7">70%</Option>
                                    <Option value="0.8">80%</Option>
                                    <Option value="0.9">90%</Option>
                                    <Option value="1">100%</Option>
                                    <Option value="">其他比例</Option>
                                </Select>
                                {this.state.odividePercentFlag == true ? <InputNumber min={0}
                                    max={100}
                                    disabled={this.state.dividePercentFlag}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    defaultValue={100}
                                    onChange={(value) => this.moreDividePercentChange(value)}
                                    style={{ width: 170, marginLeft: 100 }} /> : null}
                            </RadioGroup>
                        </Col>
                    </Row>
                </Modal>

                <Modal
                    visible={this.state.batchVisible}
                    title='修改续费和分成'
                    onCancel={this.batchhideModal}
                    width={800}
                    className="detail-modal"
                    onOk={this.batchhandleOk}
                >
                    <Row className="m-input">
                        <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">动画图书馆续费金额</span></Col>
                        <Col span={6}>
                            <Select defaultValue={this.state.batchList.renewMoney} style={{ width: 170 }} onChange={(value) => this.batchmodalRenewMoneyChange(value)}>
                                <Option value="880">880</Option>
                                <Option value="1280">1280</Option>
                                <Option value="1980">1980</Option>
                                <Option value="">其他金额</Option>
                                {/* {
                                    this.state.renewMoney.map(item => {
                                        return <Option value={item}>{item}</Option>
                                    })
                                } */}
                            </Select>
                        </Col>
                        {this.state.batchotherRenewMoney == true ? <Col span={5}>{<Input value={this.state.batchoRenewMoney} onChange={(e) => this.batchoRenewMoneyChange(e.target.value)} style={{ width: 170 }} />}</Col> : null}
                    </Row>
                    <Row className="m-input">
                        <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">合伙人分成</span></Col>
                        <Col span={5}>
                            <RadioGroup onChange={(e) => this.batchdivideTypeChange(e)} value={this.state.batchvalue}>
                                <Radio value="AMOUNT_DIV"></Radio>
                                分成金额
                                <Select disabled={this.state.batchdividMoneyFlag} defaultValue="" onChange={(value) => this.batchmodalDividMoneyChange(value)} style={{ width: 100, marginLeft: 20 }}>
                                    {/* {
                                        this.state.divideMoney.map(item => {
                                            return <Option value={item}>{item}</Option>
                                        })
                                    } */}
                                    <Option value="440">440</Option>
                                    <Option value="840">840</Option>
                                    <Option value="1540">1540</Option>
                                    <Option value="">其他金额</Option>
                                </Select>
                                {this.state.batchodividMoneyFlag == true ? <InputNumber disabled={this.state.batchdividMoneyFlag} defaultValue={this.state.batchmoreDividMoney} onChange={(value) => this.batchmoreDividMoneyChange(value)} style={{ width: 170, marginLeft: 100 }} /> : null}
                                <br />
                                <Radio value="PERCENT_DIV"></Radio>
                                分成比例
                                <Select disabled={this.state.batchdividePercentFlag} defaultValue="" onChange={(value) => this.batchmodalDividePercentChange(value)} style={{ width: 100, marginLeft: 20 }}>
                                    {/* {
                                        this.state.dividePercent.map(item => {
                                            return <Option value={item}>{item}</Option>
                                        })
                                    } */}
                                    <Option value="0">0%</Option>
                                    <Option value="0.1">10%</Option>
                                    <Option value="0.2">20%</Option>
                                    <Option value="0.3">30%</Option>
                                    <Option value="0.4">40%</Option>
                                    <Option value="0.5">50%</Option>
                                    <Option value="0.6">60%</Option>
                                    <Option value="0.7">70%</Option>
                                    <Option value="0.8">80%</Option>
                                    <Option value="0.9">90%</Option>
                                    <Option value="1">100%</Option>
                                    <Option value="">其他比例</Option>
                                </Select>
                                {this.state.batchodividePercentFlag == true ? <InputNumber min={0}
                                    max={100}
                                    disabled={this.state.batchdividePercentFlag}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    defaultValue={100}
                                    onChange={(value) => this.batchmoreDividePercentChange(value)}
                                    style={{ width: 170, marginLeft: 100 }} /> : null}
                            </RadioGroup>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}