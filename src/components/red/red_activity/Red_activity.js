import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, message, Spin, Popover, Input, Select } from "antd";
import { Link } from 'react-router';
import getUrl from "../../util.js";
import commonData from '../../commonData.js';
import "./common.css";
import Reddir from "./Red_directional.js"
import Redcha from "./Red_channel.js"
import Redpay from "./Red_pay.js"
import Redreg from "./Red_register.js"
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;
export default class addGoods extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data1: [],    //红包活动数据
      listLength: 0,//总共多少条数据
      loading: false,
      searchContent: '',
      activityType: '1',
      searchType: 'ACTIVITY_NAME',
      channelList:[]
    }
  }
  componentDidMount() {
    this.getInitialData();
    this.fetchdata('1', '');
  }
  getInitialData() {
    getUrl.API({}, 'ella.operation.coupon.selectChannelList').then(res => res.json()).then((data) => {
      if (data.status == '1') {
        this.setState({
          channelList: data.data
        })
      } else {
        message.error(data.message)
      }
    }).catch(e => {
      console.log(e.message)
    })
  }
  //搜索框
  bannerSearch(value) {
    this.setState({
      searchContent: value
    })
    this.listFetchFn(this.state.activityType, value);
  }
  async fetchdata(activityType, searchContent) {
    this.setState({
      loading: true
    })
    var doc = {
      searchType: this.state.searchType,
      searchContent: searchContent,
      pageIndex: 1,
      pageSize: 1000
    }
    if (activityType == '1') {
      var _url = "ella.operation.coupon.selectH5CouponActivity";
    } else if (activityType == '2') {
      var _url = "ella.operation.coupon.selectDirectionalCouponActivity"
    } else if (activityType == '3') {
      var _url = "ella.operation.coupon.selectChannelCouponActivity"
    } else if (activityType == '4') {
      var _url = "ella.operation.coupon.selectRechargeCouponActivity"
    } else if (activityType == '5') {
      var _url = "ella.operation.coupon.selectRegisterCouponActivity"
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=" + _url + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json())
    var resultData = data.data.couponActivityList.map(item => {
      var status = ""
      if (item.status == "WAITING") {
        status = "未开始"
      } else if (item.status == "START") {
        status = "进行中"
      } else if (item.status == "FINISHED") {
        status = "已发送"
      } else if (item.status == "EXPIRED") {
        status = "已过期"
      } else if (item.status == "STOP") {
        status = "禁用"
      } else if (item.status == "FAIL") {
        status = "失败"
      } else if (item.status == "DELIVERED") {
        status = "发送成功"
      }
      return {
        ...item,
        status
      }
    })
    this.setState({
      data1: resultData,
      listLength: resultData.length,
      loading: false
    })
  }
  callback(key) {
    console.log(key);
  }
  // 判断有没有权限
  isUPDAT() {
    if (!getUrl.operationTypeCheck("UPDAT")) {
      message.error("抱歉没有权限,请联系管理员或者切换账号");
    }
  }
  //搜索框
  bannerSearch(value) {
    this.setState({
      searchContent: value
    })

    this.fetchdata(this.state.activityType, value);
  }
  changeTabs = (activeKey) => {
    this.fetchdata(activeKey, this.state.searchContent)
    this.setState({
      activityType: activeKey
    });
  }
  render() {
    //////////////样式///////////////////	
    const title = {
      padding: "10px 0px",
      borderBottom: "1px solid #e3e6e6",
      textIndent: "20px",
      fontSize: "16px",
      marginBottom: "0px"
    }
    const box = {
      padding: "20px"
    }
    const table_box = {
      margin: "0px 0px 0px 0px"
    }
    //////////////样式///////////////////	
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 100,
        className: "red_4 td_hide",
        render: (text, record) => {
          return (
            <Popover
              placement="top"
              title={null}
              content={
                record.activityName
              }
            >
              <span>{record.activityName}</span>
            </Popover>
          )
        }
      },
      {
        title: 'code码',
        dataIndex: 'activityCode',
        key: 'activityCode',
        width: 200,
        className: "td_hide",
        render: (text, record) => {
          return (
            <Popover
              placement="top"
              title={null}
              content={
                record.activityCode
              }
            >
              <span>{record.activityCode}</span>
            </Popover>
          )
        }
      },
      {
        title: '红包金额',
        dataIndex: 'couponAmount',
        key: 'couponAmount',
        width: 80,
        className: "red_4"
      }, {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 150,
      }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 150
      }, {
        title: '用户数量',
        dataIndex: 'activityAmount',
        key: 'activityAmount',
        width: 100,
        className: "red_4",
        render: (text, record) => {
          if (record.whetherLimit === 'NO') {
            return '不限量'
          } else {
            return record.activityAmount
          }
        }
      }, {
        title: '领取人数',
        dataIndex: 'joinAmount',
        key: 'joinAmount',
        width: 100,
        className: "red_4"
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        className: "red_4"
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        className: "red_4",
        render: (text, record, index) => <Link target="_blank" onClick={() => { this.isUPDAT() }} to={getUrl.operationTypeCheck("UPDAT") ? `red/redactivity/addRedActivity/H5/${record.activityCode}` : `red`}><i className="i-action-ico i-edit" type="edit" /></Link>
      }
    ];
    //分页器
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 20,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showTotal: () => { return `共 ${this.state.listLength} 条` }
    }
    console.log(123569874)
      const data = getUrl.operationTypeCheck("UPDAT") ? this.state.data1 : [];
      console.log(data)
    return <div className="red" style={{"paddingLeft":"20px"}}>
      <p style={title}>红包活动</p>
      <div style={box}>
        <Button disabled={!getUrl.operationTypeCheck("CREATE")} className="button intervalRight" type="primary"><Link to="/red/redactivity/addRedActivity"><Icon style={{ paddingRight: "5px" }} type="plus" />添加红包活动</Link></Button>
        <Select value={this.state.searchType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => { this.setState({searchType: value})}}>
          <Option value='ACTIVITY_NAME'>活动名称</Option>
          <Option value='ACTIVITY_CODE'>code码</Option>
        </Select>
        <Search placeholder="搜索" enterButton className="searchWidth" onSearch={value => this.bannerSearch(value)} />
        <div style={table_box}>
          <Tabs defaultActiveKey="1" onChange={this.changeTabs}>
            <TabPane tab="红包活动" key="1">
              <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                <Table columns={columns} rowKey={(record, index) => index} dataSource={data} scroll={{ y: data.length <= 10 ? 0 : 550 }} pagination={pagination} />
              </Spin>
            </TabPane>
            <TabPane tab="定向红包" key="2">
              <Reddir isUPDAT={this.isUPDAT.bind(this)} data={data}></Reddir>
            </TabPane>
            <TabPane tab="渠道红包" key="3">
              <Redcha isUPDAT={this.isUPDAT.bind(this)} data={data} channelList={this.state.channelList}></Redcha>
            </TabPane>
            <TabPane tab="充值红包" key="4">
              <Redpay isUPDAT={this.isUPDAT.bind(this)} data={data}></Redpay>
            </TabPane>
            <TabPane tab="注册红包" key="5">
              <Redreg isUPDAT={this.isUPDAT.bind(this)} data={data}></Redreg>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  }
}