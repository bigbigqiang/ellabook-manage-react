import React from 'react'
import { Menu, Icon } from 'antd'
import { Link, hashHistory } from 'react-router'
const SubMenu = Menu.SubMenu;
const util = require('../util.js');
export default class LeftSider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: localStorage.getItem('current'),
            subMenu: [],
            firstAllMenu: [],
            menuItem: []
        }
    }

    async getAllMenu() {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.menuList"
        }).then(function (response) {
            return response.json();
        });
        var arr = data.data.filter((item) => {
            return item.menuLevel == 1;
        })
        this.setState({
            firstAllMenu: arr
        }, () => {
            this.fetchFn();
        })
    }
    fetchFn = async () => {
        var doc = {
            uid: localStorage.getItem('uid')
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.findUserLeftMenu" + "&content=" + JSON.stringify(doc)
        }).then(function (response) {
            return response.json();
        });
        let currentPathname = hashHistory.getCurrentLocation().pathname;
        let rootMenuKeys = [];
        let secondMenuList = data.data.filter((item) => {
            return (item.menuLevel == 2 && item.menuName != '勋章管理');
        });
        secondMenuList.map((item) => {
            rootMenuKeys.push(item.parentCode);
        })
        let arr = new Set(rootMenuKeys);
        let menu = [];
        let openKeys = [];
        arr.forEach((item) => {
            menu.push(this.state.firstAllMenu.filter((item0) => {
                return item0.menuCode == item;
            })[0]);
        })
        menu.forEach(element => {
            element.childMenu = secondMenuList.filter(Item => Item.parentCode === element.menuCode);
        })
        let matchRouter = secondMenuList.filter(Item => Item.menuAddress === currentPathname);
        let currentKey = '';
        //如果url匹配了二级路由
        if (matchRouter.length) {
            if (matchRouter[0].menuCode !== localStorage.getItem('current')) {
                openKeys = [matchRouter[0].parentCode];
                currentKey = matchRouter[0].menuCode
            } else {
                let currentKeys = secondMenuList.filter(Item => Item.menuCode === localStorage.getItem('current'))
                currentKey = localStorage.getItem('current')
                if (currentKeys.length) {
                    openKeys = [currentKeys[0].parentCode]
                } else {
                    openKeys = []
                }
            }
        } else {
            openKeys = []
            currentKey = ''
        }
        this.setState({
            secondMenuList: secondMenuList,
            subMenu: menu,
            current: currentKey
        })
        this.props.setOpenKey(openKeys)
    }

    setOperationType(operationType, key) {
        this.setState({
            current: key
        })
        localStorage.setItem('current', key);
        localStorage.setItem('operationType', operationType);
    }

    componentDidMount() {
        this.getAllMenu();
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.props.openKeys.indexOf(key) === -1);
        let flag = true;
        for (let i = 0; i < this.state.subMenu.length; i++) {
            if (this.state.subMenu[i].menuCode === latestOpenKey) {
                flag = false
                break;
            }
        }
        if (flag) {
            // this.setState({ openKeys });
            this.props.setOpenKey(openKeys)
        } else {
            this.props.setOpenKey(latestOpenKey ? [latestOpenKey] : [])
            // this.setState({
            //     openKeys: latestOpenKey ? [latestOpenKey] : [],
            // });
        }
    }
    render() {
        return (
            <Menu theme="dark"
                  openKeys={this.props.openKeys}
                  onOpenChange={this.onOpenChange}
                  selectedKeys={[this.state.current]}
                  style={{ backgroundColor: '#373d41' }}
                  mode="inline" >
                {
                    this.state.subMenu.map(item =>
                        <SubMenu key={item.menuCode} title={<span><Icon type={item.menuIcon} /><span>{item.menuName}</span></span>}>
                            {
                                item.childMenu.map(element => <Menu.Item key={element.menuCode} ><Link to={element.menuAddress} onClick={(e) => { this.setOperationType(element.operationType, element.menuCode) }}>{element.menuName}</Link></Menu.Item>)
                            }
                        </SubMenu>
                    )
                }
            </Menu>
        )
    }
}