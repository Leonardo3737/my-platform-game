import { Entity } from "../entities/Entity.js"
import { Collisions } from "../enum/Collisions.js"
import { Game } from "../Game.js"
import { CollisionsType } from "../types/CollisionsType.js"
import { Collider } from "./Collider.js"

export class Gravity {
  velocity = 2
  game
  collider
  fallingEntities: Record<number, boolean> = {}

  constructor(
    game: Game,
    collider: Collider
  ) {
    this.game = game
    this.collider = collider
    this.checkFallCondition()
  }

  isToFall = (collisionType: CollisionsType) => !collisionType.bottom.length || !collisionType.bottom.find(c => c.collisionType === Collisions.CONTACT)

  checkFallCondition() {
    this.game.entities.forEach(entity => {

      if (!entity.usesGravity) return

      const collisionType = this.collider.getEntityState(entity.id)

      if (!collisionType.bottom.length) {
        this.pushDown(entity)
      }
    });
  }

  checkSpecificFallCondition(entity1: Entity) {
    if (!entity1.usesGravity) return

    const collisionType = this.collider.getEntityState(entity1.id)


    if (this.isToFall(collisionType)) {
      this.pushDown(entity1)
    } else {
      entity1.isSuspended = false
    }
  }

  pushDown(entity: Entity) {

    if (this.fallingEntities[entity.id]) return
    entity.isSuspended = true
    this.fallingEntities[entity.id] = true

    const intervalId = setInterval(() => {

      if (this.fallingEntities[entity.id]) {
        const collisionType = this.collider.getEntityState(entity.id)
        this.fallingEntities[entity.id] = this.isToFall(collisionType)

        if (!this.isToFall(collisionType)) {
          return
        }

        entity.hide()
        entity.position = { ...entity.position, y: entity.position.y + this.velocity }
        entity.notifyMovement({
          direction: 'bottom',
          endMovement: true,
          isGravity: true
        })
        this.game.updateScreen()

      } else {
        entity.isSuspended = false
        clearInterval(intervalId)
      }
    }, 20)
  }
}