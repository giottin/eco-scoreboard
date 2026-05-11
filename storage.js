
const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

const state={
editMode:false,
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
},
cities:[]
};

function uid(){
return String(Date.now()+Math.random());
}

function createCity(name='Nouvelle ville'){
return{
id:uid(),
name,
checks:{}
};
}

function syncCities(){
state.cities.forEach(city=>{
state.model.levels.forEach((level,l)=>{
if(!city.checks[l]) city.checks[l]={};

level.tasks.forEach((task,t)=>{
if(city.checks[l][t]===undefined){
city.checks[l][t]=false;
}
});
});
});
}

function getCityRank(city){

let completed=0;

state.model.levels.forEach((level,l)=>{

let ok=true;

level.tasks.forEach((task,t)=>{
if(!city.checks[l]?.[t]){
ok=false;
}
});

if(ok && level.tasks.length>0){
completed++;
}

});

completed=Math.max(1,Math.min(8,completed));

return{
rank:completed,
roman:ROMAN[completed-1],
asset:`city_rank_${completed}.png`,
progress:Math.round((completed/8)*100)
};

}
