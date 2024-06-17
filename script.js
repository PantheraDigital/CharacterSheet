"use strict";
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
  const abilityMod = document.getElementById(FullStatNameFromPrefix(document.getElementById("spell-ability").value)).parentElement.querySelector(".stat-mod").innerText;
  spellSave.value = 8 + parseInt(abilityMod) + parseInt(profBonus);
  spellAttack.value = parseInt(abilityMod) + parseInt(profBonus);
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

//
//drop downs
//
function FoldTraitDropdown(wrapper){
  let body = wrapper.querySelector(".dropdown-body");
  let spn = wrapper.querySelector(".dropdown-header").querySelector("span");

  if (spn.innerHTML == "-")
    spn.innerHTML = "+";
  else
    spn.innerHTML = "-";

  if(body.classList.contains("folded-body")){
    body.classList.remove("folded-body");
    body.querySelector("[name='trait-desc']").contentEditable = true;
  }
  else if(body.classList.contains("folded-body-small")){
    body.classList.remove("folded-body-small");
    body.querySelector("[name='trait-desc']").contentEditable = true;
  }
  else{
    body.querySelector("[name='trait-desc']").contentEditable = false;
    if(body.querySelector("ul").getElementsByTagName("li").length > 0){
      body.classList.add("folded-body");
    }
    else{
      body.classList.add("folded-body-small");
    }
  }
}

function AddBubleCheckToTrait(wrapper, checked = false){
  //<li><input type="checkbox" class="buble-check"/></li>
  let check = document.createElement("input");
  check.type = "checkbox";
  check.name = "ability-tracker-buble";
  check.className = "buble-check";
  check.checked = checked;

  let li = document.createElement("li");
  li.appendChild(check);
  li.style.display = "inline-block";

  let body = wrapper.querySelector(".dropdown-body");
  body.querySelector("ul").appendChild(li);
  if(body.classList.contains("folded-body-small")){
    body.classList.remove("folded-body-small");
    body.classList.add("folded-body");
  }
}

function RemoveBubleCheckFromTrait(wrapper){
  let body = wrapper.querySelector(".dropdown-body");
  let ul = body.querySelector("ul");
  if(ul && ul.lastChild){ ul.removeChild(ul.lastChild); }
  if(ul.getElementsByTagName("li").length <= 0){
    if(body.classList.contains("folded-body")){
      body.classList.add("folded-body-small");
      body.classList.remove("folded-body");
    }
  }
}


document.getElementById("traits").querySelector('input[value="+"]').addEventListener("click", function (e) {
    e.currentTarget.parentElement.appendChild(CreateTraitDropDown());
  });

function CreateTraitDropDown(traitData = undefined){
    const trait = document.getElementById("trait-template").content.children[0].cloneNode(true);

    if(traitData){
      trait.querySelector("[name='ability-name']").value = traitData.name;
      trait.querySelector("[name='trait-desc']").innerHTML = traitData.description;
      const chargeList = trait.querySelector(".ability-uses");
      const chargeCheckbox = chargeList.querySelector("li").cloneNode(true);
      while (chargeList.firstChild) {
        chargeList.removeChild(chargeList.lastChild);
      }
      for(let i = 0; i < traitData.charges; i++){
        const node = chargeCheckbox.cloneNode(true);
        chargeList.appendChild(node);
        if(i < traitData.expended){node.querySelector("input").checked = true};
      }
      FoldTraitDropdown(trait);
    }

    RegisterMouseAndTouchEvent(trait.querySelector("span"), function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      FoldTraitDropdown(trait);
    });

    RegisterMouseAndTouchEvent(trait.querySelector("[name='add-check']"), function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      AddBubleCheckToTrait(trait);
    });
    
    RegisterMouseAndTouchEvent(trait.querySelector("[name='remove-check']"), function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      RemoveBubleCheckFromTrait(trait);
    });

    RegisterMouseAndTouchEvent(trait.querySelector("[name='remove-dropdown']"), function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      e.currentTarget.parentElement.parentElement.remove();
    });
    
    trait.querySelector("[name='trait-desc']").addEventListener("focus", function (e) {e.currentTarget.spellcheck = true;});
    trait.querySelector("[name='trait-desc']").addEventListener("blur", function (e) {e.currentTarget.spellcheck = false;});

    return trait;
}

function LoadTraitDropDowns(){
  let dropdownCol = document.getElementById("traits").getElementsByClassName("dropdown-wrapper");
  if(dropdownCol.length > 0){
    for(let i = dropdownCol.length - 1; i >= 0; i--){
      dropdownCol.item(i).remove();
    }
  }

  for(const trait of data.traits){
    let dropdown = CreateTraitDropDown();
    dropdown.querySelector(".dropdown-header").querySelector('[name="ability-name"]').innerText = trait.name;
    dropdown.querySelector(".dropdown-body").querySelector('[name="trait-desc"]').innerHTML = trait.description;

    for(let i = 0; i < trait.charges; i++){
      AddBubleCheckToTrait(dropdown, (i < trait.expended));
    }
    document.getElementById("traits").appendChild(dropdown);
  }
}


function CreateSpell(spellData = undefined){
  const spell = document.getElementById("spell-template").content.children[0].cloneNode(true);

  if(spellData){
    spell.querySelector("[name='name']").value = spellData.name;
    spell.querySelector("[name='lv']").value = spellData.lv;
    spell.querySelector("[name='ready']").checked = spellData.ready;
    spell.querySelector("[name='cast-time']").value = spellData["cast-time"];
    spell.querySelector("[name='range']").value = spellData.range;
    spell.querySelector("[name='duration']").value = spellData.duration;
    spell.querySelector("[name='target']").value = spellData.target;
    spell.querySelector("[name='components']").value = spellData.components;
    spell.querySelector("[name='description']").innerHTML = spellData.description;
  }

  RegisterMouseAndTouchEvent(spell.querySelector("input[name='remove-spell']"), function(e){
    e.preventDefault();
    if(e.type == "mouseup" && e.button != 0){ return; }
    
    e.currentTarget.parentElement.remove();
  });
  return spell;
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


RegisterMouseAndTouchEvent(document.getElementById("spell-list").querySelector("input"), function(e){
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


// update data 30s after user interacts with page
// resets countdown on new input
let saveTimeoutID;
RegisterMouseAndTouchEvent(document.body, function(e){
  if(e.type == "mouseup" && e.button != 0){ return; }
  if(saveTimeoutID){ clearTimeout(saveTimeoutID); }
  saveTimeoutID = setTimeout(SaveSheet, 10000);
});


//
//save / load
//
RegisterMouseAndTouchEvent(document.getElementById("save-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  setTimeout(function(){clearTimeout(saveTimeoutID);}, 5000);
  SaveSheet();
  localStorage.setItem("sheet", JSON.stringify(data));
});
RegisterMouseAndTouchEvent(document.getElementById("clear-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  setTimeout(function(){clearTimeout(saveTimeoutID);}, 5000);
  localStorage.clear();
  window.location.reload();
});
RegisterMouseAndTouchEvent(document.getElementById("download-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  setTimeout(function(){clearTimeout(saveTimeoutID);}, 5000);
  SaveSheet();
  download(JSON.stringify(data), "character-stats", "txt");
});
RegisterMouseAndTouchEvent(document.getElementById("load-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  setTimeout(function(){clearTimeout(saveTimeoutID);}, 5000);
  LoadData(JSON.parse(localStorage.getItem("sheet")));
  UpdateAllValues();
});

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

  const spellList = document.getElementById("spell-list").querySelectorAll("[name='spell']");
  for(let i = 0; i < spellList.length; i++){
    const spellData = {name:"", lv:"", ready:false, "cast-time":"", range:"", duration:"", target:"", components:"", description:""};
    for(const key in spellData){
      if(key === "description"){
        spellData[key] = spellList[i].querySelector(`[name='${key}']`).innerHTML;
      }else if(key === "ready"){
        spellData[key] = spellList[i].querySelector(`[name='${key}']`).checked;
      }else{
        spellData[key] = spellList[i].querySelector(`[name='${key}']`).value;
      }
    }

    if(spellData.lv === "cantrips" || spellData.lv === "---"){ 
      data.spells.cantrips.push(spellData); 
    }else{
      data.spells[spellData.lv].spells.push(spellData);
    }
  }

  const passiveWisdom = document.getElementById("passive-wisdom-prof").checked;
  data["passive-wisdom"] = passiveWisdom;
  
  for(const key in data){
    const element = document.getElementById(key);
    if(element){

      if(element.id === "traits"){
        data.traits = [];
        const traits = element.getElementsByClassName("dropdown-wrapper");
        for(let i = 0; i < traits.length; i++){
          let trait = {name: "", description: "", charges: 0, expended: 0};
          trait.name = traits[i].querySelector("[name='ability-name']").value;
          trait.description = traits[i].querySelector("[name='trait-desc']").innerHTML;
          let charges = handleTicks(traits[i].querySelector(".ability-uses"));
          trait.charges = parseInt(charges.split('/')[1]);
          trait.expended = parseInt(charges.split('/')[0]);

          data.traits.push(trait);
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
  data = sheetData;
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
        clearChildren(traitList, ".dropdown-wrapper");
        for(const trait of data["traits"]){
          traitList.appendChild(CreateTraitDropDown(trait));
        }
        break;
      }
      case "spells":{
        //spells and slots
        const spellList = document.getElementById("spell-list");
        const spellSlotTracker = document.getElementById("spell-slot-block");
        const removeSlotButton = document.getElementById("spell-slot-level-count-spinner").querySelector("[name='remove-spell']");
        const spellDataList = data.spells;
        clearChildren(spellList, "[name='spell']");
        clearChildren(spellSlotTracker, "[name='spell-slot-tracker-wrapper']");

        for(const spellKey in spellDataList){
          if(spellDataList[spellKey].hasOwnProperty("spells")){
            if(spellDataList[spellKey].slots > 0){
              spellSlotTracker.appendChild(CreateSpellSlotTracker(spellKey, spellDataList[spellKey].slots, spellDataList[spellKey].expended));
              if(removeSlotButton.disabled){removeSlotButton.disabled = false;}
            }
            for(const spell of spellDataList[spellKey]["spells"]){
              spellList.appendChild(CreateSpell(spell));
            }
          }else{//cantrips
            for(const cantrip of spellDataList[spellKey]){
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
  "name": "Aelarion Brightwing",
  "race": "Elf",
  "class": "Ranger",
  "background": "Outlander",
  "level": 1,
  "xp": 0,
  "alignment": "Chaotic Good",
  "hit-dice": "",

  "strength": 10,
  "dexterity": 14,
  "constitution": 12,
  "intelligence": 10,
  "wisdom": 15,
  "charisma": 13,

  "prof-bonus": 2,
  "prof-armor": "",
  "prof-weapons": "",
  "prof-tools": "",
  "prof-languages": "",
  "saving-throws": ["strength", "dexterity"],
  "skills": ["athletics", "stealth", "survival"],
  
  "hp-current": 8,
  "hp-max": 8,
  "hp-temp": 0,

  "death-saves-successes": 0,
  "death-saves-failures": 0,

  "inspiration": 0,
  "passive-wisdom": 0,

  "armor-class": 13,
  "initiative": 2,
  "speed": 30,

  "equipment": "",

  "money-cp": 50,
  "money-sp": 0,
  "money-ep": 0,
  "money-gp": 50,
  "money-pp": 0,

  "traits": [
    {
      "name": "Ability Name",
      "description": "Ability Description",
      "charges": 2,
      "expended": 0
    }
  ],

  "spell-save": 8,
  "spell-attack-mod": 8,
  "spell-ability": "",

  "sorcery-points": 0,
  "sorcery-current-points": 0,

  "spells":{
    "cantrips": [
    ],
    "1":{
      "slots": 2,
      "expended": 1, 
      "spells": [
      ]
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