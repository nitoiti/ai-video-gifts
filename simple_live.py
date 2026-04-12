#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8001  # Different port to avoid conflict

def start_server():
    try:
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        # Start HTTP server
        with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
            print(f"🚀 Live Server running at: http://localhost:{PORT}")
            print("📡 Auto-reload: Press F5 to refresh changes")
            print("💡 Press Ctrl+C to stop server")
            print("")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is busy. Trying port {PORT + 1}...")
            start_server_with_alt_port()
        else:
            print(f"Error: {e}")

def start_server_with_alt_port():
    global PORT
    PORT += 1
    start_server()

if __name__ == "__main__":
    start_server()
