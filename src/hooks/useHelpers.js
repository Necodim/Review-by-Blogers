import api from "../api/api";

export function useHelpers() {
	const getPlural = (n, form1, form2, form5) => {
		let nAbs = Math.abs(n) % 100;
		let n1 = n % 10;
		if (nAbs > 10 && nAbs < 20) return form5;
		if (n1 > 1 && n1 < 5) return form2;
		if (n1 == 1) return form1;
		return form5;
	}

	const getMarketplace = async (id) => {
		try {
			// const marketplace = await api.createBarterOffer(id);
			const marketplaces = [
				{
					id: 1,
					name: 'WildBerries',
					shortname: 'WB',
					link: {
						base: 'https://www.wildberries.ru',
						product: {
							start: '/catalog/',
							end: '/detail.aspx'
						}
					}
				}
			];
			const marketplace = marketplaces.find(item => item.id === id);
			return marketplace;
		} catch (error) {
			console.error(error);
		}
	}

	const copyToClipboard = (data, successMessage, errorMessage) => {
		try {
			navigator.clipboard.writeText(data.trim());
			return {status: 'success', message: successMessage};
		} catch (error) {
			console.error(error);
			return {status: 'error', message: errorMessage};
		}
	}

	const getMarketplaceShortName = async (id) => {
		const marketplace = await getMarketplace(id);
		return marketplace.shortname;
	}

	const getMarketplaceProductLink = async (id, productId) => {
		const marketplace = await getMarketplace(id);
		const link = marketplace.link.base + marketplace.link.product.start + productId + marketplace.link.product.end;
		return link;
	}

	const getBarterTitle = (status, role) => {
		const statuses = [
			{
				name: 'queued',
				blogger: 'В очереди',
				seller: 'В очереди',
			},
			{
				name: 'created',
				blogger: 'Предложение создано',
				seller: 'Новое предложение',
			},
			{
				name: 'sended',
				blogger: 'Получите средства',
				seller: 'Средства отправлены',
			},
			{
				name: 'progress',
				blogger: 'Отправьте отчёт №1',
				seller: 'Блогер начал работу',
			},
			{
				name: 'planned',
				blogger: 'Отправьте отчёт №2',
				seller: 'Выбрана дата рекламы',
			},
			{
				name: 'reported',
				blogger: 'Ожидает завершения',
				seller: 'Публикация готова',
			},
			{
				name: 'closed',
				blogger: 'Бартер завершен',
				seller: 'Бартер завершен',
			},
			{
				name: 'refused',
				blogger: 'Отклонено',
				seller: 'Отклонено',
			},
		]
		const object = statuses.find(obj => obj.name === status);
		if (object) {
			return object[role];
		} else {
			return null;
		}
	}

	return {
		getPlural,
		copyToClipboard,
		getMarketplaceShortName,
		getMarketplaceProductLink,
		getBarterTitle,
	}
}