function setStatus(text,color='white'){

const el=document.getElementById('cloudStatus');

if(el){
el.innerHTML=text;
el.style.color=color;
}

}

async function saveCloud(){

try{

await fetch(
`${SUPABASE_URL}/rest/v1/cloud_saves?on_conflict=id`,
{
method:'POST',
headers:{
'Content-Type':'application/json',
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY,
'Prefer':'resolution=merge-duplicates'
},
body:JSON.stringify({
id:'main',
content:state
})
}
);

setStatus('☁ Cloud OK','#8cff9c');

}catch(err){

console.error(err);
setStatus('☁ Erreur cloud','#ff7070');

}

}

async function loadCloud(){

try{

const response = await fetch(
`${SUPABASE_URL}/rest/v1/cloud_saves?id=eq.main&select=*`,
{
headers:{
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY
}
}
);

const data = await response.json();

if(data.length>0){

state.cities=data[0].content.cities || [];
state.model=data[0].content.model || state.model;

}

syncCities();

setStatus('☁ Synchronisé','#8cff9c');

}catch(err){

console.error(err);
setStatus('☁ Hors ligne','#ff7070');

}

}