
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


/* ===== EXPORT LAYOUT FIXES ===== */
.export-mode .city-section{
  position: relative !important;
  margin-top: 140px !important;
  margin-bottom: 120px !important;
  padding: 40px 28px 50px 28px !important;
  border: 2px solid rgba(212,170,66,0.75) !important;
  border-radius: 22px !important;
  background: rgba(0,0,0,0.35) !important;
  overflow: visible !important;
}

.export-mode .rank-city,
.export-mode .ranked-city,
.export-mode .city-rank{
  position: relative !important;
  z-index: 20 !important;
  margin-top: 60px !important;
  margin-bottom: 50px !important;
  transform: none !important;
}

.export-mode .rank-city .city-name,
.export-mode .ranked-city .city-name,
.export-mode .city-rank .city-name{
  position: absolute !important;
  left: 50% !important;
  top: 63% !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
  width: 75% !important;
  z-index: 25 !important;
}

.export-mode .main-logo,
.export-mode .logo{
  position: relative !important;
  z-index: 50 !important;
  filter: brightness(1.1) !important;
  margin-bottom: 80px !important;
}

.export-mode .palier-grid,
.export-mode .tiers-grid{
  position: relative !important;
  z-index: 10 !important;
  gap: 22px !important;
}

.export-mode .palier-card,
.export-mode .tier-card{
  border: 1px solid rgba(212,170,66,0.7) !important;
  background: rgba(0,0,0,0.55) !important;
  box-shadow: 0 0 0 1px rgba(212,170,66,0.2) inset !important;
}
