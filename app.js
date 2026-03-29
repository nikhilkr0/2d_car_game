const container = document.getElementById("container");
const containerHeight = container.clientHeight;
const userCarContainer = document.getElementById('userCarContainer');
const scorePara = document.getElementById("score");
const highestScorePara = document.getElementById("highestScore");
let highestScore = localStorage.getItem("highest score");

const button = document.getElementById("startButton");
const createObstacle = () => {
    const obstaclesList = ['blue_pickup.webp', 'blue_sedan.webp', 'green_pickup.webp', 'green_sedan.webp', 'sky_blue_sedan.webp'];
    let obstacle = obstaclesList[Math.floor(obstaclesList.length * Math.random())];
    let obstaclePosition = (Math.random() * 9) * 10;
    const obstacleContainer = document.createElement("div");
    obstacleContainer.dataset.y = -75;
    obstacleContainer.setAttribute("class", "obstacleContainer");
    const obstacleImage = document.createElement("img");
    obstacleImage.setAttribute('class', 'obstcaleImage');
    obstacleImage.setAttribute("src", `./obstacles/${obstacle}`)
    obstacleContainer.appendChild(obstacleImage);
    obstacleContainer.style.right = `${obstaclePosition}%`;
    container.insertAdjacentElement('afterbegin', obstacleContainer);
}


const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
    const music = document.getElementById("car_audio");
    music.play();
    music.loop = true;
    userCarContainer.style.transform = "translate(0px,0px)";
    let carX = 0;
    let carY = 0;
    const carControl = (e) => {
        const userCarContainerHeight = userCarContainer.clientHeight;
        const containerWidth = (container.clientWidth) / 2;
        let userCarContainerProp = userCarContainer.getBoundingClientRect();
        let containerProp = container.getBoundingClientRect();
        if (e.key == "ArrowUp" || e == "ArrowUp") {
            if (carY > -(containerHeight - userCarContainerHeight)) {
                carY -= 10;
            }
        } else if (e.key == "ArrowRight" || e == "ArrowRight") {
            if (userCarContainerProp.right + 10 <= containerProp.right) {
                carX += 10;
            }
        } else if (e.key == "ArrowDown" || e == "ArrowDown") {
            if (carY > 0) {
                carY = 0;
            }
            carY += 10;
        } else if (e.key == "ArrowLeft" || e == "ArrowLeft") {
            if (userCarContainerProp.left - 10 >= containerProp.left) {
                carX -= 10;
            }
        }
        userCarContainer.style.transform = `translate(${carX}px,${carY}px)`
    }
    window.addEventListener("keydown", carControl);
    const scoreIncreament = () => {
        if (highestScore == null) {
            localStorage.setItem("highest score", 0);
        } else {
            highestScorePara.innerText = highestScore;
        }
        highestScorePara.innerText = highestScore;
        score += 1;
        scorePara.innerText = score;
    }
    document.querySelectorAll(".carButtons").forEach((element) => {
        element.addEventListener("mousedown", () => {
            const id = element.getAttribute('id');
            carControl(id);
        })
    })
    const startContainer = document.getElementById("startContainer");
    startContainer.style.visibility = "hidden";
    const obstacleContainer = document.querySelectorAll(".obstacleContainer");
    if (obstacleContainer.length != 0) {
        obstacleContainer.forEach((element) => {
            element.remove();
        })
    }
    let score = 0;
    scorePara.innerText = score;
    container.style.animation = "highway 1.8s linear infinite";
    const moveObstacle = () => {
        let userCarContainerProp = userCarContainer.getBoundingClientRect();
        document.querySelectorAll(".obstacleContainer").forEach((element) => {
            let y = Number(element.dataset.y);
            y += 5;
            element.dataset.y = y;
            element.style.transform = `translateY(${y}px)`;
            const obstacleProp = element.getBoundingClientRect();
            if (obstacleProp.top > containerHeight) {
                container.removeChild(element);
            }
            if (userCarContainerProp.right > obstacleProp.left
                && userCarContainerProp.left < obstacleProp.right
                && userCarContainerProp.top < obstacleProp.bottom
                && userCarContainerProp.bottom > obstacleProp.top) {
                clearInterval(scoreInterval);
                clearInterval(moveInterval);
                container.style.animation = "none";
                window.removeEventListener("keydown", carControl);
                clearInterval(obstacleInterval);
                if (score > highestScore) {
                    localStorage.setItem("highest score", score);
                }
                music.pause();
                startContainer.style.visibility = "visible";
            }
        })
    }
    const moveInterval = setInterval(moveObstacle, 60);
    const obstacleInterval = setInterval(createObstacle, 1200);
    const scoreInterval = setInterval(scoreIncreament, 100);
})