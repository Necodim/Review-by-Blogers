import { useNavigate, useLocation } from 'react-router-dom';

export function useTelegram() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const tg = window.Telegram.WebApp;

    const isAvailable = () => !!tg;

    const close = () => {
        if (isAvailable()) {
            tg.close();
        } else {
            console.log('Telegram WebApp API не доступно');
        }
    }

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }

    const backButtonCallback = () => {
        // if (location.pathname.startsWith('/settings')) {
        //     navigate('/profile');
        // } else {
        //     navigate(-1);
        // }
        window.history.back();
    }

    const showBackButton = () => {
        tg.BackButton.offClick(backButtonCallback);
        tg.BackButton.onClick(backButtonCallback);
        tg.BackButton.show();
    }

    const hideBackButton = () => {
        tg.BackButton.offClick(backButtonCallback);
        tg.BackButton.hide();
    }

    const showPopup = (params) => {
        tg.showPopup(params);
    }

    const settingsButtonCallback = () => {
        navigate('/settings');
    }

    const settingsButton = (boolean) => {
        if (boolean) {
            tg.SettingsButton.show();
            tg.SettingsButton.onClick(settingsButtonCallback);
        } else {
            tg.SettingsButton.hide();
            tg.SettingsButton.offClick(settingsButtonCallback);
        }
    }

    const hapticFeedback = (object) => {
        // object = {
        //     type: ['impact', 'notification', 'selection'],
        //     style: ['light', 'medium', 'heavy', 'rigid', 'soft', 'error', 'success', 'warning'],
        // }
        switch (object.type) {
            case 'impact':
              tg.HapticFeedback.impactOccurred(object.style);
              break;
            case 'notification':
              tg.HapticFeedback.notificationOccurred(object.style);
              break;
            case 'selection':
              tg.HapticFeedback.selectionChanged();
              break;
            default:
              break;
          }
    }

    const listenViewportChanged = () => {
        tg.onEvent('viewportChanged', () => {
            window.dispatchEvent(new Event('resize'));
        })
    }

    const defaultSettings = () => {
        // const theme = tg.themeParams;
        // theme.bg_color = '#1C4366';
        // theme.text_color = '#FFFFFF';
        // theme.hint_color = '#93ADC5';
        // theme.link_color = '#FFFFFF';
        // theme.button_color = '#47A7FF';
        // theme.button_text_color = '#FFFFFF';
        // theme.secondary_bg_color = '#1C4366';
        // theme.header_bg_color = '#0E2133';
        // theme.accent_text_color = '#91CAFF';
        // theme.section_bg_color = '#0E2133';
        // theme.section_header_text_color = '#0E2133';
        // theme.subtitle_text_color = '#93ADC5';
        // theme.destructive_text_color = '#FF474B';
        tg.setHeaderColor('#0E2133');
        tg.setBackgroundColor('#1C4366');
        tg.enableClosingConfirmation();
        tg.expand();
        showBackButton();
        settingsButton(true);
        listenViewportChanged();
    }

    return {
        isAvailable,
        close,
        onToggleButton,
        showBackButton,
        hideBackButton,
        showPopup,
        settingsButton,
        hapticFeedback,
        defaultSettings,
        tg,
        user: tg.initDataUnsafe?.user
    }
}