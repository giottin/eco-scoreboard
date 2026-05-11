
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
