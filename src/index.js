import './sass/main.scss';

import ApiService from './js/apiService';
import imageCardTpl from './templates/image-card.hbs';

const refs = {
    imageQuery: document.querySelector('.search-form'),
    imageGallery: document.querySelector('.gallery')
};

const apiSearchService = new ApiService;
const debounce = require('lodash.debounce');


refs.imageQuery.addEventListener('input', debounce(onSearch, 1000));

function onSearch(e) {
    refs.imageGallery.innerHTML = ' ';
    apiSearchService.query = e.target.value;
    console.dir(apiSearchService);
    apiSearchService.search().then(images => {
        refs.imageGallery.insertAdjacentHTML('beforeend', imageCardTpl(images))
    });
};