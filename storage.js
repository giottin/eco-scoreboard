
let supabase = null;

function setCloudStatus(text,color='#ffffff'){

const el = document.getElementById('cloudStatus');

if(el){
el.innerHTML = text;
el.style.color = color;
}

}

async function initSupabase(){

try{

if(!window.supabase){

setCloudStatus('❌ SDK Supabase introuvable','#ff6666');
console.error('Supabase SDK missing');

return false;

}

supabase = window.supabase.createClient(
'https://kijhnxehaxdjgvkddgyo.supabase.co',
'sb_publishable_mAXF0I_pLCxjnDCoIvoMYA_crqYPypL'
);

setCloudStatus('☁️ Supabase connecté','#7eff83');

console.log('Supabase initialized');

return true;

}catch(e){

console.error(e);

setCloudStatus('❌ Erreur connexion cloud','#ff6666');

return false;

}

}

async function saveCloud(state){

try{

if(!supabase){

console.error('Supabase not initialized');
setCloudStatus('❌ Cloud non initialisé','#ff6666');
return false;

}

const response = await supabase
.from('dashboard_data')
.upsert({
id:1,
content:state,
updated_at:new Date().toISOString()
},{
onConflict:'id'
});

if(response.error){
throw response.error;
}

console.log('save success');

setCloudStatus('☁️ Sauvegardé','#7eff83');

return true;

}catch(e){

console.error(e);

setCloudStatus('❌ Sauvegarde impossible','#ff6666');

return false;

}

}

async function loadCloud(){

try{

if(!supabase){

console.error('Supabase not initialized');
return null;

}

const response = await supabase
.from('dashboard_data')
.select('*')
.eq('id',1)
.single();

if(response.error){
throw response.error;
}

if(response.data && response.data.content){

console.log('load success');

setCloudStatus('☁️ Données chargées','#7eff83');

return response.data.content;

}

}catch(e){

console.error(e);

setCloudStatus('❌ Chargement impossible','#ff6666');

}

return null;

}
