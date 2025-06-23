import { MeassureType } from '../../types/MeassureType.js';
import { Item } from './Item.js';

export class Stick extends Item {
  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
  ) {
    super(
      body,
      position,
      { x: 8, y: 8 },
      '#8B4513',
      'stick',
    )
  }

  override render() {

    const angle = Math.PI / 4; // 45 graus para diagonal

    const x2 = this.position.x + this.size.x * Math.cos(angle);
    const y2 = this.position.y + this.size.y * Math.sin(angle);

    this.body.beginPath();
    this.body.moveTo(this.position.x, this.position.y);
    this.body.lineTo(x2, y2);
    this.body.strokeStyle = "#8B4513"; // cor marrom, parecido com madeira
    this.body.lineWidth = 3;
    this.body.stroke();
  }
}