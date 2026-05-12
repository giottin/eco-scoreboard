
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
const height = 1080;

canvas.width = width;
canvas.height = height;

/* ===== BACKGROUND ===== */

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

/* ===== OVERLAY ===== */

ctx.fillStyle='rgba(0,0,0,0.48)';
ctx.fillRect(0,0,width,height);

/* ===== MAIN PANEL ===== */

ctx.fillStyle='rgba(18,18,18,0.72)';
roundRect(ctx,40,40,width-80,height-80,32,true,false);

/* ===== HEADER ===== */

const rank = getCityRank(city);

const rankImg = await loadImage(rank.asset);

const rankWidth = 820;
const rankHeight = (rankImg.height / rankImg.width) * rankWidth;

const rankX = (width-rankWidth)/2;

ctx.drawImage(rankImg,rankX,50,rankWidth,rankHeight);

ctx.fillStyle='white';

const cityFont =
city.name.length > 20 ? 34 :
city.name.length > 14 ? 42 : 52;

ctx.font=`700 ${cityFont}px Cinzel`;

ctx.textAlign='center';
ctx.textBaseline='middle';

ctx.shadowColor='rgba(0,0,0,0.85)';
ctx.shadowBlur=18;

ctx.fillText(
(city.name || 'VILLE').toUpperCase(),
width/2,
205
);

ctx.shadowBlur=0;

/* ===== GLOBAL PROGRESS ===== */

ctx.fillStyle='rgba(0,0,0,0.72)';
roundRect(ctx,120,320,width-240,34,16,true,false);

ctx.fillStyle='#3cff67';

const completed = getCompletedLevels(city);

const progressWidth =
((width-240)/8) * completed;

roundRect(ctx,120,320,progressWidth,34,16,true,false);

/* ===== SCALE ===== */

ctx.fillStyle='white';
ctx.font='700 20px Arial';

const romans=['I','II','III','IV','V','VI','VII','VIII'];

for(let i=0;i<8;i++){

ctx.fillText(
romans[i],
165 + (i*210),
390
);

}

/* ===== LEVEL PANELS ===== */

let startX = 70;
let startY = 450;

state.model.levels.forEach((level,l)=>{

ctx.fillStyle='rgba(22,22,22,0.76)';
roundRect(ctx,startX,startY,390,220,22,true,false);

ctx.strokeStyle='rgba(255,190,90,0.25)';
ctx.lineWidth=2;
roundRect(ctx,startX,startY,390,220,22,false,true);

ctx.fillStyle='#eadfc6';
roundRect(ctx,startX+16,startY+16,358,52,14,true,false);

ctx.fillStyle='#2b1b0d';
ctx.font='700 24px Arial';
ctx.textAlign='center';

ctx.fillText(
level.name,
startX+195,
startY+48
);

ctx.textAlign='left';
ctx.font='20px Arial';

let ty = startY + 105;

level.tasks.forEach((task,t)=>{

ctx.fillStyle='#eadfc6';
roundRect(ctx,startX+16,ty-24,358,42,12,true,false);

const checked = city.checks?.[l]?.[t];

ctx.fillStyle = checked ? '#38ff63' : '#7f7f7f';
ctx.fillRect(startX+30,ty-10,18,18);

ctx.fillStyle='#2b1b0d';
ctx.fillText(task,startX+65,ty+4);

ty += 56;

});

startX += 440;

if(startX + 390 > width){

startX = 70;
startY += 270;

}

});

/* ===== EXPORT ===== */

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
