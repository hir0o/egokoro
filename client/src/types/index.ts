export type MessageType = {
  name: string
  text: string
}

export type StateType = 'draw' | 'answer'

export type UserType = {
  name: string
  id: string
  state: StateType
}
