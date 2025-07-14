import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { NavBar, Icon } from 'zarm';

import s from './style.module.less';

const Header = ({ title = '' }) => {
    const navigateTo = useNavigate();
    return <div className={s.headerWrap}>
        <div className={s.block}>
            {/* 作用：路由返回事件，它不会触发浏览器的刷新，而是改变浏览器的地址栏，让组件匹配地址栏对应的地址组件 */}
            <NavBar
                className={s.header}
                left={<Icon type="arrow-left" theme="primary" onClick={() => navigateTo(-1)} />}
                title={title}
            />
        </div>
    </div>
};

Header.propTypes = {
    title: PropTypes.string, // 标题
};

export default Header;