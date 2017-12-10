(function () {
    'use strict';

    angular
        .module('chatfuel')
        .controller('userEditController', userEditController);

    userEditController.$inject = ['$rootScope','$http','$location','config','$routeParams','$window'];

    function userEditController($rootScope,$http,$location,config,$routeParams,$window) {
        let vm = this;
        vm.disabled = true; //Отображение кнопки сохранения/редактирования имени
        vm.userId = $routeParams.id; // ID пользователя
        vm.page = $routeParams.page; //Страница, на которой он находится. В текущей архитектуре делается только так. В правильной архитектуре мы должны иметь метод получения пользователя по ID по отдельному REST-запросу

        vm.goBack = goBack; //Возвращение о странице списка пользователей
        vm.editName = editName; //Возвращение о странице списка пользователей
        vm.saveChanges = saveChanges; //Сохранение данных пользователя на сервере.

        activate();
        ///////////////////
        function activate() {
            getUserData(); //Получение данных о пользователе.
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
            $http.get(config.api + 'users'+vm.page+'.json')
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
                });
        }

        /**
         * Возможность редактировать имени пользователя
         */
        function editName(click) {
            if (click) {
                vm.ok = false; //Отображение сообщения о успешном сохранении
            }
            vm.disabled = !vm.disabled; ////Отображение кнопки сохранения/редактирования имени
        }

        /**
         * Сохранение данных пользователя на сервере. Данный метод будет работать лишь на PROD сервере, где уже есть архитектура REST-API. В данном тестовом задании возможно лишь описание метода сохранения
         * @param user - весь объект пользователя
         */
        function saveChanges(user) {
            vm.ok = true; //Отображение сообщения о успешном сохранении
            //TODO откомментировать при переносе на PROD
            /*
            let data = {
                name: user.name,
                avatarUrl: user.avatarUrl
            };
            $http.post('/api/users/' + user.id, data)
                .then(function(res){
                    if (res.data.result) {
                        vm.ok = true;
                    }
                })
                .catch(function(err){
                    if (err) {
                        console.log('userEditController : saveChanges ->', err);
                        vm.err = true;
                    }
                });
           */
            editName(); //Возможность редактировать имени пользователя
        }

        /**
         * Возвращение о странице списка пользователей
         */
        function goBack() {
            $rootScope.page = vm.page;
            $location.path('/');
        }
    }
})();