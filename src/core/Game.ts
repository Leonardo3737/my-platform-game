import { Enemy } from "./entities/Enemy.js"
import { Entity } from "./entities/Entity.js"
import { MovableEntity } from "./entities/MovableEntity.js"
import { MovableObject } from "./entities/MovableObject.js"
import { Platform } from "./entities/Platform.js"
import { Player } from "./entities/Player.js"
import { Collisions } from "./enum/Collisions.js"
import { CollisionsType } from "./types/CollisionsType.js"
import { DirectionType } from "./types/DirectionType.js"
import { MoveEntityData } from "./types/MoveEntityData.js"

export class Game {
  body: CanvasRenderingContext2D
  screenGame: HTMLCanvasElement
  player: Player
  entities: Entity[] = []
  cooldownDamage: Record<number, boolean> = {}

  constructor(
    body: CanvasRenderingContext2D,
    screenGame: HTMLCanvasElement,
    player: Player,
  ) {
    this.body = body
    this.screenGame = screenGame
    this.player = player
    this.entities.push(player)
    this.updateLifebar()
    this.startGame()
  }

  startGame() {
    setInterval(() => this.updateScreen(), 10)
  }

  updateLifebar() {
    const lifebar = document.getElementById("lifebar")
    if (lifebar) {
      lifebar.innerHTML = ''

      for (let i = 0; i < this.player.life; i++) {
        lifebar.innerHTML += `<img src="assets/heart.svg" width="40" alt="life-${i}">`
      }
    }
  }

  updateScreen() {
    this.entities.forEach(entity => {
      entity.hide()
      entity.render()
    })
    this.player.hide()
    this.player.render()
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

    if (direction && !this.player.isTakingDamage) {
      this.moveEntity({
        entity: this.player,
        direction
      })
    }
  }

  moveEntity(data: MoveEntityData) {
    const { entity, direction, endMovement, isGravity } = data

    const movement = entity.movements[direction]

    entity.lastPosition = { ...entity.position }

    if (isGravity) {
      movement()
      //this.updateScreen()
      return
    }

    let mayMove = true

    entity.collisions[direction].forEach(collision => {
      const collidedObject = collision.target

      if (!(collidedObject instanceof MovableEntity)) {
        mayMove = false
        return
      }
      collidedObject.notifyMovement({
        direction,
        endMovement: true
      })
      if (!collidedObject.canMove(direction)) {
        mayMove = false
      }
    })

    if (!mayMove) return
    movement()
  }

  notifyCollision(collider: Entity, direction: DirectionType, collisions: CollisionsType) {

    const collision = collisions[direction]
    if (collision instanceof Array && collision.length) {
      collision.map(c => {

        if (c.target instanceof MovableObject && c.collisionType !== Collisions.CONTACT) {
          this.moveEntity({
            entity: c.target,
            direction,
            endMovement: true,
          })
        }

        if (direction === 'bottom' && c.target instanceof Enemy && collider instanceof Player && c.collisionType === Collisions.CONTACT) {
          console.log(direction);

          if (this.cooldownDamage[c.target.id]) return
          this.cooldownDamage[c.target.id] = true
          setTimeout(() => this.moveEntity({
            entity: collider,
            direction: 'top',
            endMovement: true,
          }), 10)
          setTimeout(() => {
            this.cooldownDamage[c.target.id] = false
          }, 100)

          c.target.sufferDamage()
          if (!c.target.life) {
            const index = this.entities.findIndex(e => e.id === c.target.id)
            delete this.entities[index]
          }
        }

        if ((direction === 'left' || direction === 'right') && c.target instanceof Player && collider instanceof Enemy) {
          this.playerTakingDamage(c.target, collider.damage, direction)
        }
        if ((direction === 'left' || direction === 'right') && c.target instanceof Enemy && collider instanceof Player) {
          const oppositeDirection = direction === 'left' ? 'right' : "left"
          this.playerTakingDamage(collider, c.target.damage, oppositeDirection)
        }

      })
    }
  }

  playerTakingDamage(player: Player, damage: number, direction: DirectionType) {
    if (this.cooldownDamage[player.id]) return
    this.cooldownDamage[player.id] = true
    setTimeout(() => {
      this.cooldownDamage[player.id] = false
    }, 100)
    player.life = player.life - damage

    this.updateLifebar()

    let frame = 0
    let totalFrame = 40

    player.isTakingDamage = true

    const intervalId = setInterval(() => {
      if (frame < totalFrame) {
        this.moveEntity({
          entity: player,
          direction,
          endMovement: true,
        })
        frame++
      } else {
        player.isTakingDamage = false
        clearInterval(intervalId)
      }
    }, 10)
  }
}