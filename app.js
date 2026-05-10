const state = {
editMode:false,

model:{
levels:[
{
name:'Palier 1',
tasks:['Tâche 1','Tâche 2']
}
]
},

cities:[]
};

function uid(){
return String(Date.now() + Math.random());
}

function createCity(name='Nouvelle ville'){
return{
id:uid(),
name:name,
checks:{}
};
}

function ensureStructure(){

state.cities.forEach(city=>{

state.model.levels.forEach((level,l)=>{

if(!city.checks[l]){
city.checks[l]={};
}

level.tasks.forEach((task,t)=>{

if(city.checks[l][t] === undefined){
city.checks[l][t] = false;
}

});

});

});

}

function calculateProgress(city){

let total=0;
let done=0;

state.model.levels.forEach((level,l)=>{

level.tasks.forEach((task,t)=>{

total++;

if(city.checks[l]?.[t]){
done++;
}

});

});

return total ? Math.round((done/total)*100) : 0;

}

async function sync(){

ensureStructure();

await saveCloud(state);

render();

}

async function addCity(){

state.cities.push(createCity());

await sync();

}

async function renameCity(id,value){

const city = state.cities.find(c=>c.id===id);

if(city){
city.name=value;
}

await sync();

}

async function deleteCity(id){

state.cities = state.cities.filter(c=>c.id!==id);

await sync();

}

async function toggleTask(id,l,t,checked){

const city = state.cities.find(c=>c.id===id);

city.checks[l][t]=checked;

await sync();

}

async function addLevel(){

state.model.levels.push({
name:'Nouveau palier',
tasks:['Nouvelle tâche']
});

await sync();

}

async function renameLevel(index,value){

state.model.levels[index].name=value;

await sync();

}

async function deleteLevel(index){

state.model.levels.splice(index,1);

await sync();

}

async function addTask(level){

state.model.levels[level].tasks.push('Nouvelle tâche');

await sync();

}

async function renameTask(level,task,value){

state.model.levels[level].tasks[task]=value;

await sync();

}

async function deleteTask(level,task){

state.model.levels[level].tasks.splice(task,1);

await sync();

}

document.getElementById('toggleEditBtn').onclick = ()=>{

state.editMode = !state.editMode;

render();

};

document.getElementById('addCityBtn').onclick = addCity;

document.getElementById('downloadBtn').onclick = async ()=>{

const canvas = await html2canvas(
document.getElementById('app'),
{
useCORS:true,
backgroundColor:null,
scale:2
}
);

const link = document.createElement('a');

link.download='dashboard.png';
link.href=canvas.toDataURL('image/png');

link.click();

};

(async ()=>{

const cloud = await loadCloud();

if(cloud){

state.model = cloud.model || state.model;
state.cities = cloud.cities || [];

}

ensureStructure();

render();

})();
