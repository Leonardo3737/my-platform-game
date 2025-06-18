import { ScreenSize } from "../core/constants/ScreenSize.js"
import { MovableObject } from "../core/entities/MovableObject.js"
import { Platform } from "../core/entities/Platform.js"
import { Player } from "../core/entities/Player.js"
import { Game } from "../core/Game.js"
import { Collider } from "../core/physics/Collider.js"
import { Gravity } from "../core/physics/Gravity.js"
import { Control } from "./control.js"

const screenGame: HTMLCanvasElement = document.getElementById('screen-game') as HTMLCanvasElement
const genericBody = screenGame.getContext('2d')

if(!genericBody) {
  throw new Error("cannot get genericBody")
}

const screenPosition = {
  x: (window.screen.width - ScreenSize.x) / 2,
  y: (window.screen.height - ScreenSize.y) / 2
}

screenGame.width = ScreenSize.x
screenGame.height = ScreenSize.y

function GetSize(percentage = 100) {  
  return (screenGame.width/5) * (percentage / 100)
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
  { x: GetSize(30), y: 110 },
  '#00ffa0'
)
const platform3 = new Platform(
  genericBody,
  { x: GetSize(70) },
  { x: GetSize(30), y: 290 },
  '#00ffa0'
)

const player = new Player(
  genericBody,
  { x: 10, y: 100 },
  { x: 6, y: 10 }
)

const block = new MovableObject(
  genericBody,
  { x: 40, y: 100 },
  { x: 6, y: 6 }
)


const game = new Game(
  genericBody,
  screenGame,
  player,
)

game.addEntity(block)
game.addEntity(platform1)
game.addEntity(platform2)
game.addEntity(platform3)


const collider = new Collider(game)
const gravity = new Gravity(game, collider)


control.subscribe((keyPress: string) => game.onKeyPress(keyPress))

game.entities.forEach(entity => {
  if(entity.type === 'platform') return
  
  
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
