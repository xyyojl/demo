/* import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App */


import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
// 不使用全局引入样式，改用按需引入
// import 'zarm/dist/zarm.css';

import NavBar from '@/components/NavBar';

import routes from '@/router';

function App() {
  const location = useLocation(); // 拿到 location 实例
  const { pathname } = location; // 获取当前路径
  const needNav = ['/', '/data', '/user']; // 需要底部导航栏的路径
  const [showNav, setShowNav] = useState(false);
  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]); // [] 内的参数若是变化，便会执行上述回调函数
  return <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
      <>
        <Routes>
          { routes.map(route =><Route exact key={route.path} path={route.path} element={<route.component />} />) }
        </Routes>
        <NavBar showNav={showNav} />
      </>
    </ConfigProvider>
}

export default App;
