import React from 'react'
import { Button,Table, Icon, Spin, Pagination,Popover   } from 'antd'
import { Link} from 'react-router';
import './orderList.css';

export default class OrderTable extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        const style = {marginRight:'10px'};
        const columns = [
        	{
                
                title: '用户ID',
                dataIndex: 'uid',
                width:'8%',
                render(text, record) {
                	
                    return(
                    	<Popover content={(<span>{record.uid}</span>)}>
                        	<Link to={"/userList?uid="+record.uid+""} className="shennue" target="_blank">{record.uid}</Link>
                        </Popover>
                    )
                }
                
            },

            {
                title: '订单编号',
                dataIndex: 'orderNo',
                width: '8%',
                render(text, record) {
	                return(
	                	
	                    <Popover content={(<span>{record.orderNo}</span>)}>
	                    	<span className="shennue">{record.orderNo}</span>
	                    </Popover>
	                   
	                )
	            }
            },
            {
                title: '用户账号',
                dataIndex: 'username',
                width: '8%'
            },
            {
                title: '商品类型',
                dataIndex: 'goodsType',
                width: '7%'
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                width: '8%'
            },
            {
                title: '订单金额',
                dataIndex: 'orderAmount',
                width: '6%'
            },
            {
                title: '实付金额',
                dataIndex: 'payAmount',
                width:'6%'
            },
            {
                title: '渠道',
                dataIndex: 'channelName',
                width: '6%'
            },
            {
                title: '支付方式',
                dataIndex: 'orderPayType',
                width: '8%'
            },
            {
                title: '购买类型',
                dataIndex: 'buyType',
                width: '8%'
            },
            // {
            //     title: '生成日期',
            //     dataIndex: 'createTime',
            //     width: 120
            // },
            {

                title: '生成日期',
                dataIndex: 'createTime',
                width: '8%'
            }, {

                title: '完成日期',
                dataIndex: 'finishedTime',
                width: '8%'
            }, {
                title: '订单状态',
                dataIndex: 'orderStatus',
                width: '11%',
                render(text, record) {
                    return(
                        <div data-page="orderDetails">
                            <span style={style}>{record.orderStatus}</span>
                            <Link to={"/orderDetails?orderNo="+record.orderNo+""}>
                                查看详情
                            </Link>
                        </div>
                    )
                }
            }];
        return (
            <Table className="m-table orderListTable" columns={columns} dataSource={this.props.tdata} bordered pagination={false} scroll={{y: (this.props.pageLength>10)?'600':0 }} />
        )
    }
}
