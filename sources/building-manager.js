"use strict"
const BuildingManager = function (elevators, floorButtons) {

    let elevatorsJobs = [];

    function getElevator(elevatorId) {
        let el = elevators[elevatorId];
        return el;
    }

    function getElevatorItem(elevatorId) {
        return getElevator(elevatorId).item;
    }

    function getElevatorJobs(elevatorId, createItem) {
        let jobs = elevatorsJobs[elevatorId];
        if (jobs == undefined && createItem) {
            elevatorsJobs[elevatorId] = [];
            return elevatorsJobs[elevatorId];
        }
        return jobs;
    }

    function startTimer(job, progress) {

        let timer = job.timeLeft, minutes, seconds;
        job.timer = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            progress(minutes + ":" + seconds);
            job.timeLeft = timer;

            timer = timer - 0.5;
            if (timer < 0) {
                clearInterval(job.timer);
            }
        }, 500);
    }

    function addJob(elevatorId, depFloor, floorButton, times) {
        let floorNumber = floorButton.floorNumber;

        let job = {
            depFloor,
            floorNumber,
            jobTime: times.jobTime,
            movingTime: times.movingTime,
            timeLeft: times.timeLeft,
            state: appData.elevator.status.idle,
            floorButton
        };

        getElevatorJobs(elevatorId, true).push(job);

        startTimer(job, function (seconds) {
            job.floorButton.displayTime(seconds);
        });
    }

    function removeJob(elevatorId) {
        let jobs = getElevatorJobs(elevatorId);
        jobs.shift();
    }

    function getLastFloor(elevatorId) {
        let ej = getElevatorJobs(elevatorId);
        let lastFloor;
        if (ej && ej.length != 0) {
            lastFloor = ej[ej.length - 1].floorNumber;
        } else {
            lastFloor = getElevatorItem(elevatorId).getCurrentFloor();
        }

        return lastFloor;
    }

    function getEndTime(elevatorId, destFloor) {

        let jobs = getElevatorJobs(elevatorId);

        let times = {
            movingTime: 0,
            jobTime: 0,
            timeLeft: 0
        };

        if (jobs && jobs.length != 0) {

            let lastJob = jobs[jobs.length - 1];
            times.movingTime = Math.abs(lastJob.floorNumber - destFloor) * appData.elevator.speedPerFloor;
            times.jobTime = times.movingTime + appData.elevator.openDoorTime;
            times.timeLeft = (lastJob.timeLeft + appData.elevator.openDoorTime) + times.movingTime;

        } else {

            var lastFloor = getLastFloor(elevatorId);
            times.movingTime = Math.abs(lastFloor - destFloor) * appData.elevator.speedPerFloor;
            times.jobTime = times.movingTime + appData.elevator.openDoorTime;
            times.timeLeft = times.movingTime;
        }

        return times;
    }

    function startJob(elevatorId) {
        let el = getElevatorItem(elevatorId);
        if (!el.isActive()) {
            let jobs = getElevatorJobs(elevatorId);
            let job = jobs[0];

            if (job) {
                el.startJob(job,
                    function () {
                        job.floorButton.setNotActive();
                    },
                    function () {
                        removeJob(elevatorId);
                        startJob(elevatorId);
                    }
                );
            }
        }
    }

    function findBestElevator(floorNumber) {
        let times = null;
        let elevatorId = null;

        for (let index in elevators) {
            let elevator = elevators[index];
            let eTimes = getEndTime(elevator.item.id, floorNumber);

            if (times == null || times.timeLeft > eTimes.timeLeft) {
                times = eTimes;
                elevatorId = elevator.item.id;
            }
        }

        return { id: elevatorId, times };
    }

    function floorOrdered(floorNumber) {
        for (let el = 0; el < elevators.length; el += 1) {
            let jobs = getElevatorJobs(el);
            if (jobs) {
                for (let j = 0; j < jobs.length; j += 1) {
                    if (jobs[j].floorNumber == floorNumber) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function buttonClicked(floorButton) {
        let elevatorData = findBestElevator(floorButton.floorNumber);

        if (elevatorData.times.timeLeft != 0) {
            if (!floorOrdered(floorButton.floorNumber)) {
                floorButton.setActive();

                addJob(elevatorData.id, getLastFloor(elevatorData.id), floorButton, elevatorData.times);
                startJob(elevatorData.id);
            }
        }
    }

    for (let i in floorButtons) {
        floorButtons[i].item.on("click", buttonClicked);
    }

}