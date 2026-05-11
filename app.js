const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];

let state={
cities:[]
};

function setStatus(text,color='white'){
const el=document.getElementById('cloudStatus');
el.innerText=text;
el.style.color=color;
}

function cityTemplate(name='Nouvelle Ville'){
return{
id:crypto.randomUUID(),
name,
rank:1
};
}

async function saveCloud(){

try{

const response = await fetch(
SUPABASE_URL + '/rest/v1/cloud_saves?id=eq.save1',
{
method:'PATCH',
headers:{
'Content-Type':'application/json',
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY,
'Prefer':'return=minimal'
},
body:JSON.stringify({
content:state
})
}
);

if(!response.ok){

await fetch(
SUPABASE_URL + '/rest/v1/cloud_saves',
{
method:'POST',
headers:{
'Content-Type':'application/json',
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY
},
body:JSON.stringify({
id:'save1',
content:state
})
}
);

}

setStatus('☁ Sauvegarde OK','#78ff97');

}catch(e){
console.error(e);
setStatus('Erreur sauvegarde','#ff6f6f');
}

}

async function loadCloud(){

try{

const response = await fetch(
SUPABASE_URL + '/rest/v1/cloud_saves?id=eq.save1&select=*',
{
headers:{
'apikey':SUPABASE_ANON_KEY,
'Authorization':'Bearer '+SUPABASE_ANON_KEY
}
}
);

const data = await response.json();

if(data.length && data[0].content){
state = data[0].content;
}

if(!state.cities){
state.cities=[];
}

setStatus('☁ Cloud connecté','#78ff97');

}catch(e){
console.error(e);
setStatus('Erreur cloud','#ff6f6f');
}

}

function render(){

const container=document.getElementById('cities');

container.innerHTML='';

state.cities.forEach(city=>{

const progress=(city.rank/8)*100;

let levels='';

for(let i=1;i<=8;i++){

levels += `
<div class="level">
<div class="level-title">Palier ${ROMAN[i-1]}</div>

<label class="task">
<input
type="checkbox"
${i<=city.rank?'checked':''}
onchange="setRank('${city.id}',${i})">
<span>Tâche 1</span>
</label>

<label class="task">
<input
type="checkbox"
${i<city.rank?'checked':''}
onchange="setRank('${city.id}',${i})">
<span>Tâche 2</span>
</label>

</div>
`;

}

container.innerHTML += `
<div class="city">

<div class="city-rank"
style="background-image:url('city_rank_${city.rank}.png')">

<div class="rank-roman">
${ROMAN[city.rank-1]}
</div>

<div class="city-name">
${city.name}
</div>

</div>

<input
class="city-input"
value="${city.name}"
oninput="renameCity('${city.id}',this.value)">

<div class="progress">
<div class="progress-fill" style="width:${progress}%"></div>
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

const city = state.cities.find(c=>c.id===id);

if(city){
city.name=value;
}

render();
await saveCloud();

}

async function setRank(id,rank){

const city = state.cities.find(c=>c.id===id);

if(city){
city.rank=rank;
}

render();
await saveCloud();

}

async function addCity(){

state.cities.push(cityTemplate());

render();
await saveCloud();

}

(async()=>{

await loadCloud();

if(state.cities.length===0){

state.cities.push(cityTemplate('Tokyo'));

await saveCloud();

}

render();

})();
