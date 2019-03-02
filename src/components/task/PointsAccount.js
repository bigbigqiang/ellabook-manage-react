import React from 'react'
import { Button, Table, message, Icon, Spin, Row, Col, Select, Pagination, Input, DatePicker, Popover } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util';
import commonData from '../commonData.js'
import moment from 'moment';
const Search = Input.Search;
class PointsAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: 0,
            loading: false,
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,

            searchKey: 'pointsCode',

            beginTime: '',
            endTime: '',
            useType: '',

            fullSearch: false,

            searchValue: '',
            searchData: {
                searchValue: '',
                uid: '',
                taskName: '',
                goodsName: '',
                pointsCode: '',
                beginTime: '',
                endTime: '',
                useType: ''
            }
        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    setStateData(str, value) {
        this.setState({
            [str]: value
        })
    }
    //积分列表
    fetchModuleList(page, pageSize) {
        this.setState({
            loading: true
        })
        let parameter = {
            uid: this.state.searchData.uid,
            taskName: this.state.searchData.taskName,
            goodsName: this.state.searchData.goodsName,
            pointsCode: this.state.searchData.pointsCode,
            useType: this.state.searchData.useType,
            beginTime: this.state.searchData.beginTime,
            endTime: this.state.searchData.endTime,
            pageVo: { "page": page, "pageSize": pageSize }
        }
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getPointsAccountList" + "&content=" + JSON.stringify(parameter) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            this.setState({
                dataSource: data.data.pointsAccountList,
                total: data.data.total,
                pageMax: data.data.total,
                pageLength: data.data.totalPage,
                loading: false
            })
        }).catch(e => {
            console.log(e.message)
        })
    }
    componentDidMount() {
        this.fetchModuleList(this.state.page, this.state.pageSize);
    }
    toggleSearch() {
        if (!this.state.fullSearch) {
            this.setState({ fullSearch: !this.state.fullSearch })
        } else {
            this.setState({
                fullSearch: !this.state.fullSearch,
                beginTime: '',
                endTime: '',
                useType: '',
                searchData: {
                    beginTime: '',
                    endTime: '',
                    useType: '',
                    pointsCode: this.state.pointsCode
                }
            })
        }
    }
    onSearch(value) {
        this.setState({
            current: 1,
            page: '0',
            searchData: {
                uid: this.state.searchKey === 'uid' ? this.state.searchValue : '',
                taskName: this.state.searchKey === 'taskName' ? this.state.searchValue : '',
                goodsName: this.state.searchKey === 'goodsName' ? this.state.searchValue : '',
                pointsCode: this.state.searchKey === 'pointsCode' ? this.state.searchValue : '',
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                useType: this.state.useType
            }
        }, () => {
            this.fetchModuleList(0, this.state.pageSize)
        })
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
            useType: '',
            searchValue: '',
            searchData: {
                searchValue: '',
                uid: '',
                taskName: '',
                goodsName: '',
                pointsCode: '',
                beginTime: '',
                endTime: '',
                useType: ''
            }
        })
    }
    render() {
        const columns = [
            {
                title: '积分编号',
                width: '20%',
                dataIndex: 'pointsCode',
                key: 'pointsCode',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.pointsCode
                            }
                        >
                            {record.pointsCode || '-'}
                        </Popover>
                    )
                }
            },
            {
                title: '用户ID',
                width: '20%',
                dataIndex: 'uid',
                key: 'uid',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={record.uid}
                        >
                            {record.uid ? <Link style={{textDecoration:'underline'}} target="_blank" to={"/userList?uid=" + record.uid}>
                                {record.uid}
                            </Link> : '-'}
                        </Popover>
                    )
                }
            },
            {
                title: '用户行为',
                width: '6%',
                dataIndex: 'useType',
                key: 'useType',
                render: (text, record) => {
                    if (record.useType === 'GET') { return '获得积分 ' } else if (record.useType === 'USE') { return '消费积分' } else { return '-' }
                }
            },
            {
                title: '完成日期',
                width: '10%',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text, record) => {
                    return (record.createTime || '-')
                }
            }, {
                title: '积分数量',
                width: '6%',
                dataIndex: 'points',
                key: 'points',
                render: (text, record) => {
                    return (record.points || '-')
                }
            },
            {
                title: '任务名称',
                width: '18%',
                dataIndex: 'taskName',
                key: 'taskName',
                render: (text, record) => {
                    return (record.taskName || '-')
                }
            },
            {
                title: '消费商品',
                width: '10%',
                dataIndex: 'goodsName',
                key: 'goodsName',
                render: (text, record) => {
                    return (record.goodsName || '-')
                }
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                width: '10%',
                render: (text, record) => {
                    return (
                        <div>
                            <Link target="_blank" to={"/pointsDetail?pointsCode=" + record.pointsCode + '&useType=' + record.useType + '&taskCode=' + (record.taskCode || '') + '&orderNo=' + (record.orderNo || '') + '&from=pointsAccount'}>
                                查看详情
                            </Link>
                        </div>
                    )
                }

            }
        ]
        return (
            <div id="PointsAccount">
                <p className="m-title">积分记录查询</p>
                <div className="m-rt-content">
                    <div style={{ marginBottom: 20 }}>
                        <Select defaultValue="pointsCode" className="selectWidth intervalRight" onChange={(value) => { this.setStateData("searchKey", value) }}>
                            <Select.Option value="pointsCode">积分编号</Select.Option>
                            <Select.Option value="uid">用户ID</Select.Option>
                            <Select.Option value="taskName">任务名称</Select.Option>
                            <Select.Option value="goodsName">商品名称</Select.Option>
                        </Select>
                        <Search placeholder="输入检索内容" value={this.state.searchValue} onChange={(e) => { this.setStateData("searchValue", e.target.value) }} enterButton className="searchWidth intervalRight" onSearch={(value) => { this.onSearch(value); }} />
                        <Button className="theSearch u-btn-green" onClick={this.toggleSearch}>更多条件<Icon type="down" /></Button>
                    </div>
                    {
                        this.state.fullSearch && <div className="showtime">
                            <div className="rowPartWrap">
                                <Row className="rowPart" style={{ marginBottom: 10 }}>
                                    <span className="colTitle">完成时间:</span>
                                    <DatePicker
                                        style={{ marginLeft: 10, width: 150 }}
                                        className="intervalBottom"
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder='开始时间'
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "beginTime") }}
                                        value={this.state.beginTime != '' ? moment(this.state.beginTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="line"> — </span>
                                    <DatePicker
                                        className="intervalRight intervalBottom"
                                        style={{ width: 150 }}
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder='结束时间'
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "endTime") }}
                                        value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="colTitle">用户行为:</span>
                                    <Select style={{ marginLeft: 10, width: 130 }} defaultValue='全部' value={this.state.useType} onChange={(value) => { this.setStateData("useType", value) }}>
                                        <Select.Option value=''>全部</Select.Option>
                                        <Select.Option value='GET'>获得积分 </Select.Option>
                                        <Select.Option value='USE'>消费积分 </Select.Option>
                                    </Select>

                                    <Col span={24} style={{ display: 'flex' }}>
                                        <Button className="u-btn-green" style={{ marginRight: 20 }} onClick={() => {
                                            this.setState({
                                                current: 1,
                                                page: '0',
                                                searchData: {
                                                    searchValue: this.state.searchValue,
                                                    uid: this.state.searchKey === 'uid' ? this.state.searchValue : '',
                                                    taskName: this.state.searchKey === 'taskName' ? this.state.searchValue : '',
                                                    goodsName: this.state.searchKey === 'goodsName' ? this.state.searchValue : '',
                                                    pointsCode: this.state.searchKey === 'pointsCode' ? this.state.searchValue : '',
                                                    beginTime: this.state.beginTime,
                                                    endTime: this.state.endTime,
                                                    useType: this.state.useType
                                                }
                                            }, () => { this.fetchModuleList(0, this.state.pageSize) });
                                        }}>查询</Button>
                                        <Button className="theSearch u-btn-green" onClick={() => this.clearSelect()}>恢复默认</Button>
                                    </Col>
                                </Row>
                            </div>
                            <hr />
                        </div>
                    }
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table
                            rowKey={(record, index) => index}
                            columns={columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                            scroll={{ y: 570 }}
                            style={{ minWidth: 1050 }}
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
export default PointsAccount;
