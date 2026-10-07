const $=id=>document.getElementById(id);
const state={template:1,color:"#0b5d3b",font:"Inter",photo:"",formations:[],experiences:[],competences:[],langues:[],projets:[],certifications:[],references:[]};
const templates=[
 ["Classique RDC","Sobre et polyvalent"],["Vert institutionnel","Professionnel"],["Élégant","Typographie raffinée"],["Droit & administratif","Structuré"],["Compact","Une page efficace"],["Accent","Moderne"],["Terre & or","Élégant"],["Colonne","Très lisible"],["Centré","Créatif"],["Bandeau","Dynamique"],["Editorial","Premium"],["Corporate sombre","Impactant"]
];
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function val(id){return $(id)?.value||""}
function fields(type){
 const maps={
 formation:[["Diplôme","diplome"],["Établissement","etablissement"],["Ville","ville"],["Début","debut"],["Fin","fin"],["Description","description"]],
 experience:[["Poste","poste"],["Entreprise","entreprise"],["Ville","ville"],["Début","debut"],["Fin","fin"],["Responsabilités","description"]],
 competence:[["Compétence","nom"],["Niveau","niveau"]],
 langue:[["Langue","nom"],["Niveau","niveau"]],
 projet:[["Nom du projet","nom"],["Rôle","role"],["Description","description"],["Lien","lien"]],
 certification:[["Certification","nom"],["Organisme","organisme"],["Année","annee"]],
 reference:[["Nom complet","nom"],["Fonction","fonction"],["Organisation","organisation"],["Téléphone","telephone"],["E-mail","email"]]
 }; return maps[type];
}
function addItem(type,data={}){
 const arr=state[type+"s"]; if(!arr)return;
 const obj={}; fields(type).forEach(x=>obj[x[1]]=data[x[1]]||""); arr.push(obj); renderEditor(type);
}
function removeItem(type,i){state[type+"s"].splice(i,1);renderEditor(type);render()}
function renderEditor(type){
 const box=$(type==="formation"?"formations":type==="experience"?"experiences":type==="competence"?"competences":type==="langue"?"langues":type==="projet"?"projets":type==="certification"?"certifications":"references");
 const arr=state[type+"s"]; box.innerHTML="";
 arr.forEach((obj,i)=>{
   const card=document.createElement("div");card.className="repeat-card";
   let h=`<button class="remove" data-remove="${type}" data-index="${i}">Supprimer</button><div class="grid ${fields(type).length>2?"two":""}">`;
   fields(type).forEach(([label,key])=>{
     if(key==="niveau") h+=`<label>${label}<select data-type="${type}" data-i="${i}" data-key="${key}"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option><option>Courant</option><option>Expert</option></select></label>`;
     else if(key==="description") h+=`<label>${label}<textarea rows="3" data-type="${type}" data-i="${i}" data-key="${key}" placeholder="${label}">${esc(obj[key])}</textarea></label>`;
     else h+=`<label>${label}<input data-type="${type}" data-i="${i}" data-key="${key}" value="${esc(obj[key])}" placeholder="${label}"></label>`;
   });
   h+="</div>";card.innerHTML=h;box.appendChild(card);
   card.querySelectorAll("[data-type]").forEach(el=>{el.value=obj[el.dataset.key]||el.value;el.addEventListener("input",()=>{obj[el.dataset.key]=el.value;render()})});
 });
 box.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeItem(type,+b.dataset.index));
}
document.querySelectorAll(".add-btn").forEach(b=>b.onclick=()=>addItem(b.dataset.add));
document.querySelectorAll("input,textarea,select").forEach(el=>{
 if(!el.closest(".repeat-card")&&!["photo"].includes(el.id))el.addEventListener("input",()=>render());
});
$("showReferences").addEventListener("change",render);
$("removePhoto").onclick=()=>{state.photo="";$("photo").value="";render()};
$("photo").addEventListener("change",e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=()=>{state.photo=r.result;render()};r.readAsDataURL(f)}});
$("color").addEventListener("input",e=>{state.color=e.target.value;render()});
$("font").addEventListener("change",e=>{state.font=e.target.value;render()});
function miniTemplates(){
 const box=$("templates");box.innerHTML="";
 templates.forEach((t,i)=>{const b=document.createElement("button");b.className="template-choice "+(state.template===i+1?"active":"");b.innerHTML=`<div class="mini" style="--mini:${state.color}"></div><b>${i+1}. ${t[0]}</b><span>${t[1]}</span>`;b.onclick=()=>{state.template=i+1;miniTemplates();render()};box.appendChild(b)})
}
function splitList(s){return s.split(",").map(x=>x.trim()).filter(Boolean)}
function contact(){return [val("telephone"),val("email"),val("ville"),val("adresse"),val("linkedin")].filter(Boolean).map(esc).join(" · ")}
function section(title,body){return body?`<section class="cv-section"><h3>${title}</h3>${body}</section>`:""}
function listItems(arr,type){
 return arr.map(x=>{
  if(type==="formation")return `<div class="item"><h4>${esc(x.diplome)}</h4><div class="meta">${esc(x.etablissement)} · ${esc(x.ville)} · ${esc(x.debut)} — ${esc(x.fin)}</div><p>${esc(x.description)}</p></div>`;
  if(type==="experience")return `<div class="item"><h4>${esc(x.poste)}</h4><div class="meta">${esc(x.entreprise)} · ${esc(x.ville)} · ${esc(x.debut)} — ${esc(x.fin)}</div><p>${esc(x.description)}</p></div>`;
  if(type==="projet")return `<div class="item"><h4>${esc(x.nom)}${x.role?" — "+esc(x.role):""}</h4><p>${esc(x.description)}</p>${x.lien?`<div class="meta">${esc(x.lien)}</div>`:""}</div>`;
  if(type==="certification")return `<div class="item"><h4>${esc(x.nom)}</h4><div class="meta">${esc(x.organisme)} · ${esc(x.annee)}</div></div>`;
  if(type==="reference")return `<div class="ref"><b>${esc(x.nom)}</b><span>${esc(x.fonction)} · ${esc(x.organisation)}</span><span>${esc(x.telephone)} ${x.email?"· "+esc(x.email):""}</span></div>`;
 }).join("")
}
function render(){
 miniTemplates();
 const fullName=[val("prenom"),val("nom"),val("postnom")].filter(Boolean).join(" ");
 const photo=state.photo?`<img src="${state.photo}" alt="Photo">`:`<span>PHOTO</span>`;
 const skills=state.competences.map(x=>`<span class="chip">${esc(x.nom)}${x.niveau?` · ${esc(x.niveau)}`:""}</span>`).join("");
 const langs=state.langues.map(x=>`<div class="item"><h4>${esc(x.nom)}</h4><div class="meta">${esc(x.niveau)}</div><div class="bar"><i></i></div></div>`).join("");
 const refs=state.references.length&&$("showReferences").checked?`<div class="ref-grid">${listItems(state.references,"reference")}</div>`:"";
 const qualities=splitList(val("qualites")).map(x=>`<span class="chip">${esc(x)}</span>`).join("");
 const interests=splitList(val("interets")).map(x=>`<span class="chip">${esc(x)}</span>`).join("");
 const main=section("Profil professionnel",`<p>${esc(val("profil"))}</p>`)+section("Expériences professionnelles",listItems(state.experiences,"experience"))+section("Formations",listItems(state.formations,"formation"))+section("Projets",listItems(state.projets,"projet"));
 const side=section("Compétences",`<div class="chips">${skills}</div>`)+section("Langues",langs)+section("Qualités",`<div class="chips">${qualities}</div>`)+section("Centres d'intérêt",`<div class="chips">${interests}</div>`)+section("Certifications",listItems(state.certifications,"certification"))+section("Références",refs);
 $("resume").style.setProperty("--accent",state.color);$("resume").style.setProperty("--resume-font",state.font);
 $("resume").className=`resume template-${state.template}`;
 $("resume").innerHTML=`<div class="resume-inner">
 <header class="cv-header"><div class="photo-box">${photo}</div><div><h1 class="cv-name">${esc(fullName||"Votre nom complet")}</h1><div class="cv-title">${esc(val("titre")||"Titre professionnel")}</div><div class="contacts">${contact()}</div></div></header>
 <div class="cv-grid"><main class="cv-main">${main}</main><aside class="cv-side">${side}</aside></div>
 </div>`;
}
function getData(){
 const basic={};["nom","postnom","prenom","titre","telephone","email","ville","adresse","naissance","lieuNaissance","nationalite","linkedin","profil","qualites","interets"].forEach(id=>basic[id]=val(id));
 return {...basic,state:{...state,photo:state.photo,template:state.template,color:state.color,font:state.font}};
}
function setData(d){
 ["nom","postnom","prenom","titre","telephone","email","ville","adresse","naissance","lieuNaissance","nationalite","linkedin","profil","qualites","interets"].forEach(id=>{if($(id))$(id).value=d[id]||""});
 Object.assign(state,d.state||{}); state.formations=state.formations||[];state.experiences=state.experiences||[];state.competences=state.competences||[];state.langues=state.langues||[];state.projets=state.projets||[];state.certifications=state.certifications||[];state.references=state.references||[];
 $("color").value=state.color;$("font").value=state.font;
 ["formation","experience","competence","langue","projet","certification","reference"].forEach(renderEditor);render()
}
$("saveBtn").onclick=()=>{localStorage.setItem("cvRdcMaker",JSON.stringify(getData()));toast("CV sauvegardé sur cet appareil")};
$("clearBtn").onclick=()=>{if(confirm("Effacer le CV actuel et recommencer ?")){localStorage.removeItem("cvRdcMaker");location.reload()}};
$("loadDemo").onclick=()=>setData({nom:"KABONGO",postnom:"MUKENDI",prenom:"Aline",titre:"Assistante administrative & Communication",telephone:"+243 97 000 00 00",email:"aline.kabongo@example.com",ville:"Kinshasa, RDC",adresse:"Gombe",naissance:"12/05/2001",lieuNaissance:"Kinshasa",nationalite:"Congolaise",profil:"Professionnelle dynamique et organisée, avec une expérience en administration, communication et gestion de projets. Habituée à travailler avec rigueur, discrétion et sens du service.",qualites:"Organisation, Ponctualité, Communication, Esprit d'équipe",interets:"Lecture, Musique, Bénévolat",state:{...state,formations:[{diplome:"Licence en Gestion",etablissement:"Université de Kinshasa",ville:"Kinshasa",debut:"2020",fin:"2023",description:"Formation en gestion et administration."}],experiences:[{poste:"Assistante administrative",entreprise:"Entreprise Exemple SARL",ville:"Kinshasa",debut:"2024",fin:"Aujourd'hui",description:"Gestion des dossiers, accueil, suivi administratif et préparation de rapports."}],competences:[{nom:"Microsoft Office",niveau:"Avancé"},{nom:"Communication",niveau:"Expert"},{nom:"Gestion administrative",niveau:"Avancé"}],langues:[{nom:"Français",niveau:"Courant"},{nom:"Lingala",niveau:"Langue maternelle"},{nom:"Anglais",niveau:"Intermédiaire"}],projets:[{nom:"Organisation d'un événement",role:"Coordinatrice",description:"Planification et coordination d'une activité professionnelle."}],certifications:[{nom:"Formation bureautique",organisme:"Centre de formation",annee:"2024"}],references:[],template:2,color:"#0b5d3b",font:"Inter"}});
$("printBtn").onclick=()=>window.print();
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");if(t.dataset.tab==="preview"){$(".preview-area").classList.add("show");document.querySelector(".editor").style.display="none"}else{$(".preview-area").classList.remove("show");document.querySelector(".editor").style.display="block"}});
const saved=localStorage.getItem("cvRdcMaker");if(saved){try{setData(JSON.parse(saved))}catch{render()}}else{["formation","experience","competence","langue","projet","certification","reference"].forEach(renderEditor);render()}
