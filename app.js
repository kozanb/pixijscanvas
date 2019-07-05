const log = console.log;
const logicalWidth = window.innerWidth;
const logicalHeight = window.innerHeight;
const stats = new Stats();
let renderer = null;
let stage = null;
let app = null;
let mainContainer = null;
let button = null;
var isOver = false;

const statsShow = () => {
  requestAnimationFrame(statsShow);

  stats.begin();
  renderer.render(stage);
  stats.end();
};

const resizeHandler = () => {
  const scaleFactor = Math.min(
    window.innerWidth / logicalWidth,
    window.innerHeight / logicalHeight);

  const newWidth = Math.ceil(logicalWidth * scaleFactor);
  const newHeight = Math.ceil(logicalHeight * scaleFactor);

  renderer.view.style.width = `${newWidth}px`;
  renderer.view.style.height = `${newHeight}px`;

  renderer.resize(newWidth, newHeight);
  mainContainer.scale.set(scaleFactor);
};

const init = () => {
  renderer = PIXI.autoDetectRenderer(logicalWidth, logicalHeight, {
    roundPixels: true,
    resolution: window.devicePixelRatio || 1
  });

  renderer.view.id = 'pixi-canvas';

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

  stage = new PIXI.Container();
  mainContainer = new PIXI.Container();
  app = new PIXI.Application();

  stage.addChild(mainContainer);

  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  document.body.appendChild(stats.domElement);
  stats.domElement.id = 'stats';
  resizeHandler();

  renderer.backgroundColor = 0xFFFFFF;

  statsShow();
};

const initButtons = () => {
  button = PIXI.Sprite.fromImage('button.png');
  const text = new PIXI.Text("Welcome", {
      font: "50px Arial",
      fill: "white"
  });
  
  button.interactive = true;
  button.anchor.set(0.5);
  button.x = logicalWidth / 2;
  button.y = logicalHeight / 2;
  button.hitArea = button.filterArea;
  text.anchor.set(0.5);
  button.addChild(text);
  stage.addChild(button);
  
  button.on('pointerdown', () => {
    log('hello');
  });
  
  button.mouseover = function (mouseData) {
    this.alpha = 0.75;
    isOver = true;
  }
  
  button.mouseout = function (mouseData) {
    this.alpha = 1;
    isOver = false;
  }
};

init();
initButtons();

app.ticker.add((delta) => {
  if(isOver){
      if(button.position.x <(logicalWidth/2 +20))
      button.position.x += 2*delta;
  } else {
      if(button.position.x > logicalWidth / 2)
      button.position.x -= 2*delta;
  }
});