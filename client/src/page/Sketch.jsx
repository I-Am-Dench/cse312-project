import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1>Space Invaders</h1>
      <button type="button" onClick={onStart}>Play</button>
    </div>
  );
};

const Sketch = () => {
  const sketchRef = useRef();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  let ship;
  let aliens = [];
  let lasers = [];
  let score = 0;

  class Ship {
    constructor(p, width, height) {
      this.x = width / 2;
      this.y = height - 20;
      this.speed = 5;

      this.show = function () {
        p.fill(0, 255, 0);
        p.rectMode(p.CENTER);
        p.rect(this.x, this.y, 20, 20);
      };

      // controls the players movement and limits them to the screen
      this.move = function () {
        if (p.keyIsDown(p.RIGHT_ARROW) && this.x < width - 10) {
          this.x += this.speed;
        }
        if (p.keyIsDown(p.LEFT_ARROW) && this.x > 10) {
          this.x -= this.speed;
        }
      };
    }
  }

  class Alien {
    constructor(p, x, y, width, height) {
      this.x = x;
      this.y = y;
      this.direction = 1; // 1 for right, -1 for left
      this.speed = 1;
      this.isAlive = true;
  
      this.show = function () {
        if (this.isAlive) {
          p.fill(255);
          p.rectMode(p.CENTER);
          p.rect(this.x, this.y, 20, 20);
        }
      };
  
      this.move = function () {
        this.x += this.direction * this.speed;
        if (this.x >= width - 10 || this.x <= 10) {
          this.direction *= -1; // Change direction
          this.y += 20; // Move down
        }
      };

      this.hit = function(laser) {
        if (laser.x > this.x - 10 && laser.x < this.x + 10 && laser.y < this.y + 10 && laser.y > this.y - 10) {
          this.isAlive = false;
          score += 200; // Update the score
          return true; // Alien is hit
        }
        return false; // Alien is not hit
      }
    }
  }

  class Laser {
    constructor(p, x, y, height) {
      this.x = x;
      this.y = y;

      this.show = function () {
        p.fill(0, 0, 200);
        p.rectMode(p.CENTER);
        p.rect(this.x, this.y, 4, 10);
      };

      this.move = function () {
        this.y = this.y - 5;
      };
    }
  }

  useEffect(() => {
    if (!gameStarted) return;

    const sketch = new p5((p) => {
      let width = 600;
      let height = 600;
      let rows = 5;
      let cols = 9;
      let xDis = 60;
      let yDis = 48;
      let xOffset = 70;
      let yOffset = 10;
      
      p.setup = () => {
        const canvas = p.createCanvas(width, height);
        canvas.parent(sketchRef.current);
        ship = new Ship(p, width, height); // Pass p, width, and height here
        for (let cIndex = 0; cIndex < cols; cIndex++) {
          for (let rIndex = 0; rIndex < rows; rIndex++) {
            let x = cIndex * xDis + xOffset;
            let y = rIndex * yDis + yOffset;
            let alien = new Alien(p, x, y, width, height);
            aliens.push(alien);
          }
        }
      };

      p.draw = () => {
        p.background(0);
        ship.show();
        ship.move();
        
        if (!gameOver) {
          // Check for collisions between lasers and aliens
          for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].show();
            lasers[i].move();
            for (let j = aliens.length - 1; j >= 0; j--) {
              if (aliens[j].isAlive && aliens[j].hit(lasers[i])) {
                lasers.splice(i, 1);
                break;
              }
            }
          }
          
          // Remove lasers that have gone off the screen
          for (let i = 0; i < lasers.length; i++) {
            if (lasers[i].y < 0) {
              lasers.splice(i, 1);
            }
          }
          
          // Check if all aliens are destroyed and spawn a new wave
          let aliveAliens = aliens.filter(alien => alien.isAlive);
          if (aliveAliens.length === 0) {
            for (let cIndex = 0; cIndex < cols; cIndex++) {
              for (let rIndex = 0; rIndex < rows; rIndex++) {
                let x = cIndex * xDis + xOffset;
                let y = rIndex * yDis + yOffset;
                let alien = new Alien(p, x, y, width, height);
                aliens.push(alien);
              }
            }
          }
          
          // Check for collisions between aliens and the player ship
          for (let i = 0; i < aliens.length; i++) {
            if (aliens[i].isAlive) {
              aliens[i].show();
              aliens[i].move();
              // Check collision with player ship
              if (
                aliens[i].y + 10 >= ship.y - 10 &&
                aliens[i].x + 10 >= ship.x - 10 &&
                aliens[i].x - 10 <= ship.x + 10
              ) {
                setGameOver(true);
                break;
              }
              // Check if alien has reached the bottom
              if (aliens[i].y > height - 20) {
                setGameOver(true);
                break;
              }
            }
          }
        }
      
        p.fill(255);
        p.textSize(32);
        p.textAlign(p.CENTER, p.CENTER);
        if (gameOver) {
          p.text(`Game Over!`, width / 2, height / 2);
        }
      };

      p.keyPressed = () => {
        if (!gameOver && p.key === ' ') {
          let laser = new Laser(p, ship.x, ship.y, height);
          lasers.push(laser);
        }
      };
    }, sketchRef.current);

    // Clean up
    return () => {
      sketch.remove();
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    score = 0;
    setGameOver(false);
    aliens = [];
    lasers = [];
  };

  return (
    <div className="sketch-container">
      {!gameStarted && <StartScreen onStart={startGame} />}
      <div ref={sketchRef}></div>
    </div>
  );
};

export default Sketch;