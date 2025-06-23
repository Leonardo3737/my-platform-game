import { Action } from "../../types/Action.js";
import { ActionType } from '../../types/ActionType.js';
import { DirectionType } from '../../types/DirectionType.js';
import { EntityType } from "../../types/EntityType.js";
import { MeassureType } from "../../types/MeassureType.js";
import { MoveEntityData } from "../../types/MoveEntityData.js";
import { Entity } from "./../Entity.js";

export abstract class MovableEntity extends Entity {
  movementObserves: ((data: MoveEntityData) => void)[] = []
  velocity = 1 // 10

  abstract actions: Partial<Record<Action, { type: ActionType, run: () => void }>>
  abstract movements: Partial<Record<Action, () => MeassureType>>

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

  runAction(actionType: Action) {

    const action = this.actions[ actionType ]

    if (!action) return

    if (action.type !== 'movement') {
      action.run()
      return
    }

    if (this.canMove(actionType as DirectionType)) {
      action.run()
      return
    }
  }

  canMove(direction: DirectionType) {

    let mayMove = true

    this.collisions[ direction ].forEach(collision => {
      const collidedObject = collision.target

      if (collidedObject.canCross) {
        return
      }

      if (!(collidedObject instanceof MovableEntity)) {
        mayMove = false
        return
      }

      collidedObject.notifyMovement({
        actionType: direction,
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

  walk(direction: Action) {
    const movement = this.movements[ direction ]
    if (!movement) return

    this.hide()
    this.position = movement()
    this.notifyMovement({ actionType: direction, endMovement: true })
    this.render()
  }
}