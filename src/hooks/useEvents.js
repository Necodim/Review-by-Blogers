export function useEvents() {

	const handleFocus = (event) => {
		const element = event.target;
		setTimeout(() => {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 300);
	}

	return {
		handleFocus,
	}
}