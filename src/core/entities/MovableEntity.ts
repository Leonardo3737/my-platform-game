import { Collisions } from "../enum/Collisions.js";
import { DirectionType } from "../types/DirectionType.js";
import { EntityType } from "../types/EntityType.js";
import { MeassureType } from "../types/MeassureType.js";
import { MoveEntityData } from "../types/MoveEntityData.js";
import { Entity } from "./Entity.js";

export class MovableEntity extends Entity {
  movementObserves: ((data: MoveEntityData) => void)[] = []
  movements: Record<DirectionType, Function> = {} as Record<DirectionType, Function>
  velocity = 1 // 10

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

  movementSubscribe(event: (data: MoveEntityData) => void) {
    this.movementObserves.push(event)
  }

  notifyMovement(data: Omit<MoveEntityData, 'entity'>) {
    this.movementObserves.forEach(callback => callback({ ...data, entity: this }))
  }
}