import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Cell } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';
import { typeMap } from '@/utils';

import s from './style.module.less';

const BillItem = ({ bill }) => {
    const [income, setIncome] = useState(0); // 收入
    const [expense, setExpense] = useState(0); // 支出
    const navigateTo = useNavigate(); // 路由实例

    // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算
    useEffect(() => {
        // 初始化将传入的 bill 内的 bills 数据内数据项，过滤出支出和收入
        // pay_type：1 为支出；2 为收入
        // 通过 reduce 累加
        const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
            curr += Number(item.amount);
            return curr;
        }, 0);
        setIncome(_income);
        const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
            curr += Number(item.amount);
            return curr;
        }, 0);
        setExpense(_expense);
    }, [bill.bills]);

    // 前往账单详情
    const goToDetail = (item) => {
        navigateTo(`/detail?id=${item.id}`);
    };

    return <div className={s.item}>
        <div className={s.headerDate}>
            <div className={s.date}>{bill.date}</div>
            <div className={s.money}>
                <span>
                    <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
                    <span>¥{ expense.toFixed(2) }</span>
                </span>
                <span>
                    <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
                    <span>¥{ income.toFixed(2) }</span>
                </span>
            </div>
        </div>
        {
            bill && bill.bills.map(item => <Cell
                className={s.bill}
                key={item.id}
                onClick={() => goToDetail(item)}
                title={
                    <>
                        <CustomIcon
                            className={s.itemIcon}
                            type={item.type_id ? typeMap[item.type_id].icon : 1}
                        />
                        <span>{ item.type_name }</span>
                    </>
                }
                description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>
                    {`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}
                </span>}
                help={<div>
                    {dayjs(Number(item.date)).format('HH:mm')}
                    {item.remark ? `| ${item.remark}` : ''}
                </div>}
            ></Cell> )
        }
    </div>
};

BillItem.propTypes = {
    bill: PropTypes.object
}

export default BillItem;