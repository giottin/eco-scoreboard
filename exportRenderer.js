
window.ExportRenderer = {

async exportScoreboard(){

await document.fonts.ready;

const zip = new JSZip();

for(const city of state.cities){

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const width = 1600;
const height = 980;

canvas.width = width;
canvas.height = height;

const bg = await loadImage('fond.png');
ctx.drawImage(bg,0,0,width,height);

ctx.fillStyle='rgba(0,0,0,0.58)';
ctx.fillRect(0,0,width,height);

const rank = getCityRank(city);
const rankImg = await loadImage(rank.asset);

const rankWidth = 700;
const rankHeight = (rankImg.height / rankImg.width) * rankWidth;

const rankX = (width - rankWidth) / 2;

ctx.drawImage(rankImg, rankX, 30, rankWidth, rankHeight);

ctx.fillStyle='white';

const cityFontSize =
city.name.length > 18 ? 26 :
city.name.length > 12 ? 30 : 36;

ctx.font=`700 ${cityFontSize}px Cinzel`;

ctx.textAlign='center';
ctx.textBaseline='middle';

ctx.fillText(
(city.name || 'Ville').toUpperCase(),
width / 2,
165
);

let progressX = 70;

state.model.levels.forEach((level,index)=>{

const filled = index < getCompletedLevels(city);

ctx.fillStyle = filled ? '#38ff63' : '#232323';

roundRect(ctx,progressX,260,165,18,9,true,false);

progressX += 185;

});

let lx = 40;
let ly = 330;

state.model.levels.forEach((level,l)=>{

ctx.fillStyle='rgba(12,12,12,0.82)';
roundRect(ctx,lx,ly,340,165,16,true,false);

ctx.strokeStyle='rgba(180,120,50,0.45)';
ctx.strokeRect(lx,ly,340,165);

ctx.fillStyle='white';
ctx.font='700 24px Arial';
ctx.textAlign='left';

ctx.fillText(level.name,lx+18,ly+36);

ctx.font='18px Arial';

let ty = ly + 72;

level.tasks.forEach((task,t)=>{

const checked = city.checks?.[l]?.[t];

ctx.fillStyle = checked ? '#38ff63' : '#8a8a8a';
ctx.fillRect(lx+18,ty-14,16,16);

ctx.fillStyle='white';
ctx.fillText(task,lx+48,ty);

ty += 30;

});

lx += 370;

if(lx + 340 > width){

lx = 40;
ly += 195;

}

});

const dataUrl = canvas.toDataURL('image/png');

const base64Data = dataUrl.split(',')[1];

const safeName = (city.name || 'ville')
.replace(/[^a-z0-9]/gi,'_')
.toLowerCase();

zip.file(`${safeName}.png`, base64Data, {base64:true});

}

const content = await zip.generateAsync({type:'blob'});

const link = document.createElement('a');

link.href = URL.createObjectURL(content);

link.download = 'cities_export.zip';

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

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
