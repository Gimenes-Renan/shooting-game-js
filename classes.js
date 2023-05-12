class Player {
  constructor(x = 0, y = 0, radius = 10, color = white) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.position = {
      x: this.x,
      y: this.y,
    };
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
  }
}

class Projectile {
  constructor(
    x = 0,
    y = 0,
    radius = 2,
    color = "red",
    velocity = { x: 1, y: 1 }
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.draw();
  }
}

class Enemy {
  constructor(
    x = 0,
    y = 0,
    radius = 2,
    color = "orange",
    velocity = { x: 1, y: 1 }
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.draw();
  }
}

const friction = 0.97;
class Particle {
  constructor(
    x = 0,
    y = 0,
    radius = 2,
    color = "orange",
    velocity = { x: 1, y: 1 }
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;

    this.alpha -= 0.01;
  }
}
