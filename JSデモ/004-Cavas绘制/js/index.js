const colorPicker = document.querySelector('input');
const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

function init() {
  const w = 500,
    h = 300;
  cvs.height = w * devicePixelRatio;
  cvs.width = h * devicePixelRatio;
  cvs.style.height = h + 'px';
  cvs.style.width = w + 'px';

}
init()


const shapes = [];

class Rectangle {
  constructor(startX, startY, color) {
    this.startX = startX;
    this.startY = startY;
    this.color = color;
    this.endX = startX;
    this.endY = startY;
  }
  get minX() {
    return Math.min(this.startX, this.endX);
  }
  get minY() {
    return Math.min(this.startY, this.endY);
  }
  get maxX() {
    return Math.max(this.startX, this.endX);
  }
  get maxY() {
    return Math.max(this.startY, this.endY);
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.minX * devicePixelRatio,
      this.minY * devicePixelRatio,
      (this.maxX - this.minX) * devicePixelRatio,
      (this.maxY - this.minY) * devicePixelRatio)
    //绘制边框
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3 * devicePixelRatio;
    ctx.strokeRect(
      this.minX * devicePixelRatio,
      this.minY * devicePixelRatio,
      (this.maxX - this.minX) * devicePixelRatio,
      (this.maxY - this.minY) * devicePixelRatio
    )
  };

  change(newX, newY) {
    this.endX = newX;
    this.endY = newY;
  }

  isInside(x, y) {
    return x >= this.minX &&
      x <= this.maxX &&
      y >= this.minY &&
      y <= this.maxY;
  }

  move(mx, my) {
    this.startX += mx;
    this.startY += my;
    this.endX += mx;
    this.endY += my;
  }
};

function getShape(x, y) {
  for (let i = shapes.length - 1; i >= 0; i--) {

    const shape = shapes[i];
    if (shape.isInside(x, y)) {
      return shape
    }
  }
  return null;
}

cvs.onmousedown = (e) => {
  const sx = e.offsetX, sy = e.offsetY;
  //如果sx和sy的位置上已经有形状了
  const shape = getShape(sx, sy);
  if (shape) {
    cvs.onmousemove = e => {
      const mx = e.movementX,
        my = e.movementY;
      shape.move(mx, my);
    }
  } else {
    const shape = new Rectangle(sx, sy, colorPicker.value);
    shapes.push(shape);

    const rect = cvs.getBoundingClientRect();
    cvs.onmousemove = e => {
      const ex = e.clientX - rect.left,
        ey = e.clientY - rect.top;
      shape.change(ex, ey);
    }

  }

  cvs.onmouseup = () => {
    cvs.onmousemove = null;
    cvs.onmouseup = null;

  }
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  for (const shape of shapes) {
    shape.draw();
  }
}
draw();