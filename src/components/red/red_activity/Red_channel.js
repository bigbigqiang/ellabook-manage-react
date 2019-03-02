import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Spin, Popover } from "antd";
import { Link } from 'react-router';
import getUrl from "../../util.js";
import "./common.css";
export default class addGoods extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data1: "",
      listLength: 0,
      loading: false
    }
  }
  componentDidMount() {
  }

  render() {
    //////////////样式///////////////////	
    const columnsChannel = [
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: '10%',
        className: "td_hide",
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
      }, {
        title: 'code码',
        dataIndex: 'activityCode',
        key: 'activityCode',
        width: '20%',
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
      }, {
        title: '渠道',
        dataIndex: 'channelCode',
        key: 'channelCode',
        className: "td_hide",
        width: '20%',
        render: (text, record) => {
          if (text) {
            let resultText = [];
            let arr = text.split(',');
            arr.map((elm) => {
              let channe = this.props.channelList.filter(item => item.code === elm)[0];
              if (channe) {
                resultText.push(channe.name)
              }
            })
            return <Popover
              placement="top"
              title={null}
              content={
                resultText.join('/')
              }
            >
              <span>{resultText.join('/')}</span>
            </Popover>
          } else {
            return '-'
          }
        }
      }, {
        title: '红包金额',
        dataIndex: 'couponAmount',
        key: 'couponAmount',
        width: '6%',
      }, {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: '10%'
      }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: '10%'
      }, {
        title: '送达人数',
        dataIndex: 'joinAmount',
        key: 'joinAmount',
        width: '6%'
      }, {
        title: '已使用',
        dataIndex: 'usedAmount',
        key: 'usedAmount',
        width: '6%'
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '6%'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '6%',
        render: (text, record, index) => <Link target="_blank" onClick={() => { this.props.isUPDAT() }} to={getUrl.operationTypeCheck("UPDAT") ? `red/redactivity/addRedActivity/CHANNEL/${record.activityCode}` : `red`}><i className="i-action-ico i-edit" type="edit" /></Link>
      }
    ];
    const data = getUrl.operationTypeCheck("UPDAT") ? this.props.data : [];
    //分页器
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 20,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showTotal: () => { return `共 ${data.length} 条` }
    }
    return <div className="red">
      <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
        <Table rowKey={(record, index) => index} columns={columnsChannel} dataSource={data} scroll={{ y: 522 }} pagination={pagination} />
      </Spin>
    </div>
  }
}