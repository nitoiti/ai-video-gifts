# Local Development Instructions

## Automatic Server Restart

### Method 1: Using Live Server Extension (Recommended)
1. Install **Live Server** extension in VS Code
2. Open your project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. Changes will automatically reload in browser

### Method 2: Using Python with Auto-reload
Install required package:
```bash
pip install watchdog
```

Create enhanced server script:
```python
# save as: auto_server.py
import http.server
import socketserver
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('.html') or event.src_path.endswith('.css') or event.src_path.endswith('.js'):
            print(f"File changed: {event.src_path}")
            # Auto-reload notification

PORT = 8000

class AutoReloadServer:
    def __init__(self):
        self.handler = ChangeHandler()
        self.observer = Observer()
        self.observer.schedule(self.handler, path='.', recursive=True)
        self.observer.start()
        
    def start_server(self):
        os.system('start http://localhost:8000')
        with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
            print(f"Server running at http://localhost:{PORT}")
            print("Auto-reload enabled - changes will refresh browser")
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                self.observer.stop()
                httpd.server_close()

if __name__ == "__main__":
    server = AutoReloadServer()
    server.start_server()
```

Run enhanced server:
```bash
python auto_server.py
```

### Method 3: Simple Browser Auto-refresh
1. Open `http://localhost:8000` in browser
2. Install **Auto Refresh** browser extension
3. Set refresh interval to 2-3 seconds
4. Changes will automatically appear

### Current Development Setup
- **Server**: Python http.server on port 8000
- **URL**: http://localhost:8000 or http://127.0.0.1:8000
- **Auto-reload**: Manual (refresh browser with F5)

### Quick Workflow
1. Make changes to `index.html`
2. Save file (Ctrl+S)
3. Refresh browser (F5) or use Live Server
4. See changes immediately

### Git Workflow for Local Changes
```bash
# After making changes:
git add .
git commit -m "Your change description"
git push origin main
```

### File Structure
```
windsurf-project/
├── index.html          # Main website file
├── assets/
│   └── img/
│       └── Centimental-logo.jpg
├── serve.py            # Simple server
├── auto_server.py      # Auto-reload server (optional)
├── DEPLOYMENT.md       # Deployment instructions
└── LOCAL_DEVELOPMENT.md  # This file
```
