import { DirectionType } from "../types/DirectionType.js"
import { MeassureType } from "../types/MeassureType.js"
import { Entity } from "./Entity.js"

export class Player extends Entity {
  life = 100
  velocity = 1
  points = 0
  isSuspended = false

  movements: Record<DirectionType, Function> = {
    top: (updateScreen: Function) => this.jump(updateScreen),
    left: (updateScreen: Function) => this.walk('left', updateScreen),
    bottom: (updateScreen: Function) => {},
    right: (updateScreen: Function) => this.walk('right', updateScreen),
  }

  movementPositions = {
    top: (aggregator: number) => ({ ...this.position, y: this.position.y - aggregator }),
    left: (aggregator: number) => ({ ...this.position, x: this.position.x - aggregator }),
    bottom: (aggregator: number) => ({ ...this.position, y: this.position.y + aggregator }),
    right: (aggregator: number) => ({ ...this.position, x: this.position.x + aggregator }),
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
      '#ff0000',
      'player',
      true
    )
  }

  /* onKeyPress(keyPress) {
    const movement = this.movements[keyPress]

    if (movement) {
      movement()
    }
    return !!movement
  } */

  walk(direction: DirectionType, updateScreen: Function) {
    this.hide()

    let walkFrame = 0
    const totalFrames = 5
    const intervalId = setInterval(() => {
      if (walkFrame < totalFrames) {
        const movements = {
          top: { ...this.position, y: this.position.y - this.velocity },
          left: { ...this.position, x: this.position.x - this.velocity },
          bottom: { ...this.position, y: this.position.y + this.velocity },
          right: { ...this.position, x: this.position.x + this.velocity },
        }
        const movement = movements[direction]
        this.hide()
        this.position = movement
        this.notifyMovement({direction, endMovement: false})
        walkFrame++
      } else {
        this.notifyMovement({direction})
        clearInterval(intervalId)
      }
      updateScreen()
    }, 5)
  }

  jump(updateScreen: Function) {
    if (this.isSuspended) return

    let jumpFrame = 0
    const totalFrames = 20
    this.isSuspended = true

    const intervalId = setInterval(() => {
      if (jumpFrame < totalFrames) {
        this.hide()
        this.position = { ...this.position, y: this.position.y - 2 }
        jumpFrame++
      }
      else {
        clearInterval(intervalId)
      }
      const direction = jumpFrame === totalFrames ? 'bottom' : 'top'
      this.notifyMovement({direction: 'top', endMovement: jumpFrame === totalFrames})
      updateScreen()
    }, 10)
  }

}