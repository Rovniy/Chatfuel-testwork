(function () {
    'use strict';

    angular
        .module('chatfuel')
        .controller('userEditController', userEditController);

    userEditController.$inject = ['$http','$location','config','$routeParams','$window'];

    function userEditController($http,$location,config,$routeParams,$window) {
        let vm = this;
        vm.disabled = true;
        vm.userId = $routeParams.id;

        vm.goBack = goBack; //Возвращение о странице списка пользователей
        vm.editName = editName; //Возвращение о странице списка пользователей

        activate();
        ///////////////////
        function activate() {
            getUserData();
        }

        /**
         * Получение данных о пользователе.
         * В продуктовом варианте логика этой функции должна быть совершенно другой
         */
        function getUserData() {
            /**
             * Получение списка пользоватлей из локального файла.
             * При запросе с сервера будет будет запрос по API конкретного пользователя
             */
            $http.get(config.api + 'users.json')
            //Событие при успешном выполнении запроса
                .then(function(res){
                    if (res) {
                        vm.allUsers = res.data.result;
                        //Поиск пользователя в массиве. Исключительно для тестового задания
                        vm.allUsers.forEach(function(f){
                            if (parseInt(f.id) === parseInt(vm.userId)) {
                                vm.user = f;
                            }
                        });
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

        function editName() {
            vm.disabled = !vm.disabled;
            let input = $window.document.getElementById("userName");
            input.focus();
        }

        /**
         * Возвращение о странице списка пользователей
         */
        function goBack() {
            $location.path('/');
        }
    }
})();