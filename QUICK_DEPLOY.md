# 🚀 Быстрое развертывание на GitHub Pages

## 📋 Что нужно сделать:

### 1. Создать репозиторий на GitHub
1. Зайти на [github.com](https://github.com)
2. Нажать "New repository"
3. Repository name: `ai-video-gifts`
4. Выбрать "Public"
5. Нажать "Create repository"

### 2. Скопировать URL репозитория
После создания GitHub покажет URL вида:
```
https://github.com/ТВОЙ_USERNAME/ai-video-gifts.git
```

### 3. Обновить remote URL
Заменить `YOUR_USERNAME` на твой никнейм в GitHub:
```bash
git remote set-url origin https://github.com/ТВОЙ_USERNAME/ai-video-gifts.git
```

### 4. Отправить код
```bash
git push -u origin main
```

### 5. Включить GitHub Pages
1. Зайти в созданный репозиторий
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Нажать "Save"

### 6. Готово!
Сайт будет доступен через 5-10 минут по адресу:
```
https://ТВОЙ_USERNAME.github.io/ai-video-gifts
```

## 🔄 Команды для обновления:
```bash
# После изменений в коде:
git add .
git commit -m "Описание изменений"
git push origin main
```

## 🌐 Настройка домена (опционально):
В настройках Pages можно добавить свой домен вместо стандартного.

## ⚡ Альтернатива: Vercel (без Node.js)
Если захочешь Vercel позже:
1. Зайти на [vercel.com](https://vercel.com)
2. Import Project → GitHub
3. Выбрать репозиторий `ai-video-gifts`
4. Deploy

Vercel автоматически развернет твой сайт!
