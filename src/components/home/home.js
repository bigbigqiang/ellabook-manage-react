import React from 'react';
import $ from 'jquery'
import './home.css'
import { Menu, Icon, Layout, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import LeftSider from './leftSider.js'
import ResetPassword from '../user/resetPassword.js'
import Login from '../login/login.js'
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
export default class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false,
			current: '',
			username: '',
			userUid: "",
			resetpwdFlag: false,
			resetpwdHtml: "",
			loginFlag: false,
			openKeys: []
		}
		//解决绑定事件，指针指向元素而无法调组件this
		this.onClick = this.onClick.bind(this);
		this.toggle = this.toggle.bind(this);
		this.setOpenKey = this.setOpenKey.bind(this);
	}

	onClick(key) {
		if (key.key == "33" && this.state.resetpwdFlag == false) {
			this.setState({
				resetpwdFlag: true
			})
		} else if (key.key == "111") {
			localStorage.setItem("flag", "0");
			localStorage.setItem("uid", "");
			localStorage.setItem("name", "");
			localStorage.setItem("loginTime", "");
			localStorage.setItem("token", "");
			this.setState({
				loginFlag: false
			})
			$(".loginContainer").show();
		}
	}

	toggle() {
		this.setState({
			collapsed: !this.state.collapsed,
			openKeys: this.state.collapsed ? this.state.openKeys : []
		});
	}
	setOpenKey (value) {
		this.setState({
			openKeys: value
		});
	} 

	ziChange(num) {
		if (num == 0) {
			this.setState({
				resetpwdFlag: false
			})
		}
	}


	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		console.log('current,home:' + localStorage.getItem('current'));
		console.log(localStorage.getItem("name"));
		if (localStorage.getItem("name") != null && localStorage.getItem("name") != "" && localStorage.getItem("name") != undefined) {
			this.setState({
				username: localStorage.getItem("name"),
				userUid: localStorage.getItem("uid"),
				loginFlag: true
			})
		} else {
			$(".loginContainer").show();
			this.setState({
				loginFlag: false
			})
		}

	}
	componentDidMount() {
	}

	//登陆后，设置用户UID，和name
	setUserName(theUid, userName) {
		this.setState({
			username: userName,
			userUid: theUid,
			loginFlag: true
		})
	}

	logout() {
		this.setState({
			loginFlag: false,
		})
	}

	render() {
		return (
			<LocaleProvider locale={zhCN}>
				<div style={{ width: '100%', height: '100%' }}>
					<Login setUserNameP={(a, b) => this.setUserName(a, b)} logout={() => this.logout()} />
					{this.state.resetpwdFlag && <ResetPassword ziChange={num => this.ziChange(num)} />}
					{this.state.loginFlag && <Layout style={{ minHeight: '100%' }} id='components-layout-demo-custom-trigger'>
						<Sider
							trigger={null}
							collapsible
							style={{backgroundColor:'#373d41'}}
							collapsed={this.state.collapsed}
						>
							<div className={this.state.collapsed ? 'logo-small' : 'logo'} />
							<LeftSider openKeys={this.state.openKeys} setOpenKey={this.setOpenKey}/>
						</Sider>
						<Layout>
							<Header style={{ padding: 0,backgroundColor:'#373d41' }}>
								<Icon
									className='trigger'
									type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
									onClick={this.toggle}
								/>
								<Menu theme="dark" mode="horizontal" onClick={this.onClick} style={{ height: 48, lineHeight: '48px', float: 'right', width: 160,backgroundColor:'#373d41' }}>
									<SubMenu title={<span style={{ color: "#fff" }} ><Icon type="setting" />{this.state.username}</span>}>
										<Menu.Item key="33">修改密码</Menu.Item>
										<Menu.Item key="111">退出</Menu.Item>
									</SubMenu>
								</Menu>
							</Header>
							<Content>
								{this.props.children}
							</Content>
						</Layout>
					</Layout>}
				</div>
			</LocaleProvider>
		)
	}
}

