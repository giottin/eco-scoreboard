
function debounce(fn,delay=700){

let timer;

return (...args)=>{

clearTimeout(timer);

timer=setTimeout(()=>{
fn(...args);
},delay);

};

}

const saveDebounced = debounce(saveCloud,800);

function render(){

syncCities();

renderEditor();

const container = document.getElementById('cities');

container.innerHTML='';

state.cities.forEach(city=>{

const rank = getCityRank(city);

const card = document.createElement('div');
card.className='city-card';

let levelsHTML='';

state.model.levels.forEach((level,l)=>{

let tasksHTML='';

level.tasks.forEach((task,t)=>{

const checked = city.checks[l]?.[t];

tasksHTML += `
<label class="task-row">
<input type="checkbox"
${checked ? 'checked' : ''}
onchange="toggleTask('${city.id}',${l},${t},this.checked)">
<span>${task}</span>
</label>
`;

});

levelsHTML += `
<div class="level-box">
<h3>${level.name}</h3>
${tasksHTML}
</div>
`;

});

card.innerHTML = `
<div class="rank-panel" style="background-image:url('${rank.asset}')">
<div class="rank-overlay">
<input
class="city-name-input"
value="${city.name}"
onchange="renameCity('${city.id}',this.value)"
placeholder="Nom de ville">
</div>
</div>

<div class="segmented-progress">
${state.model.levels.map((lvl,index)=>{
const filled = index < getCompletedLevels(city);
return `<div class="segment ${filled ? 'filled' : ''}"></div>`;
}).join('')}
</div>

<div class="levels-grid">
${levelsHTML}
</div>

<div class="city-actions">
<button onclick="deleteCity('${city.id}')">Supprimer</button>
</div>
`;

container.appendChild(card);

});

}

function renderEditor(){

const panel = document.getElementById('editorPanel');

if(!state.editMode){

panel.innerHTML='';

return;

}

let html = `
<div class="editor-card">
<h2 class="editor-title">Configuration des paliers</h2>
`;

state.model.levels.forEach((level,l)=>{

html += `
<div class="editor-level">
<input
class="level-name-input"
value="${level.name}"
onchange="renameLevel(${l},this.value)">

<button onclick="deleteLevel(${l})">Supprimer palier</button>

<div class="editor-tasks">
`;

level.tasks.forEach((task,t)=>{

html += `
<div class="editor-task-row">
<input
value="${task}"
onchange="renameTask(${l},${t},this.value)">
<button onclick="deleteTask(${l},${t})">X</button>
</div>
`;

});

html += `
<button onclick="addTask(${l})">Ajouter tâche</button>
</div>
</div>
`;

});

html += `
<button onclick="addLevel()">Ajouter palier</button>
</div>
`;

panel.innerHTML = html;

}

function addCity(){

state.cities.push(createCity('Nouvelle ville'));

syncCities();

render();

saveDebounced();

}

function deleteCity(id){

state.cities = state.cities.filter(c=>c.id !== id);

render();

saveDebounced();

}

function renameCity(id,value){

const city = state.cities.find(c=>c.id===id);

if(city){
city.name=value;
}

saveDebounced();

}

function toggleTask(cityId,l,t,checked){

const city = state.cities.find(c=>c.id===cityId);

if(!city.checks[l]){
city.checks[l]={};
}

city.checks[l][t]=checked;

render();

saveDebounced();

}

function toggleEdit(){

state.editMode = !state.editMode;

render();

}

function addLevel(){

state.model.levels.push({
name:`Palier ${state.model.levels.length+1}`,
tasks:['Nouvelle tâche']
});

syncCities();

render();

saveDebounced();

}

function deleteLevel(index){

state.model.levels.splice(index,1);

syncCities();

render();

saveDebounced();

}

function renameLevel(index,value){

state.model.levels[index].name = value;

saveDebounced();

}

function addTask(levelIndex){

state.model.levels[levelIndex].tasks.push('Nouvelle tâche');

syncCities();

render();

saveDebounced();

}

function deleteTask(levelIndex,taskIndex){

state.model.levels[levelIndex].tasks.splice(taskIndex,1);

syncCities();

render();

saveDebounced();

}

function renameTask(levelIndex,taskIndex,value){

state.model.levels[levelIndex].tasks[taskIndex]=value;

saveDebounced();

}

async function init(){

await loadCloud();

render();

}

window.addEventListener('DOMContentLoaded',init);

async function downloadScoreboardImage(){

if(window.ExportRenderer){

await window.ExportRenderer.exportScoreboard();

}

}
