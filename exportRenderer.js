
window.ExportRenderer = {

async exportScoreboard(){

await document.fonts.ready;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const width = 1600;
const cardHeight = 420;
const margin = 40;
const headerHeight = 180;

const height = headerHeight + (state.cities.length * (cardHeight + margin)) + 100;

canvas.width = width;
canvas.height = height;

const bg = await loadImage('fond.png');
ctx.drawImage(bg,0,0,width,height);

ctx.fillStyle='rgba(0,0,0,0.50)';
ctx.fillRect(0,0,width,height);

const logo = await loadImage('logo.png');
ctx.drawImage(logo,40,20,140,140);

ctx.fillStyle='white';
ctx.font='700 54px Arial';
ctx.fillText('ECO SCOREBOARD',220,95);

let y = 180;

for(const city of state.cities){

const rank = getCityRank(city);

const rankImg = await loadImage(rank.asset);

ctx.drawImage(rankImg,40,y,1520,120);

ctx.fillStyle='white';
ctx.font='700 42px Arial';
ctx.textAlign='center';
ctx.fillText(city.name || 'Ville',800,y+72);

let progressX = 60;

state.model.levels.forEach((level,index)=>{

const filled = index < getCompletedLevels(city);

ctx.fillStyle = filled ? '#38ff63' : '#232323';

roundRect(ctx,progressX,y+145,170,16,8,true,false);

progressX += 185;

});

let lx = 40;
let ly = y + 190;

state.model.levels.forEach((level,l)=>{

ctx.fillStyle='rgba(18,18,18,0.82)';
roundRect(ctx,lx,ly,340,170,14,true,false);

ctx.strokeStyle='rgba(255,255,255,0.15)';
ctx.strokeRect(lx,ly,340,170);

ctx.fillStyle='white';
ctx.font='700 22px Arial';
ctx.textAlign='left';

ctx.fillText(level.name,lx+16,ly+34);

ctx.font='18px Arial';

let ty = ly + 70;

level.tasks.forEach((task,t)=>{

const checked = city.checks?.[l]?.[t];

ctx.fillStyle = checked ? '#38ff63' : '#888';

ctx.fillRect(lx+16,ty-14,16,16);

ctx.fillStyle='white';

ctx.fillText(task,lx+44,ty);

ty += 28;

});

lx += 370;

if(lx + 340 > width){

lx = 40;
ly += 200;

}

});

y += cardHeight + margin;

}

const link = document.createElement('a');

link.download='eco-scoreboard-hd.png';
link.href = canvas.toDataURL('image/png');

link.click();

}

};

function roundRect(ctx,x,y,width,height,radius,fill,stroke){

ctx.beginPath();

ctx.moveTo(x + radius, y);
ctx.lineTo(x + width - radius, y);
ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
ctx.lineTo(x + width, y + height - radius);
ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
ctx.lineTo(x + radius, y + height);
ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
ctx.lineTo(x, y + radius);
ctx.quadraticCurveTo(x, y, x + radius, y);
ctx.closePath();

if(fill) ctx.fill();
if(stroke) ctx.stroke();

}

function loadImage(src){

return new Promise((resolve,reject)=>{

const img = new Image();

img.crossOrigin='anonymous';

img.onload=()=>resolve(img);
img.onerror=reject;

img.src=src;

});

}
