import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Sketch = (props) => {
  const sketchRef = useRef();
  let ship;
  let aliens = [];
  let lasers = [];

  class Ship {
    constructor(p, width, height) {
      this.x = width / 2;
      this.y = height - 20;

      this.show = function () {
        p.fill(255);
        p.rectMode(p.CENTER);
        p.rect(this.x, this.y, 20, 20);
      };

      this.move = function (direction) {
        this.x += direction * 5;
        this.constraint();
      };

      this.constraint = function () {
        // prevents the player from moving offscreen
        if (this.x <= 0){
          this.x = 0;
        } else if (this.x >= width){
          this.x = width;
        }
      }
    }
  }

  class Alien {
    constructor(p, x, y) {
      this.x = x;
      this.y = y;

      this.show = function () {
        p.fill(50);
        p.rectMode(p.CENTER);
        p.rect(this.x, this.y, 20, 20);
      };

      this.move = function (direction) {
        this.x += direction * 5;
      };
    }
  }

  class Laser {
    constructor(p, x, y) {
      this.x = x;
      this.y = y;

      this.show = function () {
        p.fill(0, 0, 255);
        p.rectMode(p.CENTER);
        p.rect(this.x, this.y, 4, 10);
      };

      this.move = function () {
        this.y = this.y - 5;
      };
    }
  }

  useEffect(() => {
    const sketch = new p5((p) => {
      let width = 600;
      let height = 600;
      let rows= 6
      let cols = 8
      let xDis = 60
      let yDis = 48
      let xOffset = 70 
      let yOffset = 10
      
      p.setup = () => {
        p.createCanvas(width, height);
        ship = new Ship(p, width, height); // Pass p, width, and height here
        for(let rIndex = 0; rIndex < rows; rIndex++){
          for(let cIndex = 0; cIndex < cols; cIndex++){
            let x = rIndex * xDis + xOffset;
            let y = cIndex * yDis + yOffset;
            let alien = new Alien(p, x, y);
            aliens.push(alien);
          }
        }
      };

      p.draw = () => {
        p.background(0);
        ship.show();
        
        for(let i = 0; i < lasers.length; i++){
          lasers[i].show();
          lasers[i].move();
        }
        for(let i = 0; i < aliens.length; i++){
          aliens[i].show();
        }
      };

      p.keyPressed = () => {
        if (p.key === ' ') {
          let laser = new Laser(p, ship.x, ship.y);
          lasers.push(laser);
        }
        if (p.keyCode === p.RIGHT_ARROW) {
          ship.move(1);
        } else if (p.keyCode === p.LEFT_ARROW) {
          ship.move(-1);
        }
      }
    }, sketchRef.current);

    // Clean up
    return () => {
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;