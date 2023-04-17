import socket
import threading
import time

SERVER_HOST = "0.0.0.0"
SERVER_PORT = 8080
MAX_CONNECTIONS = 1000

class BotnetThread(threading.Thread):
    def __init__(self, client_socket, client_address):
        threading.Thread.__init__(self)
        self.client_socket = client_socket
        self.client_address = client_address

    def run(self):
        while True:
            try:
                data = self.client_socket.recv(1024)
                if not data:
                    break
                # Do something with the data received from the bot
                print("[+] Received data from bot {}:{}".format(self.client_address[0], self.client_address[1]))
            except:
                break
        
        self.client_socket.close()
        print("[+] Closed connection from bot {}:{}".format(self.client_address[0], self.client_address[1]))

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((SERVER_HOST, SERVER_PORT))
    server_socket.listen(MAX_CONNECTIONS)
    print("[+] Listening on {}:{}".format(SERVER_HOST, SERVER_PORT))

    while True:
        client_socket, client_address = server_socket.accept()
        print("[+] Accepted connection from bot {}:{}".format(client_address[0], client_address[1]))
        botnet_thread = BotnetThread(client_socket, client_address)
        botnet_thread.start()

if __name__ == "__main__":
    start_server()
