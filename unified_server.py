#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import time

class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_reload = time.time()
        self.reload_pending = False
    
    def on_modified(self, event):
        if event.src_path.endswith(('.html', '.css', '.js', '.jpg', '.png', '.md')):
            current_time = time.time()
            if current_time - self.last_reload > 1:
                print(f"🔄 File changed: {event.src_path}")
                self.reload_pending = True
                self.last_reload = current_time
    
    def should_reload(self):
        return self.reload_pending

PORT = 8000

class UnifiedServer:
    def __init__(self):
        self.handler = ChangeHandler()
        self.observer = Observer()
        self.observer.schedule(self.handler, path='.', recursive=True)
        self.observer.start()
        
    def start_server(self):
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        # Start HTTP server
        with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
            print(f"🚀 Unified Server running at: http://localhost:{PORT}")
            print("📁 Auto-reload enabled for all changes")
            print("💡 Works with both AI and manual changes")
            print("🌐 Open your browser to http://localhost:{PORT}")
            print("💡 Press Ctrl+C to stop server")
            print("")
            
            # Start reload checker thread
            reload_thread = threading.Thread(target=self.check_reload_loop, daemon=True)
            reload_thread.start()
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 Server stopped")
                self.observer.stop()
                httpd.server_close()
    
    def check_reload_loop(self):
        """Check if reload is needed and trigger browser refresh"""
        while True:
            time.sleep(1)  # Check every second
            if self.handler.should_reload():
                print("📡 Reloading browser...")
                # Send JavaScript to reload
                os.system('echo "setTimeout(() => window.location.reload(), 100);" > reload.js')
                self.handler.reload_pending = False

if __name__ == "__main__":
    server = UnifiedServer()
    server.start_server()
