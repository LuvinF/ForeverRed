const SECRET = "you are my jaanu";
const START_DATE = new Date("2026-06-01T00:00:00");

const gate = document.getElementById("gate");
const main = document.getElementById("main");
const password = document.getElementById("password");
const unlock = document.getElementById("unlock");
const error = document.getElementById("error");
const heartPassword = document.getElementById("heart-password");

let remainingHearts = 24;
let heartEls = [];
let unlocked = false;

// 24 hearts = 24 attempts. A wrong attempt makes one disappear.
for(let i=0;i<24;i++){
  const h=document.createElement("span");
  h.className="password-heart";
  h.textContent="♥";
  h.style.animationDelay=(i*0.035)+"s";
  heartPassword.appendChild(h);
  heartEls.push(h);
}

function fail(){
  if(remainingHearts<=0) return;
  remainingHearts--;
  const h=heartEls[remainingHearts];
  h.classList.add("vanish");
  error.textContent = remainingHearts
    ? `${remainingHearts} little ${remainingHearts===1?"heart":"hearts"} left. Think of us. ♡`
    : "The little hearts are gone... refresh and try again. ♡";
  password.value="";
}

const loveSong = document.getElementById("love-song");
const musicToggle = document.getElementById("music-toggle");

function startLoveSong(){
  if(!loveSong) return;
  loveSong.volume = 0.45;
  loveSong.play().then(()=>{
    if(musicToggle) musicToggle.classList.add("playing");
  }).catch(()=>{
    // Browser blocked playback; the music button remains available.
  });
}

if(musicToggle){
  musicToggle.addEventListener("click",()=>{
    if(loveSong.paused){
      loveSong.play();
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-label","Pause music");
    }else{
      loveSong.pause();
      musicToggle.classList.remove("playing");
      musicToggle.setAttribute("aria-label","Play music");
    }
  });
}

function openHeart(){
  if(unlocked || remainingHearts<=0) return;
  if(password.value.trim().toLowerCase()===SECRET){
    unlocked=true;
    gate.classList.remove("active");
    gate.classList.add("hidden");
    main.classList.remove("hidden");
    startPetals();
    startLoveSong();
    updateCounter();
    setInterval(updateCounter,1000);
    window.scrollTo({top:0,behavior:"instant"});
  }else fail();
}
unlock.addEventListener("click",openHeart);
password.addEventListener("keydown",e=>{if(e.key==="Enter")openHeart();});

// If you want a different phrase, change SECRET above.
// The phrase currently is: "you are my home"

function updateCounter(){
  const now=new Date();
  let diff=Math.max(0,now-START_DATE);
  const sec=Math.floor(diff/1000);
  const days=Math.floor(sec/86400);
  const hours=Math.floor(sec%86400/3600);
  const minutes=Math.floor(sec%3600/60);
  const seconds=sec%60;
  document.getElementById("days").textContent=String(days).padStart(3,"0");
  document.getElementById("hours").textContent=String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent=String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent=String(seconds).padStart(2,"0");
}

function startPetals(){
  const layer=document.getElementById("petal-layer");
  function petal(){
    const p=document.createElement("span");
    p.className="petal";
    p.style.left=(Math.random()*100)+"vw";
    p.style.animationDuration=(6+Math.random()*8)+"s";
    p.style.setProperty("--drift",(Math.random()*260-130)+"px");
    p.style.transform=`rotate(${Math.random()*360}deg)`;
    p.style.width=(7+Math.random()*8)+"px";
    p.style.height=(10+Math.random()*11)+"px";
    layer.appendChild(p);
    setTimeout(()=>p.remove(),15000);
  }
  for(let i=0;i<32;i++) setTimeout(petal,i*180);
  setInterval(petal,420);
}
