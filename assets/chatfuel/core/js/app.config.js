(function () {
    'use strict';

    angular
        .module('chatfuel', [
            'ngRoute',
            'ngAnimate',
            'ngSanitize',
            'ngCookies',
            'ui.bootstrap'
        ])
        .constant('config', {
            version: '0.0.1', //Текущая версия сайта
            template: 'chatFuel', //Шаблон сайта
            theme: 'default', //Тема сайта
            mainUrl: window.location.protocol+ '//' + window.location.host,
            copy: 'Chatfuel &copy &year',
            debug: window.location.host === 'chat.fuel:9360',
            api: '/src/json/'
        })
        .config(config);

    config.$inject = ['$locationProvider','$httpProvider'];

    function config ($locationProvider,$httpProvider) {
        
        /**
         * Включение HTML5 навигации для сайта
         */
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        /**
         * Отключение $http.OPTIONS при запросах
         */
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }

})();