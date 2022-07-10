var population = [] //Популяция
var good = [] //Положительные обстоятельства
var bad = [] //Отрицательные обстоятельства
populationCount = 100 //Количество людей в популяции

//Количество инфецированных, на карантине, вакцинированных, с иммунитетом, докторов, положительных обстоятельств, плохих обстоятельств
var infectedCount, quarentinedCount, vaccinationCount, immunityCount, doctorCount, goodCount = 5, badCount = 5; 
var flagStop = false //Флаг стопа
var Mask //Режим маски

var time = 0 //Время для таймера

var k = 0 //доп.переменная для окончания симуляция
var ctx = document.getElementById('chart').getContext('2d');

var data = []
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{data: data}],
      labels: ["Healthy", "Infected", "Recovered", "Vaccinated", "Immunity", "Doctor"],
      backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f", "#923cba", "#e3860b", "#d8e30b"]
    },
    options: {
      title: {
        display: true,
        text: 'Virus infection',
        maintainAspectRatio: false
      }
    }
});

//Очистка массива популяции
function deletePopulation(){
  for (var i = 0; i < populationCount; i++)
    population.pop();
}

//Очистка массива положительных обстоятельств
function deleteGood(){
  for (var i = 0; i < goodCount; i++)
    good.pop();
}

//Очистка массива отрицательных обстоятельств
function deleteBad(){
  for (var i = 0; i < badCount; i++)
    bad.pop();
}

function postData(h, i, r, v, im, d) {
  data = [h, i, r, v, im, d]
}

//Установка
function setup() {
  createCanvas(500, 500)
  var buttonStart = createButton("START")
  buttonStart.mousePressed(loop, flagStop = false)
  var buttonStop = createButton("STOP")
  buttonStop.mousePressed(noLoop, flagStop = true)
  var buttonReset = createButton("RESET");
  buttonReset.mousePressed(reset)
  var buttonSpeedX1= createButton("Speed X1")
  buttonSpeedX1.mousePressed(speed1)
  var buttonSpeedX2 = createButton("Speed X2")
  buttonSpeedX2.mousePressed(speed2)
  var buttonSpeedX5 = createButton("Speed X5");
  buttonSpeedX5.mousePressed(speed5)
}

//Перезапуск и инициализация данных
function reset() {
  deletePopulation()
  deleteGood()
  deleteBad()
  time = 0;
  k = 0
  
  loop()
  flagStop = false


  populationCount = parseInt(document.getElementById('fieldPopulation').value);
  if ( !populationCount ) populationCount = 100;
  
  infectedCount = parseInt(document.getElementById('fieldInfected').value); 
  if ( !infectedCount ) infectedCount = 1;

  quarentinedCount = parseInt(document.getElementById('fieldQuarentined').value); 
  if ( !quarentinedCount) quarentinedCount = 75;

 vaccinationCount = parseInt(document.getElementById('fieldVaccination').value); 
  if ( !vaccinationCount) vaccinationCount = 1;

  immunityCount = parseInt(document.getElementById('fieldImmunity').value); 
  if ( !immunityCount) immunityCount = 1;

 doctorCount = parseInt(document.getElementById('fieldDoctor').value); 
  if ( !doctorCount) doctorCount = 1;

  goodCount = parseInt(document.getElementById('fieldGood').value); 
  if ( !goodCount) goodCount = 5;
  
  badCount = parseInt(document.getElementById('fieldBad').value); 
  if ( !badCount) badCount = 5;

  Mask = document.querySelector('#mask'); 

  if ((infectedCount + vaccinationCount + immunityCount + doctorCount > populationCount) && (quarentinedCount > populationCount)){
    alert("The total number of objects exceeds the population! Please enter the data so that the total number does not exceed the population number.")
  } else  if (Mask.checked){ //Если режим маски
    for (let i = 0; i < populationCount; i++) {
      if (infectedCount != 0) {
        population.push(new Person(false, true, false, false, false, true))
        infectedCount--;
      } else if (vaccinationCount != 0) {
      population.push(new Person(false, false, true, false, false, true))
      vaccinationCount--;
      }else if (immunityCount != 0){
        population.push(new Person(false, false, false, true, false, true))
        immunityCount--; 
      }else if (doctorCount != 0){
        population.push(new Person(false, false, false, false, true, true))
        doctorCount--;
      }else if (quarentinedCount != 0) {
        population.push(new Person(true, false, false, false, false, true))
        quarentinedCount--;
      } else {
        population.push(new Person(false, false, false, false, false, true))
      }
    }
    for (let i = 0; i < goodCount; i++) {
      good.push(new Good())
    }
    for (let i = 0; i < badCount; i++) {
      bad.push(new Bad())
    }
  } else { //Обычный режим
  for (let i = 0; i < populationCount; i++) {
    if (infectedCount != 0) {
      population.push(new Person(false, true, false, false, false, false))
      infectedCount--;
    } else if (vaccinationCount != 0) {
    population.push(new Person(false, false, true, false, false, false))
    vaccinationCount--;
    }else if (immunityCount != 0){
      population.push(new Person(false, false, false, true, false, false))
      immunityCount--; 
    }else if (doctorCount != 0){
      population.push(new Person(false, false, false, false, true, false))
      doctorCount--;
    }else if (quarentinedCount != 0) {
      population.push(new Person(true, false, false, false, false, false))
      quarentinedCount--;
    } else {
      population.push(new Person())
    }
  }
  for (let i = 0; i < goodCount; i++) {
    good.push(new Good())
  }
  for (let i = 0; i < badCount; i++) {
    bad.push(new Bad())
  }
}
timer()
}
//Таймер
function timer() {
  t = setInterval(tick, 5000);
}
//Тик
function tick(){
  time++;
}	

//Режим speed X1
function speed1(){
  clearInterval(t)
  for (let i = 0; i < populationCount; i++) {
    population[i].speedX1();
  }
  t = setInterval(tick, 5000); 
}

//Режим speed X2
function speed2(){
  clearInterval(t)
  for (let i = 0; i < populationCount; i++) {
    population[i].speedX2();
  }
  t = setInterval(tick, 2500); 
}

//Режим speed X5
function speed5(){
  clearInterval(t)
  for (let i = 0; i < populationCount; i++) {
    population[i].speedX5();
  }
  t = setInterval(tick, 1000); 
}

//Отрисовка
function draw() {
  background('white')
  myChart.data = {
      datasets: [{
        data: data,
        backgroundColor: ["rgb(10, 230, 40)", "rgb(230, 0, 40)", "rgb(0, 40, 230)", "rgb(146, 60, 186)", "rgb(227, 134, 11)", "rgb(216, 227, 11)"]
      }],
      labels: ["Healthy", "Infected", "Recovered", "Vaccinated", "Immunity", "Doctor"],
  }
  myChart.update(0)
  var infected = []
  var healthy = []
  var recovered = []
  var vaccinated = []
  var immunity = []
  var doctor = []
  
  for (let l = 0; l < good.length; l++){
    good[l].show()
  }

  for (let l = 0; l < bad.length; l++){
    bad[l].show()
  }

  for (let i = 0; i < population.length; i++) {
    for (let j = 0; j < population.length; j++) {
      population[i].collide(population[j])
    }
    for (let j = 0; j < good.length; j++){
      population[i].collideGood(good[j])
      if (population[i].getIsCollideGood() == true){
        good.splice(j, 1);
        good.push(new Good())
        population[i].setIsCollideGood(false)
      }
    }
    for (let j = 0; j < bad.length; j++){
      population[i].collideBad(bad[j])
      if (population[i].getIsCollideBad() == true){
        bad.splice(j, 1);
        bad.push(new Bad())
        population[i].setIsCollideBad(false)
      }
    }
    switch(population[i].state) {
      case "INFECTED":
        infected.push(population[i])
        break
      case "HEALTHY":
        healthy.push(population[i])
        break
      case "RECOVERED":
        recovered.push(population[i])
        break
      case "VACCINATED":
        vaccinated.push(population[i])
        break
      case "IMMUNITY":
        immunity.push(population[i])
        break
      case "DOCTOR":
        doctor.push(population[i])
        break
    }
    population[i].show()
    population[i].move()
  }

  postData(healthy.length, infected.length, recovered.length, vaccinated.length, immunity.length, doctor.length)

  document.getElementById("population").innerHTML = "Population: " + population.length
  document.getElementById("infected").innerHTML = "Infected: " + infected.length
  document.getElementById("healthy").innerHTML = "Healthy: " + healthy.length
  document.getElementById("recovered").innerHTML = "Recovered: " + recovered.length
  document.getElementById("vaccinated").innerHTML = "Vaccinated: " + vaccinated.length
  document.getElementById("immunity").innerHTML = "Immunity: " + immunity.length
  document.getElementById("doctor").innerHTML = "Doctors: " + doctor.length
  document.getElementById("time").innerHTML = "Days: " + time

  if (((infected.length == 0) && (flagStop == false)) && (k < 1)){
    alert("Simulation completed! There are no infected!")
    k++;
  }
}