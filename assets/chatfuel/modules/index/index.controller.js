(function () {
    'use strict';

    angular
        .module('chatfuel')
        .controller('indexController', indexController);

    indexController.$inject = ['$http','config','$location'];

    function indexController($http,config,$location) {
        let vm = this;
        vm.error = false; //Наличие ошибки. Начальное значение - false

        vm.editUser = editUser; //Редактирование пользователя

        activate(); //Инициализирование базовых функций для страницы списка пользователей бота
        /**
         * Инициализирование базовых функций для страницы списка пользователей бота
         */
        function activate() {
            getUsers(); //Получение списка пользователей
        }

        /**
         * Получение списка пользователей
         */
        function getUsers(){
            /**
             * Получение списка пользоватлей из локального файла.
             * При запросе с сервера будет пагинация. Ее архитектура будет напрямую завязана на архитектуру сервера
             */
            $http.get(config.api + 'users.json')
                //Событие при успешном выполнении запроса
                .then(function(res){
                    if (res) {
                        vm.users = res.data.result;
                    }
                })
                //Событие обработки ошибки при запросе с сервера
                .catch(function(err){
                    if (err) {
                        vm.error = true;
                        console.log('indexController : getUsers ->', err);
                    }
                })
        }

        /**
         * Редактирование пользователя
         * @param id - ID пользователя, записанный в базе
         */
        function editUser(id) {
            /**
             * Переход на страницу редактирования пользователя
             */
            $location.path('/edit/' + id);
        }
    }
})();