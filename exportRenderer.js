
window.ExportRenderer = {

async exportScoreboard(){

const canvas=document.createElement('canvas');

const ctx=canvas.getContext('2d');

const cities=[...document.querySelectorAll('.city-card')];

const bg=new Image();
bg.src='fond.png';

await new Promise(res=>{
bg.onload=res;
});

const width=1400;
const cityHeight=420;
const headerHeight=180;

const height=(cities.length * cityHeight) + headerHeight + 100;

canvas.width=width;
canvas.height=height;

ctx.drawImage(bg,0,0,width,height);

ctx.fillStyle='rgba(0,0,0,0.45)';
ctx.fillRect(0,0,width,height);

let y=40;

const logo=document.querySelector('.logo');

if(logo){

const logoImg=new Image();
logoImg.src=logo.src;

await new Promise(res=>{
logoImg.onload=res;
});

ctx.drawImage(logoImg,40,20,140,140);

}

for(const city of cities){

const rankPanel=city.querySelector('.rank-panel');

const cityName=city.querySelector('.city-name-input')?.value || '';

const rankBg=getComputedStyle(rankPanel).backgroundImage
.replace(/^url\(["']?/,'')
.replace(/["']?\)$/,'');

if(rankBg){

const rankImg=new Image();

rankImg.src=rankBg;

await new Promise(res=>{
rankImg.onload=res;
rankImg.onerror=res;
});

ctx.drawImage(rankImg,390,y,620,150);

ctx.fillStyle='white';
ctx.font='700 38px Cinzel';
ctx.textAlign='center';
ctx.textBaseline='middle';

ctx.strokeStyle='rgba(0,0,0,.7)';
ctx.lineWidth=6;

ctx.strokeText(cityName,700,y+77);
ctx.fillText(cityName,700,y+77);

}

const segments=[...city.querySelectorAll('.segment')];

let segX=40;

segments.forEach(seg=>{

const filled=seg.classList.contains('filled');

ctx.fillStyle=filled ? '#2dff43' : '#1a1a1a';

roundRect(ctx,segX,y+165,150,14,10,true,false);

segX+=165;

});

const levels=[...city.querySelectorAll('.level-box')];

let lx=40;
let ly=y+200;

levels.forEach((level,index)=>{

ctx.fillStyle='rgba(20,10,0,.82)';
roundRect(ctx,lx,ly,300,170,14,true,false);

ctx.strokeStyle='rgba(255,180,90,.25)';
ctx.stroke();

ctx.fillStyle='white';
ctx.font='600 18px Arial';

const title=level.querySelector('.level-title')?.innerText || '';

ctx.fillText(title,lx+20,ly+28);

const tasks=[...level.querySelectorAll('.task-row')];

let ty=ly+58;

tasks.forEach(task=>{

const checked=task.querySelector('input')?.checked;
const text=task.querySelector('span')?.innerText || '';

ctx.fillStyle=checked ? '#2dff43' : '#777';
ctx.fillRect(lx+18,ty-12,12,12);

ctx.fillStyle='white';
ctx.font='16px Arial';
ctx.fillText(text,lx+42,ty);

ty+=28;

});

lx+=330;

if((index+1)%4===0){

lx=40;
ly+=190;

}

});

y=ly+210;

}

canvas.toBlob(blob=>{

const url=URL.createObjectURL(blob);

const a=document.createElement('a');

a.href=url;
a.download='eco-scoreboard-render.jpg';

a.click();

URL.revokeObjectURL(url);

},'image/jpeg',0.92);

}

};

function roundRect(ctx,x,y,w,h,r,fill,stroke){

if(typeof r==='number'){
r={tl:r,tr:r,br:r,bl:r};
}

ctx.beginPath();
ctx.moveTo(x+r.tl,y);
ctx.lineTo(x+w-r.tr,y);
ctx.quadraticCurveTo(x+w,y,x+w,y+r.tr);
ctx.lineTo(x+w,y+h-r.br);
ctx.quadraticCurveTo(x+w,y+h,x+w-r.br,y+h);
ctx.lineTo(x+r.bl,y+h);
ctx.quadraticCurveTo(x,y+h,x,y+h-r.bl);
ctx.lineTo(x,y+r.tl);
ctx.quadraticCurveTo(x,y,x+r.tl,y);
ctx.closePath();

if(fill) ctx.fill();
if(stroke) ctx.stroke();

}
