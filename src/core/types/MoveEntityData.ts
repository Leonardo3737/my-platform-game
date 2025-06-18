import { Entity } from "../entities/Entity.js"
import { DirectionType } from "./DirectionType.js"

export type MoveEntityData = {
  entity: Entity,
  direction: DirectionType,
  endMovement?: boolean,
  isGravity?: boolean
}