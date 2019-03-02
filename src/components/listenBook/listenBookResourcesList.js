import React from 'react';
import { Table, Input, Select, Transfer, DatePicker, Button, Modal, Icon, Popconfirm, message, Tabs } from 'antd';
const { RangePicker } = DatePicker;
const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import { Link } from 'react-router';
import './listenBookResources.css';
import getUrl from "../util.js";
import moment from 'moment';
import { dataString } from '../commonData.js'
class myForm extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            ossUrl: '',
            //搜索字段
            total: 0,
            page: 1,
            pageSize: 10,

            total2: 0,
            page2: 1,
            pageSize2: 10,

            searchType: 'audioName',
            isShelves: null,
            audioCode: null,
            audioName: null,
            startTime: null,
            endTime: null,
            goodsState: null,
            pushHome: null,

            dataList: [],
            dataList2: [],
            isSearchMore: false,
            visible: false,
            audioListen: false,
            // 批量上传结果
            pushList: [],
            middlewareT: [],
            resultT: [],
        }

    }
    componentDidMount() {
        this.fetchDataList(this.state.page, this.state.pageSize);
        this.fetchPushList()
        // function CompareDate(d1, d2) {
        //     return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        // }
    }
    setOneKV(k, v) { this.setState({ [k]: v }) };
    async fetchDataList(page, pageSize) {
        this.setState({
            loading: true
        })
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.bookAudioList" + "&content=" + JSON.stringify({
                page,
                pageSize,
                isShelves: this.state.isShelves || null,
                audioCode: this.state.audioCode || null,
                audioName: this.state.audioName || null,
                startTime: this.state.startTime || null,
                endTime: this.state.endTime || null,
                goodsState: this.state.goodsState || null,
                pushHome: this.state.pushHome,
            }) + dataString
        }).then(res => res.json())
        if (this.state.isShelves) {
            this.setState({
                loading: false,
                dataList: data.data.list,
                total: data.data.total,
            })
        } else {
            this.setState({
                loading: false,
                dataList: data.data.list,
                total: data.data.total,
                page,
                pageSize
            })
        }
        // console.log(data);
    }
    async fetchPushList() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.bookAudioList" + "&content=" + JSON.stringify({
                page: 1,
                pageSize: 999,
                pushHome: false,
            }) + dataString
        }).then(res => res.json());
        // console.log(data);
        this.setState({
            pushList: data.data.list.map(item => ({ title: item.audioName, key: item.audioCode, homeStatus: item.homeStatus }))
        })
    }
    async pushAudio() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.pushHome" + "&content=" + JSON.stringify({
                audioCodes: this.state.middlewareT,
                pushHome: true,
            }) + dataString
        }).then(res => res.json());
        console.log(data);
        if (data.status == 1) {
            message.success('操作成功!');
            this.setState({
                visible: false
            }, () => { this.fetchPushList(); this.fetchDataList(this.state.page, this.state.pageSize); })
        } else {
            message.error('操作失败!')
        }
    }
    async pushAudioSingle(text, audioCodes) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.pushHome" + "&content=" + JSON.stringify({
                audioCodes: [audioCodes],
                pushHome: text == '已推送' ? false : true,
            }) + dataString
        }).then(res => res.json());
        if (data.status == 1) {
            message.success('操作成功');
        } else {
            message.error('操作失败');
        }
        this.fetchDataList(this.state.page, this.state.pageSize);
    }
    // async fetchChannelItem() {
    //     var data = await fetch(getUrl.url, {
    //         mode: "cors",
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
    //             type: "AUTO_BOX",
    //             groupId: "operation.box.chanelList"
    //         }) + dataString
    //     }).then(res => res.json())
    //     console.log(data);
    //     this.setState({
    //         defaultData: {
    //             ...this.state.defaultData,
    //             channel: data.data
    //         }

    //     })
    // }
    render() {
        console.log(this.state)
        const columns = [
            {
                title: '音频ID',
                dataIndex: 'audioCode',
                key: 'audioCode',
                width: 500,
                align: 'center',
            }, {
                title: '音频名称',
                dataIndex: 'audioName',
                key: 'audioName',
                width: 400,
                align: 'center',
            }, {
                title: '关联图书',
                dataIndex: 'bookName',
                key: 'bookName',
                width: 400,
                align: 'center',
            }, {
                title: '图书状态',
                dataIndex: 'goodsState',
                key: 'goodsState',
                width: 200,
                align: 'center',
            }, {
                title: '音频状态',
                dataIndex: 'isShelves',
                key: 'isShelves',
                width: 200,
                align: 'center',
            }, {
                title: '音频时长',
                dataIndex: 'audioTimeLength',
                key: 'audioTimeLength',
                width: 200,
                align: 'center',
                render:(text)=><span>{parseInt(text / 60)+"′"+parseInt(text % 60)+"″"}</span>
            }, {
                title: '上传时间',
                dataIndex: 'creatTime',
                key: 'creatTime',
                width: 300,
                align: 'center',
                render: (text) => moment(text).format('YY-MM-DD')
            }, {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 300,
                align: 'center',
                render: (text) => moment(text).format('YY-MM-DD')
            }, {
                title: '推送绘本馆',
                dataIndex: 'pushHome',
                key: 'pushHome',
                width: 200,
                align: 'center',
                render: (text, record) => {
                    return <Popconfirm
                        placement="top"
                        title={text == '已推送' ? '确认取消推送吗?' : '确认推送吗?'}
                        onConfirm={() => {
                            const _this = this;
                            if (text == '未推送') {
                                if (record.pushHome == '未推送') {
                                    Modal.confirm({
                                        title: '音频关联动画书未推送至绘本馆,确认推送音频吗?',
                                        // content: 'Some descriptions',
                                        onOk() {
                                            _this.pushAudioSingle(text, record.audioCode);
                                        },
                                        onCancel() {
                                            console.log('Cancel');
                                        },
                                    });
                                    return;
                                }
                            }
                            this.pushAudioSingle(text, record.audioCode);
                        }}
                        okText="确定"
                        cancelText="取消">
                        <a style={{ textDecoration: 'underline' }}>{text}</a>
                    </Popconfirm>
                }
            }, {
                title: '试听',
                dataIndex: 'androidRate',
                key: 'androidRate',
                width: 100,
                align: 'center',
                render: (text, record) =>
                    <a>
                        <Icon style={{ fontSize: 15 }} type="customer-service" theme="outlined" onClick={() => {
                            this.setState({
                                audioListen: true,
                                ossUrl: record.ossUrl
                            })
                            this.setOneKV('audioListen', true)
                        }} />
                    </a>
            }, {
                title: '操作',
                dataIndex: 'iosRate',
                key: 'iosRate',
                width: 100,
                align: 'center',
                render: (text, record) => <Link to={'/listenBookResourcesList/ope?type=edit&audioCode=' + record.audioCode}><Icon style={{ fontSize: 15 }} type="profile" theme="outlined" /></Link>
            },
        ]
        return (
            <div className='listenBookResources'>
                {/* 音频弹窗 */}
                <Modal
                    title="音频试听"
                    visible={this.state.audioListen}
                    onOk={() => { this.setOneKV('audioListen', false) }}
                    onCancel={() => { this.setOneKV('audioListen', false) }}
                    destroyOnClose
                    style={{ textAlign: 'center' }}
                >
                    <audio id='audio' preload="meta" width="500" height="200" className='previewImg' src={this.state.ossUrl || 'http://member.ellabook.cn/437bedfcf87e466cbd56da2a6ebf81ed'} controls name="media"></audio>
                </Modal>
                {/* 音频弹窗 */}
                <p className="m-title">听书资源管理</p>
                <div className='search'>
                    <Button type='primary'><Link to={'/listenBookResourcesList/ope?type=add'}>添加新的音频</Link></Button>
                    <Select
                        defaultValue="audioName"
                        style={{ width: 120, marginLeft: '20px' }}
                        onChange={(v) => {
                            this.setState({
                                searchType: v,
                                audioCode: null,
                                audioName: null,
                            })
                        }}>
                        <Option value="audioName">音频名称</Option>
                        <Option value="audioCode">音频ID</Option>
                    </Select>
                    <Search
                        placeholder="请输入搜索内容"
                        value={this.state.audioCode || this.state.audioName}
                        onChange={(e) => {
                            this.setState({
                                audioCode: null,
                                audioName: null,
                                [this.state.searchType]: e.target.value
                            })
                        }}
                        onSearch={value => {
                            // this.setState({})
                            this.fetchDataList(1, this.state.pageSize)
                        }}
                        style={{ width: 400, marginLeft: '10px' }}
                    />
                    <Button onClick={() => { this.setOneKV('isSearchMore', !this.state.isSearchMore) }} style={{ marginLeft: 40 }} type='primary'>
                        更多条件<Icon type={this.state.isSearchMore ? 'down' : 'up'} theme="outlined" />
                    </Button>
                    <Button onClick={() => {
                        this.fetchPushList()
                        this.setOneKV('visible', !this.state.visible)
                        this.setState({
                            visible: !this.state.visible,
                            middlewareT: this.state.resultT
                        })
                    }} style={{ marginLeft: '20px' }} type='primary'>批量推送</Button>
                    <Modal
                        title="音频推送"
                        visible={this.state.visible}
                        footer={null}
                        width={960}
                        onOk={() => { }}
                        onCancel={() => { this.setOneKV('visible', !this.state.visible) }}
                    >
                        <Transfer
                            listStyle={{
                                width: 400,
                                height: 500,
                            }}
                            dataSource={this.state.pushList}
                            showSearch
                            // filterOption={(inputValue, option) => option.description.indexOf(inputValue) > -1}
                            titles={['未推送列表', '已推送列表']}
                            operations={['全部推送', '全部取消']}
                            targetKeys={this.state.middlewareT}
                            onChange={(targetKeys) => {
                                console.log(targetKeys);
                                this.setOneKV('middlewareT', targetKeys)
                            }}
                            render={(item, index) => {
                                return <span>{item.title}------图书资源:<b style={{ color: item.homeStatus == '已推送' ? 'green' : 'red' }}>{item.homeStatus}</b></span>
                            }
                            }
                        />
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <Button onClick={() => {
                                this.pushAudio()
                                // this.setState({
                                //     resultT: this.state.middlewareT,
                                //     visible: false
                                // })
                            }} style={{ margin: '20px auto' }} type='primary'>保存</Button>
                        </div>
                    </Modal>
                </div>
                {
                    this.state.isSearchMore && <div className='searchMore'>
                        <span className='title'>上传时间:</span>
                        <DatePicker value={this.state.startTime ? moment(this.state.startTime) : null} style={{ marginLeft: 20 }} onChange={(date, dateString) => { this.setState({ startTime: moment(dateString, 'YYYY-MM-DD').valueOf() }) }} />
                        <span className='centerH'>——</span>
                        <DatePicker value={this.state.endTime ? moment(this.state.endTime) : null} onChange={(date, dateString) => { this.setState({ endTime: moment(dateString, 'YYYY-MM-DD').valueOf() }) }} />
                        <span style={{ marginLeft: 50 }} className='title'>图书状态:</span>
                        <Select value={this.state.goodsState} style={{ width: 120, marginLeft: 20 }} onChange={(v) => { this.setState({ goodsState: v }) }}>
                            <Option value={null}>全部</Option>
                            <Option value="SHELVES_ON ">已上架</Option>
                            <Option value="SHELVES_OFF ">已下架</Option>
                        </Select>
                        <span style={{ marginLeft: 20 }} className='title'>推送状态:</span>
                        <Select value={this.state.pushHome} style={{ width: 120, marginLeft: 20 }} onChange={(v) => { this.setState({ pushHome: v }) }}>
                            <Option value={null}>全部</Option>
                            <Option value={true}>已推送</Option>
                            <Option value={false}>未推送</Option>
                        </Select>
                        <div className='searchMoreTwo'>
                            <Button
                                style={{ width: 120 }}
                                onClick={() => { this.fetchDataList(1, this.state.pageSize) }} type='primary'
                            >查询</Button>
                            <Button
                                style={{ marginLeft: 20, width: 120 }}
                                type='primary'
                                onClick={() => {
                                    this.setState({
                                        audioCode: null,
                                        audioName: null,
                                        startTime: null,
                                        endTime: null,
                                        goodsState: null,
                                        pushHome: null,
                                    }, () => {
                                        this.fetchDataList(1, this.state.pageSize)
                                    })
                                }}
                            >恢复默认</Button>
                        </div>
                    </div>
                }
                <div className='tableWrap'>
                    <Tabs defaultActiveKey="2" onChange={(key) => {
                        this.setState({
                            isShelves: key == 1 ? true : null,
                            page2: 1
                        }, () => {
                            this.fetchDataList(key == 1 ? 1 : this.state.page, key == 1 ? 10 : this.state.pageSize);
                        })
                    }}>
                        <TabPane tab="上架音频" key="1">
                            <Table
                                rowKey="audioCode"
                                loading={this.state.loading}
                                columns={columns}
                                dataSource={this.state.dataList}
                                pagination={
                                    {
                                        defaultPageSize: this.state.pageSize,
                                        // defaultCurrent: 1,
                                        current: this.state.page2,
                                        // current: pageNo,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['5', '10', '20', '30', '40'],
                                        total: this.state.total,
                                        showTotal: () => { return `共 ${this.state.total} 条` },
                                        onShowSizeChange: (pageNo, pageSize) => {
                                            this.fetchDataList(pageNo, pageSize);
                                        },
                                        onChange: (pageNo, pageSize) => {
                                            // console.log(pageNo)
                                            this.setState({
                                                page2: pageNo
                                            })
                                            this.fetchDataList(pageNo, pageSize);
                                        }
                                    }
                                }
                            ></Table>
                        </TabPane>
                        <TabPane tab="全部音频" key="2">
                            <Table
                                rowKey="audioCode"
                                loading={this.state.loading}
                                columns={columns}
                                dataSource={this.state.dataList}
                                pagination={
                                    {
                                        defaultPageSize: this.state.pageSize,
                                        // current: pageNo,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['5', '10', '20', '30', '40'],
                                        total: this.state.total,
                                        showTotal: () => { return `共 ${this.state.total} 条` },
                                        onShowSizeChange: (pageNo, pageSize) => {
                                            this.fetchDataList(pageNo, pageSize);
                                        },
                                        onChange: (pageNo, pageSize) => {
                                            // console.log(pageNo)
                                            this.fetchDataList(pageNo, pageSize);
                                        }
                                    }
                                }
                            ></Table>
                        </TabPane>
                    </Tabs>

                </div>
            </div>
        )
    }
}



export default myForm