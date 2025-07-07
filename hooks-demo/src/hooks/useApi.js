import { useEffect, useState } from 'react';

// 自定义 Hook 的使用，在开发中也非常常见，比如有一个请求公共数据的接口，在多个页面中被重复使用，
// 你便可通过自定义 Hook 的形式，将请求逻辑提取出来公用，这也是之前 Class 类组件所不能做到的
// 模拟数据接口，3秒钟返回数据
const getList = (query) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('query', query);
            resolve([6, 7, 8, 9, 10]);
        }, 3000);
    });
};

// 自定义 hook
const useApi = () => {
    const [data, setData] = useState([1, 2, 3, 4, 5]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        (async () => {
            const data = await getList(query);
            // const data = await getList();
            console.log('data', data);
            setData(data);
        })();
    }, [query]);

    return [ { data }, setQuery ];
};

export default useApi;