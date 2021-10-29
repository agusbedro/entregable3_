let move_speed = 3;
let gravity = 0.5;
let bird = document.getElementById('bird');
let floor = document.getElementById('floor');
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let state = 'Start';
let five_points = document.getElementById("five_points");
let timer_evil_bird = 0;
let pipe_seperation = 0;
let pipe_gap = 35;
let yellow = document.getElementById("yellow");
let blue = document.getElementById("blue");

//choose the yellow bird to play
yellow.addEventListener("click", () => {
  bird.style.background = "url('img/yellowbird.png')";
});

//choose the blue bird to play
blue.addEventListener("click", () => {
  bird.style.background = "url('img/bluebird.png')";
});


document.addEventListener('keydown', (e) => {
    
  //To start playing press space
  if (e.key == ' ' && state != 'Play') {
    
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
      e.remove();
    });
    timer_evil_bird = 0; 
    bird.style.animation = '';
    bird.style.top = '40vh';
    state = 'Play';
    message.innerHTML = '';
    score_val.innerHTML = '0';
    play();
  }
});



function play() {


  function action_pipe() {
    
    if (state != 'Play') return;
      
    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach((pipe) => {
        
      let pipe_props = pipe.getBoundingClientRect();
      let bird_props = bird.getBoundingClientRect();

      //delete pipe if it is out of screen
      if (pipe_props.right <= 0) {
        pipe.remove();
      } 
      else {
        //chech if the bird touches the pipe
        if (bird_touch_element(bird_props, pipe_props) ) { 
          state = 'End';
          message.innerHTML = 'Toca SpaceBar para reiniciar';
          message.style.left = '21vw';
          bird.style.animation = 'die 0.5s linear infinite';
          return;
        } else {
         //increase score if the bird skips the pipe
          if (
            pipe_props.right < bird_props.left &&
            pipe_props.right + 
            move_speed >= bird_props.left &&
            pipe.increase_score == '1'
          ) {
            five_points.style.animation = '';
            score_val.innerHTML = +score_val.innerHTML + 1;
          }
          //movement pipe
          pipe.style.left = 
            pipe_props.left - move_speed + 'px';
        }
      }
    });
    requestAnimationFrame(action_pipe);
  }
  requestAnimationFrame(action_pipe);



  function action_coin(){

    let coin_sprite = document.querySelectorAll('.coin');

    coin_sprite.forEach((coin) => {
      
      if (state == 'End'){
        coin.remove();
        return;
      }

      let coin_sprite_props = coin.getBoundingClientRect();
      let bird_props = bird.getBoundingClientRect();
      
      //delete coin if it is out of window 
      if (coin_sprite_props.right == window.screen.width) {
        coin.remove();
      }
      else {
        //increase 5 point if the bird catches the coin
        if (bird_touch_element(bird_props, coin_sprite_props)){ 
          score_val.innerHTML =+score_val.innerHTML + 5;
          //show animation when increasing 5
          five_points.style.top = coin_sprite_props.top - 10 + "px";
          five_points.style.left = coin_sprite_props.left + "px";
          five_points.style.animation = 'show_5 1s linear 1';

          coin.remove();        
        }
      }
    });
    requestAnimationFrame(action_coin);
  }
  requestAnimationFrame(action_coin);
  


  function action_evil_bird(){

    let evil_sprite = document.querySelectorAll('.evil_bird');

    evil_sprite.forEach((evil) => {
      
      if (state == 'End'){
        evil.remove();
        return;
      }

      let evil_sprite_props = evil.getBoundingClientRect();
      let bird_props = bird.getBoundingClientRect();
     
      //deletes the evil bird if it is out of window 
      if(evil_sprite_props.right < 2){  
          evil.remove();
      }
      else {
        //loose game if the bird touches the evil bird 
        if (bird_touch_element(bird_props, evil_sprite_props)){ 
          message.innerHTML = 'Toca SpaceBar para reiniciar';
          message.style.left = '21vw';
          bird.style.animation = 'die 0.5s linear infinite';
          state = 'End';
          evil.remove();
        }
      }
    });
    requestAnimationFrame(action_evil_bird);
  }
  requestAnimationFrame(action_evil_bird);


  //checks if the bird touches any element 
  function bird_touch_element(bird_props, element_props){
    return bird_props.left < element_props.left +
    element_props.width &&
    bird_props.left +
    bird_props.width > element_props.left &&
    bird_props.top < element_props.top +
    element_props.height &&
    bird_props.top +
    bird_props.height > element_props.top;
  }
  
  let bird_dy = 0;

  //apply gravity when flying 
  function apply_gravity() {
    if (state != 'Play') return;
    
    bird_dy = bird_dy + gravity;
    document.addEventListener('keydown', (e) => {
      if (e.key == ' ') {
        bird_dy = -7.6;
      }
    });
  
    let bird_props = bird.getBoundingClientRect();

    // Collision detection with bird and window top and bottom
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      state = 'End';
      message.innerHTML = 'Toca SpaceBar para reiniciar';
      message.style.left = '23vw';
      return;
    }

    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);
  
  
  
  function create_pipe() {
    if (state != 'Play') return;
      
    //Create two pipes when distance between two pipes has exceeded 115
    if (pipe_seperation > 115) {
      pipe_seperation = 0;
        
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';

      //Set space between pipes for differents screens 
      if(window.screen.width > 1300 && window.screen.width < 1550)
        pipe_sprite_inv.style.top = pipe_posi - 160 + 'vh';
      else if(window.screen.width > 1550 && window.screen.width < 1660)
        pipe_sprite_inv.style.top = pipe_posi - 125 + 'vh';
      else if(window.screen.width > 1660 && window.screen.width < 1950)
        pipe_sprite_inv.style.top = pipe_posi - 100 + 'vh';
      
      pipe_sprite_inv.style.left = '100vw';
      pipe_sprite_inv.style.transform = 'rotate(180deg)';
        
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
        
      // Append the created pipe element in DOM
      document.body.appendChild(pipe_sprite_inv);
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);



  function create_coin(){

    //Create a coin when distance pipe_separation has exceeded 115
    if(pipe_seperation > 115){

      let coin = document.createElement('div');
      coin.className = 'coin';
      //set a random position for the coin
      let coin_posi = Math.round(Math.random() * (30 - 60 + 1) + 60);
      coin.style.top = coin_posi + 'vh';
      
      //run the coin in differents velocitys depending on the screen
      if(window.screen.width > 1500 && window.screen.width < 1600)
          coin.style.animation = "move_coin 5s linear 1";
      else if(window.screen.width > 1300 && window.screen.width < 1400) {
          coin.style.animation = "move_coin 4s linear 1";
      }
      else if(window.screen.width > 1850 && window.screen.width < 1950){
          coin.style.animation = "move_coin 10.55s linear 1";
      }

      document.body.appendChild(coin);
    }
    requestAnimationFrame(create_coin);
  }
  requestAnimationFrame(create_coin);


  function create_evil_bird(){

    if (state == "Play" ){
      
      //Create an evil bird when timer has exceeded 500
      if(timer_evil_bird > 500){
        timer_evil_bird = 0;

        let evil_bird = document.createElement('div');
        evil_bird.className = 'evil_bird';
     
        //set a random position for the evil bird
        let bird_posi = Math.round(Math.random() * (30 - 60 + 1) + 60);
        evil_bird.style.top = bird_posi + 'vh';
        document.body.appendChild(evil_bird);
      }
      timer_evil_bird++;
      requestAnimationFrame(create_evil_bird);
    }
  }
  requestAnimationFrame(create_evil_bird);

  //if the score exceeds 100, the player wins
  function score_exceeded(){
    
    if(state == 'End')
      return;

    if(score_val.innerText > 100){  
      state = 'End';
      message.innerHTML = 'Has llegado al final del juego';
      message.style.left = '21vw';
      bird.style.animation = 'die 0.5s linear infinite';
    }
    requestAnimationFrame(score_exceeded);
  }
  requestAnimationFrame(score_exceeded);
}



