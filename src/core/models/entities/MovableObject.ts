import { Action } from "../../types/Action.js"
import { ActionType } from '../../types/ActionType.js'
import { DirectionType } from '../../types/DirectionType.js'
import { MeassureType } from "../../types/MeassureType.js"
import { MovableEntity } from "./MovableEntity.js"

export class MovableObject extends MovableEntity {
  //velocity = 10

  actions: Partial<Record<Action, { type: ActionType, run: () => void }>> = {
    left: {
      type: 'movement',
      run: () => this.walk('left'),
    },
    right: {
      type: 'movement',
      run: () => this.walk('right'),
    }
  }

  movements = {
    left: () => ({ ...this.position, x: this.position.x - this.velocity }),
    right: () => ({ ...this.position, x: this.position.x + this.velocity }),
  }

  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
    size: MeassureType,
  ) {
    super(
      body,
      position,
      size,
      '#0000ff',
      'movable-object',
    )
  }

  canMove(direction: DirectionType) {
    if (direction === 'top') return false
    const superCanMove = super.canMove(direction)
    return superCanMove
  }

}