import { DirectionType } from "../types/DirectionType.js";
import { MeassureType } from "../types/MeassureType.js";
import { MovableEntity } from "./MovableEntity.js";

export class Enemy extends MovableEntity {
  life = 2
  damage = 2

  movements = {
    top: () => { },
    left: () => this.walk('left'),
    bottom: () => { },
    right: () => this.walk('right'),
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
      'enemy',
    )
    this.patrol()
  }

  patrol() {
    const walkToDirection = (direction: DirectionType) => new Promise<void>(resolve => {
      let frame = 0
      const idInterval = setInterval(() => {
        if (!this.life) {
          this.hide()
          clearInterval(idInterval)
          return
        }
        this.walk(direction)
        frame++
        if (frame > 50) {
          clearInterval(idInterval)
          resolve()
        }
      }, 20)
    })

    let aux = true;

    const patrolLoop = async () => {
      if (!this.life) {
        this.hide()
        return
      }
      await walkToDirection(aux ? 'right' : 'left');
      aux = !aux;
      setTimeout(patrolLoop, 0); // Chama novamente após a conclusão
    };

    patrolLoop();
  }

  walk(direction: DirectionType) {
    const movements = {
      top: { ...this.position, y: this.position.y - this.velocity },
      left: { ...this.position, x: this.position.x - this.velocity },
      bottom: { ...this.position, y: this.position.y + this.velocity },
      right: { ...this.position, x: this.position.x + this.velocity },
    }
    const movement = movements[direction]
    this.hide()
    this.position = movement
    this.notifyMovement({ direction, endMovement: true })
    this.render()
  }

  sufferDamage() {
    this.color = '#ff000080'
    this.life = this.life - 1
  }
}