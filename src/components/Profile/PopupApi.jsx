import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useEvents } from '../../hooks/useEvents';
import Popup from "../Popup/Popup"
import Link from '../Button/Link';
import Form from '../Form/Form';
import Input from '../Form/Input';
import imgInstruction1 from '../../images/instruction-1.png';
import imgInstruction2 from '../../images/instruction-2.png';
import imgInstruction3 from '../../images/instruction-3.png';
import imgInstruction4 from '../../images/instruction-4.png';

const PopupApi = (props) => {
    const { handleFocus } = useEvents();

    const [formData, setFormData] = useState({
        'api': ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [display, setDisplay] = useState('none');
    const [contentHeight, setContentHeight] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const isValid = formData.api.trim() !== '';
        setIsFormValid(isValid);
    }, [formData]);

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

    const apiPopupHeader = () => {
        return (
            <div className='list'>
                <div className='list-item'>
                    <h2>API-ключ</h2>
                    <Link onClick={toggleVisibility}>Где взять?</Link>
                </div>
                <animated.div className='list-item' style={{ ...animation, display }}>
                    <div ref={ref} className='hint-wrapper list'>
                        <div className='list-item vertical'>
                            <p>Войдите в настройки профиля.</p>
                            <img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction1} />
                        </div>
                        <div className='list-item vertical'>
                            <p>Откройте вкладку «Доступ к API» и нажмите кнопку «Создать новый токен».</p>
                            <img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction2} />
                        </div>
                        <div className='list-item vertical'>
                            <p>Задайте имя токена, поставьте галочку «Только на чтение...», выберите «Контент» и нажмите кнопку «Создать токен». Чтобы не запутаться в будущем, рекомендуем дать имя «review-by-bloggers», так вы будете понимать, для какого сервиса создали токен.</p>
                            <img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction3} />
                        </div>
                        <div className='list-item vertical'>
                            <p>Скопируйте токен, вставьте в поле ниже и нажмите «Сохранить».</p>
                            <img style={{ width: '100%', borderRadius: 'var(--xs)' }} src={imgInstruction4} />
                        </div>
                    </div>
                </animated.div>
            </div>
        )
    }

    const handleApiChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const iconClearCallback = (event) => {
        const input = event.target.closest('.input-wrapper').querySelector('input');
        input.value = '';
        setFormData(prev => ({ ...prev, [input.name]: input.value }));
    }

    const apiPopupInput = () => {
        return (
            <Input
                id='input-api'
                name='api'
                title='Введите API-ключ'
                icon='backspace'
                iconCallback={iconClearCallback}
                fade='true'
                placeholder='eyJhbGciOiJ...'
                value={formData.api}
                onChange={handleApiChange}
                onFocus={handleFocus}
            />
        )
    }

    const apiPopupForm = () => {
        return (
            <Form className='form-wrapper' btnicon='save' btntext='Сохранить' isDisabled={!isFormValid} onSubmit={props.onSubmit}>
                {apiPopupInput()}
            </Form>
        )
    }

    const apiPopupHint = () => {
        return (<small>При сохранении все товары обновятся</small>)
    }

    return (
        <Popup id={props.id} isOpen={props.isOpen} onClose={props.onClose} {...props}>
            {apiPopupHeader()}
            {apiPopupForm()}
            {apiPopupHint()}
        </Popup>
    )
}

export default PopupApi