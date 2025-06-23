import { DirectionType } from '../../types/DirectionType.js'
import { MeassureType } from '../../types/MeassureType.js'
import { Stick } from '../items/Stick.js'
import { Entity } from './../Entity.js'
import { Item } from './../items/Item.js'

export class Tree extends Entity {
  leafColor = '#228B22' // Green color for the leaves
  life = 40

  dropItems: Item[] = []

  observersDie: ((dropItems: Item[]) => void)[] = []

  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
  ) {
    super(
      body,
      position,
      { x: 4, y: 18 }, // Size of the tree
      '#8B4513', // Brown color for the tree trunk
      'tree',
      false,
      true
    )

    const items = parseInt(`${(Math.random() * 10) + 2}`)
    for (let index = 0; index < items; index++) {
      const stick = new Stick(
        this.body,
        {
          x: this.position.x / 5,
          y: this.position.y / 5 + this.size.y / 5 - 8
        }
      )
      this.dropItems.push(stick)
    }
  }

  render() {
    this.body.fillStyle = this.color
    this.body.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    this.body.fillStyle = this.leafColor
    this.body.fillRect(this.position.x - 20, this.position.y, this.size.x + 40, this.size.y - 40)
  }

  renderLife() {
    this.body.fillStyle = '#00ff00'
    this.body.fillRect(this.position.x - 20, this.position.y - 15, this.size.x + this.life, 5)
  }

  hideLife() {
    this.body.clearRect(this.position.x - 20, this.position.y - 20, this.size.x + 40, 10)
  }

  hide() {
    this.body.clearRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    )
    this.body.clearRect(
      this.position.x - 20,
      this.position.y,
      this.size.x + 40,
      this.size.y - 40
    )
  }

  takeDamage() {
    this.life -= 10
    this.hideLife()
    if (this.life <= -20) {
      this.hide()
      this.notifyDie()
    } else {
      this.renderLife()
    }
  }

  subscribeDie(observer: (dropItems: Item[]) => void) {
    this.observersDie.push(observer)
  }

  notifyDie() {
    this.observersDie.forEach(observer => observer(this.dropItems))
  }

  canMove(direction: DirectionType) {
    return false
  }

}