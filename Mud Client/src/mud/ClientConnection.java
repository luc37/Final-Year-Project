package mud;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

public class ClientConnection extends Thread {

	private Socket socket;
	private DataInputStream conIn;
	private DataOutputStream conOut;
	
	public ClientConnection(Socket socket, Client client){
		this.socket = socket;
		try {
			conIn = new DataInputStream(socket.getInputStream());
			conOut = new DataOutputStream(socket.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void sendStringToServer(String text){
		try {
			conOut.writeUTF(text);
			conOut.flush();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void run(){
		try {
			conIn = new DataInputStream(socket.getInputStream());
			conOut = new DataOutputStream(socket.getOutputStream());
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		
		while(true){
			try {
				while(conIn.available() == 0){
					try {
						Thread.sleep(1);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				
				String reply = conIn.readUTF();
				System.out.println(reply);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void close(){
		close();
	}
}
