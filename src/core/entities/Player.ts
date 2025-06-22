import { ActionType } from '../types/ActionType.js'
import { DirectionType } from "../types/DirectionType.js"
import { MeassureType } from "../types/MeassureType.js"
import { MovableEntity } from "./MovableEntity.js"

export class Player extends MovableEntity {
  life = 5
  //velocity = 10 // 10
  points = 0
  isJumping = false
  isTakingDamage = false

  actions: Partial<Record<DirectionType, { type: ActionType, run: () => void }>> = {
    top: {
      type: 'movement',
      run: () => this.jump(),
    },
    left: {
      type: 'movement',
      run: () => this.walk('left'),
    },
    right: {
      type: 'movement',
      run: () => this.walk('right'),
    },
    hit: {
      type: 'movement',
      run: () => this.hit(),
    }
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
      '#00B7EB',
      'player',
    )
  }

  walk(direction: DirectionType) {
    const movements = {
      top: { ...this.position, y: this.position.y - this.velocity },
      left: { ...this.position, x: this.position.x - this.velocity },
      bottom: { ...this.position, y: this.position.y + this.velocity },
      right: { ...this.position, x: this.position.x + this.velocity },
    }
    const movement = movements[ direction ]
    this.hide()
    this.position = movement
    this.notifyMovement({ direction, endMovement: true })
    this.render()
  }

  jump() {
    if (this.isSuspended || this.isJumping) return

    let jumpFrame = 0
    const totalFrames = 20
    this.isSuspended = true
    this.isJumping = true

    const intervalId = setInterval(() => {
      if (jumpFrame < totalFrames && this.canMove('top')) {
        this.hide()
        this.position = { ...this.position, y: this.position.y - 2 }
        jumpFrame++
      }
      else {
        clearInterval(intervalId)
        this.isJumping = false
      }

      this.notifyMovement({ direction: 'top', endMovement: true })
      this.render()
    }, 10)
  }

  hit() {

  }

  override mayFall(): boolean {
    return this.usesGravity && !this.isJumping;
  }

}