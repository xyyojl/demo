import { useEffect, useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Child({ callback }) {
  useEffect(() => {
    callback();
  }, [callback]);

  return <div>子组件</div>
};

function App() {
  // useCallback 例子
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [kw, setKw] = useState('');

  // 问题：当我们修改任何状态值，都会触发子组件的回调函数执行，但是 callback 没有作任何变化。
  // const callback = () => {
  //   console.log('我是 callback');
  // };

  // 无论修改其他任何属性，都不会触发子组件的副作用
  const callback = useCallback(() => {
    console.log('我是 callback');
  }, []);

  return (
    <div className='App'>
      <input type="text" onChange={(e) => setName(e.target.value)} placeholder='请输入姓名' />
      <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder='请输入电话' />
      <input type="text" onChange={(e) => setKw(e.target.value)} placeholder='请输入姓名关键词' />
      <Child callback={callback} />
    </div>
  );
}

export default App
