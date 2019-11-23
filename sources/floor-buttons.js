"use strict"
const FloorButton = function (buildingElem, floorNumber) {

    let events = [];
    let button = buildingElem.querySelector(".metal");
    let timeElem = button.parentNode.querySelector(".time");
    let me = this;

    function setActive() {
        button.classList.add("waiting");
        timeElem.classList.add("active")
        timeElem.classList.remove("not-active")
    }

    function setNotActive() {
        button.classList.remove("waiting");
        timeElem.classList.add("not-active")
        timeElem.classList.remove("active")        
        let audio = new Audio("./assets/ding.mp3");
        audio.play();
    }

    function displayTime(seconds){
        timeElem.innerText = seconds;
    }

    button.addEventListener("click", function () {
        let e = events["click"];
        if (e) {
            e(me);
        }        
    });


    this.floorNumber = floorNumber;
    this.setActive = setActive;
    this.setNotActive = setNotActive;
    this.displayTime = displayTime;
    this.on = function (a, b) {
        events[a] = b;
    };
}