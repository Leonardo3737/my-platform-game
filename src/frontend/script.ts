import { ScreenSize } from "../core/constants/ScreenSize.js"
import { MovableEntity } from "../core/entities/MovableEntity.js"
import { MovableObject } from "../core/entities/MovableObject.js"
import { Platform } from "../core/entities/Platform.js"
import { Player } from "../core/entities/Player.js"
import { Tree } from '../core/entities/Tree.js'
import { Game } from "../core/Game.js"
import { Collider } from "../core/physics/Collider.js"
import { Gravity } from "../core/physics/Gravity.js"
import { Control } from "./control.js"

const screenGame: HTMLCanvasElement = document.getElementById('screen-game') as HTMLCanvasElement
const genericBody = screenGame.getContext('2d')

if (!genericBody) {
  throw new Error("cannot get genericBody")
}

const screenPosition = {
  x: (window.screen.width - ScreenSize.x) / 2,
  y: (window.screen.height - ScreenSize.y) / 2
}

screenGame.width = ScreenSize.x
screenGame.height = ScreenSize.y

function GetSize(percentage = 100) {
  return (screenGame.width / 5) * (percentage / 100)
}

const control = new Control()

const platform1 = new Platform(
  genericBody,
  { x: 0 },
  { x: GetSize(40), y: 100 },
  '#00ffa0'
)
const platform2 = new Platform(
  genericBody,
  { x: GetSize(40) },
  { x: GetSize(30), y: 160 },
  '#00ffa0'
)
const platform3 = new Platform(
  genericBody,
  { x: GetSize(70) },
  { x: GetSize(30), y: 290 },
  '#00ffa0'
)

const tree = new Tree(
  genericBody,
  { x: 50, y: 106 },
)

const player = new Player(
  genericBody,
  { x: 10, y: 100 },
  { x: 6, y: 10 }
)

/* const enemy = new Enemy(
  genericBody,
  { x: 40, y: 100 },
  { x: 6, y: 6 }
) */

const block = new MovableObject(
  genericBody,
  { x: 80, y: 100 },
  { x: 6, y: 6 }
)
const block1 = new MovableObject(
  genericBody,
  { x: 100, y: 100 },
  { x: 6, y: 7 }
)
const block2 = new MovableObject(
  genericBody,
  { x: 120, y: 90 },
  { x: 6, y: 14 }
)

const block3 = new MovableObject(
  genericBody,
  { x: 140, y: 80 },
  { x: 6, y: 21 }
)


const game = new Game(
  genericBody,
  screenGame,
  player,
)

//game.addEntity(enemy)
game.addEntity(tree)
game.addEntity(block)
game.addEntity(block1)
game.addEntity(block2)
game.addEntity(block3)
game.addEntity(platform1)
game.addEntity(platform2)
game.addEntity(platform3)

const collider = new Collider(game)
const gravity = new Gravity(game, collider)


control.subscribe('keydown', (keydown: string) => game.onKeyDown(keydown))
control.subscribe('keypress', (keypress: string) => game.onKeyPress(keypress))

game.entities.forEach(entity => {
  if (!(entity instanceof MovableEntity)) return


  entity.movementSubscribe((data) => {
    if (!data.endMovement) return

    collider.checkCollision(data)
  })

  entity.movementSubscribe((data) => {
    if (!data.endMovement || data.isGravity) return

    gravity.checkSpecificFallCondition(data.entity)
  })

  //entity.movementSubscribe((data) => game.moveEntity(data))
})
