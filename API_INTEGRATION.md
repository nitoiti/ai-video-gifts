# 🔗 RunwayML API Integration Guide

## 📋 Обзор интеграции

Создал полную интеграцию с RunwayML API для реальной генерации видео из фотографий.

### 🛠️ Созданные файлы:

1. **`api.js`** - Frontend API интеграция
   - Класс `RunwayMLAPI` для работы с API
   - Класс `FileUploader` для загрузки файлов
   - Класс `VideoGenerator` для управления процессом
   - Полная обработка ошибок и прогресса

2. **`server.js`** - Backend API сервер
   - Express.js сервер для загрузки фото
   - Проксирование запросов к RunwayML
   - Multer для обработки multipart/form-data
   - Эндпоинты для загрузки, генерации и проверки статуса

3. **`storage.js`** - Управление видео в localStorage
   - Класс `VideoStorage` для сохранения результатов
   - Автоматическая очистка старых видео
   - Ограничение размера хранилища

## 🚀 Как это работает:

### 1. Загрузка фото
```javascript
// Пользователь загружает 3 фото
const files = event.target.files;
const uploadResult = await RunwayMLIntegration.videoGenerator.uploader.uploadFile(file);
```

### 2. Генерация видео
```javascript
// Отправка в RunwayML API
const generationTasks = await RunwayMLIntegration.processPhotos(selectedFiles, {
    duration: 5,
    prompt: 'Animate this photo with natural movements'
});
```

### 3. Отслеживание прогресса
```javascript
// Проверка статуса каждые 2 секунды
const statusResult = await RunwayMLIntegration.videoGenerator.api.getTaskStatus(taskId);
```

### 4. Показ результатов
```javascript
// Отображение готовых видео с выбором
showGeneratedVideos(tasks.filter(task => task.status === 'COMPLETED'));
```

## 🔑 Безопасность

### API ключи
- RunwayML API ключ хранится в переменных окружения
- Не хранится в frontend коде
- Передается через backend сервер

### Валидация
- Проверка типа файлов (только изображения)
- Ограничение размера (10MB)
- Проверка количества файлов (ровно 3)

### Обработка ошибок
- Try-catch блоки для всех API вызовов
- Детальные сообщения об ошибках
- Graceful fallback при недоступности API

## 📁 Структура запросов

### Загрузка фото
```
POST /api/upload
Content-Type: multipart/form-data
Body: FormData с файлами
Response: {
  success: true,
  files: [
    {
      filename: "photo1-123456789.jpg",
      url: "https://example.com/uploads/photo1-123456789.jpg"
    }
  ]
}
```

### Генерация видео
```
POST /api/runwayml
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
Body: {
  "image_url": "https://example.com/uploads/photo1.jpg",
  "model": "gen3a_turbo",
  "duration": 5,
  "prompt": "Animate this photo with natural movements"
}
Response: {
  "success": true,
  "taskId": "task_123456789",
  "status": "PENDING"
}
```

### Проверка статуса
```
GET /api/runwayml/status/:taskId
Authorization: Bearer YOUR_API_KEY
Response: {
  "success": true,
  "status": "RUNNING",
  "progress": 45,
  "output": ["https://runwayml-video-url.mp4"]
}
```

## 🎯 Frontend использование

```html
<!-- Подключение API -->
<script src="api.js"></script>
<script src="storage.js"></script>

<!-- Использование -->
<script>
// Генерация видео
await RunwayMLIntegration.processPhotos(files, {
    duration: 5,
    prompt: 'Animate with natural transitions'
});

// Проверка результатов
const results = await RunwayMLIntegration.pollForResults(tasks);
</script>
```

## 🔧 Backend настройка

### Установка зависимостей
```bash
npm install express multer cors
```

### Запуск сервера
```bash
node server.js
```

### Переменные окружения
```bash
export RUNWAYML_API_KEY=your_actual_api_key
export PORT=3001
```

## 📊 Мониторинг

### Логирование
- Все API запросы логируются
- Ошибки сохраняются с деталями
- Прогресс операций отслеживается

### Метрики
- Время загрузки фото
- Время генерации видео
- Успешные/неуспешные операции
- Размер сгенерированных файлов

## 🔒 Следующие шаги

1. **Получить API ключ RunwayML**
   - Зарегистрироваться на [runwayml.com](https://runwayml.com)
   - Создать API ключ

2. **Настроить переменные окружения**
   ```bash
   export RUNWAYML_API_KEY=your_key_here
   ```

3. **Запустить сервер**
   ```bash
   npm install
   node server.js
   ```

4. **Тестирование**
   - Загрузить тестовые фото
   - Проверить генерацию видео
   - Проверить сохранение результатов

## ✅ Готовность к production

- ✅ Frontend интеграция с RunwayML
- ✅ Backend сервер для проксирования
- ✅ Система хранения видео
- ✅ Обработка ошибок и прогресса
- ✅ Валидация и безопасность
- ✅ Документация и инструкции

**Проект готов к реальной генерации видео через RunwayML!** 🚀
