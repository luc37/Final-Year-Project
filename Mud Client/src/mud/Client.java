package mud;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Scanner;

public class Client {

	private Socket socket;
	private ClientConnection clientConnection;
	
	public Client(){
		try {
			socket = new Socket("localhost", 4000);
			clientConnection = new ClientConnection(socket, this);
			clientConnection.start();
			
			listen();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void listen(){
		Scanner console = new Scanner(System.in);
		
		while(true){
			while(!console.hasNextLine()){
				try {
					Thread.sleep(1);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		
			String input = console.nextLine();
		
			if(input.equals("EXIT")){
				break;
			}
			
			clientConnection.sendStringToServer(input);
		}
		clientConnection.close();
	}
	
	public static void main( String[] args ) {
		new Client();
	}
}
