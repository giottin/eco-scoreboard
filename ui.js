
function renderEditor(){

const panel=document.getElementById('editorPanel');

if(!state.editMode){
panel.innerHTML='';
return;
}

let html=`
<div class="city-card">

<div class="editor-header">
<h2>Ville modèle</h2>
<button onclick="addLevel()">Ajouter palier</button>
</div>

<div class="editor-grid">
`;

state.model.levels.forEach((level,l)=>{

html+=`
<div class="level">

<div class="editor-header">

<input class="level-title"
value="${level.name}"
onchange="renameLevel(${l},this.value)">

<button class="delete-btn"
onclick="deleteLevel(${l})">
✕
</button>

</div>
`;

level.tasks.forEach((task,t)=>{

html+=`
<div class="task">

<input type="text"
value="${task}"
onchange="renameTask(${l},${t},this.value)">

<button class="delete-btn"
onclick="deleteTask(${l},${t})">
✕
</button>

</div>
`;

});

html+=`
<button onclick="addTask(${l})">
Ajouter tâche
</button>
`;

html+=`</div>`;

});

html+=`</div></div>`;

panel.innerHTML=html;

}

function renderCities(){

const container=document.getElementById('citiesContainer');

state.cities.sort((a,b)=>
calculateProgress(b).percent-
calculateProgress(a).percent
);

container.innerHTML='';

state.cities.forEach(city=>{

const progress=calculateProgress(city);

let html=`
<div class="city-card ${rankClass(progress.rank)}">

<div class="city-name-wrapper">

<input class="city-name"
value="${city.name}"
onchange="renameCity('${city.id}',this.value)">

</div>

<div class="progress-wrapper">

<div class="progress">
<div class="progress-fill"
style="width:${progress.percent}%">
</div>
</div>

<div class="progress-steps">
`;

for(let i=1;i<=state.model.levels.length;i++){
html+=`<div>${i}</div>`;
}

html+=`
</div>
</div>

<div class="levels-grid">
`;

state.model.levels.forEach((level,l)=>{

const completed=progress.completed.includes(l);

html+=`
<div class="level ${completed?'completed':''}">

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

html+=`</div>`;

});

html+=`</div></div>`;

container.innerHTML+=html;

});

}

function render(){
renderEditor();
renderCities();
}
