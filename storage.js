const supabase = window.supabase.createClient(
'https://kijhnxehaxdjgvkddgyo.supabase.co',
'sb_publishable_mAXF0I_pLCxjnDCoIvoMYA_crqYPypL'
);

async function saveCloud(state){

try{

await supabase
.from('dashboard_data')
.upsert({
id:1,
content:state,
updated_at:new Date().toISOString()
});

console.log('☁️ sauvegarde cloud');

}catch(e){

console.error(e);

}

}

async function loadCloud(){

try{

const response = await supabase
.from('dashboard_data')
.select('*')
.eq('id',1)
.single();

if(response.data && response.data.content){
return response.data.content;
}

}catch(e){

console.error(e);

}

return null;

}
