
async function sync(){
syncCities();
render();
await saveCloud();
}

async function addCity(){
state.cities.push(createCity());
await sync();
}

async function renameCity(id,v){
const city=state.cities.find(c=>c.id===id);
if(city) city.name=v;
await sync();
}

async function toggleTask(id,l,t,val){
const city=state.cities.find(c=>c.id===id);
city.checks[l][t]=val;
await sync();
}

async function addLevel(){
state.model.levels.push({
name:'Nouveau palier',
tasks:['Nouvelle tâche']
});
await sync();
}

async function renameLevel(i,v){
state.model.levels[i].name=v;
await sync();
}

async function deleteLevel(i){
state.model.levels.splice(i,1);
await sync();
}

async function addTask(l){
state.model.levels[l].tasks.push('Nouvelle tâche');
await sync();
}

async function renameTask(l,t,v){
state.model.levels[l].tasks[t]=v;
await sync();
}

async function deleteTask(l,t){
state.model.levels[l].tasks.splice(t,1);
await sync();
}

document.getElementById('toggleEditBtn').onclick=()=>{
state.editMode=!state.editMode;
render();
};

document.getElementById('addCityBtn').onclick=addCity;

document.getElementById('downloadBtn').onclick=()=>{
window.print();
};

(async()=>{

await loadCloud();

if(state.cities.length===0){
state.cities.push(createCity('Ville I'));
}

syncCities();

render();

})();
