package mud0;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

public class ServerConnection extends Thread {
	
	private Socket socket;
	private Server server;
	private DataInputStream conIn;
	private DataOutputStream conOut;
	private Boolean connected = true;
	
	public ServerConnection(Socket socket, Server server){
		super("Client " + server.getConnections().size());
		this.socket = socket;
		this.server = server;
	}
	
	public void sendStringToClient(String text){
		try {
			conOut.writeUTF(text);
			conOut.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void sendStringToAllClients(String text){
		for(ServerConnection s : server.getConnections()){
			s.sendStringToClient(text);
		}
	}
	
	public void run(){
		try{
			conIn = new DataInputStream(socket.getInputStream());
			conOut = new DataOutputStream(socket.getOutputStream());
			
			while(connected){
				while(conIn.available() == 0){
					try{
						Thread.sleep(1);
					} catch(InterruptedException e){
						e.printStackTrace();
					}
				}
				
				String textIn = conIn.readUTF();
				sendStringToAllClients(textIn);
				
				if(textIn == "EXIT"){
					connected = false;
				}
			}
			
			conIn.close();
			conOut.close();
			socket.close();
		} catch(IOException e){
			e.printStackTrace();
		}
	}
}
