/* eslint-disable prettier/prettier */

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log("Initialized socket");
  }

  handleDisconnect(client: any) {
    console.log(`Cliend id:${client.id} disconnected`);
  }

  handleConnection(client: any) {
    const { sockets } = this.server.sockets;
    console.log(`Client id: ${client.id} connected`);
    console.debug(`Number of connected clients: ${sockets.size}`);
  }

  @SubscribeMessage('connect-to-machine')
  handleMessage(
    @MessageBody() message: any,
  ): void {
    const user_id = message.user_id;
    const machine_id = message.machine_id;
    this.server.emit(`on-request-connect-to-${machine_id}`, user_id);
  }
}
