
const CLOUD_SAVE_ID = 'main_save';

function setStatus(text,color='white'){
const el=document.getElementById('cloudStatus');
if(!el) return;
el.innerHTML=text;
el.style.color=color;
}

async function saveCloud(){

try{

syncCities();

const payload = {
id:CLOUD_SAVE_ID,
content:state,
updated_at:new Date().toISOString()
};

const response = await fetch(
`${SUPABASE_URL}/rest/v1/cloud_saves?on_conflict=id`,
{
method:'POST',
headers:{
'Content-Type':'application/json',
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY,
'Prefer':'resolution=merge-duplicates'
},
body:JSON.stringify(payload)
}
);

if(!response.ok){
throw new Error(await response.text());
}

setStatus('☁ Sauvegarde cloud OK','#8cff9c');

}catch(error){

console.error(error);
setStatus('☁ Erreur cloud','#ff7070');

}

}

async function loadCloud(){

try{

setStatus('☁ Synchronisation...','#ffd86b');

const response = await fetch(
`${SUPABASE_URL}/rest/v1/cloud_saves?id=eq.${CLOUD_SAVE_ID}&select=*`,
{
headers:{
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY
}
}
);

if(!response.ok){
throw new Error(await response.text());
}

const data = await response.json();

if(data.length > 0 && data[0].content){

state.editMode = false;
state.model = data[0].content.model || state.model;
state.cities = data[0].content.cities || [];

}else{

state.cities = [
createCity('Ville 1'),
createCity('Ville 2')
];

await saveCloud();

}

syncCities();

setStatus('☁ Cloud synchronisé','#8cff9c');

}catch(error){

console.error(error);

if(state.cities.length === 0){

state.cities = [
createCity('Ville 1'),
createCity('Ville 2')
];

}

syncCities();

setStatus('☁ Mode hors ligne','#ffae42');

}

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
