import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useTelegram } from '../../hooks/useTelegram';
import { useToastManager } from '../../hooks/useToast';
import Form from '../../components/Form/Form';
import Textarea from '../../components/Form/Textarea';

const SupportPage = () => {
    const { sendSupportMessage } = api;
    const { isAvailable, showBackButton, user } = useTelegram();
    const { showToast } = useToastManager();
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (isAvailable) showBackButton();
    }, [isAvailable, showBackButton]);

    useEffect(() => {
        if (errorMessage) {
            showToast(errorMessage, 'error');
            setErrorMessage('');
        }
    }, [errorMessage, showToast]);

    useEffect(() => {
        setIsDisabled(!message.trim());
    }, [message]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!message.trim()) return;

        try {
            const response = await sendSupportMessage({ userId: user?.id, message: message });
            if (response.status === 200) {
                showToast('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                setMessage('');
            } else {
                setErrorMessage('Ошибка при отправке сообщения, попробуйте снова');
            }
        } catch (error) {
            setErrorMessage('Ошибка при отправке сообщения, попробуйте снова');
        }
    }

    const handleChange = (event) => {
        console.log(event.target.value);
        console.log(event);
        setMessage(event.target.value);
    }

    return (
        <div className='content-wrapper'>
            <div className='container' id='support'>
                <div className='list'>
                    <div className='list-item'>
                        <h2>Поддержка</h2>
                    </div>
                    <div className='list-item'>
                        <small>Напишите нам, мы постараемся ответить в ближайшее время</small>
                    </div>
                </div>
                <Form onSubmit={handleSubmit} isDisabled={isDisabled} btntext='Отправить'>
                    <Textarea
                        id='question'
                        name='question'
                        placeholder='Задайте вопрос или напишите о неработающем функционале...'
                        value={message}
                        onChange={handleChange}
                    />
                </Form>
            </div>
        </div>
    )
}

export default SupportPage;