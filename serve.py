import http.server
import socketserver
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Starting server at http://localhost:{PORT}")
print(f"Serving files from: {os.getcwd()}")
print("Press Ctrl+C to stop the server")

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped")
    httpd.shutdown()
