
export class WebSocketService {
    private socket: WebSocket;

    constructor() {
        this.socket = new WebSocket(process.env.EXPO_PUBLIC_WS_URL!);
    }

    open(callback: () => void){
        this.socket.onopen = () => {
            callback();
        }
    }

    send(message: string) {
        this.socket.send(message);
    }

    onMessage(callback: (data: string) => void) {
        this.socket.onmessage = (event) => {
            callback(event.data);
        };
    }

    onerror(callback: (error: Event) => void) {
        this.socket.onerror = (event) => {
            callback(event);
        };
    }

    close() {
        this.socket.close();
        console.log('Connection closed')
    }
}