
window.ExportRenderer = {

async exportScoreboard(){

await document.fonts.ready;

const zip = new JSZip();

for(const city of state.cities){

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const width = 1920;
const height = 1400;

canvas.width = width;
canvas.height = height;

/* BACKGROUND */

const bg = await loadImage('fond.png');

const bgRatio = bg.width / bg.height;
const canvasRatio = width / height;

let drawWidth, drawHeight, offsetX, offsetY;

if(bgRatio > canvasRatio){

drawHeight = height;
drawWidth = drawHeight * bgRatio;
offsetX = (width - drawWidth) / 2;
offsetY = 0;

}else{

drawWidth = width;
drawHeight = drawWidth / bgRatio;
offsetX = 0;
offsetY = (height - drawHeight) / 2;

}

ctx.drawImage(bg, offsetX, offsetY, drawWidth, drawHeight);

/* GLOBAL OVERLAY */

ctx.fillStyle='rgba(0,0,0,0.55)';
ctx.fillRect(0,0,width,height);

/* MAIN CONTAINER */

ctx.fillStyle='rgba(12,12,12,0.62)';
roundRect(ctx,40,40,width-80,height-80,34,true,false);

ctx.strokeStyle='rgba(255,200,90,0.25)';
ctx.lineWidth=2;
roundRect(ctx,40,40,width-80,height-80,34,false,true);

/* HEADER */

const rank = getCityRank(city);
const rankImg = await loadImage(rank.asset);

const rankWidth = 760;
const rankHeight = (rankImg.height / rankImg.width) * rankWidth;

ctx.drawImage(
rankImg,
(width-rankWidth)/2,
70,
rankWidth,
rankHeight
);

/* CITY NAME */

ctx.fillStyle='white';

const fontSize =
city.name.length > 22 ? 38 :
city.name.length > 16 ? 48 :
56;

ctx.font=`700 ${fontSize}px Cinzel`;

ctx.textAlign='center';
ctx.textBaseline='middle';

ctx.shadowColor='rgba(0,0,0,0.9)';
ctx.shadowBlur=18;

ctx.fillText(
(city.name || 'VILLE').toUpperCase(),
width/2,
220
);

ctx.shadowBlur=0;

/* PROGRESS BAR */

ctx.fillStyle='rgba(0,0,0,0.82)';
roundRect(ctx,120,330,width-240,34,18,true,false);

const completed = getCompletedLevels(city);

const progressWidth =
((width-240)/8) * completed;

ctx.fillStyle='#3eff67';

roundRect(ctx,120,330,progressWidth,34,18,true,false);

/* ROMAN LEVELS */

const romans=['I','II','III','IV','V','VI','VII','VIII'];

ctx.fillStyle='white';
ctx.font='700 22px Cinzel';

for(let i=0;i<8;i++){

ctx.fillText(
romans[i],
170 + (i*210),
405
);

}

/* DYNAMIC PANELS */

const cols = 4;
const gapX = 40;
const gapY = 40;

const panelWidth = 400;

let positions = [];

let currentX = 70;
let currentY = 460;

let rowHeights = [];

state.model.levels.forEach((level,index)=>{

const taskCount = level.tasks.length;

const panelHeight =
120 + (taskCount * 68);

positions.push({
x: currentX,
y: currentY,
h: panelHeight
});

rowHeights.push(panelHeight);

currentX += panelWidth + gapX;

if((index+1)%cols===0){

currentX = 70;

currentY += Math.max(...rowHeights) + gapY;

rowHeights = [];

}

});

/* DRAW PANELS */

state.model.levels.forEach((level,l)=>{

const pos = positions[l];

ctx.fillStyle='rgba(14,14,14,0.78)';
roundRect(ctx,pos.x,pos.y,panelWidth,pos.h,24,true,false);

ctx.strokeStyle='rgba(255,195,95,0.35)';
ctx.lineWidth=2;

roundRect(ctx,pos.x,pos.y,panelWidth,pos.h,24,false,true);

/* HEADER */

ctx.fillStyle='#eadfc6';

roundRect(
ctx,
pos.x+16,
pos.y+16,
panelWidth-32,
58,
14,
true,
false
);

ctx.fillStyle='#2d1d0d';

ctx.font='700 24px Arial';
ctx.textAlign='center';

ctx.fillText(
level.name,
pos.x + panelWidth/2,
pos.y + 53
);

/* TASKS */

ctx.textAlign='left';

ctx.font='20px Arial';

let taskY = pos.y + 110;

level.tasks.forEach((task,t)=>{

ctx.fillStyle='#eadfc6';

roundRect(
ctx,
pos.x+16,
taskY-24,
panelWidth-32,
48,
12,
true,
false
);

/* CHECKBOX */

const checked = city.checks?.[l]?.[t];

ctx.fillStyle =
checked ? '#40f56c' : '#8c8c8c';

roundRect(
ctx,
pos.x+28,
taskY-10,
22,
22,
6,
true,
false
);

/* CHECKMARK */

if(checked){

ctx.strokeStyle='white';
ctx.lineWidth=3;

ctx.beginPath();
ctx.moveTo(pos.x+33, taskY+1);
ctx.lineTo(pos.x+38, taskY+8);
ctx.lineTo(pos.x+47, taskY-4);
ctx.stroke();

}

ctx.fillStyle='#2a1b0d';

ctx.fillText(
task,
pos.x+70,
taskY+7
);

taskY += 68;

});

});

/* EXPORT */

const data = canvas.toDataURL('image/png').split(',')[1];

const safeName = (city.name || 'ville')
.replace(/[^a-z0-9]/gi,'_')
.toLowerCase();

zip.file(`${safeName}.png`,data,{base64:true});

}

const blob = await zip.generateAsync({type:'blob'});

const link = document.createElement('a');

link.href = URL.createObjectURL(blob);

link.download='cities_export.zip';

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

}

};

function roundRect(ctx,x,y,w,h,r,fill,stroke){

ctx.beginPath();

ctx.moveTo(x+r,y);
ctx.lineTo(x+w-r,y);
ctx.quadraticCurveTo(x+w,y,x+w,y+r);
ctx.lineTo(x+w,y+h-r);
ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
ctx.lineTo(x+r,y+h);
ctx.quadraticCurveTo(x,y+h,x,y+h-r);
ctx.lineTo(x,y+r);
ctx.quadraticCurveTo(x,y,x+r,y);
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
