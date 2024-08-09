import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://192.168.43.143:5173'],
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Websocket server init...');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: #${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: #${client.id}`);
  }

  @SubscribeMessage('newMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    console.log(`Message from: ${client.id} :`, payload);
    this.server.emit('onMessage', {
      message: payload,
      event: 'onMessage',
    });
  }
}
