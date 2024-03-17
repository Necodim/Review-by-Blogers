import { useNavigate } from 'react-router-dom';

export function useTelegram() {
    let navigate = useNavigate();
    
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

    const BackButton = () => {
        const backButtonCallback = () => {
            navigate(-1);
        }
        tg.BackButton.offClick(backButtonCallback);
        tg.BackButton.onClick(backButtonCallback);
    }

    const showBackButton = () => {
        tg.BackButton.show();
    }

    const showPopup = (params) => {
        tg.showPopup(params);
    }

    const settingsButton = (boolean) => {
        const settingsButtonCallback = () => {
            navigate('settings');
        }

        if (boolean) {
            tg.SettingsButton.show();
            tg.SettingsButton.onClick(settingsButtonCallback);
        } else {
            tg.SettingsButton.hide();
            tg.SettingsButton.offClick(settingsButtonCallback);
        }
    }

    const defaultSettings = () => {
        // const theme = tg.themeParams;
        // theme.bg_color = '#0E2133';
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
        // theme.destructive_text_color = '#992B64';
        tg.setHeaderColor('#0E2133');
        BackButton();
        settingsButton(false);
        settingsButton(true);
    }

    return {
        isAvailable,
        close,
        onToggleButton,
        showBackButton,
        showPopup,
        settingsButton,
        defaultSettings,
        tg,
        user: tg.initDataUnsafe?.user
    }
}