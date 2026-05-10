function render(){

renderEditor();
renderCities();

}

function renderEditor(){

const panel = document.getElementById('editorPanel');

if(!state.editMode){

panel.innerHTML='';
return;

}

let html = `
<div class="city-card">
<h2 style="margin-bottom:20px;">Ville modèle</h2>
`;

state.model.levels.forEach((level,l)=>{

html += `
<div class="level">

<div class="city-header">
<input class="city-name" value="${level.name}"
onchange="renameLevel(${l}, this.value)">

<button class="delete-btn"
onclick="deleteLevel(${l})">
✕
</button>
</div>
`;

level.tasks.forEach((task,t)=>{

html += `
<div class="task">

<input type="text"
value="${task}"
onchange="renameTask(${l}, ${t}, this.value)">

<button class="delete-btn"
onclick="deleteTask(${l}, ${t})">
✕
</button>

</div>
`;

});

html += `
<button onclick="addTask(${l})">
Ajouter tâche
</button>
`;

html += `</div>`;

});

html += `
<button onclick="addLevel()">
Ajouter palier
</button>
`;

html += `</div>`;

panel.innerHTML = html;

}

function renderCities(){

const container = document.getElementById('citiesContainer');

container.innerHTML='';

state.cities.forEach(city=>{

const progress = calculateProgress(city);

let html = `
<div class="city-card">

<div class="city-header">

<input class="city-name"
value="${city.name}"
onchange="renameCity('${city.id}', this.value)">

<button class="delete-btn"
onclick="deleteCity('${city.id}')">
✕
</button>

</div>

<div class="progress">
<div class="progress-fill"
style="width:${progress}%">
</div>
</div>
`;

state.model.levels.forEach((level,l)=>{

html += `
<div class="level">

<div class="level-title">
${level.name}
</div>
`;

level.tasks.forEach((task,t)=>{

html += `
<div class="task">

<input type="checkbox"
${city.checks[l]?.[t] ? 'checked':''}
onchange="toggleTask('${city.id}', ${l}, ${t}, this.checked)">

<div>${task}</div>

</div>
`;

});

html += `</div>`;

});

html += `</div>`;

container.innerHTML += html;

});

}
