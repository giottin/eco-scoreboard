
const supabase = window.supabase.createClient(
'https://kijhnxehaxdjgvkddgyo.supabase.co',
'sb_publishable_mAXF0I_pLCxjnDCoIvoMYA_crqYPypL'
);

function setCloudStatus(text,color='#fff'){

const el = document.getElementById('cloudStatus');

if(el){
el.innerHTML=text;
el.style.color=color;
}

}

async function saveCloud(state){

try{

const response = await supabase
.from('dashboard_data')
.upsert({
id:1,
content:state,
updated_at:new Date().toISOString()
});

if(response.error){
throw response.error;
}

setCloudStatus('☁️ Sauvegardé','#7eff83');

}catch(e){


console.error(e);
alert('Erreur cloud : ' + JSON.stringify(e));


setCloudStatus('❌ Erreur cloud','#ff6666');

}

}

async function loadCloud(){

try{

const response = await supabase
.from('dashboard_data')
.select('*')
.eq('id',1)
.single();

if(response.error){
throw response.error;
}

if(response.data && response.data.content){

setCloudStatus('☁️ Données chargées','#7eff83');


console.log('☁️ load success');
return response.data.content;


}

}catch(e){


console.error(e);
alert('Erreur cloud : ' + JSON.stringify(e));


setCloudStatus('❌ Chargement impossible','#ff6666');

}

return null;

}
