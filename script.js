const characterStats = {
  name: "",
  race: "",
  alignment: "",
  background: "",
  xp: 0,
  "class and level": "",

  "ability score": {
    strength: {
      value: 11,
      mod: 0,
      save: false,
      skills: {//skill name, proficient
        "athletics": false
      }
    },
    dexterity: {
      value: 11,
      mod: 0,
      save: false,
      skills: {
        "acrobatics": false,
        "sleight of hand": false,
        "stealth": false
      }
    },
    constitution: {
      value: 11,
      mod: 0,
      save: false,
      skills: {}
    },
    intelligence: {
      value: 11,
      mod: 0,
      save: false,
      skills: {
        "arcana": false,
        "history": false,
        "investigation": false,
        "nature": false,
        "religion": false
      }
    },
    wisdom: {
      value: 11,
      mod: 0,
      save: false,
      skills: {
        "animal handling": false,
        "insight": false,
        "medicine": false,
        "perception": false,
        "survival": false
      }
    },
    charisma: {
      value: 11,
      mod: 0,
      save: false,
      skills: {
        "deception": false,
        "intimidation": false,
        "performance": false,
        "persuasion": false
      }
    }
  },
  

  "proficiency bonus": 2,

  inspiration: 0,
  "passive wisdom": 0,

  "armor class": 0,
  initiative: 0,
  speed: 0,
  "max hp": 0,
  "current hp": 0,
  "temp hp": 0,
  "death saves": "",

  "other proficiencies": "",

  inventory: {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
    items: ""
  },

  attacks: [
    {
      weapon: "Unarmed Strike",
      range: "5ft",
      proficient: true,//add prof bonus to bonus to hit
      bonus: "str",
      damage: "1 + str",
      notes: "An attack made with any body part. You are automatically proficient in this attack."
    }
  ],

  traits: [
    {
      name: "Ability Name",
      description: "Ability Description",
      charges: 2,
      expended: 0
    }
  ],

  notes: ""
}
//load obj

//fill page
FillSkillBlock();
FillSavingThrowBlock();

//load obj values
LoadAbilities();
LoadSavingThrows();
LoadSkills();
LoadTraitDropDowns();

//assign button funcs
//add event listners to stat inputs and set scores in statMap
document.querySelectorAll(".stat-box").forEach((element) => {
  element.addEventListener("input", function () {
    let abilityScore = element.querySelector(".ability-score");
    let abilityID = FullStatNameFromPrefix(abilityScore.id);
    let abilityObj = characterStats["ability score"][abilityID];
    CheckInputValueInRange(abilityScore, 1, 30);
    //change value
    abilityObj.value = Number(abilityScore.value);

    //update mod
    abilityObj.mod = CalcStatMod(abilityScore.value);
    element.querySelector(".stat-mod").innerText = (abilityObj.mod >= 0) ? ("+" + abilityObj.mod) : abilityObj.mod;

    //update saving throw val
    let saveProf = document.getElementById(`${abilityScore.id}-save-prof`).checked;
    let saveBonus = saveProf ? abilityObj.mod + characterStats["proficiency bonus"] : abilityObj.mod;
    document.getElementById(`${abilityScore.id}-save-mod`).innerText = (saveBonus >= 0) ? ('+' + saveBonus) : saveBonus;
    abilityObj.save = saveProf;

    //update skill vals
    for(const skill in abilityObj.skills){
      let skillID = skill.split(" ").join("-");
      let skillProf = document.getElementById(`${skillID}-prof`).checked;
      let skillBonus = skillProf ? abilityObj.mod + characterStats["proficiency bonus"] : abilityObj.mod;
      abilityObj.skills[skill] = skillProf;
      document.getElementById(`${skillID}-mod`).innerText = (skillBonus >= 0) ? ('+' + skillBonus) : skillBonus;
    }
  });
  
});

//add event listener to proficiency bonus input
document.getElementById("prof").addEventListener("input", function (e) {
  CheckInputValueInRange(e.currentTarget, 2, 6);
  //UpdateProfBonus(e);
  characterStats["proficiency bonus"] = Number(e.currentTarget.value);
  //UpdateSavingThrows("all");
  for(const save in characterStats["ability score"]){
    let saveID = save.substring(0,3);
    let saveObj = characterStats["ability score"][save];
    let saveBonus = saveObj.save ? saveObj.mod + characterStats["proficiency bonus"] : saveObj.mod;
    document.getElementById(`${saveID}-save-mod`).innerText = (saveBonus >= 0) ? ('+' + saveBonus) : saveBonus;
  }
  //UpdateSkill("all");
  let skillContainer = document.getElementById("skills");
  let skillLabels = skillContainer.getElementsByTagName("label");
  for(const label of skillLabels){
    let skillMod = characterStats["ability score"][FullStatNameFromPrefix(label.getAttribute("data-stat-type"))].mod;
    let skill = label.htmlFor.substring(0, label.htmlFor.length - 5);
    let hasProf = skillContainer.querySelector(`#${skill}-prof`).checked;
    let bonus = hasProf ? skillMod + characterStats["proficiency bonus"] : skillMod;
    document.getElementById(`${skill}-mod`).innerText = (bonus >= 0) ? ("+" + bonus) : bonus;
  }
});

//add event listeners to saving throws checkboxes
document.getElementById("saving-throws").querySelectorAll('input[type="checkbox"]').forEach((element) => {
  element.addEventListener("input", function () {
    //UpdateSavingThrows(element.id.split('-')[0]);
    let ability = FullStatNameFromPrefix(element.id.split("-")[0]);
    let bonus = element.checked ? characterStats["ability score"][ability].mod + characterStats["proficiency bonus"] : characterStats["ability score"][ability].mod;
    characterStats["ability score"][ability].save = element.checked;
    document.getElementById("saving-throws").querySelector(`#${element.id.split("-")[0]}-save-mod`).innerText = (bonus >= 0) ? ("+" + bonus) : bonus;
  });
  
});

document.getElementById("skills").querySelectorAll('input[type="checkbox"]').forEach((element) => {
    element.addEventListener("input", function () {
      //UpdateSkill(element.id);
      let skill = element.id.substring(0, element.id.length - 5);
      let mod = document.getElementById("skills").querySelector(`#${skill}-mod`);
      let ability = FullStatNameFromPrefix(mod.parentElement.getAttribute("data-stat-type"));
      let bonus = element.checked ? characterStats["ability score"][ability].mod + characterStats["proficiency bonus"] : characterStats["ability score"][ability].mod;
      characterStats["ability score"][ability].skills[skill] = element.checked;
      mod.innerText = (bonus >= 0) ? ("+" + bonus) : bonus;
    });
});


function CalcStatMod(score){
  return Math.floor((score - 10) / 2);
}
function CalcStatBonus(stat, hasProf){
  if(statMap.has(stat)){
    var bonus = CalcStatMod(statMap.get(stat));
    return hasProf ? Number(bonus) + Number(profBonus) : Number(bonus);
  }
  else{
    return 0;
  }
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


function LoadSavingThrows(){
  let labels = document.getElementById("saving-throws").getElementsByTagName('label');
  for(let i = 0; i < labels.length; i++){
    let prefix = labels[i].htmlFor.split('-')[0];
    let full = FullStatNameFromPrefix(prefix);
    if(characterStats["ability score"].hasOwnProperty(full)){
      let ability = characterStats["ability score"][full];
      let bonus = ability.save ? ability.mod + characterStats["proficiency bonus"] : ability.mod;
      labels[i].getElementsByTagName('span')[0].innerHTML = (bonus >= 0) ? ('+' + bonus) : bonus;
      document.getElementById(labels[i].htmlFor).checked = characterStats["ability score"][full].save;
    }
  }
}
function LoadSkills(){
  let labels = document.getElementById("skills").getElementsByTagName('label');
  for(const label of labels){
    let ability = characterStats["ability score"][FullStatNameFromPrefix(label.getAttribute("data-stat-type"))];
    let skill = label.htmlFor.split("-")[0];
    let bonus = ability.skills[skill] ? ability.mod + characterStats["proficiency bonus"] : ability.mod;
    document.getElementById(label.htmlFor).checked = ability.skills[skill];
    label.getElementsByTagName("span")[0].innerText = (bonus >= 0) ? ('+' + bonus) : bonus;
  }
}
function LoadAbilities(){
  let statBoxes = document.getElementsByClassName("stat-box");
  for(const stat of statBoxes){
    let input = stat.querySelector('input[type="number"]');
    let ability = characterStats["ability score"][FullStatNameFromPrefix(input.id)];
    input.value = ability.value;
    stat.querySelector('.stat-mod').innerText = (ability.mod >= 0) ? ('+' + ability.mod) : ability.mod;
  }
}


function FillSkillBlock(){
  /*
  skill structure
  <input type="checkbox" class="buble-check" id="acrobatics"/>
  <label for="acrobatics" data-stat-type="dex" class="capitalize">
    <span id="acrobatics-mod">_</span> Acrobatics (dex) <span class="skill-type">(dex)</span>
  </label>
  <br> 
   */
  var skillBlock = document.getElementById("skills");
  const skills = ["acrobatics_dex", "animal-handling_wis", "arcana_int", "athletics_str", "deception_cha", "history_int", "insight_wis", "intimidation_cha", "investigation_int", "medicine_wis", "nature_int", "perception_wis", "performance_cha", "persuasion_cha", "religion_int", "sleight-of-hand_dex", "stealth_dex", "survival_wis"];

  for(var i = skills.length - 1; i >= 0; i--){
    var skill = skills[i].split("_");
    var inputNode = document.createElement("input");
    inputNode.type = "checkbox";
    inputNode.className = "buble-check";
    inputNode.id = `${skill[0]}-prof`;

    var inputLabel = document.createElement("label");
    inputLabel.htmlFor = `${skill[0]}-prof`;
    inputLabel.setAttribute("data-stat-type", skill[1]);
    inputLabel.className = "capitalize";
    inputLabel.innerHTML = `<span id="${skill[0]}-mod">_</span> ${skill[0].replace(/-/g, " ")} <span class="skill-type">(${skill[1]})</span>`;
    
    
    skillBlock.insertBefore(document.createElement("br"), skillBlock.firstChild);
    skillBlock.insertBefore(inputLabel, skillBlock.firstChild);
    skillBlock.insertBefore(inputNode, skillBlock.firstChild);
  }
}
function FillSavingThrowBlock(){
  /*
  save structure
  <input type="checkbox" class="buble-check" id="str-save-prof"/>
  <label for="str-save-prof">
    <span id="str-save-mod">_</span> Strength
  </label>
  */
  var savingThrowBlock = document.getElementById("saving-throws");
  const saves = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  for(var i = saves.length - 1; i >= 0; i--){
    let abilityShort = saves[i].substring(0, 3);
    var inputNode = document.createElement("input");
    inputNode.type = "checkbox";
    inputNode.className = "buble-check";
    inputNode.id = abilityShort + "-save-prof";
  
    var inputLabel = document.createElement("label");
    inputLabel.htmlFor = abilityShort + "-save-prof";
    inputLabel.className = "capitalize";
    inputLabel.innerHTML = `<span id="${abilityShort}-save-mod">_</span> ${saves[i]}`;

    savingThrowBlock.insertBefore(document.createElement("br"), savingThrowBlock.firstChild);
    savingThrowBlock.insertBefore(inputLabel, savingThrowBlock.firstChild);
    savingThrowBlock.insertBefore(inputNode, savingThrowBlock.firstChild);
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
    body.querySelector(".editable-text").contentEditable = true;
  }
  else if(body.classList.contains("folded-body-small")){
    body.classList.remove("folded-body-small");
    body.querySelector(".editable-text").contentEditable = true;
  }
  else{
    body.querySelector(".editable-text").contentEditable = false;
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


document.getElementById("abilities").querySelector('input[value="+"]').addEventListener("click", function (e) {
    e.currentTarget.parentElement.appendChild(CreateTraitDropDown());
  });

function CreateTraitDropDown(){
  /*<div class="dropdown-wrapper">
      <div class="dropdown-header">
        <span>-</span>
        <input type="text" name="ability-name" value="Ability">
        <input type="button" name="add-check" value="+">
        <input type="button" name="remove-check" value="-">
      </div>
      <div class="dropdown-body">
        <ul class="ability-uses"></ul>
        <div contenteditable="true" class="editable-text">Ability description</div>
        <input type="button" name="remove-dropdown" value="remove">
      </div>
    </div> */
    var wrapper = document.createElement("div");
    wrapper.className = "dropdown-wrapper";
    //
    var header = document.createElement("div");
    header.className = "dropdown-header";
    ////
    var spn = document.createElement("span");
    spn.innerHTML = '-';

    var abilityName = document.createElement("input");
    abilityName.type = "text";
    abilityName.name = "ability-name";
    abilityName.value = "Ability Name";

    var addCheck = document.createElement("input");
    addCheck.type = "button";
    addCheck.name = "add-check";
    addCheck.value = '+';

    var removeCheck = document.createElement("input");
    removeCheck.type = "button";
    removeCheck.name = "remove-check";
    removeCheck.value = '-';
    ////
    var body = document.createElement("div");
    body.className = "dropdown-body";
    ////
    var ul = document.createElement("ul");
    ul.className = "ability-uses";

    var abilityDesc = document.createElement("div");
    abilityDesc.contentEditable = true;
    abilityDesc.className = "editable-text";
    abilityDesc.innerHTML = "Ability Description";

    var removeDropdown = document.createElement("input");
    removeDropdown.type = "button";
    removeDropdown.name = "remove-dropdown";
    removeDropdown.value = 'remove';
    ////
    //
    
    header.append(spn, abilityName, addCheck, removeCheck);
    body.append(ul, abilityDesc, removeDropdown);

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    RegisterMouseAndTouchEvent(spn, function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      FoldTraitDropdown(wrapper);
    });

    RegisterMouseAndTouchEvent(addCheck, function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      AddBubleCheckToTrait(wrapper);
    });
    
    RegisterMouseAndTouchEvent(removeCheck, function(e){
      e.preventDefault();
      if(e.type == "mouseup" && e.button != 0){ return; }
      RemoveBubleCheckFromTrait(wrapper);
    });
    
    abilityDesc.addEventListener("focus", function (e) {e.currentTarget.spellcheck = true;});
    abilityDesc.addEventListener("blur", function (e) {e.currentTarget.spellcheck = false;});

    removeDropdown.addEventListener("touchstart", function(e) {e.currentTarget.parentElement.parentElement.remove(); e.preventDefault();});
    removeDropdown.addEventListener("mouseup", function(e) { if(e.button == 0){ e.currentTarget.parentElement.parentElement.remove(); e.preventDefault();} });

    return wrapper;
}

function SaveTraitDropDownsToCharacter(){
  for(const trait of document.getElementsByClassName("dropdown-wrapper")){
    let charges = trait.getElementsByTagName('li');
    let expendedCharges = 0;
    if(charges.length > 0){
      for(const charge of charges){
        if(charge.getElementsByTagName("input")[0].checked){ expendedCharges++; }
      }
    }
    characterStats.traits.push({
      name: trait.querySelector('[name="ability-name"]').value,
      description: trait.querySelector('.dropdown-body').querySelector('.editable-text').innerText,
      charges: charges.length,
      expended: expendedCharges
    });
  }
}
function LoadTraitDropDowns(){
  let dropdownCol = document.getElementById("abilities").getElementsByClassName("dropdown-wrapper");
  if(dropdownCol.length > 0){
    for(let i = dropdownCol.length - 1; i >= 0; i--){
      dropdownCol.item(i).remove();
    }
  }

  for(const trait of characterStats.traits){
    let dropdown = CreateTraitDropDown();
    dropdown.querySelector(".dropdown-header").querySelector('[name="ability-name"]').innerText = trait.name;
    dropdown.querySelector(".dropdown-body").querySelector(".editable-text").innerHTML = trait.description;

    for(let i = 0; i < trait.charges; i++){
      AddBubleCheckToTrait(dropdown, (i < trait.expended));
    }
    document.getElementById("abilities").appendChild(dropdown);
  }
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

//
//save / load
//
RegisterMouseAndTouchEvent(document.getElementById("save-btn"), function(e){
  e.preventDefault();
  if(e.type == "mouseup" && e.button != 0){ return; }
  SaveTraitDropDownsToCharacter();
  download(JSON.stringify(characterStats), "character-stats", "txt");
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
      let charObj = JSON.parse(fileLoadedEvent.target.result);  
      if(charObj.hasOwnProperty("ability score") && charObj.hasOwnProperty("proficiency bonus") && charObj.hasOwnProperty("traits")){
        for(const prop in charObj){
          if(characterStats.hasOwnProperty(prop)){
            characterStats[prop] = charObj[prop];
          }
        }
      }
      LoadAbilities();
      LoadSavingThrows();
      LoadSkills();
      LoadTraitDropDowns();
    } catch (e) {  
      console.log('invalid json');
    }
  };

};