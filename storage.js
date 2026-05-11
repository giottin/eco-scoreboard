
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


/* ===== EXPORT LAYOUT FIXES ===== */
.export-mode .city-section{
  position: relative !important;
  margin-top: 140px !important;
  margin-bottom: 120px !important;
  padding: 40px 28px 50px 28px !important;
  border: 2px solid rgba(212,170,66,0.75) !important;
  border-radius: 22px !important;
  background: rgba(0,0,0,0.35) !important;
  overflow: visible !important;
}

.export-mode .rank-city,
.export-mode .ranked-city,
.export-mode .city-rank{
  position: relative !important;
  z-index: 20 !important;
  margin-top: 60px !important;
  margin-bottom: 50px !important;
  transform: none !important;
}

.export-mode .rank-city .city-name,
.export-mode .ranked-city .city-name,
.export-mode .city-rank .city-name{
  position: absolute !important;
  left: 50% !important;
  top: 63% !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
  width: 75% !important;
  z-index: 25 !important;
}

.export-mode .main-logo,
.export-mode .logo{
  position: relative !important;
  z-index: 50 !important;
  filter: brightness(1.1) !important;
  margin-bottom: 80px !important;
}

.export-mode .palier-grid,
.export-mode .tiers-grid{
  position: relative !important;
  z-index: 10 !important;
  gap: 22px !important;
}

.export-mode .palier-card,
.export-mode .tier-card{
  border: 1px solid rgba(212,170,66,0.7) !important;
  background: rgba(0,0,0,0.55) !important;
  box-shadow: 0 0 0 1px rgba(212,170,66,0.2) inset !important;
}
