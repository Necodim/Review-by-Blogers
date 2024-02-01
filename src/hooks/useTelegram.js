const tg = window.Telegram.WebApp;

export function useTelegram() {
    const onClose = () => {
        tg.close()
    }

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }

    const showBackButton = () => {
        tg.BackButton.show();
    }

    const showPopup = (params) => {
        tg.showPopup(params);
    }

    const settingsButton = (boolean = true) => {
        boolean ? tg.SettingsButton.show() : tg.SettingsButton.hide();
    }

    return {
        onClose,
        onToggleButton,
        showBackButton,
        showPopup,
        settingsButton,
        tg,
        user: tg.initDataUnsafe?.user
    }
}