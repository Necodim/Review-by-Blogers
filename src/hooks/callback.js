import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useTelegram } from "./useTelegram";
import { useUserProfile } from "../UserProfileContext"
import { useToastManager } from "./useToast";

export function callback() {
    const { updateRole, setApi } = api;
    const { tg, user } = useTelegram();
    const { profile } = useUserProfile();
    const { showToast, resetLoadingToast } = useToastManager();

    // Для тестов
    const userId = user?.id || profile.id;

    const navigate = useNavigate();

    const roleCallback = (e) => {
        const role = e.target.dataset.role;
        // Предполагаем, что updateRole возвращает Promise
        updateRole(user?.id, role)
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

    const submitApiCallback = (formValues, onSuccess) => {
        showToast('Отправка данных...', 'loading');

        setApi(userId, formValues.api)
            .then(res => {
                showToast(res.message, 'success');
                onSuccess();
            })
            .catch(error => {
                showToast(error.message, 'error');
                console.error(`${error.message}:`, error);
                tg ? tg.showAlert(error.message + '. Попробуйте ещё раз.') : alert(errorText);
            });
    };

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