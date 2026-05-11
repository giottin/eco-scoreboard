
const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

const DEFAULT_LEVELS = [
{name:'Palier I',tasks:['Tâche 1','Tâche 2']},
{name:'Palier II',tasks:['Tâche 1','Tâche 2']},
{name:'Palier III',tasks:['Tâche 1','Tâche 2']},
{name:'Palier IV',tasks:['Tâche 1','Tâche 2']},
{name:'Palier V',tasks:['Tâche 1','Tâche 2']},
{name:'Palier VI',tasks:['Tâche 1','Tâche 2']},
{name:'Palier VII',tasks:['Tâche 1','Tâche 2']},
{name:'Palier VIII',tasks:['Tâche 1','Tâche 2']}
];

window.state = {
editMode:false,
model:{
levels:structuredClone(DEFAULT_LEVELS)
},
cities:[]
};

function uid(){
return crypto.randomUUID();
}

function createCity(name='Nouvelle ville'){
return {
id:uid(),
name,
checks:{}
};
}

function syncCities(){

state.cities.forEach(city=>{

state.model.levels.forEach((level,l)=>{

if(!city.checks[l]){
city.checks[l]={};
}

level.tasks.forEach((task,t)=>{

if(city.checks[l][t] === undefined){
city.checks[l][t]=false;
}

});

});

});

}

function getCompletedLevels(city){

let completed = 0;

state.model.levels.forEach((level,l)=>{

const ok = level.tasks.every((task,t)=>city.checks?.[l]?.[t]);

if(ok && level.tasks.length){
completed++;
}

});

return completed;

}

function getCityRank(city){

const completed = Math.max(1,Math.min(8,getCompletedLevels(city)));

return {
rank:completed,
roman:ROMAN[completed-1],
asset:`city_rank_${completed}.png`
};

}
