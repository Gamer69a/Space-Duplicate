localforage.setItem('e', 'e');
shapePositions = {
	blank: '26.5px',
	performance: '65px',
	themes: '103.5px',
	proxy: '142px',
	account: '180.5px',
	about: '219px',
	news: '257.5px'
};

document.addEventListener('click', function (event) {
	const dropdowns = document.querySelectorAll('.dropdown');

	dropdowns.forEach(function (dropdown) {
		const toggle = dropdown.querySelector('.dropdown-toggle');
		const selectedSpan = toggle.querySelector('.dropdown-selected');
		const menu = dropdown.querySelector('.dropdown-menu');
		const items = menu.querySelectorAll('li');

		if (toggle.contains(event.target)) {
			toggle.classList.toggle('active');
			menu.style.display =
				menu.style.display === 'block' ? 'none' : 'block';
		} else if (menu.contains(event.target)) {
			const selectedOption = event.target;
			if (selectedOption.tagName === 'LI') {
				const newText = selectedOption.textContent.trim();
				selectedSpan.textContent = newText;
				items.forEach(function (item) {
					item.classList.remove('hidden');
				});
				selectedOption.classList.add('hidden');
				toggle.classList.remove('active');
				menu.style.display = 'none';
				if (dropdown.classList.contains('dropdown-memory')) {
					const dropdownId = dropdown.id;
					localStorage.setItem(
						'dropdown-selected-text-' + dropdownId,
						newText
					);
					location.reload();
				}
			}
		} else {
			toggle.classList.remove('active');
			menu.style.display = 'none';
		}
	});
});

function showPageFromHash() {
	var hash = window.location.hash || '';
	// Extract the settings sub-page from hash like #/~#/blank
	var settingsSubPage = '';
	if (hash.includes('#/~#/')) {
		settingsSubPage = hash.split('#/~#/')[1] || '';
	} else if (hash.includes('#/~#')) {
		settingsSubPage = hash.split('#/~#')[1] || '';
	}
	// Also handle simple hash like #blank (for backwards compat)
	if (!settingsSubPage && hash.startsWith('#') && !hash.startsWith('#/')) {
		settingsSubPage = hash.slice(1);
	}

	const pages = document.querySelectorAll('.scontent');
	let pageToShow = document.getElementById('blank');

	pages.forEach(page => {
		page.style.display = 'none';
	});

	if (settingsSubPage) {
		const targetPage = document.getElementById(settingsSubPage);
		if (targetPage) {
			pageToShow = targetPage;
			pageToShow.style.display = 'block';
		}
	} else {
		pageToShow.style.display = 'block';
	}

	const settingItems = document.querySelectorAll('.settingItem');
	let foundActive = false;

	settingItems.forEach(item => {
		if (item.dataset.id === settingsSubPage) {
			shapePositions = {
				blank: '26.5px',
				performance: '65px',
				themes: '103.5px',
				proxy: '142px',
				account: '180.5px',
				about: '219px',
				news: '257.5px',
				faq: '296px'
			};

			item.classList.add('sideActive');
			document
				.querySelector('.settingsShape')
				.setAttribute(
					'style',
					'top: ' + shapePositions[item.dataset.id]
				);
			foundActive = true;
		} else {
			item.classList.remove('sideActive');
		}
	});

	if (!foundActive) {
		const defaultSettingItem = document.querySelector(
			'.settingItem[data-id="blank"]'
		);
		if (defaultSettingItem) {
			defaultSettingItem.classList.add('sideActive');
		}
	}
}

function setupHashChangeListener() {
	window.addEventListener('hashchange', showPageFromHash);
}

function preventDefaultLinkBehavior() {
	const settingItems = document.querySelectorAll('.settingItem');
	settingItems.forEach(item => {
		item.addEventListener('click', event => {
			event.preventDefault();
			const targetHash = item.dataset.id;
			if (targetHash) {
				window.location.hash = '/~#/' + targetHash;
			}
		});
	});
}

setupHashChangeListener();
preventDefaultLinkBehavior();
showPageFromHash();

function setCheckboxState() {
	const launchType = localStorage.getItem('launchType');
	if (launchType === 'blob') {
		document.querySelector('.autoLaunchBlob').checked = true;
	} else if (launchType === 'aboutBlank') {
		document.querySelector('.autoLaunchAboutBlank').checked = true;
	}
}

function handleCheckboxChange() {
	document.querySelectorAll('.checkbox-blob-aboutBlank').forEach(checkbox => {
		checkbox.addEventListener('change', function () {
			if (this.checked) {
				document
					.querySelectorAll('.checkbox-blob-aboutBlank')
					.forEach(otherCheckbox => {
						if (otherCheckbox !== this) {
							otherCheckbox.checked = false;
						}
					});
				if (this.classList.contains('autoLaunchBlob')) {
					localStorage.setItem('launchType', 'blob');
				} else if (this.classList.contains('autoLaunchAboutBlank')) {
					localStorage.setItem('launchType', 'aboutBlank');
				}
			} else {
				localStorage.removeItem('launchType');
			}
		});
	});
}

setCheckboxState();
handleCheckboxChange();

document.addEventListener('DOMContentLoaded', function () {
	const dropdowns = document.querySelectorAll('.dropdown.dropdown-memory');

	dropdowns.forEach(function (dropdown) {
		const dropdownId = dropdown.id;
		const selectedText = localStorage.getItem(
			'dropdown-selected-text-' + dropdownId
		);
		if (selectedText) {
			const toggle = dropdown.querySelector('.dropdown-toggle');
			const selectedSpan = toggle.querySelector('.dropdown-selected');
			const menu = dropdown.querySelector('.dropdown-menu');
			const items = menu.querySelectorAll('li');

			selectedSpan.textContent = selectedText;

			items.forEach(function (item) {
				item.classList.remove('hidden');
				if (item.textContent.trim() === selectedText) {
					item.classList.add('hidden');
				}
			});
		}
	});

	function checkboxToggle(checkboxClass, storageKey, defaultChecked) {
		const checkbox = document.querySelector('.checkbox.' + checkboxClass);

		if (localStorage.getItem(storageKey) === null) {
			localStorage.setItem(storageKey, defaultChecked ? 'false' : 'true');
		}

		const isHidden = localStorage.getItem(storageKey) === 'true';
		checkbox.checked = !isHidden;

		checkbox.addEventListener('change', function () {
			localStorage.setItem(
				storageKey,
				checkbox.checked ? 'false' : 'true'
			);
		});
	}

	checkboxToggle('utilBarYesNo', 'utilBarHidden', true);
	checkboxToggle('particlesYesNo', 'particlesHidden', true);
	checkboxToggle('smallIconsYesNo', 'smallIcons', true);
	checkboxToggle('passwordYesNo', 'passwordOff', false);
});

function preventScroll(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
}

function lockScroll() {
	window.scrollTo(0, 0);
}

window.addEventListener('scroll', lockScroll);
lockScroll();
