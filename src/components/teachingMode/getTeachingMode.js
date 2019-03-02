import React from 'react'
import { Carousel, Button, Icon, Modal, message } from 'antd'
import { Link } from 'react-router'
// require('babel-polyfill')
// require('es6-promise').polyfill()
import "./teachingMode.css";
import 'whatwg-fetch'
const util = require('../util.js');
const confirm = Modal.confirm;
import Editor from "../editor/teachEditor.js";
/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */


/* 
 * PropType validation
 */


class teachingMode extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bookCode: this.props.params.status,
			bookPages: this.props.params.bookPages,
			bookName: this.props.params.bookName,
			carouselList: [],
			modeContentList: [],
			content: '',
			teachingModeContent: '',
			uid: localStorage.getItem("uid"),
			token: localStorage.getItem("token"),
			pageToken: '',
			packingMessage: '未曾打包过该本书籍的教学模式!',
			titleImg: null,
			isInsert: false,
			visible: false,
			dailyTitle: "",
			dailyContent: "",
			dailyImg: "",
			effectDate: "",
			targetPage: "",
			authorName: "",
			oldCurrent: 0,

			allList: [],           //这是拉取的所有数据列表
			bookSearchList: [],    //这是展示的搜索列表
			bookSelectList: [],     //这是选择的结果列表
			teachingModeList: [], //教学模式内容
			page: 0
		}
		// this.onChange = this.onChange.bind(this);
	}

	fetchFn = async (type, pageToken, currentPageName, n, frontPageName) => {
		var doc = {
			bookCode: this.state.bookCode,
			uid: this.state.uid,
			type: type,
			pageToken: pageToken,
			currentPageName: currentPageName,
			frontPageName: frontPageName
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.getTeachingModeResourceRealTimeInfo" + "&content=" + JSON.stringify(doc) + "&token=" + this.state.token + "&uid=" + this.state.uid
		})
			.then(function (response) {
				return response.json();
			});
		console.log(data.data.content);
		if (data.status == 1) {
			this.setState({
				modeContentList: data.data.content,
				teachingModeContent: encodeURIComponent(data.data.content[n].content),
				packingMessage: data.data.packingRecord == null ? this.state.packingMessage : data.data.packingRecord
			}, () => {
				this.setState({
					pageToken: data.data.pageToken,
					dailyContent: this.state.teachingModeContent
				}, () => {
					console.log('dailyContent:' + this.state.dailyContent);
				})

			})
		} else {
			message.error(data.message);
		}

	}

	contentShow = () => {
		console.log(this.state.bookPages)
		for (var i = 0; i < this.state.bookPages; i++) {
			this.state.carouselList.push(i + 1);
			this.state.teachingModeList.push('');
		}
		console.log(this.state.carouselList)
		this.setState({
			content: (this.state.carouselList.map(item =>
				<div className="bottomPage">
					<div style={{ paddingTop: 15, textAlign: 'left', paddingLeft: 10 }}>
						<Button type="primary" style={{ marginRight: 20 }} value={item} onClick={(e) => this.openModal(e.target.value)}>预览第{item}页</Button>
						<Button type="primary" value={item} onClick={(e) => { this.savePerPage(e.target.value) }}>保存第{item}页</Button>
					</div>
				</div>
			))
		},()=>{
			
		}
		);
		
	}

	getContent(k, v) {
		this.setState({
			[k]: v
		})
	}

	componentDidMount() {
		this.fetchFn('', this.state.pageToken, '', 0, '');
		this.contentShow();
		var iframe = document.getElementById('ueditor_0');
		console.log(iframe)
	}

	packTeachingMode = () => {
		let _this = this;
		confirm({
			title: '确认',
			content: '确定要开始打包吗？',
			okText: '是，我要打包',
			cancelText: '否，暂时不打包',
			onOk() {
				console.log('OK');
				_this.packTeachingModeFetchfn();
			},
			onCancel() {

			},
		});

	}

	packTeachingModeFetchfn = async () => {
		var doc = {
			bookCode: this.state.bookCode,
			uid: this.state.uid
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.packTeachingModeResource" + "&content=" + JSON.stringify(doc) + "&token=" + this.state.token + "&uid=" + this.state.uid
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.packTeachingModeCallBack();
			if (!this.timer) {
				this.timer = setInterval(
					() => {
						this.packTeachingModeCallBack();
						let percent = this.state.packingPercent;
						//当这个数字大于最后显示的数据时，停止
						if (percent == 100) {
							clearInterval(this.timer);
							this.timer = undefined;
							this.setState({
								packingMessage: '打包成功！'
							})
						}
						if (this.state.packingStage == false) {
							clearInterval(this.timer);
							this.timer = undefined;
							return;
						}
						// if(this.state.packingStage=='ONGOING:错误中断'){
						// 	clearInterval(this.timer);
						//     this.timer = undefined;
						//     this.setState({
						//     	packingMessage:'打包中断！'
						//     })
						//     // return false;
						// }
					},
					2000
				);
			}
		} else {
			message.error(data.message);
		}
	}

	packTeachingModeCallBack = async () => {
		var doc = {
			bookCode: this.state.bookCode
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.getTeachingModeResourcePackingState" + "&content=" + JSON.stringify(doc) + "&token=" + this.state.token + "&uid=" + this.state.uid
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.setState({
				packingState: data.data.packingState,
				packingStage: data.data.packingStage,
				packingPercent: data.data.packingPercent,
				packingRecord: data.data.packingRecord,
				packingMessage: data.data.packingPercent + '%,' + data.data.packingRecord + ' ' + data.data.packingStage
			})
		} else {
			this.setState({
				packingStage: false
			})
		}

		// if(data.data.packingState=='PACKING:错误中断'){
		// 	return;
		// }
		console.log(data.data.packingPercent + '%,' + data.data.packingRecord);
	}

	fetchFnSave = async (pageToken, currentPageName, n) => {
		var _this = this;
		console.log('dailyContent456465:' + _this.state.dailyContent);
		var content = encodeURIComponent(_this.state.dailyContent);
		console.log('content:' + content);
		var doc = {
			bookCode: _this.state.bookCode,
			content: encodeURIComponent(content),
			pageToken: pageToken,
			currentPageName: currentPageName
		};
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.uploadTeachingModePageInfo" + "&content=" + JSON.stringify(doc) + "&token=" + _this.state.token + "&uid=" + _this.state.uid
		})
			.then(function (response) {
				console.log('content123456:' + content);
				return response.json();
			});
			console.log(data);
		if (data.status == 1) {
			message.success('第' + n + '页保存成功！');
		} else {
			message.error('第' + n + '页保存失败,请点击保存按钮保存,若已保存，请忽略');
		}
	}

	savePerPage(n) {
		console.log('当前页码：' + n);
		this.fetchFnSave(this.state.pageToken, this.state.modeContentList[n - 1].pageName, n);
		// if(this.state.pageToken=='READ_ONLY'){
		// 	message.error('当前页面为只读状态，不可保存！');
		// }else{
		// 	console.log(this.state.modeContentList);
		// 	this.fetchFnSave(this.state.pageToken,this.state.modeContentList[n-1].pageName,n);
		// }
		console.log(JSON.stringify(this.state.teachingModeList));
		// localStorage.setItem('teachingModeList',this.state.teachingModeList);
	}

	onChange(from, to) {
		console.log(from + '确定切换吗？' + to);
		var _this = this;
		_this.setState({
			page: to
		});
		var pageToken = _this.state.pageToken;
		console.log('pageToken:' + pageToken);
		console.log(from);
		console.log(_this.state.modeContentList);
		_this.fetchFn('REFRESH_AND_GET', pageToken, _this.state.modeContentList[to].pageName, to, _this.state.modeContentList[from].pageName);
		console.log('teachingModeContent:' + _this.state.teachingModeContent);

		this.setState({
			teachingModeContent: " "
		})
		// if(_this.state.pageToken!='READ_ONLY'){
		// 	// _this.fetchFnSave(_this.state.pageToken,_this.state.modeContentList[from].pageName,from+1);

		// }
	}

	openModal = (key) => {
		this.setState({
			key: key,
			title: '您正在预览第' + key + '页教学模式',
			modalVisible: true
		})
	}

	handleCancel = (e) => {
		this.setState({
			modalVisible: false,
		});
	}

	render() {
		const { editorContent, editorState } = this.state;
		//提交图片
		const { previewVisible, previewImage, fileList } = this.state;
		console.log(this.state.content);
		return (
			<div>
				<p className="m-title"><Link to='/bookList'><Icon type="left" />教学模式</Link></p>
				<div className='m-teaching-box'>
					<p>书名：《{this.state.bookName}》<Button type="primary" onClick={this.packTeachingMode}>我要打包</Button><span style={{ paddingLeft: 20 }}>{this.state.packingMessage}</span></p>
					<div id='teachingWrap' style={{ width: "60%" }}>
						<Editor titleImg={null} getContent={this.getContent.bind(this)} dailyContent={this.state.teachingModeContent}></Editor>
						<Carousel
							effect="fade"
							// TODO:laihongbo改
							afterChange={(to) => {
								console.log(this.state.oldCurrent, to)
								this.onChange(this.state.oldCurrent, to)
								this.setState({
									oldCurrent: to
								})

							}}
							//TODO:原suhaihui代码
							// beforeChange={(from, to) => { console.log(from, to); this.onChange(from, to) }}
							ref='myCarousel'>
							{this.state.content}
						</Carousel>
					</div>
				</div>
				<div>
					<Modal
						key={this.state.key}
						title={this.state.title}
						visible={this.state.modalVisible}
						footer={null}
						onCancel={this.handleCancel}
						style={{ top: '20%' }}
						width={900}
						className='m-teaching-preview'
					>
						<div className='m-pw-lt'>此处为动画书展示部分</div>
						<div dangerouslySetInnerHTML={{ __html: decodeURIComponent(this.state.dailyContent) }} style={{ overflow: 'auto' }} className='m-pw-rt'></div>
					</Modal>
				</div>
			</div >
		)
	}
}
export default teachingMode
