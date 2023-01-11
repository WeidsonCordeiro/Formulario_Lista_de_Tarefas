(function () {
    'user strict'

    const vDescricaoTarefa = document.querySelector(".inputItem");
    const vAdicionaraTarefa = document.querySelector(".todo-add-item");
    const vUls = document.getElementById("todo-list");
    const vLis = vUls.getElementsByTagName("li");

    const arrayTarefas = getSavedTasks();

    function getSavedTasks() {
        //return localStorage.getItem("Tasks");
        let vTasksDatas = localStorage.getItem("Tasks");
        vTasksDatas = JSON.parse(vTasksDatas);
        //console.log(vTasksDatas);
        return vTasksDatas && vTasksDatas.length ? vTasksDatas : [
            {
                nome: "Tarefa 1",
                criacao: Date.now(),
                completado: false
            },
            {
                nome: "Tarefa 2",
                criacao: Date.now(),
                completado: false
            }
        ]
    }

    function setNewData() {
        return localStorage.setItem("Tasks", JSON.stringify(arrayTarefas));
    }
    setNewData();

    /*function adicionarEventoLI(li){
        li.addEventListener("click", function(){
            console.log(this);
            console.log(this.outerText);         
            console.log(this.textContent);
            console.log(this.outerHTML);
            console.log(this.innerHTML);
        })
    }*/

    function geradorDeLi(vObj) {
        const vLI = document.createElement("li");
        const vP = document.createElement("p");
        const vButtonCheck = document.createElement("button");
        const vButtonEdit = document.createElement("i");
        const vButtonDelete = document.createElement("i");

        /*-------------------------------------------------------------------*/
        const vDivContainer = document.createElement("div");
        const vInputContainer = document.createElement("input");
        const vButtonEditContainer = document.createElement("button");
        const vButtonCancelContainer = document.createElement("button");

        vDivContainer.className = "editContainer";
        vInputContainer.className = "editInput";
        vInputContainer.setAttribute("type", "text");
        vInputContainer.value = vObj.nome;
        vButtonEditContainer.className = "editButton";
        vButtonEditContainer.setAttribute("data_action", "vButtonEditContainer");
        vButtonCancelContainer.className = "cancelButton";
        vButtonCancelContainer.setAttribute("data_action", "vButtonCancelContainer");
        vButtonEditContainer.textContent = "Edit";
        vButtonCancelContainer.textContent = "Cancel";

        vDivContainer.appendChild(vInputContainer);
        vDivContainer.appendChild(vButtonEditContainer);
        vDivContainer.appendChild(vButtonCancelContainer);

        //console.log(vDivContainer);

        /*-------------------------------------------------------------------*/
        vP.textContent = vObj.nome;
        vLI.className = "todo-item";

        vButtonCheck.className = "button-check";
        vButtonCheck.innerHTML = `<i class="fas fa-check ${vObj.completado ? "" : "displayNone"}"data_action="vButtonCheck"></i>`;
        vButtonCheck.setAttribute("data_action", "vButtonCheck");

        vButtonEdit.className = "fas fa-edit";
        vButtonDelete.className = "fas fa-trash-alt";

        vButtonEdit.setAttribute("data_action", "vButtonEdit");
        vButtonDelete.setAttribute("data_action", "vButtonDelete");

        vLI.appendChild(vButtonCheck);
        vLI.appendChild(vP);
        vLI.appendChild(vButtonEdit);
        vLI.appendChild(vDivContainer);
        vLI.appendChild(vButtonDelete);

        if (vObj.nome !== "") {
            //adicionarEventoLI(vLI);
            return vLI;
        } else {
            return false;
        }
    }

    function renderizarTarefas() {
        vUls.innerHTML = "";
        arrayTarefas.forEach(tarefas => {

            if (geradorDeLi(tarefas) == false) {
                vDescricaoTarefa.focus();
            } else {
                vUls.appendChild(geradorDeLi(tarefas));
            }
        })
    }

    function adicionarTarefas(vValor) {
        arrayTarefas.push({
            nome: vValor,
            criacao: Date.now(),
            completado: false
        });
        setNewData();
    }

    function obterAtributoClicado(e) {
        const vData_action = e.target.getAttribute("data_action");
        /*  
            Exemplos de como se pode fazer:
        
        if(e.target.getAttribute("data_action") === "vButtonEdit"){
            console.log("Clicou em Editar!");
        }else if(e.target.getAttribute("data_action") === "vButtonDelete"){
            console.log("Clicou em Deletar!");
        }
        
        switch(e.target.getAttribute("data_action")){
            case "vButtonEdit":
                console.log("Clicou em Editar!");
            break;
            case "vButtonDelete":
                console.log("Clicou em Deletar!");
            break;
            default: console.log("Não clicou em Editor ou Deletar!");
        }
        */

        //console.log(e.target);
        //console.log(e.target.nodeName);
        // console.log(vLis);

        if (!vData_action) return;

        let vLIClicada = e.target;

        while (vLIClicada.nodeName !== "LI") {
            vLIClicada = vLIClicada.parentElement;
        }
        //console.log(vLIClicada);

        const vLIClicadaIndex = [...vLis].indexOf(vLIClicada);
        //console.log(vLIClicadaIndex);

        const vActions = {
            vButtonCheck: function () {
                arrayTarefas[vLIClicadaIndex].completado = !arrayTarefas[vLIClicadaIndex].completado;
                setNewData();
                renderizarTarefas();
            },
            vButtonEdit: function () {
                const vEditarContainer = vLIClicada.querySelector(".editContainer");

                [...vUls.querySelectorAll(".editContainer")].forEach(vContainer => {
                    vContainer.removeAttribute("style");
                });

                vEditarContainer.style.display = "flex";
                inputContainer();
                setNewData();
                //renderizarTarefas();
            },
            vButtonDelete: function () {
                arrayTarefas.splice(vLIClicadaIndex, 1);
                //vLIClicada.remove();
                //vLIClicada.parentElement.removeChild(vLIClicada);
                setNewData();
                renderizarTarefas();
            },
            vButtonEditContainer: function () {
                const vValorDigitadoContainer = vLIClicada.querySelector(".editInput").value;

                if (vValorDigitadoContainer !== "") {
                    arrayTarefas[vLIClicadaIndex].nome = vValorDigitadoContainer;
                    renderizarTarefas();
                }
                inputContainer();
                setNewData();
            },
            vButtonCancelContainer: function () {
                vLIClicada.querySelector(".editContainer").style.display = "none";
                vLIClicada.querySelector(".editInput").value = arrayTarefas[vLIClicadaIndex].nome;
            }
        }

        function inputContainer() {
            const vValorDigitadoContainer = vLIClicada.querySelector(".editInput");
            vValorDigitadoContainer.focus();
        }

        if (vActions[vData_action]) {
            vActions[vData_action]();
        }


    }

    vAdicionaraTarefa.addEventListener("submit", function (e) {
        e.preventDefault(); // Para não enviar o Formulario.

        //crirElementoLI(vDescricaoTarefa.value);
        

        /*if(vDescricaoTarefa.value && existeValorLista(vDescricaoTarefa.value) !== "undefined"){
            adicionarTarefas(existeValorLista(vDescricaoTarefa.value))
        }*/

        //console.log(existeValorLista(vDescricaoTarefa.value));
        /*if(existeValorLista(vDescricaoTarefa.value) !== "" && vDescricaoTarefa.value !== ""){

           console.log("Item novo!");
            
        }else{

            console.log("Existe!")
        };*/
        if(vDescricaoTarefa.value !== ""){
            //console.log(existeValorLista(vDescricaoTarefa.value));
            let vRetorno = existeValorLista(vDescricaoTarefa.value);
            if(vRetorno !== "Existe!") adicionarTarefas(vRetorno)
        }

        function existeValorLista(nTextoDigitado){
            let vValorEncontrado = arrayTarefas.findIndex(vTexto => vTexto.nome === nTextoDigitado);
           if(vValorEncontrado >= 0){
                return "Existe!"; // Corrigir para aparecer uma label informando 
            }else{
                return nTextoDigitado;
            }
        };
        
        renderizarTarefas();
        /* vUls.innerHTML += `
                             <li class="todo-item">
                                 <button class="button-check">
                                     <i class="fas fa-check displayNone"></i>
                                 </button>
                                 <p class="task-name">${vDescricaoTarefa.value}</p>
                                 <i class="fas fa-edit"></i>
                                 <!-- <div class="editContainer">
                                     <input class="editInput" type="text">
                                     <button class="editButton">Edit</button>
                                     <button class="cancelButton">Cancel</button>
                                 </div> -->
                                 <i class="fas fa-trash-alt"></i>
 
                             </li>
                         `
         */
        limparTarefaDigitada();
    });

    /*[...vLis].forEach(li => {
        adicionarEventoLI(li);
    })*/
    renderizarTarefas();
    vUls.addEventListener("click", obterAtributoClicado);

    function limparTarefaDigitada() {
        vDescricaoTarefa.value = "";
        vDescricaoTarefa.focus();
    }

})()