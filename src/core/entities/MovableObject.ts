import { Collisions } from "../enum/Collisions.js"
import { DirectionType } from "../types/DirectionType.js"
import { MeassureType } from "../types/MeassureType.js"
import { Entity } from "./Entity.js"
import { MovableEntity } from "./MovableEntity.js"

export class MovableObject extends MovableEntity {
  //velocity = 10

  movements = {
    left: (updateScreen: Function) => this.walk('left', updateScreen),
    right: (updateScreen: Function) => this.walk('right', updateScreen),
    top: () => { },
    bottom: () => { },
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

  walk(direction: DirectionType, updateScreen: Function) {

    const movements: Record<DirectionType, MeassureType> = {
      left: { ...this.position, x: this.position.x - this.velocity },
      right: { ...this.position, x: this.position.x + this.velocity },
      bottom: { ...this.position },
      top: { ...this.position },
    }
    const movement = movements[direction]
    this.hide()
    this.position = movement || this.position
    this.notifyMovement({ direction, endMovement: true })
    updateScreen()
  }

  canMove(direction: DirectionType) {
    if(direction === 'top') return false
    const superCanMove = super.canMove(direction)
    return superCanMove
  }

}