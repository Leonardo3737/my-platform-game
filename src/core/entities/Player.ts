import { Action } from "../types/Action.js";
import { ActionType } from '../types/ActionType.js';
import { DirectionType } from '../types/DirectionType.js';
import { MeassureType } from "../types/MeassureType.js";
import { MovableEntity } from "./MovableEntity.js";
import { Tree } from './Tree.js';

export class Player extends MovableEntity {
  life = 5
  //velocity = 10 // 10
  points = 0
  isJumping = false
  isTakingDamage = false

  actions: Partial<Record<Action, { type: ActionType, run: () => void }>> = {
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
      type: 'hit',
      run: () => this.hit(),
    }
  }

  movements = {
    top: () => ({ ...this.position, y: this.position.y - this.velocity }),
    left: () => ({ ...this.position, x: this.position.x - this.velocity }),
    bottom: () => ({ ...this.position, y: this.position.y + this.velocity }),
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
      '#00B7EB',
      'player',
    )
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

      this.notifyMovement({ actionType: 'top', endMovement: true })
      this.render()
    }, 10)
  }

  hit() {
    let tree: unknown = undefined

    for (let direction in this.collisions) {
      this.collisions[ direction as DirectionType ].forEach(collision => {
        const collidedObject = collision.target

        if (collidedObject instanceof Tree) {
          tree = collidedObject
          return
        }
      })
    }

    if (!(tree instanceof Tree)) {
      return
    }
    tree.takeDamage()
  }

  override mayFall(): boolean {
    return this.usesGravity && !this.isJumping;
  }

}