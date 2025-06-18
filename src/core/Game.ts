import { Entity } from "./entities/Entity.js"
import { Player } from "./entities/Player.js"
import { Collisions } from "./enum/Collisions.js"
import { CollisionsType } from "./types/CollisionsType.js"
import { DirectionType } from "./types/DirectionType.js"
import { MoveEntityData } from "./types/MoveEntityData.js"

export class Game {
  body
  screenGame
  player
  entities: Entity[] = []

  constructor(
    body: CanvasRenderingContext2D,
    screenGame: HTMLCanvasElement,
    player: Player,
  ) {
    this.body = body
    this.screenGame = screenGame
    this.player = player
    this.entities.push(player)

    this.updateScreen()
  }

  updateScreen() {
    /* console.log('renderizando player'); */

    this.player.render()
    this.entities.forEach(entity => {
      entity.render()
    })
  }

  addEntity(entity: Entity) {
    this.entities.push(entity)
    this.updateScreen()
  }

  onKeyPress(key: string) {
    const keyMap: Record<string, DirectionType> = {
      W: 'top',
      A: 'left',
      S: 'bottom',
      D: 'right',
    }
    const direction = keyMap[key]

    if (direction) {
      this.moveEntity({
        entity: this.player,
        direction
      })
    }
  }

  moveEntity(data: MoveEntityData) {
    const { entity, direction, endMovement, isGravity } = data

    const movement = entity.movements[direction]

    if (isGravity || !(entity instanceof Player)) {
      this.updateScreen()
      return
    }

    const collidedObject = entity.collisions[direction].find(c => c.collisionType === Collisions.CONTACT || c.collisionType === Collisions.IMPACT)
    const isMovableObject = collidedObject?.target.type === 'movable-object'

    if (entity.collisions[direction].length && !isMovableObject && !collidedObject.target?.canMove(direction)) {
      console.log(entity.collisions[direction]);
      return
    }

    movement(() => this.updateScreen())
  }

  notifyCollision(collider: Entity, direction: DirectionType, collisions: CollisionsType) {
    const collision = collisions[direction]
    if (collision instanceof Array && collision.length) {
      collision.map(c => {
        console.log(c);

        if (c.target.type === 'movable-object' && c.collisionType !== Collisions.CONTACT) {

          this.moveEntity({
            entity: c.target,
            direction,
            endMovement: true,
          })
        }
      })
    }
    //console.log("o " + collider + " "+ collision + " no " + target.type);
  }
}