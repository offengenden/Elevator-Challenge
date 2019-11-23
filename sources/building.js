"use strict"
const Building = function(){

    function initElevator(buildingElem, elevatorId, floorsCount){
        return new Elevator(buildingElem, elevatorId, floorsCount);
    }

    function initFloorButton(buildingElem, floorNumber){
        return new FloorButton(buildingElem, floorNumber);
    }

    this.initElevator = initElevator;
    this.initFloorButton = initFloorButton;
};





