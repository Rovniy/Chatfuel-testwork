### Для начала работы следует не забыть поставить компоненты: ###
Windows:
npm install &&  bower prune && bower install --global

Mac OS:
sudo npm install -g gulp bower && npm install && bower prune && bower install

Linux:
curl -sL https://deb.nodesource.com/setup_0.12 | bash - apt-get install -y nodejs apt-get install -y build-essential

npm install -g gulp bower;
ln -s /usr/bin/nodejs /usr/bin/node;
npm install &&  bower prune && bower install
bower update

### If got exception "Agreeing to the Xcode/iOS license requires admin privileges, please re-run as root via sudo." ###
sudo xcodebuild -license

### Прописываем в хостах!!! ###
sudo nano /private/etc/hosts
(для win - открываем блокнот от имени администратора C:\Windows\System32\drivers\etc\hosts)
127.0.0.1 kaskonomika.local

### В проекте настроен локальный фронт сервер (бек от девелоперского окружения kaskonomika.ru), запускается простой командой: ###
gulp watch

### If got exception "You already have a server listening on 35729" ###
lsof | grep 35729
kill -9  {proccedID}

### Сборка JS компонентов(из bower) происходит через команду: ###
gulp js-vendor // --> ./sites/src/js/vendor.js

### Фронты работают теперь на kaskonomika.local:9360

****
**P.S. просьба не включать папки bower_components и node_modules и их компоненты в проект.**