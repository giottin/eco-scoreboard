function debounce(fn,delay=600){

let timer;

return (...args)=>{
clearTimeout(timer);
timer=setTimeout(()=>fn(...args),delay);
};

}

const saveDebounced = debounce(saveCloud,700);

function sortCities(){

state.cities.sort((a,b)=>{

const scoreA = getCityScore(a);
const scoreB = getCityScore(b);

if(scoreB.completed !== scoreA.completed){
return scoreB.completed - scoreA.completed;
}

return scoreB.checked - scoreA.checked;

});

}

function render(){

syncCities();
sortCities();

const container=document.getElementById('cities');

container.innerHTML='';

state.cities.forEach(city=>{

const rank=getCityRank(city);

const card=document.createElement('div');
card.className='city-card';

let levels='';

state.model.levels.forEach((level,l)=>{

let tasks='';

level.tasks.forEach((task,t)=>{

const checked = city.checks?.[l]?.[t];

tasks += `
<label class="task">
<input type="checkbox"
${checked ? 'checked' : ''}
onchange="toggleTask('${city.id}',${l},${t},this.checked)">
<span>${task}</span>
</label>
`;

});

levels += `
<div class="level-card">
<h3>${level.name}</h3>
${tasks}
</div>
`;

});

card.innerHTML=`
<div class="rank-banner">
<img class="rank-image" src="${rank.asset}">
<div class="city-title-wrapper">
<input
class="city-title"
value="${city.name}"
onchange="renameCity('${city.id}',this.value)">
</div>
</div>

<div class="progress-wrapper">
${state.model.levels.map((level,index)=>{

const filled = index < getCompletedLevels(city);

return `<div class="progress-segment ${filled ? 'filled' : ''}"></div>`;

}).join('')}
</div>

<div class="levels-grid">
${levels}
</div>

<div class="bottom-actions">
<button onclick="deleteCity('${city.id}')">Supprimer</button>
</div>
`;

container.appendChild(card);

});

}

function addCity(){

state.cities.push(createCity(`Ville ${state.cities.length+1}`));

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

function deleteCity(id){

state.cities = state.cities.filter(c=>c.id!==id);

render();
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

window.addEventListener('DOMContentLoaded',async()=>{

document.body.style.backgroundPosition='top center';


await loadCloud();

if(state.cities.length===0){

state.cities.push(createCity('Ville 1'));
state.cities.push(createCity('Ville 2'));

}

render();

});

async function downloadScoreboardImage(){

await window.ExportRenderer.exportScoreboard();

}