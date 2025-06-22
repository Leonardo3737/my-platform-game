import { MovableEntity } from "../entities/MovableEntity.js"
import { Action } from './Action.js'

export type MoveEntityData = {
  entity: MovableEntity,
  actionType: Action,
  endMovement?: boolean,
  isGravity?: boolean
}