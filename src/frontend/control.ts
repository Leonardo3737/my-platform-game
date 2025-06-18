export class Control {
  observes: ((key: string)=> void)[] = []

  constructor() {
    document.addEventListener('keypress', (event) => this.notifyAll(event))
  }

  subscribe(callback: (key: string)=> void) {
    this.observes.push(callback)
  }

  notifyAll(event: KeyboardEvent) {
      
    this.observes.forEach(observe=> {
      const auxKey: string = event.key.toUpperCase()
      observe(auxKey)
    })
  }
}