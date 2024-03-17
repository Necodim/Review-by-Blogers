export function callback() {

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
        iconClearCallback,
        submitSubscribeCallback,
    }
}