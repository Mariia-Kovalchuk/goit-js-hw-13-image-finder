import './sass/main.scss';
import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

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
    apiSearchService.page = 1;

    apiSearchService.query = e.target.value;
    if (apiSearchService.searchQuery.length > 0) {
        apiSearchService.resetPage();
        apiSearchService.search()
            .then(images => {
                if (images.length) {
                    galleryMarkup(images);
                    
                } else {
                    errorQuery(e);
                };
            })
            .catch(console.log);
        
    };
};

function galleryMarkup(images) {
    refs.imageGallery.insertAdjacentHTML('beforeend', imageCardTpl(images));
    observer.observe(document.querySelector('li:last-child'));
};

function errorQuery(e) {
    e.target.value = '';
    error({
        text: "No match found. Please check your query!",
        delay: 2000,
    });
};

function loadList(){
    apiSearchService.incrementPage();
    apiSearchService.search().then(images => {
        if (apiSearchService.page * 12 > apiSearchService.total) {
            error({
                text: "No more images found.",
                delay: 2000,
            });
            return;
        };
        galleryMarkup(images);
    });
};


var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadList();
            observer.unobserve(entry.target);
        };

        // observer.unobserve(entry.target);
        // observer.observe(document.querySelector('li:last-child'));
    });

}, { threshold: 1 });
