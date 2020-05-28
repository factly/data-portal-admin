import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button, AutoComplete, Divider } from 'antd';
import './basic.css';
import logo from '../assets/logo.svg';

import {
  PieChartOutlined,
  LogoutOutlined,
  ContainerOutlined,
  IdcardOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TagOutlined,
  MoneyCollectFilled,
  FilePptOutlined,
} from '@ant-design/icons';

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});

function BasicLayout(props) {
  const { Header, Footer, Sider, Content } = Layout;
  const { children } = props;

  const [options, setOptions] = React.useState([]);
  const [collapsed, setCollapsed] = React.useState(false);

  const onSearch = (searchText) => {
    setOptions(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onSelect = (data) => {
    console.log('onSelect', data);
  };

  return (
    <Layout hasSider={true}>
      <Sider
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        theme="dark"
        trigger={null}
        width="256"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
      >
        <div className="menu-header">
          <img alt="logo" className="menu-logo" src={logo} />
          <span hidden={collapsed} className="menu-company">
            GO COMM
          </span>
        </div>
        <Menu theme="dark" mode="vertical" className="slider-menu">
          <Menu.Item key="1">
            <Link to={'/'}>
              <PieChartOutlined />
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={'/categories'}>
              <TagOutlined />
              <span>Categories</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={'/carts'}>
              <ShoppingCartOutlined />
              <span>Carts</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to={'/currencies'}>
              <MoneyCollectFilled />
              <span>Currencies</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to={'/memberships'}>
              <IdcardOutlined />
              <span>Memberships</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to={'/orders'}>
              <ShoppingOutlined />
              <span>Orders</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to={'/payments'}>
              <CreditCardOutlined />
              <span>Payments</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to={'/plans'}>
              <ContainerOutlined />
              <span>Plans</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link to={'/products'}>
              <ContainerOutlined />
              <span>Products</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="10">
            <Link to={'/tags'}>
              <TagOutlined />
              <span>Tags</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="11">
            <Link to={'/types'}>
              <FilePptOutlined />
              <span>Product Types</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="layout-header">
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            <Divider type="vertical" />
            <AutoComplete
              style={{ width: 300 }}
              options={options}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="Search....."
            />
            <Divider type="vertical" />
            <a
              href={process.env.REACT_APP_KRATOS_PUBLIC_URL + '/self-service/browser/flows/logout'}
            >
              <Button>
                <LogoutOutlined />
                Logout
              </Button>
            </a>
          </div>
        </Header>
        <Content className="layout-content">{children}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
