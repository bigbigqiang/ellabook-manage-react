import React from 'react';
import { Table, Icon } from 'antd';


const columns = [{
  title: '操作日期',
  dataIndex: 'operationData',
  key: 'operationData',
  render: text => <a href="#">{text}</a>,
}, {
  title: '操作内容',
  dataIndex: 'operationContent',
  key: 'operationContent',
}, {
  title: '操作人',
  dataIndex: 'operationPerson',
  key: 'operationPerson',
}];

const data = [{
  key: '1',
  operationData: '2017年08月21日16:09:43',
  operationContent: "审核申请:通过",
  operationPerson: '来洪波',
}];
export default class OprtrationRec extends React.Component {

	constructor(){
		super()
		this.state={
			data : [
				{
  					key: '1',
  					operationData: '2017年08月21日16:09:43',
  					operationContent: "审核申请:通过",
  					operationPerson: '来洪波',
				}
			]
		}
	}
	render(){
		return <div>
			<Table columns={columns} dataSource={this.state.data} />
		</div>
	}
}