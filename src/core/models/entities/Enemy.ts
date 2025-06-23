import { Action } from "../../types/Action.js";
import { ActionType } from '../../types/ActionType.js';
import { MeassureType } from "../../types/MeassureType.js";
import { MovableEntity } from "./MovableEntity.js";

export class Enemy extends MovableEntity {
  life = 2
  damage = 1

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
      '#ff0000',
      'enemy',
    )
    this.patrol()
  }

  patrol() {
    const walkToDirection = (direction: Action) => new Promise<void>(resolve => {
      let frame = 0
      let totalFrame = 70
      const idInterval = setInterval(() => {
        if (!this.life) {
          this.hide()
          clearInterval(idInterval)
          return
        }
        this.walk(direction)
        frame++
        if (frame > totalFrame) {
          clearInterval(idInterval)
          resolve()
        }
      }, 30)
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

  sufferDamage() {
    this.color = '#ff000080'
    this.life = this.life - 1
  }
}