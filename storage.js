
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

function calculateProgress(city){

const total=state.model.levels.length;

let completed=[];

state.model.levels.forEach((level,l)=>{

let valid=true;

level.tasks.forEach((task,t)=>{
if(!city.checks[l]?.[t]){
valid=false;
}
});

if(valid && level.tasks.length>0){
completed.push(l);
}

});

return{
percent:total?Math.round((completed.length/total)*100):0,
completed,
rank:completed.length
};

}

function rankClass(rank){
const names=['I','II','III','IV','V','VI','VII','VIII'];
return 'rank-'+(names[Math.max(0,Math.min(rank-1,7))]||'I');
}
