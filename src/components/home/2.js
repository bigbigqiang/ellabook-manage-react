import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'
import { hashHistory } from 'react-router'
const SubMenu = Menu.SubMenu;
const util = require('../util.js');
export default class LeftSider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: null,
            subMenu: [],
            firstAllMenu: [],
            menuItem: []
        }
    }

    async fetchFn() {
        var doc = {
            uid: localStorage.getItem('uid')
        };
        await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.findUserLeftMenu" + "&content=" + JSON.stringify(doc)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            let openKeys = [];
            let current = null;
            let CurrentLocation_pathname = hashHistory.getCurrentLocation().pathname;
            let firstMenuList = data.data.filter((item) => {
                return item.menuLevel == 1;
            });
            let secondMenuList = data.data.filter((item) => {
                return (item.menuLevel == 2 && item.menuName != '勋章管理');
            });
            firstMenuList.forEach(element => {
                element.childMenu = secondMenuList.filter(Item => Item.parentCode === element.menuCode);
            })
            if (CurrentLocation_pathname === '/') {
                openKeys = []
            } else {
                if (localStorage.getItem('current')) {
                    let currentKeys = secondMenuList.filter(Item => Item.menuCode === localStorage.getItem('current'))
                    if (currentKeys.length) {
                        openKeys = [currentKeys[0].parentCode];
                        current = currentKeys[0].menuCode;
                    } else {
                        openKeys = [];
                        current = null
                    }
                }
            }
            this.setState({
                secondMenuList: secondMenuList,
                subMenu: firstMenuList,
                current: current
            })
            this.props.setOpenKey(openKeys)
        });
    }

    setOperationType(operationType, key) {
        this.setState({
            current: key
        })
        localStorage.setItem('current', key);
        localStorage.setItem('operationType', operationType);
    }

    componentDidMount() {
        this.fetchFn();
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