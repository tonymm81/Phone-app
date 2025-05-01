declare module 'react-native-paho-mqtt' {
    export class Client {
      constructor(options: { uri: string; clientId: string; storage?: any });
      on(event: string, callback: (responseObject: any) => void): void;
      connect(options?: any): Promise<void>;
      subscribe(topic: string, options?: any): Promise<void>;
      unsubscribe(topic: string, options?: any): Promise<void>;
      send(message: Message): void;
      disconnect(): void;
    }
  
    export class Message {
      constructor(payload: string);
      destinationName: string;
      payloadString: string; // Lisää tämä rivi
    }
  }