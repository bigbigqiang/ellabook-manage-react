import React from 'react';
import { Row, Col, Card, Icon, Button, Checkbox, Table, Select, Popconfirm, Popover, notification, message, Input, Modal, Spin, Pagination} from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js'
import "./common.css";
import "../../main.css";
import copy from "copy-to-clipboard";
const Search = Input.Search;
export default class addGoods extends React.Component {

  constructor() {
    super()
    this.state = {
      dataList: [],
      publishFlag: null,
      visible: false,
      titleCode: "",           //今日后台要的码
      titleCode2: "",          //明日后台要的码
      showType: "SHOW_WAIT",   //今日
      specialTitle: "标题",    //今日
      jumpWord: "跳转文字",    //明日
      specialTitle2: "标题",   //明日
      jumpWord2: "跳转文字",   //明日
      partCode: "",
      listLength: 0,         //总共多少条数据
      loading: false,
      pageMax: 10,
      page: '0',
      pageSize: '20',
      current: 1,
      dailyTitle: '',
      total: '',
      selectData:[]
    }
    this.pageChangeFun = this.pageChangeFun.bind(this);
    this.pageSizeFun = this.pageSizeFun.bind(this);
  }
  componentDidMount() {
    this.fetchdata(this.state.dailyTitle, this.state.publishFlag, this.state.page, this.state.pageSize);
    // this.fetchword("DAILY_BOOK");
    //新版获取标题跳转文字
    this.fetchWord();
    this.fetchSelectData();
  }
  pageSizeFun(current, pageSize) {

    this.setState({
      pageSize: pageSize,
      page: current - 1,
      current: current
    }, () => {
      this.fetchdata(this.state.dailyTitle, this.state.publishFlag, this.state.page, this.state.pageSize);
    });
  }
  pageChangeFun(pageNum) {

    this.setState({
      page: pageNum - 1,
      current: pageNum

    }, () => {
      this.fetchdata(this.state.dailyTitle, this.state.publishFlag, this.state.page, this.state.pageSize);
    });
  }
  dailySearch(value) {
    this.setState({
      dailyTitle: value
    })
    this.fetchdata(value, this.state.publishFlag, 0, this.state.pageSize);
  }
  async fetchdata(dailyTitle, showStatus, page, pageSize) {
    this.setState({
      loading: true
    })
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.listDailyBook" + "&content=" + JSON.stringify({ "dailyTitle": dailyTitle, "publishFlag": showStatus, "pageVo": { "page": page, "pageSize": pageSize } }) + commonData.dataString
    }).then(res => res.json())
    var dataList = data.data.list.map((item, index) => {
      if (item.publishFlag == "PUSH_NO") return { ...item, publishFlag: "未推送" };
      if (item.publishFlag == "PUSH_YES") return { ...item, publishFlag: "已推送" };
      if (item.publishFlag == "PUBLISH_YES") return { ...item, publishFlag: "已发布" };
      if (item.publishFlag == "OFF_LINE") return { ...item, publishFlag: "已下线" };
      return { ...item, publishFlag: "未知状态" };
    })
    this.setState({
      dataList: dataList,
      listLength: dataList.length,
      loading: false,
      total: data.data.total,
      pageMax: data.data.total,
      pageLength: data.data.list.length,
      current:data.data.currentPage

    })
  }
  /////////////////////////////////////获取默认标题字段//////////////////////////////////////
  async fetchword(partStyle) {
    var doc = {
      page: 0,
      pageSize: 1,
      partStyle
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.getOperationPartList" + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json())
    this.setState({
      specialTitle: data.data.partList[0].partTitle,
      jumpWord: data.data.partList[0].targetDesc,
      tem_specialTitle: data.data.partList[0].partTitle,
      tem_jumpWord: data.data.partList[0].targetDesc,
      partCode: data.data.partList[0].partCode
    })
  }
  async fetchWord() {
    var doc = {
      "titleType": "DAILY_LOOP_WEEK"
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.getDailyTitleConfigList" + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json());
    var today = data.data.find(n => n.showType == "TODAY_SUBJECT");
    var tomorrow = data.data.find(n => n.showType == "TOMORROW_SUBJECT");

    this.setState({
      specialTitle: today.targetName,
      tem_specialTitle: today.targetName,
      jumpWord: today.targetDesc,
      tem_jumpWord: today.targetDesc,
      titleCode: today.titleCode,
      specialTitle2: tomorrow.targetName,
      jumpWord2: tomorrow.targetDesc,
      titleCode2: tomorrow.titleCode
    })

  }





  //确认删除
  deleteData(dailyCode) {
    //判断是不是有删除权限
    if (!getUrl.operationTypeCheck("DELETE")) {
      message.error("抱歉没有权限,请联系管理员或者切换账号");
      return
    }
    message.success("删除成功了,一去不复返了");
    this.fetchDeleteData(dailyCode)
  }
  async fetchDeleteData(dailyCode) {
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.deleteDailyByCode" + "&content=" + JSON.stringify({
        dailyCode,
      }) + commonData.dataString
    }).then(res => res.json())
    const cur = this.state.total - 1;
    this.setState({ total: cur })
    this.fetchdata(this.state.publishFlag)
  }

  // 下拉选择publishFlag
  handleFilter(v) {
    this.setState({
      publishFlag: v
    }, () => {
      this.fetchdata(this.state.dailyTitle, this.state.publishFlag, 0, this.state.pageSize);
    })
  }
  // 改为发布状态
  async release(dailyCode, publishFlag) {
    var doc = {
      dailyCode,
      publishFlag,
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.updateDailyPublishFlag" + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json())
    //判断有没有权限
    if (!getUrl.operationTypeCheck("UPDAT")) {
      message.error("抱歉没有权限,请联系管理员或者切换账号");
      return
    }

    this.fetchdata(this.state.publishFlag)
  }
  //模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    // this.submitword(this.state.tem_specialTitle,this.state.tem_jumpWord,this.state.partCode);
    this.submitWord()
    this.setState({
      visible: false,
    });
  }
  ///////////////////////////////////提交修改后的标题字段////////////////////////////////
  // async submitword(partTitle,targetDesc,partCode){
  //   var doc = {
  //     partTitle,
  //     targetDesc,
  //     partCode
  //   }
  //   var data = await fetch(getUrl.url,{
  //       mode : "cors",
  //       method : "POST",
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body:"method=ella.operation.saveOperationPartInfo"+"&content="+JSON.stringify(doc)
  //   }).then(res => res.json())
  //   if(data.status == 1){
  //     ////////////////////////////此处成功修改后,后面直接传修改后的specialTitle和jumpWord而不是tem_specialTitle和tem_jumpWord///////////////////////////////////////
  //     message.success("恭喜修改成功啦!");
  //     this.setState({
  //       specialTitle:this.state.tem_specialTitle,
  //       jumpWord:this.state.tem_jumpWord
  //     })
  //   }
  // }
  async submitWord() {
    var doc = [
      {
        titleCode: this.state.titleCode,
        targetName: this.state.tem_specialTitle,
        targetDesc: this.state.tem_jumpWord,
        showType: this.state.showType,
      }, {
        titleCode: this.state.titleCode2,
        targetName: this.state.specialTitle2,
        targetDesc: this.state.jumpWord2,
        showType: "SHOW_WAIT",
      }
    ];
    if (doc[0].targetName == "" || doc[0].targetDesc == "" || doc[1].targetName == "" || doc[1].targetDesc == "") {
      message.error("数据不能为空字符");
      return;
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.updateDailyTitleConfigList" + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json());
    if (data.status == 1) {
      message.success("恭喜修改成功啦!");
    }
  }
     //拉数据
    async fetchSelectData() {
    	
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId":"DAILY_MANAGE_LIST" })+commonData.dataString
        }).then(res => res.json())
        this.setState({
           selectData:data.data
        })
      
    }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  changeContent(k, v) {
    this.setState({
      [k]: v
    })
  }
  //是否有权限更新
  isUPDAT() {
    if (!getUrl.operationTypeCheck("UPDAT")) {
      message.error("抱歉没有权限,请联系管理员或者切换账号");
    }
  }
  render() {
    //////////////样式///////////////////	
    const title = {
      borderBottom: "1px solid #e3e6e6",
      textIndent: "20px",
      fontSize: "16px",
      marginBottom: "0",
      padding: "10px 0px"
    }
    const back = {
      paddingRight: "8px"
    }
    const box = {
      padding: "20px 20px 20px 20px"
    }
    const table_box = {
      margin: "20px 0px 0px 0px"
    }
    const font_color = {
      color: "#242424"
    }
    const small_title = {
      fontSize: "14px",
      lineHeight: "28px"
    }
    const margin_8 = {
      marginLeft: "8px"
    }
    //////////////样式///////////////////	
    //删除确认提示
    const columns = [
      {
        title: '文章标题',
        dataIndex: 'dailyTitle',
        key: 'dailyTitle',
        width: 100,
        className:'td_hide',

        render: (text, record) =>{
            return(
                <Popover
                    placement="top"
                    title={null}
                    content={
                        record.dailyTitle
                    }
                >
                    <span>{record.dailyTitle}</span>
                </Popover>
            )
        }
       

      }, {
        title: '推送时间',
        dataIndex: 'effectDate',
        key: 'effectDate',
        width: 100,
      }, {
        title: '状态',
        dataIndex: 'publishFlag',
        key: 'publishFlag',
        width: 100
      }, {
        title: '活动链接',
        dataIndex: 'targetPage',
        width: 100,
        render: (text, record) => (
          <Popover
            placement="top"
            // title={<div style={{ textAlign: "center", fontSize: "16px" }}>活动地址二维码</div>}
            title="活动链接"
            content={
              <div>
                {/* <div className="QRCode" style={{ position: 'relative', textAlign: 'center' }}>
                          <QRCode size={1000} value={record.activityAddress} logo={logo} logoWidth={250} logoHeight={250} >
                          </QRCode>

                      </div> */}
                {/* <Collapse> */}
                {/* <Panel header="活动链接地址" key="1"> */}
                <Input style={{ marginTop: '5px' }} readOnly value={record.targetPage} />
                <Button
                  style={{ marginTop: '5px' }}
                  onClick={() => {
                    copy(record.targetPage);
                    message.success("复制成功");
                  }}
                  type="primary"
                >一键复制</Button>
                {/* </Panel> */}
                {/* </Collapse> */}
              </div>
            }
            trigger="hover" >
            {/* <Icon title="点击显示二维码" type="qrcode" style={{ fontSize: '18px' }} /> */}
            <div className='i-action-ico i-link'></div>
          </Popover>
        )
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        className: "titit_operation",
        render: (text, record, index) => {
          let dailyContent = record.dailyContent || "暂无内容.....";
          return <div>
            {/*<Link onClick={()=>{this.isUPDAT()}} to={"/remittance/uploadRemittance/"+record.dailyCode+"/"+encodeURIComponent(dailyContent)}>*/}
            <Link onClick={() => { this.isUPDAT() }} target="_blank" to={getUrl.operationTypeCheck("UPDAT") ? `/remittance/uploadRemittance/${record.dailyCode}/${encodeURIComponent(dailyContent)}` : `/remittance`}>
              <i className="i-action-ico i-edit" title="点击进入编辑页面" style={{ marginLeft: "20px", cursor: "pointer" }} type="edit" />
            </Link>
            <Popconfirm
              placement="top"
              title={'确定要改成发布状态吗?'}
              onConfirm={
                () => {
                  if (record.publishFlag == "已推送" || record.publishFlag == "已发布") {
                    notification.error({
                      message: '对不起这一条不能推送',
                      description: '因为这一条已经是已推送或者已发布',
                    })
                  } else {
                    this.release(record.dailyCode, "PUSH_YES")
                  }
                }
              }
              okText="确定"
              cancelText="取消">
              {/*<Tooltip placement="top" title={'点击更改状态'}>*/}
              <i className="i-action-ico i-up" title="点击更改状态为发布" style={{ marginLeft: "20px", cursor: "pointer" }} type="upload" />
              {/*</Tooltip>*/}
            </Popconfirm>
            <Popconfirm
              placement="top"
              title={'确定要改成已下线状态吗?'}
              onConfirm={
                () => {
                  if (record.publishFlag == "未推送" || record.publishFlag == "已下线") {
                    notification.error({
                      message: '对不起这一条不能下线',
                      description: '因为这一条已经是未推送或者已下线',
                    })
                  } else {
                    this.release(record.dailyCode, "OFF_LINE")
                  }
                }
              }
              okText="确定"
              cancelText="取消">
              <i className="i-action-ico i-down" title="点击更改状态为已下线" style={{ marginLeft: "20px", cursor: "pointer" }} type="download" />
            </Popconfirm>

            <Popconfirm placement="top" title={'确定要删除吗?'} onConfirm={() => { this.deleteData(record.dailyCode) }} okText="确定" cancelText="取消">
              <i className="i-action-ico i-delete" title="点击删除" style={{ marginLeft: "20px", cursor: "pointer" }} type="delete" />
            </Popconfirm>
          </div>
        }
      }
    ];

    const data = getUrl.operationTypeCheck("UPDAT") ? this.state.dataList : [];
    //TODO:分页器
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 20,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showTotal: () => { return `共 ${this.state.listLength} 条` }
      // 分页加载
      // onChange : (page, pageSize)=>{this.fn(page, pageSize)}
    }
    return <div className="daily">
      <p style={title}><Link style={font_color}>每日绘本</Link></p>
      <div style={box}>

        <div>
          
            <Link to="/remittance/addRemittance">
              <Button style={{padding:0}} display={!getUrl.operationTypeCheck("CREATE")} className="button buttonWidth intervalRight" type="primary">
                <Icon type="plus" />
                <span style={{ ...margin_8 }}>添加新绘本</span>
              </Button>
            </Link>
        
         
            <Button style={{padding:0}} display={!getUrl.operationTypeCheck("UPDAT")} onClick={this.showModal} className="button intervalRight selectWidth" type="primary"><Icon type="reload" /><span style={{ ...margin_8 }}>更新专栏</span></Button>
            <Modal
              title="编辑专栏文字"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={620}
            >
              <Row>
                <Col span={4}>
                  <span style={{ ...small_title }} >当前专栏标题</span>
                </Col>
                <Col span={5}>
                  <Input value={this.state.tem_specialTitle} onChange={(e) => { this.changeContent("tem_specialTitle", e.target.value) }} placeholder="输入专栏标题" />
                </Col>
                <Col span={3} offset={1}>
                  <span style={{ ...small_title }} >跳转文字</span>
                </Col>
                <Col onChange={(e) => { this.changeContent("tem_jumpWord", e.target.value) }} span={5} >
                  <Input value={this.state.tem_jumpWord} placeholder="输入跳转文字" />
                </Col>
                {/*<Col span={4} offset={2}>
                        <Button type="primary">更新</Button>
                      </Col>*/}
                <Col span={4} offset={2}>
                  <Checkbox onChange={(e) => { this.changeContent("showType", e.target.checked ? "SHOW_ON" : "SHOW_WAIT") }}>立刻生效</Checkbox>
                </Col>
              </Row>

              <Row style={{ marginTop: "20px" }}>
                <Col span={4}>
                  <span style={{ ...small_title }} >明日专栏标题</span>
                </Col>
                <Col span={5}>
                  <Input onChange={(e) => { this.changeContent("specialTitle2", e.target.value) }} value={this.state.specialTitle2} placeholder="输入专栏标题" />
                </Col>
                <Col span={3} offset={1}>
                  <span style={{ ...small_title }} >跳转文字</span>
                </Col>
                <Col span={5} >
                  <Input onChange={(e) => { this.changeContent("jumpWord2", e.target.value) }} value={this.state.jumpWord2} placeholder="输入跳转文字" />
                </Col>
              </Row>

              <Row style={{ padding: "10px 0px" }}>
                <Col>
                  <Card hoverable style={{ width: "100%" }}>
                    <Row>
                      <Col span={4}>
                        {this.state.tem_specialTitle}
                      </Col>
                      <Col offset={16} span={4}>
                        {this.state.tem_jumpWord}
                      </Col>
                    </Row>

                    <Row>
                      <Col offset={2}>
                        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                            </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Modal>
         
         
          <Search placeholder="搜索" enterButton onSearch={value => this.dailySearch(value)} className="intervalRight searchWidth"/>
         
          
        <Select defaultValue={null} className="selectWidth" onChange={(v) => { this.handleFilter(v) }}>
            <Option value={null}>全部</Option>
            {
              this.state.selectData.map((item)=><Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>)
            }
         
        </Select>
         
        </div>
        <div style={table_box}>
          <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
            <Table rowKey={(record, index)=>index} columns={columns} dataSource={data} scroll={{ y: 538 }} pagination={false} />
          </Spin>
        </div>
        <div className="m-pagination-box">
          <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
        </div>
      </div>
    </div>
  }
}