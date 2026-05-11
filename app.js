const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

let saveTimeout;

let state={
editMode:false,
model:{
levels:Array.from({length:8},(_,i)=>({
name:`Palier ${ROMAN[i]}`,
tasks:['Tâche 1','Tâche 2']
}))
},
cities:[]
};

function setStatus(text,color='white'){
const el=document.getElementById('cloudStatus');
el.innerText=text;
el.style.color=color;
}

function cityTemplate(name='Nouvelle Ville'){
return{
id:crypto.randomUUID(),
name,
checks:{}
};
}

function queueSave(){
clearTimeout(saveTimeout);
saveTimeout=setTimeout(saveCloud,400);
}

async function saveCloud(){
try{
await fetch(
SUPABASE_URL+'/rest/v1/cloud_saves',
{
method:'POST',
headers:{
'Content-Type':'application/json',
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY,
'Prefer':'resolution=merge-duplicates'
},
body:JSON.stringify({
id:'save1',
content:state
})
}
);
setStatus('☁ Sauvegarde OK','#78ff97');
}catch(e){
console.error(e);
setStatus('Erreur sauvegarde','#ff6f6f');
}
}

async function loadCloud(){
try{
const response=await fetch(
SUPABASE_URL+'/rest/v1/cloud_saves?id=eq.save1&select=*',
{
headers:{
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY
}
}
);

const data=await response.json();

if(data.length && data[0].content){
state={...state,...data[0].content};
}

if(!state.model){
state.model={levels:[]};
}

if(!state.cities){
state.cities=[];
}

setStatus('☁ Cloud connecté','#78ff97');
}catch(e){
console.error(e);
setStatus('Erreur cloud','#ff6f6f');
}
}

function getCityRank(city){
let completed=0;

state.model.levels.forEach((level,l)=>{
const allDone=level.tasks.every((_,t)=>city.checks?.[l]?.[t]);
if(allDone){
completed++;
}
});

const rank=Math.max(1,Math.min(8,completed+1));

return{
rank,
roman:ROMAN[rank-1],
progress:(completed/8)*100
};
}

function renderEditor(){
const panel=document.getElementById('editorPanel');

if(!state.editMode){
panel.innerHTML='';
return;
}

let html=`
<div class="editor-card">
<h2>Ville modèle</h2>
<div class="editor-grid">
`;

state.model.levels.forEach((level,l)=>{
html+=`
<div class="level">
<input class="editor-input level-title-input"
value="${level.name}"
oninput="renameLevel(${l},this.value)">
`;

level.tasks.forEach((task,t)=>{
html+=`
<div class="task editor-task">
<input type="text"
value="${task}"
oninput="renameTask(${l},${t},this.value)">
<button class="delete-btn" onclick="deleteTask(${l},${t})">✕</button>
</div>
`;
});

html+=`
<button class="small-btn" onclick="addTask(${l})">+ Tâche</button>
</div>
`;
});

html+=`</div></div>`;
panel.innerHTML=html;
}

function renderCities(){
const container=document.getElementById('cities');
container.innerHTML='';

state.cities.forEach(city=>{
const rank=getCityRank(city);

let levels='';

state.model.levels.forEach((level,l)=>{
levels+=`<div class="level">`;
levels+=`<div class="level-title">${level.name}</div>`;

level.tasks.forEach((task,t)=>{
levels+=`
<label class="task">
<input
type="checkbox"
${city.checks?.[l]?.[t]?'checked':''}
onchange="toggleTask('${city.id}',${l},${t},this.checked)">
<span>${task}</span>
</label>
`;
});

levels+='</div>';
});

container.innerHTML+=`
<div class="city-card">
<div class="city-top">
<div class="city-rank"
style="background-image:url('city_rank_${rank.rank}.png')">
<div class="rank-roman">${rank.roman}</div>
<div class="city-name">${city.name}</div>
</div>

<button class="delete-city" onclick="deleteCity('${city.id}')">🗑</button>
</div>

<div class="city-level-text">Niveau ${rank.roman}</div>

<input
class="city-input"
value="${city.name}"
oninput="renameCity('${city.id}',this.value)">

<div class="progress">
<div class="progress-fill" style="width:${rank.progress}%"></div>
</div>

<div class="levels">
${levels}
</div>
</div>
`;
});
}

function render(){
renderEditor();
renderCities();
}

function toggleEditMode(){
state.editMode=!state.editMode;
render();
queueSave();
}

function renameLevel(level,value){
state.model.levels[level].name=value;
renderEditor();
queueSave();
}

function renameTask(level,task,value){
state.model.levels[level].tasks[task]=value;
queueSave();
}

function addTask(level){
state.model.levels[level].tasks.push('Nouvelle tâche');
render();
queueSave();
}

function deleteTask(level,task){
state.model.levels[level].tasks.splice(task,1);
render();
queueSave();
}

function toggleTask(cityId,level,task,checked){
const city=state.cities.find(c=>c.id===cityId);

if(!city.checks[level]){
city.checks[level]={};
}

city.checks[level][task]=checked;

renderCities();
queueSave();
}

function renameCity(id,value){
const city=state.cities.find(c=>c.id===id);
if(city){
city.name=value;
}
renderCities();
queueSave();
}

function deleteCity(id){
state.cities=state.cities.filter(c=>c.id!==id);
renderCities();
queueSave();
}

function addCity(){
state.cities.push(cityTemplate(`Ville ${state.cities.length+1}`));
renderCities();
queueSave();
}

(async()=>{
await loadCloud();

if(state.cities.length===0){
state.cities.push(cityTemplate('Tokyo'));
}

render();
})();
