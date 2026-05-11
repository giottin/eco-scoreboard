
const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

let state={
editMode:false,
model:{
levels:[
{name:'Palier 1',tasks:['Tâche 1','Tâche 2']},
{name:'Palier 2',tasks:['Tâche 1','Tâche 2']},
{name:'Palier 3',tasks:['Tâche 1','Tâche 2']},
{name:'Palier 4',tasks:['Tâche 1','Tâche 2']}
]
},
cities:[]
};

function cityTemplate(name=''){
return {
id:crypto.randomUUID(),
name,
checks:{}
}
}

function getCompletedLevels(city){
let completed=0;
state.model.levels.forEach((level,l)=>{
const ok=level.tasks.every((t,i)=>city.checks?.[l]?.[i]);
if(ok) completed++;
});
return completed;
}

function getRank(city){
const completed=getCompletedLevels(city);
if(completed<=0) return 0;
return Math.min(8,completed);
}

function renderProgress(city){
const total=state.model.levels.length;
const completed=getCompletedLevels(city);
let html='<div class="segmented-progress">';
for(let i=0;i<total;i++){
html+=`<div class="segment ${i<completed?'filled':''}"></div>`;
}
html+='</div>';
return html;
}

function getNameClass(name){
if(name.length > 20) return 'tiny';
if(name.length > 14) return 'small';
return '';
}

function renderEditor(){
const panel=document.getElementById('editorPanel');

if(!state.editMode){
panel.innerHTML='';
return;
}

let html=`<div class="editor-card">
<h2 class="editor-title">VILLE MODÈLE</h2>
<div class="levels-grid">`;

state.model.levels.forEach((level,l)=>{
html+=`<div class="level-box">
<input class="level-name-input"
value="${level.name}"
onchange="renameLevel(${l},this.value)">`;

level.tasks.forEach((task,t)=>{
html+=`<input class="task-input"
value="${task}"
onchange="renameTask(${l},${t},this.value)">`;
});

html+='</div>';
});

html+='</div></div>';

panel.innerHTML=html;
}

function renderCities(){
const container=document.getElementById('cities');
container.innerHTML='';

state.cities.forEach(city=>{

const rank=getRank(city);

let levels='';

state.model.levels.forEach((level,l)=>{

levels+=`<div class="level-box">
<div class="level-title">${level.name}</div>`;

level.tasks.forEach((task,t)=>{

levels+=`
<label class="task-row">
<input
type="checkbox"
class="green-check"
${city.checks?.[l]?.[t]?'checked':''}
onchange="toggleTask('${city.id}',${l},${t},this.checked)">
<span>${task}</span>
</label>
`;

});

levels+='</div>';

});

container.innerHTML += `
<div class="city-card">

<button
class="delete-city"
onclick="deleteCity('${city.id}')">🗑</button>

<div
class="rank-panel"
style="background-image:${rank>0?`url('city_rank_${rank}.png')`:'none'}">

<input
class="city-name-input ${getNameClass(city.name)}"
value="${city.name}"
placeholder="Nom de ville"
onchange="renameCity('${city.id}',this.value)" oninput="updateCityNameOnly(this.value,'${city.id}')">

</div>

${renderProgress(city)}

<div class="levels-grid">
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


function updateCityNameOnly(value,id){
const city=state.cities.find(c=>c.id===id);
city.name=value;

clearTimeout(window.citySaveTimer);

window.citySaveTimer=setTimeout(()=>{
save();
},300);
}

function renameCity(id,value){
const city=state.cities.find(c=>c.id===id);
city.name=value;
save();
render();
}

function toggleTask(id,l,t,v){
const city=state.cities.find(c=>c.id===id);

if(!city.checks[l]){
city.checks[l]={};
}

city.checks[l][t]=v;

render();
save();
}

function renameLevel(l,v){
state.model.levels[l].name=v;
render();
save();
}

function renameTask(l,t,v){
state.model.levels[l].tasks[t]=v;
render();
save();
}

function deleteCity(id){
state.cities=state.cities.filter(c=>c.id!==id);
render();
save();
}

function addCity(){
state.cities.push(cityTemplate(''));
render();
save();
}

function toggleEdit(){
state.editMode=!state.editMode;
render();
}

async function save(){
localStorage.setItem('eco_state_v12',JSON.stringify(state));
}

function load(){
const data=localStorage.getItem('eco_state_v12');
if(data){
state=JSON.parse(data);
}
}

load();

if(state.cities.length===0){
state.cities=[cityTemplate(''),cityTemplate('')];
}

render();
