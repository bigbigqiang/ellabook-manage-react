import React from 'react'
import { Button, Table, Icon, message, Popconfirm,Modal, Spin, Row, Col, Select, Pagination, Input,DatePicker,Popover,InputNumber} from 'antd';
import getUrl from '../util';
import commonData from '../commonData.js'
import moment from 'moment';
const InputGroup = Input.Group;
class Idfa extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: '',
            loading: false,
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,
            beginTime:'',
            endTime:'',
            channel:'',
            callbackShowSuccessProbability: 1,
            channels:[],
            searchData:{
                beginTime:'',
                endTime:'',
                channel:''
            }
        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    setStateData(str, value) {
        this.setState({
            [str]: value
        })
    }
    //模块列表
    fetchModuleList(page, pageSize) {
        this.setState({
            loading: true
        })
        let parameter = { channel:this.state.searchData.channel, beginTime:this.state.searchData.beginTime,endTime:this.state.searchData.endTime, pageVo: { "page": page, "pageSize": pageSize } }
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getIdfaList" + "&content=" + JSON.stringify(parameter) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            this.setState({
                dataSource: data.data.list,
                total: data.data.total,
                pageMax: data.data.total,
                pageLength: data.data.totalPage,
                loading: false
            })
        }).catch(e => {
            console.log(e.message)
        })
    }
    getIdfaChannels(){
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getIdfaChannels" + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            if (data.status == '1') {
                let channels = []
                data.data.map((item)=>{
                    channels.push(item.channel)
                })
                this.setState({
                    channels: channels
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    saveCallbackProbability() {
        if (this.state.callbackShowSuccessProbability) {
            fetch(getUrl.url, {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "method=ella.operation.saveCallbackProbability" + "&content=" + JSON.stringify({channel: this.state.channel,percentage: this.state.callbackShowSuccessProbability}) + commonData.dataString,
            }).then(res => res.json()).then((data) => {
                if (data.status == '1') {
                    message.success('回调显示成功率设定成功')
                } else {
                    message.error(data.message)
                }
            }).catch(e => {
                console.log(e.message)
            })
        } else {
            message.error('回调显示成功率未填写');
        }
    }
    getIdfaChannelValue(value) {
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getIdfaChannelValue" + "&content=" + JSON.stringify({channel: value}) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    callbackShowSuccessProbability: (data.data && data.data.percentage)?data.data.percentage/100:1
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    componentDidMount() {
        this.getIdfaChannels();
        this.fetchModuleList(this.state.page, this.state.pageSize);
    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchModuleList(this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.fetchModuleList(this.state.page, this.state.pageSize);
        });
    }
	setStartOrEndData(value, dateString, str) {
        this.setState({
            [str]: dateString
        })
    }
	 //恢复默认设置
    clearSelect() {
        this.setState({
            beginTime: '',
            endTime: '',
            channel: '',
        })
    }
    render() {
        const columns = [
            {
                title: '日期',
                width: 100,
                dataIndex: 'dateTime',
                key: 'dateTime'
            }, {
                title: '投放量',
                width: 100,
                dataIndex: 'launchNum',
                key: 'launchNum'
            }, 
            {
	            title: '回调成功数',
                width: 100,
                dataIndex: 'callbackSuccessNum',
                key: 'callbackSuccessNum'
	        },
	        {
	            title: '成功未回调数',
                width: 100,
                dataIndex: 'successNoCallbackNum',
                key: 'successNoCallbackNum'
	        },
            {
                title: '回调显示成功概率',
                width: 150,
                dataIndex: 'callbackShowSuccessProbability',
                key: 'callbackShowSuccessProbability'
            }, {
                title: '实际成功概率',
                width: 100,
                dataIndex: 'actualSuccessProbability',
                key: 'actualSuccessProbability'
            }, {
                title: '渠道',
                width: 100,
                dataIndex: 'channel',
                key: 'channel',
                render: (text, record) => {
                    return record.channel === 'all'?'全部':record.channel

                }
            }
        ]
        return (
            <div id="Recommend">
                <p className="m-title">IDFA数据查看</p>
                <div className="m-rt-content">
                    <div className="showtime">
                        <div className="rowPartWrap">
                            <Row className="rowPart" style={{marginBottom:10}}>
                                <Col md={{ span: 24}} lg={{ span: 16}} xl={{span: 11}} xxl={{span: 8}}>
                                    <span className="colTitle">创建时间:</span>
                                    <DatePicker
                                        style={{marginLeft:10,width:"150"}}
                                        className="intervalBottom"
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder={['开始时间']}
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "beginTime") }}
                                        value={this.state.beginTime != '' ? moment(this.state.beginTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="line"> — </span>
                                    <DatePicker
                                        className="intervalRight intervalBottom"
                                        style={{width:"150"}}
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder={['结束时间']}
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "endTime") }}
                                        value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD') : null}
                                    />
                                </Col>
                                <Col md={{ span: 24}} lg={{ span: 8}} xl={{span: 6}} xxl={{span: 4}} style={{paddingBottom:10}}>
                                    <span className="colTitle">渠道:</span>
                                    <Select defaultValue="全部" style={{marginLeft:10,width:130}} value={this.state.channel} onChange={(value) => { this.getIdfaChannelValue(value);this.setStateData("channel", value) }}>
                                        <Option value=''>全部</Option>
                                        {
                                            this.state.channels.map(item => {
                                                return <Option value={item}>{item}</Option>
                                            })
                                        }
                                    </Select>
                                </Col>

                                <Col md={{ span: 24}} lg={{ span:24}} xl={{span: 7}} xxl={{span: 5}} style={{display: 'flex'}}>
                                    <Button className="u-btn-green" style={{marginRight:20}} onClick={()=>{ this.setState({
                                        current:1,
                                        page: '0',
                                        searchData:{
                                            beginTime: this.state.beginTime,
                                            endTime: this.state.endTime,
                                            channel: this.state.channel
                                        } },()=>{this.fetchModuleList(0, this.state.pageSize)}); }}>查询</Button>
                                    <Button className="theSearch u-btn-green" onClick={() => this.clearSelect()}>恢复默认</Button>
                                </Col>
                            </Row>
                        </div>
                        {
                            this.state.channel && (
                                <div className="rowPartWrap" style={{border:'1px solid #ddd',marginBottom:10}}>
                                    <div style={{backgroundColor:'#23b8e6',height:30,color:'#fff',lineHeight:'30px',textIndent:10,marginBottom:10}}>
                                        回调显示成功率设定
                                    </div>
                                    <Row className="rowPart" style={{marginBottom:10,paddingLeft:10}}>
                                        <Col md={{ span: 12}} lg={{ span: 8}} xl={{span: 6}}>
                                            <InputGroup compact>
                                                <Input style={{ width: 100,backgroundColor:'#23b8e6',color:'#fff' }} value={this.state.channel + ' :'} />
                                                <InputNumber style={{ width: 130 }} value={this.state.callbackShowSuccessProbability} min={0} max={1} step={0.1} precision={2} onChange={(value) => {this.setStateData("callbackShowSuccessProbability", value) }} />
                                            </InputGroup>
                                            <div style={{color:'#ccc',fontSize:12}}>请填写0~1之间的小数，默认保留小数点后2位</div>
                                        </Col>
                                        <Col md={{ span: 12}} lg={{ span: 8}} xl={{span: 6}}>
                                            <Button type="primary" style={{ width: 100,backgroundColor:'#23b8e6',borderColor:'#23b8e6' }} onClick={()=>{this.saveCallbackProbability()}}>保存</Button>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                        <hr />
                    </div>
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table
                            columns={columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                            scroll={{ y: 570 }}
                            style={{minWidth:1050}}
                        />
                    </Spin>
                    <div className="m-pagination-box">
                        {getUrl.operationTypeCheck("UPDAT") ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                </div>
            </div >
        )
    }
}
export default Idfa;
