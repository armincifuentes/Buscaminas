var Game = function() {
  
  var game = this;
  
  game.sizes = [
    [8,8],
    [16,16],
    [30,16]
  ]
  
  game.buttons = [];
  
  game.levels = {
    'easy': {
      size: 0,
      mines: 10
    },
    'medium': {
      size: 1,
      mines: 40
    },
    'hard': {
      size: 2,
      mines: 99
    }
  }
  
  try {
    game.level = game.levels[arguments[0].level];
  } catch(e) {
    game.level = 'easy';
  }
  
}

Game.prototype.drawBoard = function() {
  
  var game = this,
      rows = game.sizes[game.level.size][1],
      cols = game.sizes[game.level.size][0];
  
  var board = document.createElement('table');
  
  for (var i = 0; i < rows; i++) {
    var row = document.createElement('tr');
    
    for (var f=0; f<cols; f++) {
      var col = document.createElement('td'),
          btn = document.createElement('button');
      
      btn.innerHTML = '&nbsp;'
      btn.addEventListener('click', game.buttonClick);
      btn.coordinates = [f,i];
      
      col.appendChild(btn);
      row.appendChild(col);
      
      game.buttons.push(btn);
    }
    
    board.appendChild(row);
  }
  
  document.body.appendChild(board);
}

Game.prototype.pickRandomButton = function() {
  
  var buttons = game.buttons;
      random  = Math.round( Math.random() * buttons.length );
  
  return buttons[random];
  
}

Game.prototype.mineSeeder = function() {
  var game  = this,
      mines = game.level.mines,
      count = 0;
  
  while(count < mines) {
    
    var btn = game.pickRandomButton();
    
    if (!btn.hasMine) {
      btn.hasMine = true;
      count++;
    }
  }
}

Game.prototype.buttonClick = function(event) {
  
  var btn = event.target;
  
  if (btn.hasMine) {
    alert('BOOM');
  } else {
    btn.innerHTML = game.countAdjacentMines(btn.coordinates);
  }
  
}

Game.prototype.getButtonByCoordinates = function(coords) {
  
  var game = this,
      rows = game.sizes[game.level.size][1],
      cols = game.sizes[game.level.size][0];
  
  if (coords[0] >= cols || coords[1] >= rows || coords[0] < 0 || coords[1] < 0) return;
  
  var row = document.getElementsByTagName('tr')[coords[1]],
      col = row.getElementsByTagName('td')[coords[0]],
      btn = col.getElementsByTagName('button')[0];
  
  return btn;
}

Game.prototype.countAdjacentMines = function(coords) {

  var game      = this,
      mines     = 0,
      cardinals = [
    [-1,-1],[0,-1],[1,-1],
    [-1, 0]       ,[1, 0],
    [-1, 1],[0, 1],[1, 1]
  ];
  
  cardinals.forEach( function(xy) {
    
    
    var xy = [ coords[0] - xy[0], coords[1] - xy[1]];
    
    var btn = game.getButtonByCoordinates(xy);
    
    if (btn && btn.hasMine) mines++;
  });
    
  return mines;
}

Game.prototype.init = function() {
  var game = this;
  
  game.drawBoard();
  game.mineSeeder();
}