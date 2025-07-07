import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useApi from './hooks/useApi';

function App() {
  // 自定义 Hooks 例子
  const [{ data }, setQuery] = useApi();
  
  return (
    <div className='App'>
      {
        data.map((item, index) => <span key={index}>{item}</span>)
      }
      <input type="text" onChange={(e) => setQuery(e.target.value)} placeholder='请输入搜索值' />
    </div>
  );
}

export default App
