import React from 'react';
import {Icon,Table,Tabs,message,Spin} from "antd";
import { Link} from 'react-router';
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
const TabPane = Tabs.TabPane;

export default class addGoods extends React.Component {
	constructor(){
		super()
		this.state={
			androidData : [],
            iosData : [],
            loading:false
		}
	}
  componentDidMount(){
    this.fetchdata()
  }
  async fetchdata(){
    this.setState({
      loading:true
    })
    var doc1 = {
      appModel : "IOS"
    }
    var doc2 = {
      appModel : "ANDROID"
    }
    var iosData = await fetch(getUrl.url,{
        mode : "cors",
        method : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:"method=ella.operation.getVipCardConfigList"+"&content="+JSON.stringify(doc1)+dataString
    }).then(res => res.json())
    var androidData = await fetch(getUrl.url,{
        mode : "cors",
        method : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:"method=ella.operation.getVipCardConfigList"+"&content="+JSON.stringify(doc2)+dataString
    }).then(res => res.json())
    this.setState({
      iosData : getData(iosData.data),
      androidData : getData(androidData.data),
      loading:false
    })

    //此函数用来修改后台传来的数据变为可以展示的数据
    function getData(data){
      var result = data.map(item => {
        var type = "变异类型(后台新加类型了)";
        var channel = "变异类型(后台新加类型了)";
        var T =item.updateTime||"后台无数据";
        switch(item.type){
          case "CARD_WEEK":
            type = "咿啦会员周卡";
            break;
          case "CARD_MONTH":
            type = "咿啦会员月卡";
            break;
          case "CARD_YEAR":
            type = "咿啦会员年卡";
            break;
        }
        switch(item.appModel){
          case "IOS":
            channel = "苹果";
            break;
          case "ANDROID":
            channel = "安卓";
            break;
        }

        return {
          ...item,
          type,
          channel,
          T
        }
      })
      return result;
    }
  }
  //判断有没有权限
  isUPDAT(){
    if(!getUrl.operationTypeCheck("UPDAT")){
      message.error("抱歉没有权限,请联系管理员或者切换账号");
    }
  }
	render(){
	//////////////样式///////////////////	
        const title = {
            padding: "10px 0px",
            // lineHeight: "50px",
            borderBottom: "1px solid #e3e6e6",
            textIndent: "16px",
            fontSize: "16px",
            marginBottom:"0px"
        }
        const back = {
            paddingRight : "8px"
        }
        const box = {
          padding : "0px 20px 20px 20px"
        }
        const table_box = {
          margin : "0px 0px 0px 0px"
        }
	//////////////样式///////////////////	
        const columns = [
            {
              title: '渠道',
              dataIndex: 'channel',
              key: 'channel',
              width: 150,
            }, {
              title: '会员类型',
              dataIndex: 'type',
              key: 'type',
              width: 150,
            }, {
              title: '修改时间',
              dataIndex: 'T',
              key: 'T',
              width : 150
            },{
              title: '操作',
              dataIndex: 'operation',
              width: 50,
              render: (text, record, index) => <Link target="_blank" onClick={()=>{this.isUPDAT()}} to={getUrl.operationTypeCheck("UPDAT")?`/filetext/addFiletext/${record.cardCode}`:`/filetext`}><i className="i-action-ico i-edit" type="edit" /></Link>
            }
        ];
        const androidData = getUrl.operationTypeCheck("UPDAT")?this.state.androidData:[];   //安卓初始数据
        const iosData = getUrl.operationTypeCheck("UPDAT")?this.state.iosData:[];           //苹果初始数据
        //分页器
        const pagination={
          showSizeChanger : true,
          showQuickJumper : true,
          pageSizeOptions : ['20', '40', '60', '80', '100']
        }
		return <div className="filetext">
			<p style={title}>文案列表</p>
        	<div style={box}>
        		<Tabs defaultActiveKey="1">
				      <TabPane tab={<span><Icon type="apple" />苹果</span>} key="1">
				        	<div style={table_box}>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                                    <Table columns={columns} dataSource={iosData} scroll={{y: 522 }} pagination={pagination}/>
                                </Spin>
        	   			</div>
				      </TabPane>
				      <TabPane tab={<span><Icon type="android" />安卓</span>} key="2">
				        	<div style={table_box}>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                                    <Table columns={columns} dataSource={androidData} scroll={{y: 522 }} pagination={pagination}/>
                                </Spin>
        	   			</div>
				      </TabPane>
				    </Tabs>
        	  
        	</div>
		</div>
	}
}