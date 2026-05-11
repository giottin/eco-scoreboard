window.ExportRenderer={

async exportScoreboard(){

await document.fonts.ready;

const canvas=document.createElement('canvas');
const ctx=canvas.getContext('2d');

ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality='high';

const WIDTH=1600;
const HEADER=170;
const CARD_HEIGHT=470;
const GAP=30;

const HEIGHT=HEADER+(state.cities.length*(CARD_HEIGHT+GAP))+80;

canvas.width=WIDTH;
canvas.height=HEIGHT;

const bg=await loadImage('fond.png');

ctx.drawImage(bg,0,0,WIDTH,HEIGHT);

ctx.fillStyle='rgba(0,0,0,0.42)';
ctx.fillRect(0,0,WIDTH,HEIGHT);

const logo=await loadImage('logo.png');

ctx.drawImage(logo,35,20,110,110);

ctx.fillStyle='white';
ctx.font='700 54px Arial';
ctx.textAlign='left';
ctx.fillText('ECO SCOREBOARD',180,82);

let currentY=150;

for(const city of state.cities){

const rank=getCityRank(city);

const rankImg=await loadImage(rank.asset);

const bannerX=80;
const bannerY=currentY;
const bannerW=1440;
const bannerH=125;

ctx.drawImage(rankImg,bannerX,bannerY,bannerW,bannerH);

ctx.textAlign='center';
ctx.textBaseline='middle';
ctx.fillStyle='white';
ctx.font='700 42px Arial';

ctx.fillText(
city.name,
bannerX+(bannerW/2),
bannerY+(bannerH/2)
);

let progressX=60;

state.model.levels.forEach((level,index)=>{

const filled=index<getCompletedLevels(city);

ctx.fillStyle=filled ? '#37ff61' : '#1f1f1f';

roundRect(ctx,progressX,currentY+150,175,18,10,true,false);

progressX+=190;

});

let gridX=35;
let gridY=currentY+190;

state.model.levels.forEach((level,l)=>{

ctx.fillStyle='rgba(10,10,10,0.72)';
roundRect(ctx,gridX,gridY,350,175,16,true,false);

ctx.strokeStyle='rgba(255,255,255,0.08)';
ctx.strokeRect(gridX,gridY,350,175);

ctx.fillStyle='white';
ctx.textAlign='left';
ctx.textBaseline='alphabetic';

ctx.font='700 22px Arial';
ctx.fillText(level.name,gridX+18,gridY+35);

ctx.font='18px Arial';

let taskY=gridY+72;

level.tasks.forEach((task,t)=>{

const checked=city.checks?.[l]?.[t];

ctx.fillStyle=checked ? '#37ff61' : '#8a8a8a';

ctx.fillRect(gridX+18,taskY-14,16,16);

ctx.fillStyle='white';
ctx.fillText(task,gridX+48,taskY);

taskY+=30;

});

gridX+=365;

if(gridX+350>WIDTH){

gridX=35;
gridY+=200;

}

});

currentY+=CARD_HEIGHT+GAP;

}

const link=document.createElement('a');

link.download='eco-scoreboard.png';
link.href=canvas.toDataURL('image/png');

link.click();

}

};

function loadImage(src){

return new Promise((resolve,reject)=>{

const img=new Image();

img.onload=()=>resolve(img);
img.onerror=reject;

img.src=src;

});

}

function roundRect(ctx,x,y,width,height,radius,fill,stroke){

ctx.beginPath();
ctx.moveTo(x+radius,y);
ctx.lineTo(x+width-radius,y);
ctx.quadraticCurveTo(x+width,y,x+width,y+radius);
ctx.lineTo(x+width,y+height-radius);
ctx.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
ctx.lineTo(x+radius,y+height);
ctx.quadraticCurveTo(x,y+height,x,y+height-radius);
ctx.lineTo(x,y+radius);
ctx.quadraticCurveTo(x,y,x+radius,y);
ctx.closePath();

if(fill) ctx.fill();
if(stroke) ctx.stroke();

}