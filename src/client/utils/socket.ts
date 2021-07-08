import { Socket } from 'socket.io-client'

type EventType = 'chat' | 'start' | 'move' | 'end' | 'announce' | 'enter'

export const socketEmit = (
  socket: Socket,
  eventName: EventType,
  payload: {}
) => {
  socket.emit(eventName, payload)
}

export const socketOn = <T = { [key: string]: string | number | boolean }>(
  socket: Socket,
  eventName: EventType,
  func: (payload: T) => void
) => {
  socket.on(eventName, (payload) => func(payload))
}
