import { useEffect, useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Child({ data }) {
  useEffect(() => {
    console.log('查询条件：', data);
  }, [data]);

  return <div>子组件</div>
};

function App() {
  // useMemo 例子
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [kw, setKw] = useState('');

  // 这种方式，有个问题：子组件并没有监听 kw 的变化，但是结果却是子组件也被触发渲染了
  // 原因大概是 data 数据发生改变，导致子组件重新渲染
  // const data = {
  //   name,
  //   phone
  // };

  // 它相当于把父组件需要传递的参数做了一个标记，无论父组件其他状态更新任何值，都不会影响要传递给子组件的对象。
  // Q：还是不太理解
  const data = useMemo(() => ({
    name,
    phone
  }), [name, phone]);

  return (
    <div className='App'>
      <input type="text" onChange={(e) => setName(e.target.value)} placeholder='请输入姓名' />
      <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder='请输入电话' />
      <input type="text" onChange={(e) => setKw(e.target.value)} placeholder='请输入姓名关键词' />
      <Child data={data} />
    </div>
  );
}

export default App
