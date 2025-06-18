import { Collisions } from "../enum/Collisions.js"
import { DirectionType } from "../types/DirectionType.js"
import { MeassureType } from "../types/MeassureType.js"
import { Entity } from "./Entity.js"

export class MovableObject extends Entity {
  velocity = 1

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
      true
    )
  }

  walk(direction: DirectionType, updateScreen: Function) {
    this.hide()

    let moveFrame = 0
    const totalFrames = 10

    console.log('andando');
    

    const intervalId = setInterval(() => {
      if (moveFrame < totalFrames) {
        const movements: Record<DirectionType, MeassureType> = {
          left: { ...this.position, x: this.position.x - this.velocity },
          right: { ...this.position, x: this.position.x + this.velocity },
          bottom: { ...this.position },
          top: { ...this.position },
        }
        const movement = movements[direction]
        this.hide()
        this.position = movement || this.position
        this.notifyMovement({ direction, endMovement: false })
        moveFrame++
      } else {
        this.notifyMovement({ direction, endMovement: true })
        clearInterval(intervalId)
      }
      updateScreen()
    }, 5)
  }

  canMove(direction: DirectionType) {
    const collidedObject = this.collisions[direction].find(c => c.collisionType === Collisions.CONTACT || c.collisionType === Collisions.IMPACT)
    const isMovableObject = collidedObject?.target.type === 'movable-object'
    return !collidedObject || isMovableObject
  }
}