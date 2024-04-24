import React, { useState } from 'react';
import api from '../../api/api';
import { useUserProfile } from '../../hooks/UserProfileContext.js';
import Popup from './Popup';
import Form from '../Form/Form';
import Textarea from '../Form/Textarea';
import Input from '../Form/Input';

const PopupWriteTask = ({ isOpen, onClose, selectedProducts }) => {
    const { profile } = useUserProfile();

    const [task, setTask] = useState('');
    const [brandInstagram, setBrandInstagram] = useState('');
    const [feedback, setFeedback] = useState(false);

    const handleTaskChange = (e) => setTask(e.target.value);
    const handleBrandInstagramChange = (e) => setBrandInstagram(e.target.value);
    const handleFeedbackChange = (e) => setFeedback(e.target.checked);

    const submitForm = (e) => {
        const formData = new FormData(e.target)
        if (selectedProducts.length === 1) {
            const data = {
                userId: profile.id,
                productId: selectedProducts[0].id,
                task: formData.get('description'),
                brandInstagram: formData.get('brand-instagram'),
                needFeedback: formData.get('feedback'),
                // maxResponses: null
            }
            api.createBarter(data);
        } else {
            // сделать метод для массового добавления бартеров
        }
    }

    return (
        <Popup id='popup-write-task' isOpen={isOpen} onClose={onClose}>
            <h2>Техническое задание</h2>
            <div>Что блогер должен сказать о товаре?</div>
            <Form onSubmit={submitForm} btntext='Сохранить' btnicon='save'>
                <Textarea
                    id='description' 
                    name='description' 
                    title='Описание' 
                    placeholder='Необходимо распаковать товар на камеру и...' 
                >{task}</Textarea>
                <Input
                    id='brand-instagram' 
                    name='brand-instagram' 
                    title='Instagram бренда, если есть' 
                    placeholder='username' 
                    value={brandInstagram} 
                    onChange={handleBrandInstagramChange} 
                    comment='Укажите аккаунт вашего бренда в Instagram, если хотите, чтобы блогер вас отметил' 
                />
                <Input
                    type='checkbox' 
                    id='feedback' 
                    name='feedback' 
                    title='Сбор отзывов' 
                    label='Отметьте, если хотите, чтобы блогер обязательно оставил отзыв' 
                    checked={feedback} 
                    onChange={handleFeedbackChange} 
                />
            </Form>
            {/* <small>Укажите аккаунт бренда в instagram, если хотите, чтобы блогер вас отметил</small>
            <small>Отметьте, если хотите, чтобы блогер оставил отзыв</small> */}
        </Popup>
    );
};

export default PopupWriteTask;
