
const {floor,abs,random} = Math;
let r = 3;
let ei = r-1;
let ej = r-1;
let puzzle;
let score = 0;

onload = () => {
  init();
  setTimeout(()=>{
      shuffle();
  },300);
};

function updateScore(s){
    score = s;
    qs(".score").innerText = score;
}

function init() {
  puzzle = qs(".puzzle");
  puzzle.style.setProperty("--r",r);
  puzzle.innerHTML = "";
  updateScore(0);
  
  for(let i=0;i<r*r-1;i++){
    let slot = ce("div");
    slot.innerText = i;
    slot.tidx = i;
    let c = Math.floor(r/2);
    slot.style.setProperty("--i",c);
    slot.style.setProperty("--j",c);
    qs(".puzzle").append(slot);
    slot.onclick = handleClick;
  }
}

function updatePosition(slot,i,j){
  slot.i = i; slot.j = j;
  slot.style.setProperty("--i",i);
  slot.style.setProperty("--j",j);
  slot.idx = j*r + i;
}

function handleClick(e){
  let oi = e.target.i,oj = e.target.j;
  if(abs(oi-ei) > 1 || abs(oj-ej) > 1 
     || abs(oi-ei) == abs(oj-ej)) return;
  updatePosition(e.target,ei,ej);
  ei = oi; ej = oj;
  if(isSolved()){
      win();
      setSize(r);
  }
  updateScore(score + 1);
}

function shuffle(){
  let arr = new Array(r*r-1).fill(0);
  arr = arr.map((e,i)=>i);
  arr.sort(()=>random()<0.5?1:-1);
  arr.push(-1);
  
  // check for unsolvable shuffle
  if(calcInversions(arr)%2 == r%2) {
      let t = arr[0];
      arr[0] = arr[1];
      arr[1] = t;
  }
 
  arr.pop();
  let slots = [...qsa(".puzzle > div")];
  slots.forEach((s,i)=>{
      let j = arr[i];
      updatePosition(s,j%r,floor(j/r));
  });
}

function calcInversions(arr){
  let res = 0;
  for(let i=0;i<arr.length-1;i++)
    for(let j=i+1;j<arr.length;j++)
      if(arr[i]>arr[j]) res++;
  return res;
}

function isSolved(){
    let solved = true;
    let slots = [...qsa(".puzzle > div")];
    slots.forEach(s => solved = (
        solved && s.idx == s.tidx
    ));
    return solved;
}

function win(){
    setTimeout(()=>alert("Solved!!\nMoves : " + score),100);
}

function setSize(n){
    let tabs = qsa(".selector > div");
    qs("[data-selected='true']")
    .dataset.selected = "false";
    qs(".selector").style.setProperty("--i",n-3);
    tabs[n-3].dataset.selected = "true";
    r = n;
    ei = r-1;
    ej = r-1;
    let slots = [...qsa(".puzzle > div")];
    qs("body").dataset.anime = "true";
    setTimeout(()=>{
      puzzle.style.setProperty("--r",r);
      slots.forEach(s=>{
        let c = Math.floor(r/2);
        s.style.setProperty("--i",c);
        s.style.setProperty("--j",c);
      });
      setTimeout(()=>{
        init();
        setTimeout(()=>{
          shuffle();
          setTimeout(()=>{
            qs("body").dataset.anime = "false";
          },200)
        },200)
      },200)
    },200);
}


