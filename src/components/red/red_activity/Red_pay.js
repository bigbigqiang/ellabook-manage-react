import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, Spin, Popover } from "antd";
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
    const columnsPay = [
      {
        title: '渠道',
        dataIndex: 'appModel',
        key: 'appModel',
        width: 100
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 100,
        className: "td_hide",
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
        title: '咿啦币数量',
        dataIndex: 'coinAmount',
        key: 'coinAmount',
        width: 150,
      }, {
        title: '赠送红包',
        dataIndex: 'couponAmount',
        key: 'couponAmount',
        width: 100
      }, {
        title: '关联商品',
        dataIndex: 'coin',
        key: 'coin',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        render: (text, record, index) => <Link target="_blank" onClick={() => { this.props.isUPDAT() }} to={getUrl.operationTypeCheck("UPDAT") ? `red/redactivity/addRedActivity/RECHARGE/${record.activityCode}` : `red`}><i className="i-action-ico i-edit" type="edit" /></Link>
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
        <Table columns={columnsPay} rowKey={(record, index) => index} dataSource={data} scroll={{ y: 522 }} pagination={pagination} />
      </Spin>
    </div>
  }
}