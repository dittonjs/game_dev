const defaultCircleOptions = {
  shouldFill: true,
  fillStyle: "black",
  lineWidth: 1,
  strokeStyle: "black",
  shouldStroke: true,
}

const defaultRectOptions = {
  fillStyle: null,
  strokeStyle: 'black',
}

const defaultLineOptions = {
  strokeStyle: "black"
}

class JdCanvasApi {
  constructor(context){
    this.context = context;
  }

  drawRect(at, width, height, options = {}){
    const opts = _.assign({}, defaultRectOptions, options);
    this.context.save();
    _.merge(this.context, opts);
    this.context.fillRect(
      at.x - (width/2),
      at.y - (height/2),
      at.x + (width/2),
      at.y + (width/2)
    );
    this.context.restore();
  }

  drawLine(from, to, options = {}){
    const opts = _.assign({}, defaultLineOptions, options);
    this.context.save();
    _.merge(this.context, opts);
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
    this.context.restore();
  }

  drawCircle(at, radius, options = {}){
    const opts = _.assign({}, defaultCircleOptions, options);
    this.context.save();
    _.merge(this.context, opts);
    this.context.beginPath();
    this.context.arc(at.x, at.y, radius, 0, 2 * Math.PI, false);
    opts.shouldFill && this.context.fill();
    opts.shouldStroke && this.context.stroke();
    this.context.restore();
  }
}
