
window.ExportRenderer={

async exportScoreboard(){

await document.fonts.ready;

const cards=[...document.querySelectorAll('.city-card')];

const width=1600;
const cardHeight=430;
const spacing=40;
const headerHeight=180;
const footer=60;

const totalHeight=headerHeight+(cards.length*(cardHeight+spacing))+footer;

const canvas=document.createElement('canvas');
canvas.width=width;
canvas.height=totalHeight;

const ctx=canvas.getContext('2d');

ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality='high';

const bg=await loadImage('fond.png');

ctx.drawImage(bg,0,0,width,totalHeight);

ctx.fillStyle='rgba(0,0,0,0.42)';
ctx.fillRect(0,0,width,totalHeight);

const logo=await loadImage('logo.png');

const logoW=520;
const logoH=520;

ctx.drawImage(
logo,
(width/2)-(logoW/2),
-70,
logoW,
logoH
);

let currentY=170;

for(const city of state.cities){

const rank=getCityRank(city);

const banner=await loadImage(rank.asset);

const bannerW=560;
const bannerH=186;

ctx.drawImage(
banner,
(width/2)-(bannerW/2),
currentY-38,
bannerW,
bannerH
);

ctx.textAlign='center';
ctx.textBaseline='middle';
ctx.fillStyle='white';
ctx.font='800 24px Arial';

ctx.fillText(
city.name,
width/2,
currentY+6
);

let px=70;

state.model.levels.forEach((level,index)=>{

const filled=index<getCompletedLevels(city);

ctx.fillStyle=filled ? '#41ff71' : '#1f1f1f';

roundRect(ctx,px,currentY+80,170,18,9,true,false);

px+=182;

});

let gx=40;
let gy=currentY+120;

state.model.levels.forEach((level,l)=>{

ctx.fillStyle='rgba(12,12,12,0.72)';
roundRect(ctx,gx,gy,350,170,14,true,false);

ctx.strokeStyle='rgba(255,255,255,0.08)';
ctx.strokeRect(gx,gy,350,170);

ctx.fillStyle='white';
ctx.textAlign='left';
ctx.textBaseline='alphabetic';

ctx.font='700 21px Arial';
ctx.fillText(level.name,gx+18,gy+34);

ctx.font='18px Arial';

let ty=gy+72;

level.tasks.forEach((task,t)=>{

const checked=city.checks?.[l]?.[t];

ctx.fillStyle=checked ? '#41ff71' : '#8c8c8c';

ctx.fillRect(gx+18,ty-14,16,16);

ctx.fillStyle='white';
ctx.fillText(task,gx+48,ty);

ty+=30;

});

gx+=370;

if(gx+350>width){

gx=40;
gy+=190;

}

});

currentY+=cardHeight+spacing;

}

const link=document.createElement('a');

link.download='eco-scoreboard.png';
link.href=canvas.toDataURL('image/png',1);

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
