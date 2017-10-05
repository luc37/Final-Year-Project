package mud0;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class Server {
	
	private ServerSocket server;
	private ArrayList<ServerConnection> connections = new ArrayList<ServerConnection>();
	
	public Server(){
		try{
			server = new ServerSocket(4000, 10);
			while(true){
				//wait for connections
				Socket socket = server.accept();
				ServerConnection serverConnection = new ServerConnection(socket, this);
				serverConnection.start();
				getConnections().add(serverConnection);
			}
		} catch (IOException e){
			e.printStackTrace();
		}
	}
	
	public static void main( String[] args ) {
		new Server();
	}

	public ArrayList<ServerConnection> getConnections() {
		return connections;
	}

	public void setConnections(ArrayList<ServerConnection> connections) {
		this.connections = connections;
	}
}
