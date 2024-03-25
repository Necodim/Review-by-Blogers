import React, { useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import Form from '../../components/Form/Form';
import Textarea from '../../components/Form/Textarea';

const SupportPage = () => {
    const { isAvailable, showBackButton, user } = useTelegram();

    useEffect(() => {
        if (isAvailable) showBackButton();
    }, [isAvailable, showBackButton]);

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
                <Form onSubmit={handleSubmit} isDisabled={true} btntexxt='Отправить'>
                    <Textarea
                        id='question'
                        name='question'
                        placeholder='Задайте вопрос или напишите о неработающем функционале...'
                    />
                </Form>
            </div>
        </div>
    )
}

export default SupportPage;