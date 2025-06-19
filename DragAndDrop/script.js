function CreateDragAndDropElement({ title = "", body = "", dropGroup = "", color = "", readyTick = null, notes = null, ticks = [] }) {
    const clone = document.getElementById("draggable-base-template").content.children[0].cloneNode(true);
    const titleContainer = clone.querySelector(".drag-content-header");

    if (title) { 
        const titleElm = clone.querySelector(".drag-content-title");
        if(titleElm.tagName === "INPUT"){titleElm.value = title;}
        else{titleElm.innerText = title;}
    }

    if (body) {
        if(typeof body === "string"){
            clone.querySelector(".drag-content-body").innerHTML = body;
        }else if(typeof body[Symbol.iterator] === "function"){
            for(const elm of body){
                if(typeof elm === "string"){clone.querySelector(".drag-content-body").insertAdjacentHTML("beforeend", elm);}
                else{clone.querySelector(".drag-content-body").append(elm);}
            }
        }else{
            clone.querySelector(".drag-content-body").append(body);
        }
    }

    clone.setAttribute("data-drop-group", dropGroup)

    if (readyTick !== null) {
        DDAddReadyTick(titleContainer, readyTick);
    }

    DDAddTicks(titleContainer, ticks);

    if (notes) {
        if (notes !== true) {
            DDAddNotes(titleContainer, notes);
        } else {
            DDAddNotes(titleContainer);
        }
    }

    if (color) {
        clone.style.setProperty("--color", color);
    }

    // init edit button //
    const editButton = clone.querySelector(".drag-edit-button");
    const editOverlay = clone.querySelector(".drag-edit-overlay");

    editButton.addEventListener("click", (event) => {
        editOverlay.classList.toggle("disable");
        editOverlay.focus()
        titleContainer.classList.toggle("large");
        editButton.classList.toggle("active");
    });

    const editReady = editOverlay.querySelector("[name='editReadyTick']");
    if (readyTick !== null) { editReady.checked = true; }
    editReady.addEventListener("input", (event) => {
        if (event.target.checked) {
            DDAddReadyTick(titleContainer, false);
        } else {
            DDRemoveReadyTick(titleContainer);
        }
    });

    const editNotes = editOverlay.querySelector("[name='editNotes']");
    if (notes) { editNotes.checked = true; }
    editNotes.addEventListener("input", (event) => {
        if (event.target.checked) {
            DDAddNotes(titleContainer);
        } else {
            DDRemoveNotes(titleContainer);
        }
    });

    const editTicks = editOverlay.querySelector("[name='editTicks']");
    if (ticks && ticks.length > 0) { editTicks.value = ticks.length; }
    editTicks.addEventListener("input", (event) => {
        const container = titleContainer.querySelector("[name='tickContainer']");
        if (container === null) {
            if (event.target.value > 0) {
                DDAddTicks(titleContainer, Array(event.target.value));
            }
        } else {
            if (container.children.length < event.target.value) {
                const fill = Array(event.target.value - container.children.length).fill(false);
                DDAddTicks(titleContainer, fill);
            } else {
                DDRemoveTicks(titleContainer, (container.children.length - event.target.value));
            }
        }
    });

    const editColor = editOverlay.querySelector("[name='editColor']");
    editColor.value = clone.style.getPropertyValue("--color");
    editColor.addEventListener("input", (event) => {
        event.target.closest(".draggable").style.setProperty("--color", event.target.value);
    });

    return clone;
}
function CreateDragAndDropFillerElement(dropGroup = "") {
    const elm = document.createElement("span");
    elm.classList.add("draggable");
    elm.setAttribute("draggable", false);
    elm.setAttribute("name", "drop-target");
    elm.setAttribute("data-drop-group", dropGroup);
    return elm;
}

function DDAddReadyTick(headerElement, ticked) {
    const check = document.createElement("input");
    check.type = "checkbox";
    check.title = "Ready";
    check.style.float = "right";
    check.checked = ticked;
    check.name = "readyTick";
    headerElement.insertBefore(check, headerElement.firstChild);
}
function DDRemoveReadyTick(headerElement) {
    headerElement.querySelector("[name='readyTick']").remove();
}
function DDAddTicks(headerElement, ticks) {
    if (ticks && ticks.length > 0) {
        let container = headerElement.querySelector("[name='tickContainer']");
        if (container == null) {
            container = document.createElement("div");
            container.setAttribute("name", "tickContainer");
            headerElement.querySelector(".drag-content-title").after(container);
        }

        ticks.forEach((tick) => {
            const check = document.createElement("input");
            check.type = "checkbox";
            check.checked = tick;
            check.name = "tick";
            container.appendChild(check);
        });
    }
}
function DDRemoveTicks(headerElement, num = 1) {
    const container = headerElement.querySelector("[name='tickContainer']");
    if (container) {
        for (let step = 0; step < num; step++) {
            if (container.children.length > 0) {
                container.lastChild.remove();
            }
        }

        if (container.children.length == 0) {
            container.remove();
        }
    }
}
function DDAddNotes(headerElement, text = "") {
    const notes = document.createElement("textarea");
    notes.rows = 2;
    notes.placeholder = "notes";
    notes.classList.add("drag-content-notes");
    notes.name = "notes";
    if (text !== "") { notes.value = text; }
    headerElement.appendChild(notes);
}
function DDRemoveNotes(headerElement) {
    headerElement.querySelector("[name='notes']").remove();
}

function DragAndDropToJSON(draggable) {
    const json = {};

    const titleElm = draggable.querySelector(".drag-content-title"); 
    json["title"] = (titleElm.tagName === "INPUT") ? titleElm.value : titleElm.innerText;
    json["body"] = draggable.querySelector(".drag-content-body").innerHTML;
    json["color"] = window.getComputedStyle(draggable).getPropertyValue("--color");
    if(json["color"] === ""){json["color"] = draggable.style.getPropertyValue("--color");}
    json["dropGroup"] = draggable.getAttribute("data-drop-group");

    const readyCheck = draggable.querySelector(".drag-content-header").querySelector("[name='readyTick']");
    if (readyCheck !== null) {
        json["readyTick"] = readyCheck.checked;
    }

    const notes = draggable.querySelector(".drag-content-header").querySelector("textarea");
    if (notes) {
        json["notes"] = notes.value;
    }

    const ticks = draggable.querySelector(".drag-content-header").querySelectorAll("[name='tick']");
    if (ticks && ticks.length > 0) {
        json["ticks"] = []
        ticks.forEach((tick) => {
            json["ticks"].push(tick.checked);
        });
    }

    return json;
}

let dragged = null;
let entered = null;
function DDActivate(draggable) {
    if (draggable.getAttribute("data-drop-enabled") === "true") { return; }

    if (draggable.draggable) {
        const handles = draggable.querySelectorAll("[name='drag-handle']");
        if (handles && handles.length > 0) {
            handles.forEach((handle) => {
                handle.addEventListener("mousedown", (event) => {
                    draggable.draggable = true;
                });
                handle.addEventListener("touchstart", (event) => {
                    draggable.draggable = true;
                });
                handle.addEventListener("mouseup", (event) => {
                    draggable.draggable = false;
                });
                handle.addEventListener("touchend", (event) => {
                    draggable.draggable = false;
                });
            });

            draggable.draggable = false;

            draggable.addEventListener("dragend", (event) => {
                draggable.draggable = false;
            });
        }

        draggable.addEventListener("dragstart", (event) => {
            event.currentTarget.style.opacity = '0.4';
            dragged = draggable;
        });

        draggable.addEventListener("dragend", (event) => {
            event.target.style.opacity = '1';

            document.querySelectorAll("[draggable]").forEach(function (item) {
                item.classList.remove('over');
                item.classList.remove('over-bad');
            });
        });
    }


    draggable.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    draggable.addEventListener("drop", (event) => {
        event.preventDefault();
        let targetElement = event.currentTarget;
        if (targetElement == dragged) { return; }

        if (isDropCompatible(dragged, targetElement)) {
            //preserve position in parent with filler node
            //using replace preserves all node data such as checked boxes
            let targetFiller = document.createElement("p");
            let targetPrime = targetElement.parentNode.replaceChild(targetFiller, targetElement);
            let draggedFiller = document.createElement("p");
            let draggedPrime = dragged.parentNode.replaceChild(draggedFiller, dragged);

            targetFiller.parentNode.replaceChild(draggedPrime, targetFiller);
            draggedFiller.parentNode.replaceChild(targetPrime, draggedFiller);
        }
    });

    draggable.addEventListener("dragenter", (event) => {
        entered = event.target;

        if (event.target !== event.currentTarget) { return; }
        if (event.target === dragged) { return; }
        if (event.target.getAttribute("name") !== "drop-target") { return; }

        if (isDropCompatible(dragged, event.target)) {
            event.target.classList.add('over');
        } else {
            event.target.classList.add('over-bad');
        }
    });

    draggable.addEventListener("dragleave", (event) => {
        if (event.target !== event.currentTarget) { return; }
        if (event.target === dragged) { return; }
        if (event.target !== entered && event.target.contains(entered)) { return; }
        if (event.target.getAttribute("name") !== "drop-target") { return; }

        event.target.classList.remove('over');
        event.target.classList.remove('over-bad');
    });



    draggable.setAttribute("data-drop-enabled", "true");

    function isDropCompatible(draggedElement, targetElement) {
        if (targetElement.getAttribute("name") == "drop-target") {
            let groupOne = draggedElement.getAttribute("data-drop-group");
            let groupTwo = targetElement.getAttribute("data-drop-group");
            if (groupOne == groupTwo) {
                return true;
            }
        }
        return false;
    }
};