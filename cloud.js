
function setStatus(text,color='white'){
const el=document.getElementById('cloudStatus');
el.innerHTML=text;
el.style.color=color;
}

async function saveCloud(){

try{

await fetch(
SUPABASE_URL+'/rest/v1/cloud_saves',
{
method:'POST',
headers:{
'Content-Type':'application/json',
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY,
'Prefer':'resolution=merge-duplicates'
},
body:JSON.stringify({
id:'save1',
content:state
})
}
);

setStatus('☁ Sauvegarde OK','#8cff9c');

}catch(e){
console.error(e);
setStatus('Erreur sauvegarde','#ff7070');
}

}

async function loadCloud(){

try{

const response=await fetch(
SUPABASE_URL+'/rest/v1/cloud_saves?id=eq.save1&select=*',
{
headers:{
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY
}
}
);

const data=await response.json();

if(data.length>0){
state.model=data[0].content.model || state.model;
state.cities=data[0].content.cities || [];
}

setStatus('☁ Cloud connecté','#8cff9c');

}catch(e){
console.error(e);
setStatus('Erreur cloud','#ff7070');
}

}
