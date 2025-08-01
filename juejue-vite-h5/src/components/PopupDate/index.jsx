import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';

const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
    const [show, setShow] = useState(false); // 组件的显示和隐藏
    const [now, setNow] = useState(new Date());

    const choseMonth = (item) => {
        setNow(item);
        setShow(false);
        if (mode == 'month') {
            onSelect(dayjs(item).format('YYYY-MM'));
        } else if (mode == 'date') {
            onSelect(dayjs(item).format('YYYY-MM-DD'));
        }
    };

    if (ref) {
        ref.current = {
            // 外部可以通过 ref.current.show 来控制组件的显示
            show: () => {
                setShow(true);
            },
            // 外部可以通过 ref.current.close 来控制组件的显示
            close: () => {
                setShow(false);
            }
        }
    }

    return <Popup
        visible={show}
        direction='bottom'
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
    >
        <div>
            <DatePicker
                visible={show}
                value={now}
                mode={mode}
                onOk={choseMonth}
                onCancel={() => setShow(false)}
            />
        </div>
    </Popup>
});

PopupDate.propTypes = {
    mode: PropTypes.string, // 日期模式
    onSelect: PropTypes.func // 选择后的回调
}
export default PopupDate;