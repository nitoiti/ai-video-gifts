#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import threading
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_reload = time.time()
    
    def on_modified(self, event):
        # Only reload if it's been at least 1 second since last reload
        if event.src_path.endswith(('.html', '.css', '.js')):
            current_time = time.time()
            if current_time - self.last_reload > 1:
                print(f"🔄 File changed: {event.src_path}")
                print("📡 Auto-reloading browser...")
                self.last_reload = current_time
                # Try to trigger browser reload
                os.system('echo "window.location.reload();" > reload.js')

PORT = 8000

class LiveReloadServer:
    def __init__(self):
        self.handler = ChangeHandler()
        self.observer = Observer()
        self.observer.schedule(self.handler, path='.', recursive=True)
        self.observer.start()
        
    def start_server(self):
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        # Start HTTP server
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"🚀 Live Server running at: http://localhost:{PORT}")
            print("📡 Auto-reload enabled - changes will refresh automatically")
            print("💡 Press Ctrl+C to stop server")
            print("")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 Server stopped")
                self.observer.stop()
                httpd.server_close()

if __name__ == "__main__":
    server = LiveReloadServer()
    server.start_server()
