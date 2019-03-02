
import React from 'react'
import {Input, Button, Modal,Table,Checkbox, Radio,Select} from 'antd'
import { Link, hashHistory } from 'react-router'
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
var util = require('./util.js');
import commonData from './commonData.js';
const Search = Input.Search;
class ComSelectBook extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            total:'',
            bookModalList:[],
            visible:false,
            selectedRowKeys:[],
            tmpSelectdRowKeys:[],
            bookSearchName:'',
            key:'',
        }
    }
    //图书下拉列表
    fetchBookList(text,n){
        this.setState({
            selectedRowKeys: [],
            tmpSelectdRowKeys: []
        })
        let params= {
            text,
            page: n,
            pageSize: 5
        }
        util.API(params,"ella.operation.getBookListByIdOrName")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    bookModalList: response.data.bookList,
                    total: response.data.total
                })
            }else{
                message.error(response.message)
            }
        })
        
    
    }
    onPagnition(current, pageSize){
        this.fetchBookList(this.state.bookSearchName,current.current - 1);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        var tmp = this.state.tmpSelectdRowKeys;
        this.setState({
            selectedRowKeys: selectedRowKeys,
            tmpSelectdRowKeys: tmp.concat(selectedRowKeys)
        })
    }
    showModal(name){
        this.fetchBookList(this.state.bookSearchName,0);
        this.setState({visible:true,key: Math.random()});

    }
    handleOk = () => {
        var tmp = this.state.tmpSelectdRowKeys;
        var i = tmp[0];
        if (tmp.length == 0) {
            message.error('请选择图书！');
            return;
        }
        if (this.state.total > 0) {
            this.setState({visible: false}, () => {
                console.log(this.state.bookModalList[i].bookName)
                this.props.handleOk(this.state.bookModalList[i].bookCode,this.state.bookModalList[i].bookName)
            });
        } else {
            this.setState({
                visible: false
            });
        }

    }
    render(){
        const columns = [{
            title: '图书标题',
            width: '30%',
            dataIndex: 'bookName'
        }, {
            title: '图书编码',
            width: '20%',
            dataIndex: 'bookCode'
        }, {
            title: '出版时间',
            width: '30%',
            dataIndex: 'publishTime'
        }, {
            title: '图书状态',
            width: '20%',
            dataIndex: 'goodsState',
            render: (goodsState) => {
                return <div>
                    {goodsState == 'SHELVES_WAIT' ? <span>待上架</span> : (
                        goodsState == 'SHELVES_ON' ? <span>已上架</span> : <span>已下架</span>
                    )}
                </div>
            }
        }];
        const {visible, loading} = this.state;
        const { selectedRowKeys } = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:'radio',

        }

        const pagination = {
            total: this.state.total,
            showSizeChanger: false,
            pageSize: 5
        }
        return <Modal
            key={this.state.key}
            visible={visible}
            title="图书选择"
            onOk={this.handleOk}
            onCancel={()=>this.setState({visible:false})}
            
            footer=
            {[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>确定</Button>
            ]}
            >
            <Search placeholder="搜索" enterButton style={{ width: 400,"marginBottom":"20px"}} className="intervalRight" value={this.state.bookSearchName} onChange={(e)=>this.setState({"bookSearchName":e.target.value})} onSearch={value=> this.fetchBookList(value,0)} />
            <Table columns={columns} dataSource={this.state.bookModalList} bordered pagination={pagination} onChange={(current, pageSize)=>this.onPagnition(current, pageSize)} className="t-nm-tab" rowSelection={rowSelection} />
        </Modal>
    }

}
export default ComSelectBook