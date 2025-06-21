import { Entity } from "../entities/Entity.js"
import { MovableEntity } from "../entities/MovableEntity.js"
import { DirectionType } from "./DirectionType.js"

export type MoveEntityData = {
  entity: MovableEntity,
  direction: DirectionType,
  endMovement?: boolean,
  isGravity?: boolean
}