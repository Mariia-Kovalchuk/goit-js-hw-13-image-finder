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
                    refs.imageGallery.insertAdjacentHTML('beforeend', imageCardTpl(images));
                    console.log(document.querySelector('li:last-child'));
                    observer.observe(document.querySelector('li:last-child'));
                    
                } else {
                    errorQuery(e);
                };
            })
            .catch(console.log);
        
    };
};

function errorQuery(e) {
    e.target.value = '';
    error({
        text: "No match found. Please check your query!",
        delay: 2000,
    });
};


// функция создания элемента списка
function loadList(){
    apiSearchService.incrementPage();
    console.log(apiSearchService.page);
    apiSearchService.search().then(images => {
        refs.imageGallery.insertAdjacentHTML('beforeend', imageCardTpl(images))
    });

};


// для того, чтобы все время наблюдать за последним элементом списка
// мы используем нечто вроде замыкания
// прекращаем наблюдать за целевым элементом после создания очередного li
// и начинаем наблюдать за этим новым (последним) элементом
var observer = new IntersectionObserver((entries, observer) => {
    // console.dir(entries);
    entries.forEach(entry => {
        // console.log(entry.isIntersecting);
        if (entry.isIntersecting) {
            console.log("entry.isIntersecting");
            loadList()
        }
        // console.log(entry.target);
        observer.unobserve(entry.target)

        // console.log(document.querySelector('li:last-child'));
        observer.observe(document.querySelector('li:last-child'));
    });
        // console.dir(entries);

}, {
    threshold: 1
});
