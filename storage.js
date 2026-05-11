const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

window.state={
cities:[],
model:{
levels:[
{name:'Palier I',tasks:['Tâche 1','Tâche 2']},
{name:'Palier II',tasks:['Tâche 1','Tâche 2']},
{name:'Palier III',tasks:['Tâche 1','Tâche 2']},
{name:'Palier IV',tasks:['Tâche 1','Tâche 2']},
{name:'Palier V',tasks:['Tâche 1','Tâche 2']},
{name:'Palier VI',tasks:['Tâche 1','Tâche 2']},
{name:'Palier VII',tasks:['Tâche 1','Tâche 2']},
{name:'Palier VIII',tasks:['Tâche 1','Tâche 2']}
]
}
};

function createCity(name){
return {
id:crypto.randomUUID(),
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

if(city.checks[l][t]===undefined){
city.checks[l][t]=false;
}

});

});

});

}

function getCompletedLevels(city){

let completed=0;

state.model.levels.forEach((level,l)=>{

const ok = level.tasks.every((task,t)=>city.checks?.[l]?.[t]);

if(ok) completed++;

});

return completed;

}

function getCityScore(city){

let checked=0;

Object.values(city.checks || {}).forEach(level=>{
Object.values(level || {}).forEach(v=>{
if(v) checked++;
});
});

return {
completed:getCompletedLevels(city),
checked
};

}

function getCityRank(city){

const completed=Math.max(1,getCompletedLevels(city));

return {
asset:`city_rank_${Math.min(completed,8)}.png`,
roman:ROMAN[Math.min(completed,8)-1]
};

}