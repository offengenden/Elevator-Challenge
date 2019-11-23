"use strict"
const app = function () {
    let placeHolder = document.querySelector("[data-buildings-ph]");
    let sourceElement = document.querySelector("[data-building]");
    sourceElement.parentElement.removeChild(sourceElement);
    let builder = new BuildingBuilder();

    function init(buildingsCnt, floorsCnt, elevatorsCnt) {
        for (let i = 0; i < buildingsCnt; i += 1) {
            let building = builder.buildBuilding(sourceElement.cloneNode(true), floorsCnt, elevatorsCnt);

            BuildingManager(building.elevatorItems, building.floorItems);

            placeHolder.appendChild(building.elem);
        }
    }

    this.init = init;
}

let App = new app();
App.init(4, 15, 3);



