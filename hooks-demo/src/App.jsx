import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // 重新认识 useEffect
  const [count, setCount] = useState(0);

  /* const handleClick = () => {
    setTimeout(() => {
      console.log('点击次数：' + count);
    }, 3000);
  }; */

  // 问题：视图变了，内容没变？
  // 原理：
  // 函数组件 App，在每一次渲染都会被调用，而每一次调用都会形成一个独立的上下文，可以理解成一个快照。每一次渲染形成的快照，都是互相独立的。

  /* 默认进来的时候，形成一个快照，此时 count 为 0；当我们点击新增按钮第一次，执行 setCount，函数组件被刷新一次，此时的快照中，count 为 1；再次点击按钮，再次生成快照，此时的 count 为 2，此时点击 「展示点击次数」按钮，在这份快照中，我们的 count 参数就是 2。所以我们后面无论怎么新增 count，最终输出的结果 count 就是 2。 */

  // 每一次点击，都会重新执行 useEffect 内的回调，并且 count 值也是当时的快照的一个常量值。
  useEffect(() => {
    setTimeout(() => {
      console.log('点击次数：' + count);
    }, 3000);
  });

  // 区别
  /* 
    函数组件，在每一次渲染都会被调用，而每一次调用都会形成一个独立的上下文，可以理解成一个快照。每一次渲染形成的快照，都是互相独立的。
    类组件，声明之后，会在内部生成一个实例 instance，所有的数据都会存在类的上下文中，所以 this.state.count 会一直指向最新的 count 值
  */

  return (
    <div className='App'>
      <button onClick={() => setCount(count + 1)}>点击{count}次数</button>
      {/* <button onClick={handleClick}>展示点击次数</button> */}
    </div>
  );
}

export default App
