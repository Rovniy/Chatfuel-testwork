(function () {
    'use strict';

    angular
        .module('chatfuel')
        .config(config);

    config.$inject = ['$routeProvider'];
    
    function config ($routeProvider) {
        $routeProvider
            //Страница списка пользователей
            .when ('/', {
                templateUrl: '/index/index.html',
                controller: 'indexController',
                controllerAs: 'vm'
            })
            //Страница редактирования пользователя
            .when ('/edit/:id/:page', {
                templateUrl: '/user-edit/edit.html',
                controller: 'userEditController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });

    }

})();