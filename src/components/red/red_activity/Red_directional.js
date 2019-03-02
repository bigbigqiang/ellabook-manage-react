import React from 'react';
import { Table, Spin, Popover } from "antd";
import { Link } from 'react-router';
import getUrl from "../../util.js";
import "./common.css";
export default class addGoods extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data1: [],
      listLength: 0,
      loading: false
    }
  }
  componentDidMount() {
  }

  render() {
    //////////////样式///////////////////	
    const columnsDirectional = [
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 100,
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
      }, {
        title: '红包金额',
        dataIndex: 'couponAmount',
        key: 'couponAmount',
        width: 100
      }, {
        title: '送达人数',
        dataIndex: 'joinAmount',
        key: 'joinAmount',
        width: 100,
      }, {
        title: '已使用',
        dataIndex: 'usedAmount',
        key: 'usedAmount',
        width: 100
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        render: (text, record, index) => <Link target="_blank" onClick={() => { this.props.isUPDAT() }} to={getUrl.operationTypeCheck("UPDAT") ? `red/redactivity/addRedActivity/DIRECTIONAL/${record.activityCode}` : `red`}><i className="i-action-ico i-edit" type="edit" /></Link>
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
        <Table columns={columnsDirectional} dataSource={data} rowKey={(record, index) => index} scroll={{ y: 522 }} pagination={pagination} />
      </Spin>
    </div>
  }
}