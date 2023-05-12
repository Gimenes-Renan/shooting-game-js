const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c = canvas.getContext("2d");

//Upper Score
const scoreEl = document.querySelector("#scoreEl");

//Modal StartGame
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const modalScoreEl = document.querySelector("#modalScoreEl");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let projectiles = [];
let enemies = [];
let particles = [];
let player = new Player(centerX, centerY, 30, "white");
let score = 0;

function init() {
  projectiles = [];
  enemies = [];
  particles = [];
  player = new Player(centerX, centerY, 30, "white");
  score = 0;
  scoreEl.innerHTML = score;
  modalScoreEl.innerHTML = score;
}

function setDirection(start, end, speed = 1) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
  return velocity;
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius; //spawn up or down
    } else {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius; //spawn left or right
      y = Math.random() * canvas.height;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const start = {
      x: x,
      y: y,
    };
    const velocity = setDirection(start, player.position, 0.3);

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);

  c.fillStyle = "rgba(0,0,0,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  particles.forEach((particle, i) => {
    if (particle.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();

    //remove projectiles from out of the screen
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x + projectile.radius > canvas.width ||
      projectile.y - projectile.radius < 0 ||
      projectile.y + projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  });

  for (let i = enemies.length - 1; i > 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    const distancePlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distancePlayer - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId); //pause
      modalScoreEl.innerHTML = score;
      modalEl.style.display = "flex";
    }

    projectiles.forEach((p, pIndex) => {
      const distance = Math.hypot(p.x - enemy.x, p.y - enemy.y);
      //colision bullet x enemy
      if (distance - enemy.radius - p.radius < 1) {
        //create particles
        for (let part = 0; part < enemy.radius * 2; part++) {
          particles.push(
            new Particle(p.x, p.y, Math.random() * 3, enemy.color, {
              x: (Math.random() - 0.5) * 6,
              y: (Math.random() - 0.5) * 6,
            })
          );
        }

        projectiles.splice(pIndex, 1);
        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10, //smooth transition with GSAP
          });
          score += 25;
        } else {
          //enemy dies
          enemies.splice(i, 1);
          score += 100;
        }
        scoreEl.innerHTML = score;
      }
    });
  }
}

window.addEventListener("click", (event) => {
  var positionClick = {
    x: event.clientX,
    y: event.clientY,
  };
  const speed = 4;
  const velocity = setDirection(player.position, positionClick, speed);
  projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
});

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});
