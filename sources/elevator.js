"use strict"
const Elevator = function (buildingElem, id, floorsCnt) {

    let peer = buildingElem;
    let elevator = peer.querySelector(".elevator");
    elevator.setAttribute("style", "position: relative; transition: top 1s linear; top: 0px;");
    let elArrived;
    let elReleased;
    const status = appData.elevator.status;

    elevator.addEventListener('transitionend', () => {
        elArrived(id);
        setTimeout(function () {
            elReleased(id);
        }, appData.elevator.openDoorTime * 1000);
    });

    let state = {
        status: status.idle,
        currentFloor: 0
    }

    function moveTo(job) {
        elevator.style.transitionDuration = `${job.movingTime + 0.5}s`;
        console.log("moving time " + elevator.style.transitionDuration)
        elevator.style.top = (((floorsCnt - job.floorNumber) - 1) * (appData.elevator.floorDistance)) + "px";
    }

    this.getCurrentFloor = function () {
        return state.currentFloor;
    };

    this.isActive = function () {
        return state.status != status.idle;
    }

    this.id = id;

    this.startJob = function (job, arrived, released) {
        job.state = appData.elevator.status.moving;
        elArrived = arrived;
        elReleased = released;
        moveTo(job);
        state.currentFloor = job.floorNumber;
    };
};