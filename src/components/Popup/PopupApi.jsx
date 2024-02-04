import React, { useState, useRef, useLayoutEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { callback } from '../../hooks/callback';
import Popup from "./Popup"
import Button from '../Button/Button';
import Form from '../Form/Form';
import Input from '../Form/Input';

const PopupApi = (props) => {
    const [toggle, setToggle] = useState(false);
    const [display, setDisplay] = useState('none');
    const [contentHeight, setContentHeight] = useState(0);
    const ref = useRef(null);

    useLayoutEffect(() => {
        if (ref.current) {
          setContentHeight(ref.current.clientHeight);
        }
      }, [toggle]);

    const animation = useSpring({
        from: { height: 0, opacity: 0, marginTop: '0px', width: '100%' },
        to: {
            height: toggle ? contentHeight : 0,
            opacity: toggle ? 1 : 0,
            marginTop: toggle ? '8px' : '0px',
          },
        onStart: () => {
            if (toggle) setDisplay('block');
        },
        onRest: () => {
            if (!toggle) setDisplay('none');
        },
        config: { duration: 300 },
    });

    const toggleVisibility = () => {
        if (!toggle) {
            setDisplay('block');
        }
        setToggle(!toggle);
    }

    const { submitApiCallback, iconClearCallback } = callback();

    const apiPopupHeader = () => {
        return (
            <div className='list'>
                <div className='list-item'>
                    <h2>API-ключ</h2>
                    <Button className='link' onClick={toggleVisibility}>Где взять?</Button>
                </div>
                <animated.div className='list-item' style={{ ...animation, display }}>
                    <div ref={ref} className='hint-wrapper'>Ищите на Wildberries<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Enim ut sem viverra aliquet eget sit amet. Eget gravida cum sociis natoque penatibus et magnis dis parturient. Egestas congue quisque egestas diam in arcu cursus. Tristique risus nec feugiat in fermentum posuere urna nec tincidunt.<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Enim ut sem viverra aliquet eget sit amet. Eget gravida cum sociis natoque penatibus et magnis dis parturient. Egestas congue quisque egestas diam in arcu cursus. Tristique risus nec feugiat in fermentum posuere urna nec tincidunt.</div>
                </animated.div>
            </div>
        )
    }

    const apiPopupInput = () => {
        return (
            <Input
                id='input-api'
                title='Введите API-ключ'
                icon='backspace'
                iconcallback={iconClearCallback}
                fade='true'
                placeholder='eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwM'
            />
        )
    }

    const apiPopupForm = () => {
        return (
            <Form className='form-wrapper' btnicon='save' btntext='Сохранить' onSubmit={submitApiCallback}>
                {apiPopupInput()}
            </Form>
        )
    }

    const apiPopupHint = () => {
        return (<small>При сохранении все товары обновятся</small>)
    }

    return (
        <Popup id='popup-api' isOpen={props.isOpen} onClose={props.onClose}>
            {apiPopupHeader()}
            {apiPopupForm()}
            {apiPopupHint()}
        </Popup>
    )
}

export default PopupApi