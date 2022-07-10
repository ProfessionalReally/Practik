class Bad {
    constructor(){
        this.position = createVector(random(0, 500), random(0, 500))
        this.w = 10
    }
  
    //Отображение объектов
    show() {
        fill(0, 0, 0, 300)
    
        noStroke()
    
        ellipse(this.position.x, this.position.y, this.w)
      }
  }