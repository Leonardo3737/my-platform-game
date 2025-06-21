import { Collisions } from "../enum/Collisions.js";
import { DirectionType } from "../types/DirectionType.js";
import { EntityType } from "../types/EntityType.js";
import { MeassureType } from "../types/MeassureType.js";
import { MoveEntityData } from "../types/MoveEntityData.js";
import { Entity } from "./Entity.js";

export abstract class MovableEntity extends Entity {
  movementObserves: ((data: MoveEntityData) => void)[] = []
  velocity = 1 // 10
  lastPosition: MeassureType

  abstract movements: Record<DirectionType, ()=>void>

  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
    size: MeassureType,
    color: string,
    type: EntityType,
    usesGravity: boolean = true
  ) {
    super(
      body,
      position,
      size,
      color,
      type,
      usesGravity
    )
    this.lastPosition = { ...position }
  }

  canMove(direction: DirectionType) {
    
    let mayMove = true

    this.collisions[direction].forEach(collision => {
      const collidedObject = collision.target

      if (!(collidedObject instanceof MovableEntity)) {
        mayMove = false
        return
      }
      
      collidedObject.notifyMovement({
        direction,
        endMovement: true
      })
      
      if (!collidedObject.canMove(direction)) {
        mayMove = false
      }
    })
    return mayMove
  }

 /*  hide() {
    this.body.clearRect(
      this.lastPosition.x,
      this.lastPosition.y,
      this.size.x,
      this.size.y
    )
  } */

  movementSubscribe(event: (data: MoveEntityData) => void) {
    this.movementObserves.push(event)
  }

  notifyMovement(data: Omit<MoveEntityData, 'entity'>) {
    this.movementObserves.forEach(callback => callback({ ...data, entity: this }))
  }
}