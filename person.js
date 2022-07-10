class Person {
  constructor(quarentined = false, infected = false, vaccination = false, immunity = false, doctor = false, mask = false) {
    this.position = createVector(random(0, 500), random(0, 500))
    this.velocity = p5.Vector.random2D()
    this.speed = 0.5
    this.w = 10
    this.quarentined = quarentined
    this.vaccination = vaccination
    this.immunity = immunity
    this.doctor = doctor
    this.time = 0
    this.flag = false
    this.flagX1 = true
    this.flagX2 = false
    this.flagX5 = false
    this.mask = mask
    this.isCollideGood = false
    this.isCollideBad = false

    if (infected) {
      this.state = "INFECTED"
    } else if (doctor){
      this.state = "DOCTOR"
    } else if (vaccination){
      this.state = "VACCINATED"
    } else if (immunity) {
      this.state = "IMMUNITY"
    } else {
      this.state = "HEALTHY"
    }
  }
  
  setIsCollideGood(isCollideGood){
    this.isCollideGood = isCollideGood
  }

  setIsCollideBad(isCollideBad){
    this.isCollideBad = isCollideBad
  }

  getIsCollideGood(){
    return this.isCollideGood
  }

  getIsCollideBad(){
    return this.isCollideBad
  }

  //Режим speed X1
  speedX1(){
    this.speed = 0.5
    this.flagX1 = true
    this.flagX2 = false
    this.flagX5 = false
  }
  
  //Режим speed X2
  speedX2(){
    this.speed = 0.5 * 2
    this.flagX1 = false
    this.flagX2 = true
    this.flagX5 = false
  }

  //Режим speed X5
  speedX5(){
    this.speed = 0.5 * 5
    this.flagX1 = false
    this.flagX2 = false
    this.flagX5 = true
  }

  //Движение объектов
  move() {
    const recovery = 200
    const recovery2 = 400
    if ((this.state == "INFECTED") || (this.state == "VACCINATED") || (this.state == "RECOVERED")){
        if (this.flagX2 == true){
        this.time += 0.2
      } else if (this.flagX5 == true){
        this.time += 0.5
      } else if (this.flagX1 == true){
        this.time += 0.1
      }
    }
    if (!this.quarentined) {
      this.position = p5.Vector.add(this.position, p5.Vector.mult(this.velocity, this.speed))
      if (this.position.x + this.w / 2 > 500 || this.position.x - this.w / 2 < 0) {
        this.velocity.x = -this.velocity.x
      }
      if (this.position.y + this.w / 2 > 500 || this.position.y - this.w / 2 < 0) {
        this.velocity.y = -this.velocity.y
      }
    }
    if ((this.time > recovery) && (this.state == "INFECTED")) {
      this.state = "RECOVERED"
      this.time = 0
    } 
    else if ((this.time > recovery2) && (this.state == "VACCINATED")){
      this.state = "HEALTHY"
      this.time = 0
    } 
    if ((this.time > recovery2) && (this.state == "RECOVERED")){
      this.state = "HEALTHY"
      this.time = 0
    }
  }

  //Отображение объектов
  show() {
    if (this.state == "HEALTHY") {
      fill(10, 230, 40, 300)
    } else if (this.state == "INFECTED") {
      fill(230, 0, 40, 300)
    } else if (this.state == "RECOVERED") {
      fill(0, 40, 230, 300)
    } else if (this.state == "VACCINATED"){
      fill(146, 60, 186, 300)
    } else if (this.state == "IMMUNITY"){
      fill(227, 134, 11, 300)
    } else if (this.state == "DOCTOR"){
      fill(216, 227, 11, 300)
    }

    noStroke()

    ellipse(this.position.x, this.position.y, this.w)
  }

  //Генератор случайных чисел
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  //Столкновение людей
  collide(other) {
   if (this.mask == true){
    let chance = this.getRandomArbitrary(0, 101)
    if (this.state == "VACCINATED" || other.state == "VACCINATED"){
     ; 
    }else if (this.state == "IMMUNITY" && other.state == "INFECTED"){
      if (this.position.dist(other.position) < this.w) {
      other.state = "INFECTED"
      this.state = "IMMUNITY"
      this.flag = true
      }
    }else if (this.state == "IMMUNITY" && other.state == "HEALTHY" && this.flag == true && chance <= 1.5){
      if (this.position.dist(other.position) < this.w) {
        other.state = "INFECTED"
        this.state = "IMMUNITY"
        this.flag = false
      }
    }else if (this.state == "IMMUNITY" || other.state == "IMMUNITY"){
      ;
    }else if (this.state == "RECOVERED" || other.state == "RECOVERED"){
      ;
    }else if (this.state == "DOCTOR" && other.state == "HEALTHY"){
      if (this.position.dist(other.position) < this.w) {
        other.state = "VACCINATED"
        this.state = "DOCTOR"
      }
    }else if (this.state == "DOCTOR" && other.state == "INFECTED"){
      if (this.position.dist(other.position) < this.w) {
        other.state = "RECOVERED"
        this.state = "DOCTOR"
      }
    }else if (this.state == "INFECTED" && other.state != "DOCTOR" && chance <= 1.5){
      if (this.position.dist(other.position) < this.w) {
        other.state = "INFECTED"
        this.state = "INFECTED"
      }
    } 
  } else if (this.mask == false) {
      if (this.state == "VACCINATED" || other.state == "VACCINATED"){
        ; 
       }else if (this.state == "IMMUNITY" && other.state == "INFECTED"){
         if (this.position.dist(other.position) < this.w) {
         other.state = "INFECTED"
         this.state = "IMMUNITY"
         this.flag = true
         }
       }else if (this.state == "IMMUNITY" && other.state == "HEALTHY" && this.flag == true){
         if (this.position.dist(other.position) < this.w) {
           other.state = "INFECTED"
           this.state = "IMMUNITY"
           this.flag = false
         }
       }else if (this.state == "IMMUNITY" || other.state == "IMMUNITY"){
         ;
       }else if (this.state == "RECOVERED" || other.state == "RECOVERED"){
         ;
       }else if (this.state == "DOCTOR" && other.state == "HEALTHY"){
         if (this.position.dist(other.position) < this.w) {
           other.state = "VACCINATED"
           this.state = "DOCTOR"
         }
       }else if (this.state == "DOCTOR" && other.state == "INFECTED"){
         if (this.position.dist(other.position) < this.w) {
           other.state = "RECOVERED"
           this.state = "DOCTOR"
         }
       }else if (this.state == "INFECTED" && other.state != "DOCTOR"){
         if (this.position.dist(other.position) < this.w) {
           other.state = "INFECTED"
           this.state = "INFECTED"
         }
       }
      }
    }
    
    //Столкновение людей с положительными обстоятельствами
    collideGood(other)
    {
      if (this.state == "INFECTED"){
        if (this.position.dist(other.position) < this.w) {
          this.state = "HEALTHY"
          this.isCollideGood = true
        }
      }
      else this.isCollideGood = false
    }

    //Столкновение людей с отрицательными обстоятельствами
    collideBad(other)
    {
      if (this.state == "HEALTHY"){
        if (this.position.dist(other.position) < this.w) {
          this.state = "INFECTED"
          this.isCollideBad = true
        }
      }
      else this.isCollideBad = false
    }
  } 
