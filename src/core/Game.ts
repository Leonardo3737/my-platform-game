import { Enemy } from "./entities/Enemy.js"
import { Entity } from "./entities/Entity.js"
import { Item } from './entities/Item.js'
import { MovableObject } from "./entities/MovableObject.js"
import { Player } from "./entities/Player.js"
import { Tree } from './entities/Tree.js'
import { Collisions } from "./enum/Collisions.js"
import { Action } from "./types/Action.js"
import { CollisionsType } from "./types/CollisionsType.js"
import { DirectionType } from './types/DirectionType.js'

export class Game {
  body: CanvasRenderingContext2D
  screenGame: HTMLCanvasElement
  player: Player
  entities: Entity[] = []
  cooldownDamage: Record<number, boolean> = {}
  firstRender: boolean

  constructor(
    body: CanvasRenderingContext2D,
    screenGame: HTMLCanvasElement,
    player: Player,
  ) {
    this.firstRender = true
    this.body = body
    this.screenGame = screenGame
    this.player = player
    this.entities.push(player)
    this.updateLifebar()
    this.startGame()
  }

  startGame() {
    setInterval(() => {
      let collidedTree = false
      for (let direction in this.player.collisions) {

        this.player.collisions[ direction as keyof typeof this.player.collisions ].forEach(collision => {
          const collidedObject = collision.target
          if (collidedObject instanceof Tree) {
            collidedTree = true
          }
        })
        if (collidedTree) continue
      }

      const auxMessage = document.getElementById("aux-message")
      if (auxMessage) {
        if (collidedTree) {
          auxMessage.innerText = 'pressione F para cortar a árvore'
        } else if (auxMessage.innerText) {
          auxMessage.innerText = ''
        }
      }

      this.updateScreen()
    }, 10)
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
      if (this.firstRender) {
        this.onFirstRender(entity)
      }
      entity.hide()
      entity.render()
    })
    this.player.hide()
    this.player.render()
    if (this.firstRender) {
      this.firstRender = false
    }
  }

  onFirstRender(entity: Entity) {
    if (entity instanceof Tree) {
      entity.subscribeDie(() => {
        const index = this.entities.findIndex(e => e.id === entity.id)
        if (index !== -1) {
          this.entities.splice(index, 1)
          const stick = new Item(
            this.body,
            { x: entity.position.x / 5, y: entity.position.y / 5 + entity.size.y / 5 - 8 }
          )
          this.addEntity(stick)
          //this.updateScreen()
        }
      })
    }
  }

  addEntity(entity: Entity) {
    this.entities.push(entity)
    this.updateScreen()
  }

  onKeyDown(key: string) {
    const keyMap: Record<string, Action> = {
      W: 'top',
      A: 'left',
      S: 'bottom',
      D: 'right',
    }
    const actionType = keyMap[ key ]

    if (actionType && !this.player.isTakingDamage) {
      this.player.runAction(actionType)
    }
  }

  onKeyPress(key: string) {
    const keyMap: Record<string, Action> = {
      F: 'hit',
    }
    const actionType = keyMap[ key ]

    if (actionType && !this.player.isTakingDamage) {
      this.player.runAction(actionType)
    }
  }

  notifyCollision(collider: Entity, direction: DirectionType, collisions: CollisionsType) {

    const collision = collisions[ direction ]
    if (collision instanceof Array && collision.length) {
      collision.map(c => {

        // MOVER ENTIDADES MovableObject
        if (c.target instanceof MovableObject && c.collisionType !== Collisions.CONTACT) {
          c.target.runAction(direction)
        }

        // DANO ENTIDADES Enemy
        if (direction === 'bottom' && c.target instanceof Enemy && collider instanceof Player && c.collisionType === Collisions.CONTACT) {
          console.log(direction);

          if (this.cooldownDamage[ c.target.id ]) return
          this.cooldownDamage[ c.target.id ] = true
          setTimeout(() => collider.runAction('top'), 10)
          setTimeout(() => {
            this.cooldownDamage[ c.target.id ] = false
          }, 100)

          c.target.sufferDamage()
          if (!c.target.life) {
            const index = this.entities.findIndex(e => e.id === c.target.id)
            this.entities.splice(index, 1)
          }
        }

        // DANO ENTIDADES Player
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

  playerTakingDamage(player: Player, damage: number, direction: Action) {
    if (this.cooldownDamage[ player.id ]) return
    this.cooldownDamage[ player.id ] = true
    setTimeout(() => {
      this.cooldownDamage[ player.id ] = false
    }, 100)
    player.life = player.life - damage

    this.updateLifebar()

    let frame = 0
    let totalFrame = 40

    player.isTakingDamage = true

    const intervalId = setInterval(() => {
      if (frame < totalFrame) {
        this.player.runAction(direction)
        frame++
      } else {
        player.isTakingDamage = false
        clearInterval(intervalId)
      }
    }, 10)
  }
}