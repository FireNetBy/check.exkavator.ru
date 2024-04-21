const randomValue = Math.floor(Math.random() * 10_000);
const isLangRu = !!(~navigator.language.indexOf('ru'));
const endPoints = [
	{
		name: 'MAIN-https',
		data: [
			{name: 'exkavator.ru', url: 'https://exkavator.ru/'},
            {name: 'b.exkavator.ru', url: 'https://b.exkavator.ru/del/asjs.php'},
            {name: 'my.exkavator.ru', url: 'https://my.exkavator.ru/'},
            {name: 'corp.exkavator.ru', url: 'https://corp.exkavator.ru/'},
            {name: 'forum.exkavator.ru', url: 'https://forum.exkavator.ru/'},
		],
	},
	{
		name: 'MAIN-http',
		data: [
			{name: 'exkavator.ru', url: 'http://exkavator.ru/'},
		],
	},
	{
		name: 'CDN',
		data: [
			{name: 'cdnba.exkavator.ru',url: 'https://cdnba.exkavator.ru/monit.txt',},
		],
	},
	{
		name: 'OTHER',
		data: [
			{name: 'gruzovoy.ru',url: 'https://gruzovoy.ru',},
		],
	},
];

const containerBottom = document.createElement('div');
containerBottom.classList.add('container');
const largeCard = document.createElement('div');
largeCard.classList.add('card');
containerBottom.append(largeCard);

function createCard(titleValue, point) {
	const card = document.createElement('div');
	card.classList.add('card__element');
	const cardTitle = document.createElement('h2');
	cardTitle.classList.add('card__title');
	cardTitle.textContent = titleValue;
	card.append(cardTitle);
	point.forEach((data) => {
		const cardItemList = document.createElement('div');
		cardItemList.classList.add('card__item');
		const cardItemListText = document.createElement('span');
		cardItemListText.textContent = data.name;
		cardItemList.append(cardItemListText);
		const cardItemListLoader = document.createElement('span');
		cardItemListLoader.classList.add('card__loader');
		const loader = document.createElement('div');
		loader.classList.add('speed-block-item', 'loading');
		cardItemListLoader.append(loader);
		cardItemList.append(cardItemListLoader);
		card.append(cardItemList);
		fetchResult(data.url, cardItemList);
	});
	largeCard.append(card);
}

async function fetchResult(url, item) {
	const controller = new AbortController();
	const timeout = 25000;
	let timeoutFlag = false;
	const timeoutId = setTimeout(() => {
		timeoutFlag = true;
		controller.abort();
	}, timeout);
	const startTime = new Date().getTime();
	let initParam;
	if (url.includes('static') || url.includes('thumb')) {
		initParam = {
			signal: controller.signal,
		};
	} else {
		initParam = {
			credentials: 'include',
			signal: controller.signal,
		};
	}

	try {
		let resp = await fetch(url, initParam);
		const endTime = new Date().getTime() - startTime;
		const loader = item.querySelector('.card__loader');
		if (resp.status === 200) {
			item.classList.add('active');
			loader.textContent = ` ${endTime}ms`;
		} else if (resp.status >= 300 && resp.status <= 600) {
			item.classList.add('error');
			loader.textContent = `err${resp.status}, ${endTime}ms`;
		}
	} catch (err) {
		const endTime = new Date().getTime() - startTime;
		item.classList.add('error');
		const loader = item.querySelector('.card__loader');
		clearTimeout(timeoutId);
		if (timeoutFlag) {
			loader.textContent = ` timeout, ${timeout / 1000}s`;
		} else {
			loader.textContent = ` err0, ${err.message}, ${endTime}ms`;
		}
	}
}

endPoints.forEach((obj) => {
	createCard(obj.name, obj.data);
});

const containerTopBg = document.createElement('div');
containerTopBg.classList.add('container--top');
const containerTop = document.createElement('div');
containerTop.classList.add('container');
containerTopBg.append(containerTop);
document.body.append(containerTopBg, containerBottom);

const containerTopFirst = document.createElement('div');
containerTopFirst.classList.add('row');
const col1 = document.createElement('div');
col1.classList.add('col');
const col2 = document.createElement('div');
col2.classList.add('col');
const col3 = document.createElement('div');
col3.classList.add('col');
const col4 = document.createElement('div');
col4.classList.add('col');
containerTopFirst.append(col1, col2, col3, col4);
containerTop.append(containerTopFirst);

const containerTopSecond = document.createElement('div');
containerTopSecond.classList.add('row');
const largeContainerSecond = document.createElement('div');
largeContainerSecond.classList.add('col', 'col--lg');
const smallContainerSecond = document.createElement('div');
smallContainerSecond.classList.add('col');
containerTopSecond.append(largeContainerSecond, smallContainerSecond);
containerTop.append(containerTopSecond);

function createContent(titleText, ValueText, parent) {
	const title = document.createElement('div');
	title.classList.add('main-info__title');
	title.textContent = titleText;
	const dataValue = document.createElement('div');
	dataValue.classList.add('main-info__data');
	if (typeof ValueText === 'string') {
		dataValue.textContent = ValueText;
	} else {
		dataValue.append(ValueText);
	}
	parent.append(title, dataValue);
}

fetch('http://check.tildacdn.com/getip')
	.then((response) => response.text())
	.then((response) => {
		createContent('IP', response, col1);
	});

fetch('https://geoserv.tildacdn.com/geo/full/')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		var usrLocation = '';
		if (
			data['country'] !== undefined &&
			data['country']['name_en'] !== undefined
		) {
			usrLocation += data['country']['name_en'] + ', ';
		}
		if (
			data['region'] !== undefined &&
			data['region']['name_en'] !== undefined
		) {
			usrLocation += data['region']['name_en'] + ', ';
		}
		if (data['city'] !== undefined && data['city']['name_en'] !== undefined) {
			usrLocation += data['city']['name_en'];
		}
		createContent('Location', usrLocation, col2);
	});

const userAgentValue = navigator.userAgent;
createContent('Browser', userAgentValue, largeContainerSecond);

const langValue = navigator.language + ' | ' + navigator.languages;
createContent('Language', langValue, col3);

const fullTimeString = new Date().toLocaleString();
const timeZoneValue = new Date().getTimezoneOffset() / 60;
let timeZone = '';
if (timeZoneValue > 0) {
	timeZone = -timeZoneValue;
}
if (timeZoneValue < 0) {
	timeZone = '+' + -timeZoneValue;
}
if (timeZoneValue === 0) {
	timeZone = 0;
}
const fullTime = fullTimeString + ' / GTM ' + timeZone;
createContent('Time', fullTime, col4);

const speedBlock = document.createElement('div');
speedBlock.classList.add('speed-block-item', 'loading');
createContent('Speed', speedBlock, smallContainerSecond);
const urlSpeedTest = `http://tilda.ws/testspeedfileajax/?${randomValue}`;
const urlSizeMegabites = 168;

function getSpeed(url, size) {
	const start = Date.now();
	fetch(url)
		.then((resp) => resp.text())
		.then((data) => {
			const time = (Date.now() - start) / 1e3;
			const speed = size / time;
			speedBlock.classList.remove('loading');
			speedBlock.textContent = speed.toFixed(2) + ' Mbit/s';
		});
}

getSpeed(urlSpeedTest, urlSizeMegabites);

const metaTag = document.createElement('meta');
metaTag.setAttribute('name', 'viewport');
metaTag.setAttribute('content', 'width=device-width, initial-scale=1.0');
document.head.append(metaTag);

function createErrorMessage(ru, eng) {
	input.classList.add('error');
	if (!document.querySelector('.error-message')) {
		const errorMessage = document.createElement('p');
		errorMessage.classList.add('error-message');
		if (isLangRu) {
			errorMessage.textContent = ru;
		} else {
			errorMessage.textContent = eng || ru;
		}
		form.append(errorMessage);
	}
}

function getUrlStatus(data, postfix = '') {
	const arrayOfUrl = data[url]['NS'];
	const arrayOfIP = data[url]['A'];
	const mainArr = arrayOfUrl.concat(arrayOfIP);
	mainArr.forEach((url) => {
		const cardItemList = document.createElement('div');
		cardItemList.classList.add('card__item');
		cardItemList.textContent = url;
		formList.append(cardItemList);
		fetchResult('http://' + url + postfix, cardItemList);
	});
}