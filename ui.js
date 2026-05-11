
function renderEditor(){

const panel=document.getElementById('editorPanel');

if(!state.editMode){
panel.innerHTML='';
return;
}

let html=`
<div class="city-card">
<h2 class="editor-title">Ville modèle</h2>

<div class="editor-grid">
`;

state.model.levels.forEach((level,l)=>{

html+=`
<div class="level">

<div style="display:flex;gap:8px;margin-bottom:10px;">
<input class="level-title"
value="${level.name}"
onchange="renameLevel(${l},this.value)">

<button class="delete-btn"
onclick="deleteLevel(${l})">✕</button>
</div>
`;

level.tasks.forEach((task,t)=>{

html+=`
<div class="task">

<input type="text"
value="${task}"
onchange="renameTask(${l},${t},this.value)">

<button class="delete-btn"
onclick="deleteTask(${l},${t})">✕</button>

</div>
`;

});

html+=`
<button onclick="addTask(${l})">
Ajouter tâche
</button>
`;

html+='</div>';

});

html+='</div></div>';

panel.innerHTML=html;

}

function renderCities(){

const container=document.getElementById('citiesContainer');

state.cities.sort((a,b)=>
getCityRank(b).rank-getCityRank(a).rank
);

container.innerHTML='';

state.cities.forEach(city=>{

const rank=getCityRank(city);

let html=`
<div class="city-card">

<div class="city-header">

<div class="city-rank-header"
style="background-image:url('${rank.asset}')">

<div class="city-rank">${rank.roman}</div>

<div class="city-title">
${city.name}
</div>

</div>

</div>

<div class="progress">
<div class="progress-fill"
style="width:${rank.progress}%"></div>
</div>

<div class="progress-steps">
`;

for(let i=1;i<=8;i++){
html+=`<div>${i}</div>`;
}

html+=`</div>`;

html+=`<div class="levels-grid">`;

state.model.levels.forEach((level,l)=>{

html+=`
<div class="level">

<div class="level-title">
${level.name}
</div>
`;

level.tasks.forEach((task,t)=>{

html+=`
<div class="task">

<input type="checkbox"
class="custom-check"
${city.checks[l]?.[t]?'checked':''}
onchange="toggleTask('${city.id}',${l},${t},this.checked)">

<div>${task}</div>

</div>
`;

});

html+='</div>';

});

html+='</div></div>';

container.innerHTML+=html;

});

}

function render(){
renderEditor();
renderCities();
}
