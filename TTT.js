//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^...Script...^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//-->

class TTT 
{
  constructor()
  { 

   //^^^..Class Properties...^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
    this.counter = 0;     //...total moves count in a game.......//
    this.single = true;   //...Single + AI...or... Dual player...//
    this.set_end= false;  //...State: indicates end of the game..//
    this.turn = 'X';      //...player turn.......................//
    this.p = ["winner","1","2","3","4","5","6","7","8","9"]; //..Gamepaly array - Stored Player moves (X,O) in an array..//
    this.blocks = document.getElementsByClassName('main-itm'); //..Game Play blocks - DOM elements..//
    this.newG  = document.getElementById('new');     //...new/rest button - to start a new game or reset an ongoing game...//
    this.game  = document.getElementById('game');    //...game mode element - single or dual players....//
    this.score = document.getElementById('score');   //...game score element.............//
    this.btnDL = document.getElementById('themeDL'); //...Dark/Light theme button element.....//
    this.btnC  = document.getElementById('themeC');  //...Color theme button element..........//
    this.mainBlock= document.getElementById('main-block');
    this.extBlock = document.getElementById('ext-block');
    this.bloc = undefined;   //....the currently selected block....//
    this.wait = false; //...Game Process State....Usage: 1. wait until current player turn over.........//  
                       //............................... 2. keep game process in standby state .........//
                       //...if true: next player can't act until waiting condition changes (to false)...//
    this.inf = document.getElementById('title'); //....title-info element....//
    this.fill= this.fill.bind(this);
    this.p1 = 0;   //....player 1 score count....//
    this.p2 = 0;   //....player 2 score count....//
    this.dw = 0;   //....Game draw count.........//
    this.dark_theme = true;  // Dark - Light Theme indicator
    this.themeID = 1;   // Various color theme indicator
   }

  //^^^...Class.Methods.names...^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
  //.................................................................................//
  //--> {  init    -  about         -  newGame  -   reset   -  demo              }...//
  //--> {  player  -  switchPlayer  -  fill(x)  -   aiplay  -  process  -   win  }...//
  //.................................................................................//
  //..vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv//

  //--..................................................................................................--//
  //--.....Startup considerations: Screen optimizations,  Initialization, game play cycle execution.....--//
  //......................................................................................................//
  init() {  //Visuals
           window.scrollTo(0,1); let once= {once: true}; document.addEventListener( 'mousedown', ()=> document.documentElement.requestFullscreen(), once); //fullscreen process
           this.theme();  // color profile assignment
           // this.extBlock.classList.add('vi-slide', 'vo-slide', 'vr-slide');  //this.extBlock.classList.remove('vi-slide'); 
           this.inf.classList.add('vr-slide');  
           this.btnDL.classList.toggle('n-blink');      this.btnC.classList.toggle('n-blink');
           this.newGame(); this.btnC.style.display='none';
           // defining blocks elements
           //let itm = element ;
           //for (i=1; i!==9; i++)  this.mainBlock.appendChild(itm)
           Array.from ( this.mainBlock.children, f => f.setAttribute('onclick', `game.fill(${f.id})` )); // faster html based
           // Array.from ( this.blocks, f => f.onclick = this.fill );// in case used to call fill by this instance...//slower event based
           // f.addEventListener('click', this.fill ) } );// other option: replace  this.fill by [ game.fill  &  fill=(x)=>{... ]
    }

  //--....................................................................................--//
  //--.........Theme function - 1. Switch app Theme of Dark / Light / Color ..............--//    
  //--......................... 2. Processing color and style properties..................--//
  //........................................................................................//
  theme(x) { 
             let colorTheme  = document.documentElement;
             colorTheme.style.filter = 'initial'; 
             colorTheme.style.background ='';
             let lGr='linear-gradient( rgb(180, 60, 80), rgb(250, 100, 50), rgb(110, 150, 180), rgb(120, 180, 230), rgb(120, 180, 210), rgb(130, 220, 250) )';
             let dGr='linear-gradient( rgb(12, 2, 36), rgb(6, 10, 85), rgb(16, 25, 20), rgb(30, 75, 10) )';            
             let fGr='radial-gradient( rgb(195, 125, 80), rgb(230, 140, 90), rgb(235, 145, 95), rgb(254, 160, 110) )';
             let cGr='linear-gradient( rgb(150, 5, 5), rgb(200, 5, 5), rgb(255, 5, 10), rgb(250, 25, 10), rgb(225, 75, 5), rgb(200, 100, 5), rgb(200, 150, 5), rgb(175, 125, 25), rgb(100, 175, 25), rgb(75, 200, 25), rgb(25, 250, 25), rgb(5, 250, 75), rgb(10, 200, 75), rgb(10, 150, 150), rgb(5, 125, 175), rgb(15, 75, 200), rgb(25, 25, 250), rgb(50, 5, 250), rgb(100, 5, 200), rgb(150, 5, 200), rgb(175, 5, 175), rgb(150, 0, 150) )';
            
             let vals = 1; // array counting modifier: 1:(dark) 2:(light)
             //..if function call was with parameter(True), program cycle between color themes.............//
             //..if function call was without parameter(False), program will switch between Dark & Light themes..//
             
             if(x) {
                    if (this.dark_theme) { 
                    if      (this.themeID===1) { colorTheme.style.filter = 'saturate(200%)'; colorTheme.style.background = cGr }
                    else if (this.themeID===2) { colorTheme.style.filter = 'hue-rotate(-80deg)'; colorTheme.style.background = lGr }
                    else if (this.themeID===3) { colorTheme.style.filter = 'hue-rotate(120deg)'; colorTheme.style.backgroundColor='#efd' }
                    else if (this.themeID===4) { colorTheme.style.filter = 'saturate(100%) invert(180%) hue-rotate(-60deg)'; colorTheme.style.background = fGr }
                                               //colorTheme.style.filter = 'none';  // document.documentElement.style.backgroundColor=''
                    }
                    else {
                      if (this.themeID===1) colorTheme.style.filter = 'brightness(120%) saturate(100%) hue-rotate(40deg)'; //invert(20%)
                      else if (this.themeID===2) { colorTheme.style.filter = 'hue-rotate(-30deg) brightness(120%)';  colorTheme.style.background = dGr }
                      else if (this.themeID===3) colorTheme.style.filter = 'hue-rotate(120deg)';
                      else if (this.themeID===4) { colorTheme.style.filter = 'hue-rotate(25deg) saturate(120%)'; colorTheme.style.background = cGr }
                     }
                    (this.themeID===4) ? this.themeID=0 : this.themeID++ ;
                    return;
               }
              else {  // function called without parameter:
                      if (this.dark_theme) this.dark_theme=false; // Dark Theme -  assign to Light for next time D/L theme switch is called
                      else { vals=2; this.dark_theme = true }  // Light Theme -  to Dark for next time switch

                                  // Variables   ,    Dark       &    Light  theme color values
                      let ppts = [ '--cont-C'    ,   '#100820'   ,   '#fde' ,  // newspaper fff8ee
                                  '--main-C'     ,   '#0b0d0f'   ,   '#ede' ,
                                  '--ext-C'      ,   '#0d0913'   ,   '#fde' ,
                                  '--main-itm-C' ,   '#012'      ,   '#edd' ,
                                  '--ext-itm-C'  ,   '#edf'      ,   '#013' ,  
                                  '--main-txt-C' ,   'red'       ,   'red'  ,
                                  '--ext-txt-C'  ,   '#ddd'      ,   '#000' ,
                                  '--logo-btn-C' ,   '#102'      ,   '#fad' , //f50
                                  '--logo-txt-C' ,   '#fc1'      ,   '#05f' ,
                                  '--newG-btn-C' ,   '#021'      ,   '#fba5ed' ,
                                  '--newG-txt-C' ,   '#eb2'      ,   '#010' ,
                                  '--game-btn-C' ,   '#102'      ,   '#a9f' ,
                                  '--game-txt-C' ,   '#e7e'      ,   '#000' ,
                                  '--score-btn-C',   '#000'      ,   '#004' ,
                                  '--main-sh-C' ,   '#7cf'      ,   '#626' ,
                                  '--ext-sh-C'  ,   '#74b'      ,   '#003' ,  
                                  '--newG-sh-C' ,   '#1f3'      ,   '#000' ,
                                  '--game-sh-C' ,   '#aaf'      ,   '#000' ,
                                  '--score-sh-C',   '#ddd'      ,   '#000' ,
                                  '--txt-C'      ,   '#306'      ,   '#cde' ,
                                  '--blink-C'    ,   '#014'      ,   '#00a' ,
                                  '--trans-C'    ,   '#fae'      ,   '#c00' ,                      
                                  '--theme-btn-C',   '#ba9'      ,   '#214' ,
                                  '--glow-C'     ,   '#f00'      ,   '#fd1' ,
                                  '--theme-C'    ,   `${cGr}`    ,   `${cGr}`
                                  ];
                      for (let n=0; n<75 ; n+=3) { colorTheme.style.setProperty( ppts[n] , ppts[vals+n]) }
                }
    }

  //--........................................................--//
  //--.............Credits, About, Information................--//
  //--........................................................--//
  about() {
            if(this.newG.innerText==='Reset Game') return;
            // function to show/restore side menue (extBlock) this.extBlock.classList.toggle('vi-slide vo-slide');
            let info_to_menu = ()=>{  this.inf.classList.remove('vo-slide');
                this.extBlock.style.gridTemplateAreas='initial';
                this.btnDL.style.display='grid';   this.btnC.style.display='none';  
                this.newG.style.display='grid';   this.game.style.display='grid';   this.score.style.display='grid';
                this.extBlock.style ='initial';   this.inf.setAttribute('id', 'title');   this.inf.innerHTML='TIC<br>TAC<br>TOE';
                this.extBlock.classList.add('vi-slide');
                this.blocks[2].style.backgroundImage=''; this.set_end = false; this.demo();
              }

            let menu_to_info = ()=> {  // this.extBlock.innerHTML='Coded by <b>Peyman</b>. this.inf.setAttribute('class', 'vo-slide');  
                this.extBlock.classList.remove('vo-slide'); 
                this.inf.setAttribute('id', 'info');
                this.set_end = true;  this.demo();  
                this.blocks[2].style.color='transparent'; 
                this.blocks[2].style.backgroundImage=`url('./images/me.jpg')` //`url('https://scontent.fszb2-1.fna.fbcdn.net/v/t1.0-1/c0.1.320.320a/p320x320/51538838_10214084402601052_221845377349844992_n.jpg?_nc_cat=111&_nc_ht=scontent.fszb2-1.fna&oh=94bec317b5e3e5fb62a100990d47755a&oe=5D3FC4F4')`;
                this.blocks[2].style.backgroundSize='cover';  this.blocks[2].style.backgroundRepeat='no-repeat';
                this.blocks[2].style.backgroundPosition= 'center';   // this.blocks[4].style.transform = 'translate(-30%, -40%) skew(10deg,-1deg) rotateY(20deg) scale(1.6)';this.blocks[4].style.borderRadius="70%"

                this.blocks[2].style.transform = 'translate(-12%, +20%) skew(-2deg,0deg) rotateY(20deg) scale(1.4)'; this.blocks[2].style.borderRadius="10%"
                this.btnDL.style.display='none'; this.btnC.style.display='none';  this.newG.style.display='none'; this.game.style.display='none';  this.score.style.display='none';
                //this.extBlock.children.style.display='none' ;
                //this.inf.style.display='grid' ;
                this.extBlock.style.gridTemplateAreas =`'.tt.' 
                                                        '.tt.'
                                                        '.tt.'
                                                        '.tt.'
                                                        '....'`; this.extBlock.style.maxHeight='90vh';
               
                //this.inf.style.overflow='hidden';                         
                //Array.from ( this.extBlock, f => f.children.style.display='none' );//document.documentElement.style.overflow='hidden';
                this.inf.style.color='white'; this.inf.style.backgroundColor='Black';
                this.inf.innerHTML = '<p><b>Example web-app game by Peyman</b>. <br></br><b>Highlights:</b></br>This game is an example showcase for a SPA Web App, presenting a Highly dynamic workflow cycle, logical reactivity and processing. <br></br><b>Design Pattern-Style</b>: custom material design, optimized UI/UX. </br> <b>Highlights:</b> Simple interface and User friendly Features new web development standards and practices, a single html file using html/JS/CSS with no libs/dependencies. </p>';
                // let path_dir = require('path'); // later learn to find a file directory
                this.inf.classList.add('vi-slide'); 
              }

            if (this.inf.id==='title')  { this.extBlock.classList.add('vo-slide');    setTimeout(()=>{ menu_to_info() }, 790);   }
            else {  this.inf.classList.remove('vi-slide'); this.inf.classList.add('vo-slide');  setTimeout(()=>{ info_to_menu() }, 790);  this.reset() }
    }

  //--................................................................--//
  //--..............Reset the game -or- Start a new game..............--//    
  //--................................................................--//
  newGame() {             
      document.getElementById('ext-block').classList.toggle('t-fade'); // Transition fading effect on the menu
      // New game
      if (this.newG.innerText==='New Game' ) 
         {  this.set_end=true; this.btnC.style.display='grid';
            this.newG.innerText='Reset Game'; // changing to reset button, in case you want to reset the started game
          //if (!this.dark_theme)  this.game.style.color='#214'; else { this.game.style.color='#a9f'; }// this.game.style.color=this.game.style.backgroundColor; }
            if (!this.dark_theme)  {this.game.style.color='transparent'; this.game.style.backgroundColor='transparent'} 
            else { this.game.style.color=this.game.style.backgroundColor; } // continue
            this.score.style.color='cyan'; 
            this.demo(); this.reset();
        }
      // Reset Game
      else{ this.btnC.style.display='none'; this.theme(); this.theme(); // double call so theme resets into original.
            this.newG.innerText='New Game'; //this.newG.style.color='red';
            this.game.style.color=''; //this.score.style.color='darkcyan';
            this.score.innerHTML=` Player X \u00A0:\u00A0 <p  style='line-height: 2vmin; color: var(--main-sh-C)'> -----------------</p> Player O \u00A0:\u00A0 `;
            this.game.innerText = (this.single) ? 'Single Player' : 'Dual Players'; 
            this.p1=0; this.p2=0; this.dw=0; this.counter=0;
            this.set_end=false;  this.reset(); this.demo(); 
        }
   }

  //--.............................................................--//    
  //--..........Reset the gameboard blocks, back to empty..........--//
  //.................................................................//  
  reset() { 
            Array.from(this.blocks, f=>{  // Reseting dynamic elements to the initial 
                                          f.innerText='\u00A0'; f.style=''; f.setAttribute('class','main-itm'); 
                                          f.style.color="#013"; f.classList.toggle('t-fade') } );

            for (let n=0; n<10; n++) this.p[n]='\u00A0'; 
            // (this.single) ? this.turn='X' : (this.turn==='X') ? this.turn='O': this.turn='X';
            this.counter=0;  this.set_end=false; //game started
            if ((this.single)&&(this.turn==='O')) this.aiPlay(); // to fix later: return results, call aiPlay outside the class. instead of in class functional cycle 
   }

  //--.......................................................--//    
  //--..........Main Screen Blocks animation Demo............--//
  //...........................................................//  
  demo() { 
           if (this.set_end) {
               for (let n=0; n<9; n++) 
                   { this.blocks[n].classList.remove('blink');  this.blocks[n].classList.remove('trans') }
             }
           else{ for (let n=0; n<9; n=n+2) {this.blocks[n].setAttribute('class', 'main-itm blink'); this.blocks[n].innerText='X' }
                  //this.blocks[n].style.backgroundColor=('#'+n+''+n+''+n) }
                 for (let n=1; n<9; n=n+2) {this.blocks[n].setAttribute('class', 'main-itm trans'); this.blocks[n].innerText='O' } 
             }
    }

  //--..................................................................................--//
  //--...........Game Menu option - switch between Single and Dual Players mode.........--//
  //--..................................................................................--//
  player() {  
              if (this.newG.innerText==='New Game') //only switch if in main screen(not within an existing game)
              { 
                  if (this.single) 
                  { this.single=false; 
                  this.game.innerText='Dual Players';
                  }
                  else{ this.single=true;  this.game.innerText='Single Player' }
                  this.score.innerHTML=` Player X \u00A0:\u00A0 <p style='line-height: 2vmin; color: var(--main-sh-C)'> -----------------</p> Player O \u00A0:\u00A0 `; 
                  //this.game.classList.toggle('t-fade');
              }
    }

  //--..................................................................................--//
  //--............................Player turn, switch between players......................--//
  //--..................................................................................--//
  switchPlayer() {   
                   if (this.turn==='X') { this.bloc.style.color='red'; this.turn='O' }
                   else { this.bloc.style.color='blue'; this.turn='X' } 
   } 

  //--..................................................................................--//
  //--...........Game Menu option - switch between Single and Dual Players mode.........--//
  //--..................................................................................--//
  fill(x) { // Function To fill a block by Player's move 
        if(this.set_end || this.wait) return; // if end of set is reached won't fill blocks or process further.
        //this.bloc = x.currentTarget; // the clicked block
        this.bloc= document.getElementById(x);// // in case x be the id //alert(this.bloc.id);
        if (this.bloc.innerText!=='\u00A0') return;
        this.bloc.innerText=this.turn;
        this.counter++;
               // default: alert("error"); return; break; //must never execute, if it does means an issue with the code.
        let cbid= parseInt(this.bloc.getAttribute("id"),10); //get the index of the clicked block
        this.p[cbid]= this.bloc.innerText; // add player move to the game play array.
        this.switchPlayer();
        this.process();

        // if single and game not ended yet process AI play... 
        if (this.single && !this.set_end)  { this.wait=true; setTimeout(()=>{  this.aiPlay() }, 600) } 
    }


  //--........AI opponent logic - Computer turn in single player mode "fill(o)".........--//
  //--..................................................................................--//
  aiPlay() {
        this.wait = false;
        let bid=0; // To hold index of a Block

        let twoBlocks = (x,y,z) => {  //check to find any 2 blocks in a row
              if ( (this.p[x]!=='\u00A0') && (this.p[z]==='\u00A0') && (this.p[x]===this.p[y]) ) return z; 
              else if ( (this.p[z]!=='\u00A0') && (this.p[x]==='\u00A0') && (this.p[z]===this.p[y]) ) return x; 
              else if ( (this.p[x]!=='\u00A0') && (this.p[y]==='\u00A0') && (this.p[x]===this.p[z]) ) return y; 
              else return 0;
         }
        // making a random choice out of an array
        Array.prototype.rnd = function() { return this[Math.floor(Math.random()*this.length)] } 
        let c = [ 1,2,3 , 4,5,6 , 7,8,9 , 1,4,7 , 2,5,8 , 3,6,9 , 1,5,9 , 3,5,7 ]; // winning sets


        if (this.counter===0) bid = Math.floor(Math.random() * 8);   //try removing case 0 see what will happen
         //set index by a random Number 1~9 if AI does first move
        else if (this.counter < 3) { let i=[1,3,5,7,9]; do {bid=i.rnd()} while(this.p[bid]!=='\u00A0'); }

         // Horizontal // Vertical // Diagonal // checkup winning condition ***********
        else  for ( let x=0; x<22; x=x+3) { bid = twoBlocks( c[x] , c[x+1] , c[x+2] );  if(bid!==0) break } 
                                            // Calling twoBlocks to find if there is 2 blocks in a row
                                            // Else continue with next operation to find an empty block.

        if(bid===0){  // to find an empty block, based nearest neighbor to users last move.
            bid= parseInt(this.bloc.getAttribute("id"),10); // Find block index of previous player action
            let b=1; let a=1;  //  b(before it) -last move-  a(after it)
            for(let n=bid+1; n<10; n++) { /*alert(n);*/ if (this.p[n]==='\u00A0')  {a=n; break } else a=0 } //nearest block after X
            for(let n=bid-1; n>0; n--)  { /*alert(n);*/ if (this.p[n]==='\u00A0') {b=n; break } else b=0 } //nearest block before X 
            if (bid===1) b=0; else if (bid===9) a=0; // if is first no longer before - if is last no more blocks after 
            if( ((bid-b) > (a-bid)) && a!==0 ) b=a;  if(b===0) b=a; //alert(b);
            bid=b; 
         }                                                      //(-1 bcos array starts from 0)
        this.bloc = document.getElementsByClassName('main-itm')[bid-1]; //select element block of specified index.
        this.bloc.innerText = this.turn; // assign current player mark to selected element block
        this.p[bid] = this.turn; //turn: O // store player move
        this.counter++;
        this.switchPlayer();
        this.process();
    }  

  //--..........checks the Game state for a win or draw condition at the end of each round............--//
  //--................................................................................................--//
  process() { // Draw: no more possible moves  -  Win: 3 blocks in sequence filled by a player

        let prc= (x,y,z) =>   // Check if a Winning Condition met.
            {   if ((this.p[x]!=='\u00A0')&&(this.p[x]===this.p[y])&&(this.p[x]===this.p[z])) 
                    {   //Set the winner - Highlight the winner blocks 
                        this.p[0]=this.p[x];
                        this.blocks[x-1].style.boxShadow='0 0 4vmin var(--glow-C)';
                        this.blocks[y-1].style.boxShadow='0 0 4vmin var(--glow-C)';
                        this.blocks[z-1].style.boxShadow='0 0 4vmin var(--glow-C)';

                        this.blocks[x-1].style.backgroundColor='var(--glow-C)';
                        this.blocks[y-1].style.backgroundColor='var(--glow-C)';
                        this.blocks[z-1].style.backgroundColor='var(--glow-C)';
                        
                        this.blocks[x-1].style.color='var(--ext-itm-C)';
                        this.blocks[y-1].style.color='var(--ext-itm-C)';
                        this.blocks[z-1].style.color='var(--ext-itm-C)';
                    return true;
                    } 
                else return false; 
            }
      //....................Winning Conditions....................//
      // Horizontal
          (prc(1,2,3)) ? {} : (prc(4,5,6)) ? {} : (prc(7,8,9)) ? {} 
      // Vertical
        : (prc(1,4,7)) ? {} : (prc(2,5,8)) ? {} : (prc(3,6,9)) ? {} 
      // Diagonal
        : (prc(1,5,9)) ? {} : (prc(3,5,7)) ? {} : this.p[0] = (this.counter===9) ? 'Draw' : 'gameContinues'; 
      if (this.p[0] !== 'gameContinues') this.win();
    }

  //--...Process & Check the set or game outcome..Winner, Draw, Score update...--//
  //--.........................................................................--//
  win() { 
          let winner = this.p[0];
          if (winner==='X')  this.p1++;
          else if (winner==='O') this.p2++;
          else if (winner==='Draw') this.dw++;

          let round = this.p1 + this.p2 + this.dw;
          // Game End: after 10 rounds
          if (round === 3)  {  winner = (this.p2>this.p1) ? 'O wins the game' 
                                        : (this.p1>this.p2) ?  'X wins the Game' : 'Game Draw';
              this.game.innerText = winner;
              this.game.classList.toggle('n-blink');
              this.p1=0; this.p2=0; this.dw=0;  //reseting the scores
           }

          // Winner by set
          else this.game.innerText = (winner==='Draw') ?  `Set ${round} - Draw` // Set Draw 
                                                        : `Set ${round}: ${winner} wins`; // Set Win
                
          this.score.innerHTML=`<span> Player <span style='color:red'>X <span style='color:cyan'>\u00A0:\u00A0</span> <span style='color:#fff'>${this.p1}</span> </span> <p style='line-height: 2vmin; color: var(--main-sh-C)'> -----------------</p><span> Player <span style='color:blue'>O <span style='color:cyan'>\u00A0:\u00A0</span> <span style='color:#fff'>${this.p2}</span></span>` ;
          this.set_end=true; //>>> STATE Updates: End Of Set
          this.game.style.color=''; // color resets to original value
          // Storing game data
          // localStorage.setItem("score",this.p1);
          // let ls = localStorage.key(0); alert (localStorage.getItem(ls));
          setTimeout(()=>{ this.reset() },2300);  
    }

}  
//document.getElementByid('container').style.display='unset';
const game = new TTT();
game.init();


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv..Script..vvv//-->
