"use strict"
const BuildingBuilder = function () {

    function buildFloors(elem, floorsCnt, floorItems, creator) {

        let floorsContainer = elem.querySelector("[data-building-floors]")
        let floor = floorsContainer.querySelector(".floor").cloneNode(true);

        floorsContainer.querySelectorAll("*").forEach(n => n.remove());

        for (let f = 0; f < floorsCnt; f += 1) {
            let floorId = floorsCnt - f - 1;
            let fi = floor.cloneNode(true);
            let button = fi.querySelector(".metal");

            button.innerText = floorId;

            floorItems.push({ elem: fi, item: creator.initFloorButton(fi, floorId) });
            floorsContainer.appendChild(fi);
        }
    }

    function buildPeers(elem, floorsCnt, elevatorsCnt, elevatorItems, creator) {

        let peersContainer = elem.querySelector(".peers-container");
        let peer = peersContainer.querySelector(".peer").cloneNode(true);
        let size = appData.elevator.floorDistance;
        peersContainer.querySelectorAll("*").forEach(n => n.remove());
        peersContainer.style.height = (size * floorsCnt) + "px";
        peersContainer.style.width = (size * elevatorsCnt) + "px";
        peer.style.height = (size * floorsCnt) + "px";
        
        for (let p = 0; p < elevatorsCnt; p += 1) {
            let pi = peer.cloneNode(true);

            elevatorItems[p] = { elem: pi, item: creator.initElevator(pi, p, floorsCnt) };

            let el = pi.querySelector(".elevator");
            el.style.top = ((size * floorsCnt) - size) + "px";

            peersContainer.appendChild(pi);
        }
    }

    this.buildBuilding = function (elem, floorsCnt, elevatorsCnt) {
        let floorItems = [];
        let elevatorItems = [];

        let creator = new Building();

        buildFloors(elem, floorsCnt, floorItems, creator);

        buildPeers(elem, floorsCnt, elevatorsCnt, elevatorItems, creator);

        elem.removeAttribute("style");

        return { elem, floorItems, elevatorItems };
    }
}