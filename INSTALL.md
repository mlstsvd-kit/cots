# Установка и запуск "Хроники Пробуждённых Душ" на Ubuntu

## Требования

Для запуска проекта на Ubuntu вам понадобится:

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)
- Git
- Node.js (опционально, для локальной разработки)

## Установка зависимостей

### 1. Установка Docker

```bash
# Обновляем список пакетов
sudo apt update

# Устанавливаем необходимые пакеты для работы с репозиториями по HTTPS
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Добавляем официальный GPG-ключ Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавляем репозиторий Docker в sources.list
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Обновляем список пакетов
sudo apt update

# Устанавливаем Docker
sudo apt install docker-ce

# Добавляем текущего пользователя в группу docker (чтобы не использовать sudo при запуске команд docker)
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

После установки Docker рекомендуется перезапустить систему или выполнить:
```bash
newgrp docker
```

### 2. Клонирование репозитория

```bash
git clone https://github.com/ваш-аккаунт/chronicles-of-awakened-souls.git
cd chronicles-of-awakened-souls
```

## Настройка и запуск

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта и укажите следующие переменные:

```env
# База данных
DATABASE_URL=postgresql://user:password@db:5432/chronicles_of_awakened_souls

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key

# OAuth провайдеры
YANDEX_CLIENT_ID=ваш-идентификатор-приложения-яндекс
YANDEX_CLIENT_SECRET=ваш-секрет-приложения-яндекс
GOOGLE_CLIENT_ID=ваш-идентификатор-приложения-гугл
GOOGLE_CLIENT_SECRET=ваш-секрет-приложения-гугл

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Где брать эти значения:**

#### DATABASE_URL
Это строка подключения к PostgreSQL. Для локального запуска через Docker Compose используйте значение как в примере выше. Если вы используете внешнюю базу данных, измените параметры:
- `user` - имя пользователя базы данных
- `password` - пароль пользователя
- `db` - хост (для Docker Compose это имя сервиса из docker-compose.yml)
- `5432` - порт PostgreSQL
- `chronicles_of_awakened_souls` - имя базы данных

#### JWT_SECRET
Случайная строка для подписи JWT токенов. Создайте её с помощью команды:
```bash
openssl rand -base64 32
```

#### OAuth провайдеры
Для получения этих значений нужно зарегистрировать приложения в соответствующих сервисах:

**Для Яндекс:**
1. Перейдите на https://oauth.yandex.ru/client/new
2. Укажите название приложения
3. В "Callback URI" укажите: `http://localhost:5173/auth/yandex/callback`
4. Выберите права доступа (достаточно "Доступ к адресу электронной почты" и "Доступ к информации о пользователе")
5. Нажмите "Создать"
6. Скопируйте "ID приложения" (это будет YANDEX_CLIENT_ID) и "Пароль приложения" (YANDEX_CLIENT_SECRET)

**Для Google:**
1. Перейдите в Google Cloud Console: https://console.cloud.google.com/
2. Создайте проект или выберите существующий
3. Включите Google+ API (если требуется)
4. Перейдите в "Учетные данные" → "Создать учетные данные" → "Идентификатор клиента OAuth"
5. Выберите "Веб-приложение"
6. В "Авторизованные URI перенаправления" добавьте: `http://localhost:5173/auth/google/callback`
7. Создайте идентификатор клиента
8. Скопируйте "Идентификатор клиента" (это будет GOOGLE_CLIENT_ID) и "Секрет клиента" (GOOGLE_CLIENT_SECRET)

#### CORS_ORIGIN
Для локального запуска используйте `http://localhost:5173`. Если вы будете размещать клиентскую часть на другом домене, измените это значение.

### 2. Запуск проекта

Для запуска проекта используйте команду:

```bash
docker-compose up -d
```

Это запустит все необходимые сервисы:
- Сервер приложения (порт 3000)
- Клиент (порт 5173)
- PostgreSQL база данных (порт 5432)
- Redis (порт 6379)

### 3. Проверка запуска

После запуска проверьте статус контейнеров:

```bash
docker-compose ps
```

Веб-интерфейс будет доступен по адресу: http://localhost:5173

API будет доступно по адресу: http://localhost:3000

## Остановка проекта

Для остановки проекта используйте команду:

```bash
docker-compose down
```

## Разработка

Если вы хотите разрабатывать проект локально (без Docker), установите:

```bash
# Установка Node.js (если еще не установлен)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка pnpm
npm install -g pnpm

# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev
```

## Устранение неполадок

### Если возникает ошибка доступа к Docker:

```bash
# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER

# Перезапустите сессию или систему
```

### Если приложение не запускается:

1. Проверьте, что все порты (3000, 5173, 5432, 6379) не заняты другими процессами
2. Убедитесь, что в файле `.env` указаны правильные значения переменных
3. Проверьте логи контейнеров:

```bash
docker-compose logs server
docker-compose logs client
docker-compose logs db
docker-compose logs redis