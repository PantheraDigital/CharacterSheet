
//fill page
FillSkillBlock();
FillSavingThrowBlock();

UpdateAllValues();


//assign button funcs
//add event listners to stat inputs and set scores in statMap
document.querySelectorAll(".ability-score").forEach((element) => {
  element.addEventListener("input", function () {
    CheckInputValueInRange(element, 1, 30);
    const mod = document.getElementById("prof-bonus").value;
    UpdateStatMod(element.parentElement);
    UpdateSavingThrow(mod, document.getElementById(`${element.id.substring(0,3)}-save-prof`))
    UpdateSkill(mod);
    UpdateSpellStats(document.getElementById("prof-bonus").value);
  });
  if(element.id === "wisdom"){
    element.addEventListener("input", function () {
      UpdatePasivePerception();
    });
  }
});

//add event listener to proficiency bonus input
document.getElementById("prof-bonus").addEventListener("input", function (e) {
  CheckInputValueInRange(e.currentTarget, 2, 6);
  UpdatePasivePerception();
  UpdateSkill(e.currentTarget.value);
  UpdateSavingThrow(e.currentTarget.value);
  UpdateSpellStats(e.currentTarget.value);
});

//add event listeners to saving throws checkboxes
document.getElementById("saving-throws").querySelectorAll('input[type="checkbox"]').forEach((element) => {
  element.addEventListener("input", function () {
    UpdateSavingThrow(document.getElementById("prof-bonus").value, element);
  });
  
});

document.getElementById("skills").querySelectorAll('input[type="checkbox"]').forEach((element) => {
    element.addEventListener("input", function () {
      UpdateSkill(document.getElementById("prof-bonus").value, element);
    });
    element.addEventListener("dblclick", function(e){
      this.classList.add("double");
      e.currentTarget.checked = true;
      UpdateSkill(document.getElementById("prof-bonus").value, element);
    });
    element.addEventListener("change", function(e){
      if(!e.currentTarget.checked){
        this.classList.remove("double");
        UpdateSkill(document.getElementById("prof-bonus").value, element);
      }
    });
});

document.getElementById("passive-wisdom-prof").addEventListener("input", function(e){
  UpdatePasivePerception();
});

document.getElementById("spell-ability").addEventListener("input", function(e){
  UpdateSpellStats(document.getElementById("prof-bonus").value);
});

document.getElementById("layout-color").addEventListener("input", function(e){
  switch(e.currentTarget.value){
    case "bright":{
      document.body.style.setProperty("--main-BG-color", "white");
      document.body.style.setProperty("--input-BG-color", "aliceblue");
      document.body.style.setProperty("--input-color", "black");
      document.body.style.setProperty("--input-hover-outline-color", "black");
    }
    break;
    case "dark":{
      document.body.style.setProperty("--main-BG-color", "rgb(50,50,50)");
      document.body.style.setProperty("--input-BG-color", "rgb(65,65,65)");
      document.body.style.setProperty("--input-color", "gainsboro");
      document.body.style.setProperty("--input-hover-outline-color", "gainsboro");
    }
    break;
    case "beige":{
      document.body.style.setProperty("--main-BG-color", "antiquewhite");
      document.body.style.setProperty("--input-BG-color", "beige");
      document.body.style.setProperty("--input-color", "black");
      document.body.style.setProperty("--input-hover-outline-color", "black");
    }
    break;
  }
});


function UpdateSkill(profBonus, skillCheckbox = undefined){
  if(skillCheckbox){
    const skill = skillCheckbox.id.substring(0, skillCheckbox.id.length - 5);
    const mod = document.getElementById(`${skill}-mod`);
    const statMod = document.getElementById(FullStatNameFromPrefix(mod.parentElement.dataset.statType)).parentElement.querySelector(".stat-mod").innerText;
    let bonus = 0;
    if(skillCheckbox.classList.contains("double")){
      bonus = parseInt(profBonus) * 2;
    }else if(skillCheckbox.checked){
      bonus = parseInt(profBonus);
    }
    bonus += parseInt(statMod);
    mod.innerText = (bonus >= 0) ? (`+${bonus}`) : bonus;
  }else{
    //update all
    const skillInputList = document.getElementById("skills").querySelectorAll("input");
    for(const skillInput of skillInputList){
      UpdateSkill(profBonus, skillInput);
    }
  }
}
function UpdatePasivePerception(){
  const value = document.getElementById("passive-wisdom-val");
  const prof = document.getElementById("passive-wisdom-prof");
  const profBonus = document.getElementById("prof-bonus");
  const wisVal = parseInt(document.getElementById("wisdom").parentElement.querySelector(".stat-mod").innerText);
  value.value = 10 + wisVal + ((prof.checked) ? parseInt(profBonus.value) : 0);
}
function UpdateStatMod(statBox = undefined){
  if(statBox){
    const input = statBox.querySelector(".ability-score");
    const mod = statBox.querySelector(".stat-mod");
    const score = CalcStatMod(input.value);
    mod.innerText = (score >= 0) ? `+${score}` : score;
  }else{
    const stats = document.getElementById("ability-scores").querySelectorAll(".stat-box");
    for(const stat of stats){
      UpdateStatMod(stat);
    }
  }
}
function UpdateSavingThrow(profBonus, checkbox = undefined){
  if(checkbox){
    const skill = checkbox.id.substring(0,3);
    const mod = document.getElementById(`${skill}-save-mod`);
    let val = document.getElementById(FullStatNameFromPrefix(skill)).parentElement.querySelector(".stat-mod").innerText;
    val = parseInt(val);
    if(checkbox.checked){val += parseInt(profBonus);}
    mod.innerText = (val >= 0) ? (`+${val}`) : val;
  }else{
    const savingThrows = document.getElementById("saving-throws").querySelectorAll("input");
    for(const save of savingThrows){
      UpdateSavingThrow(profBonus, save);
    }
  }
}
function UpdateSpellStats(profBonus){
  const spellSave = document.getElementById("spell-save");
  const spellAttack = document.getElementById("spell-attack-mod");
  const spellAbility = document.getElementById("spell-ability-mod");
  const abilityMod = document.getElementById(FullStatNameFromPrefix(document.getElementById("spell-ability").value)).parentElement.querySelector(".stat-mod").innerText;
  spellSave.value = 8 + parseInt(abilityMod) + parseInt(profBonus);
  spellAttack.value = parseInt(abilityMod) + parseInt(profBonus);
  spellAbility.value = parseInt(abilityMod);
}
function UpdateAllValues(){
  const profBonus = document.getElementById("prof-bonus").value;
  UpdateStatMod();
  UpdateSkill(profBonus);
  UpdatePasivePerception();
  UpdateSavingThrow(profBonus);
  UpdateSpellStats(profBonus);
}


function CalcStatMod(score){
  return Math.floor((score - 10) / 2);
}

function CheckInputValueInRange(inputElement, min, max){
  if(inputElement.value > max){
    inputElement.value = max;
  }
  if(inputElement.value < min){
    inputElement.value = min;
  }
}

function FullStatNameFromPrefix(statPrefix){
  switch(statPrefix){
    case "str": return "strength";
    case "dex": return "dexterity";
    case "con": return "constitution";
    case "int": return "intelligence";
    case "wis": return "wisdom";
    case "cha": return "charisma";
    default: return "";
  }
}


//
// add elements to html
//
function FillSkillBlock(){
  var skillBlock = document.getElementById("skills");
  const skillNodeTemplate = document.getElementById("skill-template").cloneNode(true);
  const skills = ["acrobatics_dexterity", "animal-handling_wisdom", "arcana_intelligence",
                  "athletics_strength", "deception_charisma", "history_intelligence", 
                  "insight_wisdom", "intimidation_charisma", "investigation_intelligence", 
                  "medicine_wisdom", "nature_intelligence", "perception_wisdom", 
                  "performance_charisma", "persuasion_charisma", "religion_intelligence", 
                  "sleight-of-hand_dexterity", "stealth_dexterity", "survival_wisdom"];

  for(var i = skills.length - 1; i >= 0; i--){
    const skillInput = skillNodeTemplate.content.children[0].cloneNode(true);
    const skillLabel = skillNodeTemplate.content.children[1].cloneNode(true);
    const skillDataPair = skills[i].split("_");

    skillInput.id = `${skillDataPair[0]}-prof`;

    skillLabel.htmlFor = `${skillDataPair[0]}-prof`;
    skillLabel.setAttribute("data-stat-type", skillDataPair[1].substring(0,3));
    
    const spans = skillLabel.querySelectorAll("span");
    spans[0].id = `${skillDataPair[0]}-mod`;
    spans[1].innerText = `${skillDataPair[0].replace(/-/g, " ")}`;
    spans[2].innerText = `(${skillDataPair[1].substring(0,3)})`;
    spans[2].style = `--color:${window.getComputedStyle(document.getElementById(skillDataPair[1])).getPropertyValue("--color")}`;
    
    skillBlock.insertBefore(document.createElement("br"), skillBlock.firstChild);
    skillBlock.insertBefore(skillLabel, skillBlock.firstChild);
    skillBlock.insertBefore(skillInput, skillBlock.firstChild);
  }
}
function FillSavingThrowBlock(){
  const savingThrowBlock = document.getElementById("saving-throws");
  const saveNodeTemplate = document.getElementById("saving-throw-template").cloneNode(true);
  const saves = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  for(var i = saves.length - 1; i >= 0; i--){
    const saveInput = saveNodeTemplate.content.children[0].cloneNode(true);
    const saveLabel = saveNodeTemplate.content.children[1].cloneNode(true);
    const abilityShort = saves[i].substring(0, 3);

    
    saveInput.id = abilityShort + "-save-prof";
  
    saveLabel.htmlFor = abilityShort + "-save-prof";

    const abilityColor = window.getComputedStyle(document.getElementById(saves[i])).getPropertyValue("--color");
    const spans = saveLabel.querySelectorAll("span");
    spans[0].id = `${abilityShort}-save-mod`;
    spans[1].innerText = `${saves[i]}`;
    spans[1].style.textDecoration = `underline ${abilityColor}`;

    savingThrowBlock.insertBefore(document.createElement("br"), savingThrowBlock.firstChild);
    savingThrowBlock.insertBefore(saveLabel, savingThrowBlock.firstChild);
    savingThrowBlock.insertBefore(saveInput, savingThrowBlock.firstChild);
  }
}


document.getElementById("traits").parentElement.querySelector('input[value="+"]').addEventListener("click", function (e) {
  const ddelm = CreateTraitElement();
  document.getElementById("traits").appendChild(ddelm);
});

function CreateTraitElement({dropGroup="traits", title="Name", body="Description"}={}){
  let ddelm = null;

  //handle old format
  if(arguments.length > 0){
    if("charges" in arguments[0]){
      const ticks = Array(arguments[0]["charges"]).fill(true);
      if(arguments[0]["expended"] > 0){
        let expendedCount = 0;
        ticks.forEach((tick)=>{
          tick = false;
          expendedCount += 1;
          if(expendedCount === arguments[0]["expended"]){return;}
        });
      }
      const bodyTemplate = document.getElementById("editable-text-template").content.children[0].cloneNode(true);
      bodyTemplate.setAttribute("name", "description");
      bodyTemplate.innerText = arguments[0]["description"];
      ddelm = CreateDragAndDropElement(
        {dropGroup: dropGroup, title: arguments[0]["name"], body: bodyTemplate, ticks:ticks}
      );
    }else{
      if(!body.includes('contenteditable="true"')){
        const bodyTemplate = document.getElementById("editable-text-template").content.children[0].cloneNode(true);
        bodyTemplate.setAttribute("name", "description");
        bodyTemplate.innerText = body;
        body = bodyTemplate;
      }
      ddelm = CreateDragAndDropElement(arguments[0]);
    }
  }else{
    const bodyTemplate = document.getElementById("editable-text-template").content.children[0].cloneNode(true);
    bodyTemplate.setAttribute("name", "description");
    bodyTemplate.innerText = "Description";
    ddelm = CreateDragAndDropElement({dropGroup:dropGroup, title:title, body:bodyTemplate});
  }

  DDActivate(ddelm);
  RegisterMouseAndTouchEvent(ddelm.querySelector("[name='remove-self']"), function (e) {
    e.preventDefault();
    if (e.type == "mouseup" && e.button != 0) { return; }
    ddelm.remove();
  });
  ddelm.querySelector("[name='description']").addEventListener("focus", function (e) { e.currentTarget.spellcheck = true; });
  ddelm.querySelector("[name='description']").addEventListener("blur", function (e) { e.currentTarget.spellcheck = false; });
  return ddelm;
}


// problems with different name usage
function CreateSpell({dropGroup="spells", title="Spell Name", body="Description", readyTick=false}={}){
  let ddelm = null;
  const bodyTable = document.getElementById("spell-table-template").content.children[0].cloneNode(true);
  let trueBody = bodyTable;

  if(arguments.length > 0){
    if(!body.includes('contenteditable="true"')){
      const bodyTemplate = document.getElementById("editable-text-template").content.children[0].cloneNode(true);
      bodyTemplate.setAttribute("name", "description");
      bodyTemplate.innerHTML = body;
      trueBody = [bodyTable, bodyTemplate];
    }else{
      trueBody = [bodyTable, body]
    }
    bodyTable.querySelector("[name='lv']").value = arguments[0].lv;
    bodyTable.querySelector("[name='cast-time']").value = arguments[0]["cast-time"];
    bodyTable.querySelector("[name='range']").value = arguments[0].range;
    bodyTable.querySelector("[name='duration']").value = arguments[0].duration;
    bodyTable.querySelector("[name='components']").value = arguments[0].components;
    arguments[0].body = trueBody;
    ddelm = CreateDragAndDropElement(arguments[0]);
  }else{
    const bodyTemplate = document.getElementById("editable-text-template").content.children[0].cloneNode(true);
    bodyTemplate.setAttribute("name", "description");
    bodyTemplate.innerHTML = "Description";
    trueBody = [bodyTable, bodyTemplate];
    ddelm = CreateDragAndDropElement({dropGroup:dropGroup, title:title, readyTick:readyTick, body:trueBody});
  }


  DDActivate(ddelm);
  RegisterMouseAndTouchEvent(ddelm.querySelector("input[name='remove-self']"), function(e){
    e.preventDefault();
    if(e.type == "mouseup" && e.button != 0){ return; }
    
    ddelm.remove();
  });
  return ddelm;
}
function CreateSpellSlotTracker(lv, slots, numChecked = 0){
  const newSlot = document.getElementById("spell-slot-tracker-template").content.children[0].cloneNode(true);
  const slotBlock = newSlot.querySelector("[name='spell-slot-tracker']");

  newSlot.querySelector("[name='spell-slot-lv']").innerText = `LV-${lv}`;
  newSlot.querySelector(".spinner").id = `lv${lv}_${newSlot.querySelector(".spinner").id}`;
  slotBlock.id = `lv${lv}_${newSlot.querySelector("[name='spell-slot-tracker']").id}`;

  for(let i = 0; i < slots; i++){
    if(i === 0){
      if(numChecked > 0){
        slotBlock.querySelector("[name='slot']").checked = true;
      }
    }else{
      if(numChecked > i){
        slotBlock.appendChild(CreateSpellSlot(true));
      }else{
        slotBlock.appendChild(CreateSpellSlot());
      }
    }
  }

  RegisterMouseAndTouchEvent(newSlot.querySelector("[name='add-slot']"), function(e){
    e.preventDefault();
    if(e.type == "mouseup" && e.button != 0){ return; }

    const target = e.currentTarget.parentElement.parentElement;
    target.querySelector("[name='spell-slot-tracker']").appendChild(CreateSpellSlot());

    const removeButton = e.currentTarget.parentElement.querySelector("[name='remove-slot']");
    if(removeButton.disabled){removeButton.disabled = false;}
  });
  RegisterMouseAndTouchEvent(newSlot.querySelector("[name='remove-slot']"), function(e){
    e.preventDefault();
    if(e.type == "mouseup" && e.button != 0){ return; }

    const target = e.currentTarget.parentElement.parentElement;
    const slots = target.querySelectorAll("[name='slot']");

    if(slots.length <= 1){
      e.currentTarget.disabled = true;
      return;
    }

    target.querySelector("[name='spell-slot-tracker']").removeChild(slots.item(slots.length - 1));
  });

  return newSlot;
}
function CreateSpellSlot(checked = false){
  const add = document.createElement("input");
  add.type = "checkbox";
  add.name = "slot";
  if(checked){add.checked = true;}
  return add;
}

function RegisterSpecificMouseAndTouchEvent(elmnt, mouseEvent, touchEvent, fnctn) {
  if (elmnt !== null) {
    elmnt.addEventListener(mouseEvent, fnctn);
    elmnt.addEventListener(touchEvent, fnctn);
  }
}
function RegisterMouseAndTouchEvent(elmnt, fnctn) {
  if (elmnt !== null) {
    elmnt.addEventListener("mouseup", fnctn);
    elmnt.addEventListener("touchend", fnctn);
  }
}


RegisterMouseAndTouchEvent(document.getElementById("spell-list").parentElement.querySelector("input"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  document.getElementById("spell-list").appendChild(CreateSpell());
});
RegisterMouseAndTouchEvent(document.getElementById("sorcery-point-reset-button"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  document.getElementById("sorcery-current-points").value = document.getElementById("sorcery-points").value;
});

RegisterMouseAndTouchEvent(document.getElementById("spell-slot-level-count-spinner").querySelector("[name='add-spell']"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }

  const slotBlock = document.getElementById('spell-slot-block');
  const slots = slotBlock.querySelectorAll("[name='spell-slot-tracker-wrapper']");

  slotBlock.appendChild(CreateSpellSlotTracker(slots.length + 1, 1));
  if(slots.length + 1 === 9){e.currentTarget.disabled = true;}

  let removeButton = document.getElementById("spell-slot-level-count-spinner").querySelector("[name='remove-spell']");
  if(removeButton.disabled) {removeButton.disabled = false;}
});
RegisterMouseAndTouchEvent(document.getElementById("spell-slot-level-count-spinner").querySelector("[name='remove-spell']"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  
  const slotBlock = document.getElementById('spell-slot-block');
  const slots = slotBlock.querySelectorAll("[name='spell-slot-tracker-wrapper']");
  slotBlock.removeChild(slots.item(slots.length - 1));

  let addButton = slotBlock.querySelector("[name='add-spell']");
  if(addButton.disabled) {addButton.disabled = false;}

  if(slots.length === 1){e.currentTarget.disabled = true;}
});


RegisterMouseAndTouchEvent(document.getElementById("activate-spellhub-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  
  ActivateSpellHub();
  document.getElementById("main-article").style.display = "none";
});



//
//save / load
//
document.addEventListener("visibilitychange", (event) => {
  if(document.hidden){
    SaveSheet();
    localStorage.setItem("sheet", JSON.stringify(data));
  }
});
RegisterMouseAndTouchEvent(document.getElementById("download-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  SaveSheet();
  const name = data.name.trim().replaceAll(" ", "-");
  download(JSON.stringify(data), `DnDSheet-${name}`, "txt");
});

/*
RegisterMouseAndTouchEvent(document.getElementById("save-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  SaveSheet();
  localStorage.setItem("sheet", JSON.stringify(data));
});
RegisterMouseAndTouchEvent(document.getElementById("load-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  LoadData(JSON.parse(localStorage.getItem("sheet")));
  UpdateAllValues();
});
*/


//File System Access API https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
//FileSaver.js
function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"), url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}

document.getElementById("load-file").addEventListener("change", HandleFiles, false);
function HandleFiles(){
  let fileReader = new FileReader();
  fileReader.readAsText(this.files[0], "UTF-8");
  fileReader.onload = function(fileLoadedEvent){
    try {  
      LoadData(JSON.parse(fileReader.result));
      UpdateAllValues();
    } catch (e) {  
      console.log('invalid json');
    }
  };
};

function SaveSheet(){
  const savingThrowBlock = document.getElementById("saving-throws").getElementsByTagName("input");
  data["saving-throws"] = [];
  for(let i = 0; i < savingThrowBlock.length; i++){
    if(savingThrowBlock[i].checked){
      data["saving-throws"].push(savingThrowBlock[i].id.substring(0,3));
    }
  }

  const skillsBlock = document.getElementById("skills").getElementsByTagName("input");
  data["skills"] = [];
  for(const skill of skillsBlock){
    if(skill.checked){
      if(skill.classList.contains("double")){
        data["skills"].push(`${skill.id.substring(0, skill.id.length - 5)}_expert`);
      }else{
        data["skills"].push(skill.id.substring(0, skill.id.length - 5));
      }
    }
  }

  emptySpells();
  const spellSlotTracker = document.getElementById("spell-slot-block").querySelectorAll("[name='spell-slot-tracker']");
  for(let i = 0; i < spellSlotTracker.length; i++){
    const spellLV = spellSlotTracker[i].id.split("_")[0][2];
    const uses = handleTicks(spellSlotTracker[i]);
    data.spells[spellLV].slots = uses.split('/')[1];
    data.spells[spellLV].expended = uses.split('/')[0];
  }

  const spellList = document.getElementById("spell-list").querySelectorAll(".draggable");
  for(let i = 0; i < spellList.length; i++){
    const spellLV = spellList[i].querySelector("[name='lv']").value;
    if(spellLV){
      const spellData = 
        { lv:spellLV,  
          "cast-time":spellList[i].querySelector("[name='cast-time']").value, 
          range:spellList[i].querySelector("[name='range']").value, 
          duration:spellList[i].querySelector("[name='duration']").value, 
          components:spellList[i].querySelector("[name='components']").value};

      const tempElm = spellList[i].cloneNode(true);
      tempElm.querySelector("table").remove();
      Object.assign(spellData, DragAndDropToJSON(tempElm));

      if(spellLV === "cantrips" || spellLV === "---"){ 
        data.spells.cantrips.push(spellData); 
      }else{
        data.spells[spellLV].spells.push(spellData);
      }
    }
  }

  const passiveWisdom = document.getElementById("passive-wisdom-prof").checked;
  data["passive-wisdom"] = passiveWisdom;
  
  for(const key in data){
    const element = document.getElementById(key);
    if(element){

      if(element.id === "traits"){
        data.traits = [];
        const traits = element.getElementsByClassName("draggable");
        for(const trait of traits){
          data.traits.push(DragAndDropToJSON(trait));
        }
        continue;
      }

      switch(element.dataset.inputType){
        case "number":
          data[key] = element.value;
          break;

        case "string":
          data[key] = element.value;
          break;

        case "editable-div":
          data[key] = element.innerHTML;
          break;

        case "checkbox":
          data[key] = element.checked;
          break;

        case "string-select":
          data[key] = element.value;
          break;

        case "ticks":
          data[key] = handleTicks(element);
          break;
      }
    }
  }

  function handleTicks(element){
    let max = 0;
    let active = 0;
    element.querySelectorAll('input[type="checkbox"]').forEach((tick) => {
      max++;
      if(tick.checked) { active++; }
    });
    return `${active}/${max}`;
  }
  function emptySpells(){
    for(const key in data.spells){
      if(key === "cantrips"){
        data.spells[key] = [];
      }else{
        data.spells[key].spells = [];
        data.spells[key].slots = 0;
        data.spells[key].expended = 0;
      }
    }
  }
  console.log(data);
}

function LoadData(sheetData){
  console.log(sheetData);
  Object.assign(data, sheetData);
  for(const key in sheetData){
    switch(key){
      case "passive-wisdom":{
        if(sheetData[key] === true){
          const element = document.getElementById("passive-wisdom-prof");
          element.checked = true;
        }
        break;
      }
      case "traits":{
        const traitList = document.getElementById("traits");
        clearChildren(traitList, ".draggable");
        for(const trait of data["traits"]){
          traitList.appendChild(CreateTraitElement(trait));
        }
        break;
      }
      case "spells":{
        //spells and slots
        const spellList = document.getElementById("spell-list");
        const spellSlotTracker = document.getElementById("spell-slot-block");
        const removeSlotButton = document.getElementById("spell-slot-level-count-spinner").querySelector("[name='remove-spell']");
        const spellDataList = data.spells;
        clearChildren(spellList, ".draggable");
        clearChildren(spellSlotTracker, "[name='spell-slot-tracker-wrapper']");

        for(const spellKey in spellDataList){
          if(spellDataList[spellKey].hasOwnProperty("spells")){
            if(spellDataList[spellKey].slots > 0){
              spellSlotTracker.appendChild(CreateSpellSlotTracker(spellKey, spellDataList[spellKey].slots, spellDataList[spellKey].expended));
              if(removeSlotButton.disabled){removeSlotButton.disabled = false;}
            }
            for(const spell of spellDataList[spellKey]["spells"]){
              if("name" in spell){spell.title = spell.name;}
              if("description" in spell){spell.body = spell.description;}
              if("ready" in spell){spell.readyTick = spell.ready;}
              spellList.appendChild(CreateSpell(spell));
            }
          }else{//cantrips
            for(const cantrip of spellDataList[spellKey]){
              if("name" in cantrip){cantrip.title = cantrip.name;}
              if("description" in cantrip){cantrip.body = cantrip.description;}
              spellList.appendChild(CreateSpell(cantrip));
            }
          }
        }
        break;
      }
      case "skills":{
        //expertise check
        for(const skill of data["skills"]){
          const skillData = skill.split("_");
          const checkbox = document.getElementById(`${skillData[0]}-prof`);
          if(checkbox){
            checkbox.checked = true;
            if(skillData[1]){
              checkbox.classList.add("double");
            }
          }
        }
        break;
      }
      case "saving-throws":{
        for(const save of data["saving-throws"]){
          const checkbox = document.getElementById(`${save.substring(0,3)}-save-prof`);
          if(checkbox){
            checkbox.checked = true;
          }
        }
        break;
      }
        
      default:
        break;
    }

    const element = document.getElementById(key);
    if(element){
      switch(element.dataset.inputType){
        case "number":
          element.value = data[key];
          break;

        case "string":
          element.value = data[key];
          break;

        case "editable-div":
          element.innerHTML = data[key];
          break;

        case "checkbox":
          element.checked = data[key];
          break;

        case "string-select":
          element.value = data[key];
          break;

        case "ticks":
          handleTicks(element, data[key]);
          break;
      }
    }

  }

  function handleTicks(element, values){
    let max = values.split("/")[1];
    let active = values.split("/")[0];
    clearChildren(element);
    for(let i = 0; i < max; i++){
      let check = document.createElement("input");
      check.type = "checkbox";
      if(i < active){check.checked = true;}
      element.appendChild(check);
    }
  }
  function clearChildren(element, querySelector = undefined){
    if(querySelector){
      let child = element.querySelector(querySelector);
      while(child){
        element.removeChild(child);
        child = element.querySelector(querySelector);
      }
    }else{
      while (element.firstChild) {
        element.removeChild(element.lastChild);
      }
    }
  }
}

let data = {
  "name": "",
  "race": "",
  "class": "",
  "background": "",
  "level": 0,
  "xp": 0,
  "alignment": "",
  "hit-dice": "",

  "strength": 10,
  "dexterity": 10,
  "constitution": 10,
  "intelligence": 10,
  "wisdom": 10,
  "charisma": 10,

  "prof-bonus": 2,
  "prof-armor": "",
  "prof-weapons": "",
  "prof-tools": "",
  "prof-languages": "",
  "saving-throws": [],
  "skills": [],
  
  "hp-current": 0,
  "hp-max": 0,
  "hp-temp": 0,

  "death-saves-successes": 0,
  "death-saves-failures": 0,

  "inspiration": 0,
  "passive-wisdom": 0,

  "armor-class": 0,
  "initiative": 0,
  "speed": 0,

  "equipment": "",
  "equipped": "",
  "player-notes": "",

  "money-cp": 0,
  "money-sp": 0,
  "money-ep": 0,
  "money-gp": 0,
  "money-pp": 0,

  "traits": [
    {
      "name": "Ability Name",
      "description": "Ability Description",
      "charges": 0,
      "expended": 0
    }
  ],

  "spell-save": 0,
  "spell-attack-mod": 0,
  "spell-ability": "",

  "sorcery-points": 0,
  "sorcery-current-points": 0,

  "spells":{
    "cantrips": [
    ],
    "1":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "2":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "3":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "4":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "5":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "6":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "7":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "8":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    },
    "9":{
      "slots": 0,
      "expended": 0, 
      "spells": []
    }
  }
};