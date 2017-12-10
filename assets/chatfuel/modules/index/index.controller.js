(function () {
    'use strict';

    angular
        .module('chatfuel')
        .controller('indexController', indexController);

    indexController.$inject = ['$rootScope','$http','config','$location'];

    function indexController($rootScope,$http,config,$location) {
        let vm = this;
        vm.error = false; //Наличие ошибки. Начальное значение - false
        vm.currentPage = parseInt($rootScope.page) ? parseInt($rootScope.page) : 1; //Установка начальной страницы отображения пользователей

        vm.editUser = editUser; //Редактирование пользователя
        vm.editPage = editPage; //Редактирование пользователя

        activate(); //Инициализирование базовых функций для страницы списка пользователей бота
        /**
         * Инициализирование базовых функций для страницы списка пользователей бота
         */
        function activate() {
            getUsers(vm.currentPage); //Получение списка пользователей
        }

        /**
         * Получение списка пользователей
         */
        function getUsers(page){
            /**
             * Получение списка пользоватлей из локального файла.
             * При запросе с сервера будет пагинация. Ее архитектура будет напрямую завязана на архитектуру сервера
             */
            $http.get(config.api + 'users'+page+'.json')
                //Событие при успешном выполнении запроса
                .then(function(res){
                    if (res) {
                        $rootScope.page = undefined; //Обнулениче перехода на нужную страницу
                        vm.users = res.data.result;
                        vm.next = res.data.nextPageUrl.length > 0 ? true : false;
                        vm.prev = res.data.previousPageUrl.length > 0 ? true : false;
                    }
                })
                //Событие обработки ошибки при запросе с сервера
                .catch(function(err){
                    if (err) {
                        vm.error = true;
                        console.log('indexController : getUsers ->', err);
                    }
                });
        }


        /**
         * Изменение страницы для отображения
         * @param page - повышения или понижения индекса страницы
         */
        function editPage(page) {
            vm.currentPage += parseInt(page);
            getUsers(vm.currentPage);
        }

        /**
         * Редактирование пользователя
         * @param id - ID пользователя, записанный в базе
         */
        function editUser(id) {
            /**
             * Переход на страницу редактирования пользователя
             */
            $location.path('/edit/' + id + '/' + vm.currentPage);
        }
    }
})();