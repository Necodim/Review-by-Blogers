import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useTelegram } from "./useTelegram";

export function callback() {
    const { updateRole } = api;
    const { tg, user } = useTelegram();

    const navigate = useNavigate();

    const roleCallback = (e) => {
        const role = e.target.dataset.role;
        // Предполагаем, что updateRole возвращает Promise
        updateRole(82431798, role)
            .then(user => {
                console.log(user);
                navigate('/' + user.role);
            })
            .catch(error => {
                const errorText = 'Произошла ошибка при выборе роли пользователя';
                console.error(`${errorText}:`, error);
                tg ? tg.showAlert(errorText + '. Попробуйте ещё раз.') : alert(errorText);
            });
    }
    

    const submitApiCallback = (e) => {
        e.preventDefault();
        console.log(e)
        console.log(e.target)
    }

    const iconClearCallback = (e) => {
        e.preventDefault();
        const input = e.target.closest('.input-wrapper').querySelector('input');
        input.value = '';
    }

    const submitSubscribeCallback = (e) => {
        e.preventDefault();
        console.log(e)
        console.log(e.target)
    }

    return {
        roleCallback,
        submitApiCallback,
        iconClearCallback,
        submitSubscribeCallback,
    }
}