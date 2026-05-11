
window.ExportRenderer = {

async exportScoreboard(){

await document.fonts.ready;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const width = 1600;
const margin = 90;
const cityHeight = 620;
const topPadding = 260;

const totalHeight = topPadding + (state.cities.length * (cityHeight + margin)) + 80;

canvas.width = width;
canvas.height = totalHeight;

const bg = await loadImage('fond.png');
ctx.drawImage(bg,0,0,width,totalHeight);

ctx.fillStyle='rgba(0,0,0,0.42)';
ctx.fillRect(0,0,width,totalHeight);

const logo = await loadImage('logo.png');
const logoWidth = 420;
const logoHeight = (logo.height / logo.width) * logoWidth;
ctx.drawImage(logo,(width-logoWidth)/2,40,logoWidth,logoHeight);

let y = topPadding;

for(const city of state.cities){

const rank = getCityRank(city);
const rankImg = await loadImage(rank.asset);

const rankWidth = 700;
const rankHeight = (rankImg.height / rankImg.width) * rankWidth;
const rankX = (width - rankWidth) / 2;

ctx.drawImage(rankImg, rankX, y, rankWidth, rankHeight);

ctx.fillStyle='white';
ctx.font='700 34px Cinzel';
ctx.textAlign='center';
ctx.textBaseline='middle';

ctx.fillText(
(city.name || 'Ville').toUpperCase(),
width / 2,
y + 118
);

let progressX = 70;

state.model.levels.forEach((level,index)=>{

const filled = index < getCompletedLevels(city);

ctx.fillStyle = filled ? '#38ff63' : '#232323';

roundRect(ctx,progressX,y + rankHeight + 12,165,16,8,true,false);

progressX += 185;

});

let lx = 40;
let ly = y + rankHeight + 70;

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

y += cityHeight + margin;

}

const link = document.createElement('a');

link.download='eco-scoreboard-clean.png';
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


/* ===== EXPORT LAYOUT FIXES ===== */
.export-mode .city-section{
  position: relative !important;
  margin-top: 140px !important;
  margin-bottom: 120px !important;
  padding: 40px 28px 50px 28px !important;
  border: 2px solid rgba(212,170,66,0.75) !important;
  border-radius: 22px !important;
  background: rgba(0,0,0,0.35) !important;
  overflow: visible !important;
}

.export-mode .rank-city,
.export-mode .ranked-city,
.export-mode .city-rank{
  position: relative !important;
  z-index: 20 !important;
  margin-top: 60px !important;
  margin-bottom: 50px !important;
  transform: none !important;
}

.export-mode .rank-city .city-name,
.export-mode .ranked-city .city-name,
.export-mode .city-rank .city-name{
  position: absolute !important;
  left: 50% !important;
  top: 63% !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
  width: 75% !important;
  z-index: 25 !important;
}

.export-mode .main-logo,
.export-mode .logo{
  position: relative !important;
  z-index: 50 !important;
  filter: brightness(1.1) !important;
  margin-bottom: 80px !important;
}

.export-mode .palier-grid,
.export-mode .tiers-grid{
  position: relative !important;
  z-index: 10 !important;
  gap: 22px !important;
}

.export-mode .palier-card,
.export-mode .tier-card{
  border: 1px solid rgba(212,170,66,0.7) !important;
  background: rgba(0,0,0,0.55) !important;
  box-shadow: 0 0 0 1px rgba(212,170,66,0.2) inset !important;
}
