# Интеграция с Google Spreadsheet

## Настройка (выполнить один раз):

### 1. Создайте Google Таблицу
- Откройте [Google Sheets](https://sheets.new)
- Создайте новую таблицу
- Назовите ее "Sentimental Orders"

### 2. Создайте заголовки колонок (первая строка):
```
A1: Timestamp
B1: OrderRef
C1: Name
D1: Email
E1: Contact
F1: Package
G1: Price (MDL)
H1: Comment
I1: Status
```

### 3. Откройте Apps Script:
- В меню таблицы: **Расширения → Apps Script**

### 4. Вставьте этот код:

```javascript
function doPost(e) {
  try {
    // Parse JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare row data
    var row = [
      new Date(),                    // Timestamp
      data.orderRef,                 // Order Reference
      data.name,                     // Name
      data.email,                    // Email
      data.contact,                  // Contact (Telegram/WhatsApp/Viber)
      data.packageName,              // Package name
      data.priceMDL,                 // Price in MDL
      data.comment,                  // Comment
      data.status || 'New'           // Status (New/Paid/Completed)
    ];
    
    // Append row to sheet
    sheet.appendRow(row);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({"result": "success", "orderRef": data.orderRef}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({"result": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle status updates
  try {
    var orderRef = e.parameter.orderRef;
    var newStatus = e.parameter.status;
    
    if (!orderRef || !newStatus) {
      return ContentService
        .createTextOutput(JSON.stringify({"result": "error", "message": "Missing parameters"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Find row with matching orderRef (column B, index 1)
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === orderRef) {
        // Update status (column I, index 8)
        sheet.getRange(i + 1, 9).setValue(newStatus);
        return ContentService
          .createTextOutput(JSON.stringify({"result": "success", "orderRef": orderRef, "status": newStatus}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({"result": "error", "message": "Order not found"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({"result": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 5. Сохраните проект:
- Нажмите **Сохранить** (дискетка)
- Назовите проект "Sentimental Orders Integration"

### 6. Разверните как веб-приложение:
- Нажмите **Развернуть → Новое развертывание**
- Тип: **Веб-приложение**
- Выполнить как: **Я**
- Кто имеет доступ: **Все**
- Нажмите **Развернуть**
- Подтвердите разрешения (нажмите через все окна авторизации)

### 7. Получите URL:
- После развертывания скопируйте **URL веб-приложения**
- Он будет выглядеть так:
  `https://script.google.com/macros/s/AKfycbz.../exec`

### 8. Вставьте URL в код сайта:
Откройте `checkout.html` и найдите строку:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
```

Замените на ваш реальный URL.

## Как работает:

1. **Новый заказ**: При заполнении формы checkout → автоматически добавляется строка в таблицу со статусом "New"

2. **Оплата**: При нажатии "Я оплатил(а)" → статус меняется на "Paid"

3. **Выполнение**: Вы вручную меняете статус на "Completed" в таблице

## Структура таблицы:

| Timestamp | OrderRef | Name | Email | Contact | Package | Price (MDL) | Comment | Status |
|-----------|----------|------|-------|---------|---------|-------------|---------|--------|
| 2025-01-19 10:30 | SV1234 | Иван | ivan@mail.com | @ivantg | Veo 3 | 670 | - | Paid |

## Возможные статусы:
- **New** - Заказ создан, не оплачен
- **Paid** - Оплачен, ожидает выполнения
- **Completed** - Видео готово
- **Cancelled** - Отменен (если нужно)
