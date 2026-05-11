
const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

let state={
cities:[]
};

function setStatus(text,color='white'){
const el=document.getElementById('cloudStatus');
el.innerHTML=text;
el.style.color=color;
}

function createCity(name='Ville'){
return{
id:Date.now()+Math.random(),
name:name,
rank:1
};
}

async function saveCloud(){

try{

const cleanState=JSON.parse(JSON.stringify(state));

const response=await fetch(
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
content:cleanState
})
}
);

if(response.ok){
setStatus('☁ Sauvegarde cloud OK','#7dff98');
}else{
setStatus('Erreur sauvegarde','#ff7d7d');
}

}catch(e){
console.error(e);
setStatus('Erreur cloud','#ff7d7d');
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

if(data.length>0 && data[0].content){
state=data[0].content;
}

if(!state.cities){
state.cities=[];
}

setStatus('☁ Cloud connecté','#7dff98');

}catch(e){
console.error(e);
setStatus('Erreur chargement','#ff7d7d');
}

}

function render(){

const app=document.getElementById('app');

app.innerHTML='';

state.cities.forEach(city=>{

const progress=(city.rank/8)*100;

let levels='';

for(let i=1;i<=8;i++){

levels+=`
<div class="level">

<div class="level-title">
Palier ${ROMAN[i-1]}
</div>

<div class="task">
<input
type="checkbox"
${i<=city.rank?'checked':''}
onchange="setRank('${city.id}',${i})">
<div>Tâche 1</div>
</div>

<div class="task">
<input
type="checkbox"
${i<city.rank?'checked':''}
onchange="setRank('${city.id}',${i})">
<div>Tâche 2</div>
</div>

</div>
`;

}

app.innerHTML+=`

<div class="city">

<div class="city-rank"
style="background-image:url('city_rank_${city.rank}.png')">

<div class="roman">
${ROMAN[city.rank-1]}
</div>

<div class="city-zone">
<div class="city-name">${city.name}</div>
</div>

</div>

<div class="city-edit">
<input
value="${city.name}"
oninput="renameCity('${city.id}',this.value)">
</div>

<div class="progress">
<div class="progress-fill"
style="width:${progress}%"></div>
</div>

<div class="scale">
<div>I</div>
<div>II</div>
<div>III</div>
<div>IV</div>
<div>V</div>
<div>VI</div>
<div>VII</div>
<div>VIII</div>
</div>

<div class="levels">
${levels}
</div>

</div>

`;

});

}

async function renameCity(id,value){

const city=state.cities.find(c=>String(c.id)===String(id));

if(city){
city.name=value;
}

render();

await saveCloud();

}

async function setRank(id,rank){

const city=state.cities.find(c=>String(c.id)===String(id));

if(city){
city.rank=rank;
}

render();

await saveCloud();

}

async function addCity(){

state.cities.push(createCity('Nouvelle Ville'));

render();

await saveCloud();

}

document.getElementById('addCityBtn').onclick=addCity;

(async()=>{

await loadCloud();

if(state.cities.length===0){

state.cities.push(createCity('Tokyo'));

await saveCloud();

}

render();

})();
