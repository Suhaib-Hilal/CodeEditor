export enum MessageType {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
}

export type Message = {
  content: string;
  type: MessageType;
};