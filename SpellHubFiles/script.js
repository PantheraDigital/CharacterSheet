const sheetID = "1ehwe5W57QFWyTca85clkP1ArQvBCMJ8m91VejUyEdkQ";
const apiKey = "AIzaSyBHhqGZRJIo90yIk1K-J86C9PU3whMe8CA";
const savedSpellSheets = {};
/* 
{
  sheetName: [
      {name:,
      level:,
      school,
      ready:false,
      "cast-time":,
      range:,
      duration:,
      target:,
      components:,
      description:,
      "up-cast":,
      books:,
      source:,
      extra
    }, 
    ...]
}
*/

async function GatherSpellTable(sheet, spellHub) {
  //gather all spell data from sheet
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheet}!${"B:M"}?majorDimension=ROWS&key=${apiKey}`)//(`https://sheets.googleapis.com/v4/spreadsheets/${docID}/values/${"Cantrips"}!${"B:B"}?key=${apiKey}`)
  .then(function(res) {
      return res.text();
  }).then(function(textObj){
    const simpleData = JSON.parse(textObj)["values"].filter(e => e.length);
    savedSpellSheets[sheet] = [];

    for(const spellData of simpleData){
      const spellDataObj = {
        name:spellData[0],
        level: (spellData[6] === "Cantrip") ? "Cantrips" : spellData[6].at(0),
        school:spellData[7],
        ready:false,
        "cast-time":spellData[1],
        range:spellData[2],
        duration:spellData[4],
        target:'',
        components:spellData[3],
        description:spellData[5],
        "up-cast":spellData[9],
        books:spellData[8],
        source:spellData[10],
        extra:spellData[11]
      }
      savedSpellSheets[sheet].push(spellDataObj);
    }
    FillSpellHub(spellHub, savedSpellSheets[sheet]);

  }).catch(function(e){
    console.log(e.toString());
  });
}

// dont remove spell hub to properly utilize savedSpellSheets. disable display to hide it
function ActivateSpellHub(){
  const spellHub = initSpellHub();

  if(spellHub.classList.contains("hidden")){
    spellHub.classList.remove("hidden");
  }else{
    clearSpellHubTable(spellHub);
    loadSpellHub(spellHub, "Cantrips");  
  }
  

  function loadSpellHub(hub, sheet){
    if(savedSpellSheets.hasOwnProperty(sheet)){
      console.log("load local");

      FillSpellHub(hub, savedSpellSheets[sheet]);
      document.getElementById("spell-hub-loading").style.display = "none";
      return 0;
    }else{
      console.log("fetch");

      GatherSpellTable(sheet, hub).then(function(){
        hub.querySelector("#spell-hub-loading").style.display = "none";
        filterTable(hub.querySelector("tbody"));
      });
      return 1;
    }
  }

  function initSpellHub(){
    let hub = document.getElementById("spell-hub");
    if(!hub){
      hub = document.getElementById("spell-hub-template").content.children[0].cloneNode(true);
      document.body.appendChild(hub);

      const table = hub.querySelector("tbody");
      table.dataset.bookFilter = "any";
      table.dataset.schoolFilter = "any";

      hub.querySelector("#spell-select-level").addEventListener("input", function(e){
        clearSpellHubTable(hub);
        hub.querySelector("#spell-hub-loading").style.display = "block";
        if(loadSpellHub(hub, e.currentTarget.value) === 0){
          filterTable(table);
        }
      });
      hub.querySelector("#spell-select-book").addEventListener("input", function(e){
        table.dataset.bookFilter = e.currentTarget.value;
        filterTable(table);
      });
      hub.querySelector("#spell-select-school").addEventListener("input", function(e){
        table.dataset.schoolFilter = e.currentTarget.value;
        filterTable(table);
      });
      RegisterActivateEvent(hub.querySelector("#add-spell-button"), function(e){
        const spellsToAdd = GatherSelectedSpells();
        for(const spellData of spellsToAdd){
          // reformat data to match format of spells passed to CreateSpell
          const displaySpellData = {
            title:spellData.name,
            lv: spellData.level.toLowerCase(),
            readyTick: (spellData.level.toLowerCase() !== "cantrips") ? false : null,
            "cast-time":spellData["cast-time"],
            range:spellData.range,
            duration:spellData.duration,
            target:spellData.target,
            components:spellData.components,
            body:
            `${spellData.description}<br>${(spellData["up-cast"]) ? `<br>${spellData["up-cast"]}<br>` : ""}${(spellData.extra) ? `<br>${spellData.extra}<br>` : ""}<br><b>Books:</b> ${spellData.books}<br><b>Source:</b> ${spellData.source}`
          }
          // CreateSpell - function in primary script //
          document.getElementById("spell-list").appendChild(CreateSpell(displaySpellData));
        }

      }, "click", "", false);
      RegisterActivateEvent(hub.querySelector("#close-spell-hub"), function(e){
        hub.classList.add("hidden");
        document.getElementById("main-article").style.display = "inline-block";
        
        const checkboxes = hub.querySelector('.spell-table').querySelectorAll('input[type=checkbox]:checked');
        for(const check of checkboxes){ 
          check.checked = false; 
          check.closest("[name='prime-row']").classList.remove("fill-color");
        }
      }, "click", "", false);
    }
    return hub;
  }

  function clearSpellHubTable(hub){
    const table = hub.querySelector("tbody");
    if(table.children){
      while(table.firstChild){
        table.removeChild(table.lastChild);
      }
    }
  }

  function filterTable(tableBody){
    const filters = {
      school: tableBody.dataset.schoolFilter,
      book: tableBody.dataset.bookFilter
    }
    let allInvalid = true;

    for(const tr of tableBody.children){
      if(tr.getAttribute("name") !== "prime-row") { continue; }

      tr.children[0].children[0].checked = false;
      tr.classList.remove("fill-color");

      if(filters.school !== "any" || filters.book !== "any"){
        const trTd = tr.getElementsByTagName("td");
        const trBooks = trTd[3].innerText;
        const trShool = trTd[2].innerText;
        let valid = false;

        if(filters.school !== "any" && filters.book !== "any"){
          if(trShool.includes(filters.school) && trBooks.includes(filters.book)){
            valid = true;
          }
        }else if(filters.school !== "any" && trShool.includes(filters.school)){
          valid = true;
        }else if(filters.book !== "any" && trBooks.includes(filters.book)){
          valid = true;
        }

        if(!valid){ 
          tr.style.display = "none"; 
        }
        else{ 
          tr.style.display = "table-row";
          allInvalid = false;
        }

        if(!tr.nextElementSibling.classList.contains("hidden")){
          tr.nextElementSibling.classList.add("hidden");
        }

      }else{
        if(tr.style.display === "none"){
          tr.style.display = "table-row";
        }
        allInvalid = false;
      }
    }

    if(allInvalid){
      const row = document.createElement("tr");
      row.id = "spell-hub-dummy-row";
      row.innerHTML = "<td></td><td></td><td></td><td></td><td></td>";
      tableBody.appendChild(row);
    }else{
      const dummy = tableBody.querySelector("#spell-hub-dummy-row");
      if(dummy){tableBody.removeChild(dummy);}
    }
  }
}


function FillSpellHub(spellHub, spellArray){
  for(const spellData of spellArray){
    if(spellData.name.toLowerCase() === "name"){ continue; }
    AddRowToSpellHub(spellHub, spellData);
  }
}
function AddRowToSpellHub(hub, spellData){
  const template = document.getElementById("spell-hub-table-row-template");
  const spellHubRow = template.content.children[0].cloneNode(true);
  const spellHubRowDetaills = template.content.children[1].cloneNode(true);

  spellHubRow.id = `spell-hub-row${hub.querySelectorAll("[name='prime-row']").length}`;
  spellHubRowDetaills.id = `spell-hub-row${hub.querySelectorAll("[name='prime-row']").length}-details`;

  const tds = spellHubRow.children;
  tds[0].children[0].insertAdjacentHTML("beforeend", spellData.name);
  tds[1].insertAdjacentHTML("beforeend", spellData.level);
  tds[2].insertAdjacentHTML("beforeend", spellData.school);
  tds[3].insertAdjacentHTML("beforeend", spellData.books);

  spellHubRowDetaills.querySelector("span").innerHTML = `
  <table>
    <tr>
      <td><b>Cast Time:</b></td>
      <td>${spellData["cast-time"]}</td>
    </tr>
    <tr>
      <td><b>Duration:</b></td>
      <td>${spellData.duration}</td>
    </tr>
    <tr>
      <td><b>Range:</b></td>
      <td>${spellData.range}</td>
    </tr>
    <tr>
      <td><b>Components:</b></td>
      <td>${spellData.components}</td>
    </tr>
    <tr>
      <td><b>Source:</b></td>
      <td>${spellData.source}</td>
    </tr>
  </table>
  <br>
  ${spellData.description}<br>
  ${(spellData["up-cast"]) ? `<br>${spellData["up-cast"]}<br>` : ""}
  ${(spellData.extra) ? `<br>${spellData.extra}<br>` : ""}`;
  
  //toggle details row
  RegisterActivateEvent(spellHubRow.querySelector("button"), function(e){
    const idNum = e.currentTarget.closest("[name='prime-row']").id.split('-')[2].slice(3);
    const details = document.getElementById(`spell-hub-row${idNum}-details`);

    if(details.classList.contains("hidden")){
      details.classList.remove("hidden");
      e.currentTarget.children[0].classList.remove("down-angles");
      e.currentTarget.children[0].classList.add("up-angles");
    }else{
      details.classList.add("hidden");
      e.currentTarget.children[0].classList.add("down-angles");
      e.currentTarget.children[0].classList.remove("up-angles");
    }
  }, "click", "", false);
  //color selection
  RegisterActivateEvent(spellHubRow.querySelector("input[type='checkbox']"), function(e){
    if(e.currentTarget.checked){
      e.currentTarget.closest("[name='prime-row']").classList.add("fill-color");
    }else{
      e.currentTarget.closest("[name='prime-row']").classList.remove("fill-color");
    }
  }, "click", "", false);

  hub.querySelector("tbody").appendChild(spellHubRow);
  hub.querySelector("tbody").appendChild(spellHubRowDetaills);
}

function GatherSelectedSpells(){
  const sheet = document.getElementById("spell-select-level").value;
  const checkboxes = document.querySelector('#spell-hub .spell-table').querySelectorAll('input[type=checkbox]:checked');
  const results = [];
  
  for(const check of checkboxes){
    results.push(savedSpellSheets[sheet].find(obj => {return obj.name === check.parentElement.innerText;}));
    check.checked = false;
    check.closest("[name='prime-row']").classList.remove("fill-color");
  }
  
  console.log(results);
  return results;
}


// helper function for adding touch and mouse events 
function RegisterActivateEvent(elmnt, fnc, mouseEvent = "mouseup", touchEvent = "touchend", passive = true) {
  if (elmnt !== null) {
      let func = function(e){
        if(passive){e.preventDefault();}
        if (e.type == mouseEvent && e.button != 0) { return; }
        fnc(e);
      };
      elmnt.addEventListener(mouseEvent, func);
      if(touchEvent){ elmnt.addEventListener(touchEvent, func, { passive: passive }); }
  }
}