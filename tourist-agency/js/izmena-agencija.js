let firebaseUrl =
  "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

getpodaci()

function getpodaci(){

    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){

            removeTableRows('lista_agencija');

            let podaci = JSON.parse(this.responseText);

            for(let id in podaci) {
                let agencija = podaci[id];
                appendagencijaRow(agencija,id);
            }

        } else {
            alert("Greska prilikom ucitavanja agencija");
            window.location.href = 'error.html';
        }
      }
    }

    request.open('GET',firebaseUrl.concat('/agencije.json'));
    request.send();
}

function removeTableRows(tBodyId){
    let tBody = document.getElementById(tBodyId);

    while(tBody.firstChild){
        tBody.removeChild(tBody.lastChild);
    }
}
function appendagencijaRow(agencija,agencijaID) {
  let request = new XMLHttpRequest();
    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){
            let podaci = JSON.parse(this.responseText);

            for(let id in podaci) {
              if(id === agencija.destinacije) {
                let showDests = ''
                for(let id_dest in podaci[id]) {
                    showDests += podaci[id][id_dest].naziv + ' ';
                } 
                makeRow('lista_agencija',agencijaID,agencija,showDests)
                break
              }
            }

        } else {
            alert("Greska prilikom ucitavanja destinacija");
            window.location.href = 'error.html';
        }
      }
    }

    request.open('GET',firebaseUrl.concat('/destinacije.json'));
    request.send();
}
function makeRow(tbodyId,agencijaID,agencija,dests){

    let card = document.createElement('div');
    card.classList.add('card', 'm-2');

    let row = document.createElement('div');
    row.classList.add('row','g-0');

    let col1 = document.createElement('div');
    col1.classList.add('col-md-3');
    let img = document.createElement('img');
    img.src = agencija.logo;
    col1.appendChild(img);
    row.appendChild(col1); // add 1

    let col2 = document.createElement('div');
    col2.classList.add('col-md-9');

    let col21 = document.createElement('div');
    col21.classList.add('card-body');

    col21.appendChild(getTable(agencija,dests));
    col21.appendChild(getUl(agencijaID,agencija));

    col2.appendChild(col21);
    row.appendChild(col2); 
    card.appendChild(row);
  
    let tbody = document.getElementById(tbodyId);
    tbody.appendChild(card);
}

function getTable(agencija,dests) {
    let tabela = document.createElement('table');
    tabela.classList.add('mt-lg-1');

    let red = document.createElement('tr');
    let header = document.createElement('th');
    header.scope = 'row';
    header.innerText = 'Naziv: ';
    let data = document.createElement('td');
    data.innerHTML = agencija.naziv;
    red.appendChild(header);
    red.appendChild(data);
    tabela.appendChild(red);

    let red2 = document.createElement('tr');
    let header2 = document.createElement('th');
    header2.scope = 'row';
    header2.innerText = 'Adresa: ';
    let data2 = document.createElement('td');
    data2.innerHTML = agencija.adresa;
    red2.appendChild(header2);
    red2.appendChild(data2);
    tabela.appendChild(red2);

    let red3 = document.createElement('tr');
    let header3 = document.createElement('th');
    header3.scope = 'row';
    header3.innerText = 'Godina: ';
    let data3 = document.createElement('td');
    data3.innerHTML = agencija.godina;
    red3.appendChild(header3);
    red3.appendChild(data3);
    tabela.appendChild(red3);

    let red4 = document.createElement('tr');
    let header4 = document.createElement('th');
    header4.scope = 'row';
    header4.innerText = 'Telefon: ';
    let data4 = document.createElement('td');
    data4.innerHTML = agencija.brojTelefona;
    red4.appendChild(header4);
    red4.appendChild(data4);
    tabela.appendChild(red4);

    let red5 = document.createElement('tr');
    let header5 = document.createElement('th');
    header5.scope = 'row';
    header5.innerText = 'Email: ';
    let data5 = document.createElement('td');
    data5.innerHTML = agencija.email;
    red5.appendChild(header5);
    red5.appendChild(data5);
    tabela.appendChild(red5);

    let red6 = document.createElement('tr');
    let header6 = document.createElement('th');
    header6.scope = 'row';
    header6.innerText = 'Destinacije: ';
    let data6 = document.createElement('td');
    data6.classList.add('tableAgPadding')
    data6.innerText = dests;
    red6.appendChild(header6);
    red6.appendChild(data6);
    tabela.appendChild(red6);

    return tabela
}

function getUl(agencijaID,agencija) {
    let list = document.createElement('ul');
    list.classList.add('list-inline', 'm-0', 'buttons');

    let icon = document.createElement('i');
    icon.classList.add('bx','bxs-edit');
    let editBtn = document.createElement('button');
    editBtn.type='button';
    editBtn.appendChild(icon);
    editBtn.classList.add('btn', 'btn-sm', 'btn-success', 'rounded-9')
    editBtn.setAttribute('data-agencijaID',agencijaID);

    editBtn.addEventListener('click', function() {
        let popup = document.getElementById('izmena-agencije-popup');
        popup.style.display = 'block';
        document.body.style.overflow = 'hidden';
        let form = popup.getElementsByClassName('reg-form').item(0);
        form.style.display = 'block';
        
        let h = form.getElementsByTagName('h2').item(0);
        h.innerText = "Izmena agencije (" + agencija.naziv +"):";

        let inputs = form.getElementsByTagName('input');

        inputs.item(0).value = agencija.naziv;
        inputs.item(1).value = agencija.adresa;
        inputs.item(2).value = agencija.email;
        inputs.item(3).value = agencija.brojTelefona;
        inputs.item(4).value = agencija.godina;
        inputs.item(5).value = agencija.logo;

        let removeDestList = []
        getDestinacije(document.getElementById('destinationsSelect'),agencija.destinacije,removeDestList);

        let submitBtn = document.getElementById('submit-edit');
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault()
            let modal = new bootstrap.Modal(document.getElementById('modal1'));
            let agencija2 = {'destinacije': agencija.destinacije}
            if(ValidFormAG(agencija2)) {

              modal.show()
              
              let subButton = document.getElementById('modal-edit-save');
              subButton.addEventListener('click', function(e) {
                  e.preventDefault()

                  agencija = agencija2
                  if(removeDestList.length > 0) {
                    removeDest(removeDestList,agencijaID,agencija)
                  } else {
              
                    editAgency(agencijaID,agencija)
                  }
              })
          } else {
            modal.hide()
          }
        })

        
        let addBtn = document.getElementById('addDest');
        addBtn.addEventListener('click', function() {
            getAllDestinations(agencija.destinacije);
        });

        document.getElementById('close-edit-button').addEventListener('click', function(e) {
          e.preventDefault()
          popup.style.display = 'none';
          document.body.style.overflow = 'scroll';
        });
    });

    icon = document.createElement('i');
    icon.classList.add('bx','bxs-trash');
    let deleteBtn = document.createElement('button');
    deleteBtn.type='button';
    deleteBtn.id = 'submit-delete'
    deleteBtn.appendChild(icon);
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'rounded-9')
    deleteBtn.setAttribute('data-agencijaID',agencijaID);
    deleteBtn.setAttribute('data-bs-toggle',"modal");
    deleteBtn.setAttribute("data-bs-target","#modal2");

    deleteBtn.addEventListener('click', function() {
      document.getElementById('modal-save-del').addEventListener('click', function() {
        deleteAgency(agencijaID)
      })
    })

    let listItem1 = document.createElement('li');
    listItem1.classList.add('list-inline-item');
    listItem1.appendChild(editBtn);

    let listItem2 = document.createElement('li');
    listItem2.classList.add('list-inline-item');
    listItem2.appendChild(deleteBtn);

    list.appendChild(listItem1);
    list.appendChild(listItem2);

    return list
}

function displayDestinations(select,destinations,removeDestList) {
    // Prikaz svih destinacija u padajućem meniju
    select.innerHTML = '';

    // select.appendChild(document.createElement('option')); 
    for (let id in destinations) {
      let option = document.createElement('option');
      option.value = destinations[id].naziv;
      option.text = destinations[id].naziv;
      option.id = id;

      select.appendChild(option);
    }

    select.addEventListener('change', function() {
        let selectedDestination = document.querySelectorAll('[value="'+select.value+'"]').item(0);
        let removeBtn = document.getElementById('removeDest');
        removeBtn.disabled = false;
        removeBtn.setAttribute('idDest',selectedDestination.id);

        removeBtn.addEventListener('click', function() {
            if(!(removeDestList.includes(selectedDestination.id))) {
                removeDestList.push(selectedDestination.id)
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === selectedDestination.value) {
                      select.remove(i);
                      break; // Prekida petlju nakon uklanjanja prve opcije s ciljanom vrijednošću
                    }
                  }
                
            }
        })

        // removeDestList(removeBtn,grupaId,select);
        // removeDest(removeBtn,grupaId,select)

        // displayDestinations(grupaId,select,destinations);
    })
}

function getDestinacije(select,destinacijeId,removeDestList) {
  let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){
            destinacije = JSON.parse(this.responseText);
            displayDestinations(select,destinacije,removeDestList);
          } else {
            alert("Greska prilikom ucitavanja destinacija");
            window.location.href = 'error.html';
          }
        }
    }

    request.open('GET',firebaseUrl.concat('/destinacije/',destinacijeId,'.json'));
    request.send();
}

function removeDest(removeList,agencijaID,agencija) {

      for(let i=0;i<removeList.length;i++) {
        let putRequest = new XMLHttpRequest();

        putRequest.onreadystatechange = function(e){
          e.preventDefault()
          if(this.readyState==4){
            if(this.status==200){
              if(i == removeList.length-1) {
                removeList = []
                editAgency(agencijaID,agencija)
              }
            }else{
              alert("Greska prilikom izmene korisnika");
              window.location.href = 'error.html';
            }
          }
        }
  
        putRequest.open('DELETE',firebaseUrl.concat('/destinacije/',agencija.destinacije,'/',removeList[i],'.json'));
        putRequest.send();
      }
}

function ValidFormAG(agencija) {
  let inputs = []
  inputs.push(document.querySelector('input[name="agNameInput"]'));
  inputs.push(document.querySelector('input[name="agEmailInput"]'));
  inputs.push(document.querySelector('input[name="agPhoneInput"]'));
  inputs.push(document.querySelector('input[name="agAddressInput"]'));
  inputs.push(document.querySelector('input[name="agGodinaInput"]'));
  inputs.push(document.querySelector('input[name="agLogoInput"]'));

  let errors = []
  errors.push(document.getElementById('ag-name-error'));
  errors.push(document.getElementById('ag-email-error'));
  errors.push(document.getElementById('ag-phone-error'));
  errors.push(document.getElementById('ag-address-error'));
  errors.push(document.getElementById('ag-god-error'));
  errors.push(document.getElementById('ag-logo-error'))

  let valid = true;
  for(let i=0;i<inputs.length;i++) {
    if(!isValidAG(inputs[i])) {
        errors[i].style.display = 'block';
        valid = false;
    } else {
        errors[i].style.display = 'none';
    }
  }

  let godinatTren = new Date().getFullYear()
  if (inputs[4].value > godinatTren) {
    errors[4].style.display = 'block';
    valid = false;
  } else {
    errors[4].style.display = 'none';
  }

  if(valid) {
    agencija['naziv'] = inputs[0].value;
    agencija['email'] = inputs[1].value;
    agencija['brojTelefona'] = inputs[2].value;
    agencija['adresa'] = inputs[3].value;
    agencija['godina'] = inputs[4].value;
    agencija['logo'] = inputs[5].value
    }

  return valid
}

function isValidAG(input) {
    if (input.validity.valid && !(input.value === '')) {
      return true;
    } else {
      return false;
    }
}

function editAgency(agencijaID, agency) {

    let putRequest = new XMLHttpRequest();

    putRequest.onreadystatechange = function(e){
        if(this.readyState==4){
          if(this.status==200){
            DestToAdd(agency.destinacije)
          }else{
            alert("Greska prilikom izmene agencije");
            window.location.href = 'error.html';
          }
        }
    }

    putRequest.open('PUT',firebaseUrl.concat('/agencije/',agencijaID,'.json'));
    putRequest.send(JSON.stringify(agency));
}

function showDestinations(grupaId,destinacije) {
    let destinationList = document.getElementById('destinationList');
    destinationList.innerHTML = ''

    for(let idDest in destinacije) {
        let li = document.createElement('li');
        
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = idDest;
        checkbox.name = 'destinacije';
        checkbox.style.marginRight = '5px';
        let label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(destinacije[idDest].naziv));
        li.appendChild(label);
        destinationList.appendChild(li);
    }

    let addDestBtn = document.getElementById('addDestSubmit');
    addDestBtn.addEventListener('click', function() {
        let selectedDestinations = getSelectedDestinations()
        addDestinations(grupaId,selectedDestinations,destinacije);
    })
}

// Dodaje u opcijama
function addDestinations(grupaId,selectedDestinations,destinacije) {

    if(selectedDestinations.length > 0) {
        addDestinationOption(grupaId,selectedDestinations[selectedDestinations.length-1],selectedDestinations,destinacije)
    }

    let modal = document.getElementById('modalDestinacije');
    modal.style.display = 'none'

}

function addDestinationOption(grupaId,destinacija,selectedDestinations,destinacije) {
    selectedDestinations.pop();
    let select = document.getElementById('destinationsSelect')
    let option = document.createElement('option');
    option.value = destinacije[destinacija].naziv;
    option.text = destinacije[destinacija].naziv;
    option.id = destinacija;
    select.appendChild(option);

    addDestinations(grupaId,selectedDestinations,destinacije)
}

// Dodaje kad se submituje
function addDestinations2(grupaId,destinacije,checkedDest) {

  if(checkedDest.length > 0) {
      addDestination(grupaId,checkedDest[checkedDest.length-1],destinacije,checkedDest)
  } else {
      let popup = document.getElementById("izmena-agencije-popup");
      popup.style.display = "none"
      document.body.style.overflow = "scroll"

      let myToast = document.getElementById('myToast');
      let toast = new bootstrap.Toast(myToast);

      toast.show();

      setTimeout(function() {
        toast.hide();
        location.reload()
      }, 2000);
  }

}
// Za dodavanje kada se submituje
function addDestination(grupaId,idDestinacije,destinacije,checkedDest) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){
            checkedDest.pop();
            addDestinations2(grupaId,destinacije,checkedDest)
        } else {
            alert("Greska prilikom ucitavanja destinacija");
            window.location.href = 'error.html';
        }
      }
    }

    request.open('POST',firebaseUrl.concat('/destinacije/',grupaId,'.json'));
    request.send(JSON.stringify(destinacije[idDestinacije]));
}

function getSelectedDestinations() {
    let selectedDestinations = [];
    let checkboxes = document.querySelectorAll('#destinationList input[name="destinacije"]:checked');
  
    for (let i = 0; i < checkboxes.length; i++) {
      let destinationId = checkboxes[i].value;
      selectedDestinations.push(destinationId);
    }
  
    checkedDest = selectedDestinations;
    return selectedDestinations;
}

function getAllDestinations(grupaId) {
    let request = new XMLHttpRequest();
    let select = document.getElementById('destinationsSelect');
    let selectDest = select.getElementsByTagName('option')

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){
            let podaci = JSON.parse(this.responseText);

            let destinacije = {}
            for(let id in podaci) {
                for(let id_dest in podaci[id]) {
                    let postoji = false
                    for(let i=0;i<selectDest.length;i++) {
                        if(podaci[id][id_dest].naziv === selectDest[i].value) {
                            postoji = true
                            break
                        }
                    }
                    if(postoji) {
                        continue
                    }
                    let postojiUDestinacijama = false;
                    for (let id2 in destinacije) {
                      if (podaci[id][id_dest].naziv === destinacije[id2].naziv) {
                        postojiUDestinacijama = true;
                        break;
                      }
                    }

                    if (!postojiUDestinacijama) {
                      let dest = podaci[id][id_dest];
                      destinacije[id_dest] = dest;
                    }
                } 
            }
            showDestinations(grupaId,destinacije)

        } else {
            alert("Greska prilikom ucitavanja destinacija");
            window.location.href = 'error.html';
        }
      }
    }

    request.open('GET',firebaseUrl.concat('/destinacije.json'));
    request.send();
}

function DestToAdd(idDest) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){

        if(this.readyState==4){
          if(this.status==200){
              let podaci = JSON.parse(this.responseText);
  
              let destinacije = {}
              for(let id in podaci) {
                  for(let id_dest in podaci[id]) {
                      destinacije[id_dest] = podaci[id][id_dest];
                  } 
              }
              checkedDest = getSelectedDestinations();
              addDestinations2(idDest,destinacije,checkedDest)
  
          } else {
              alert("Greska prilikom ucitavanja destinacija");
              window.location.href = 'error.html';
          }
        }
      }
  
      request.open('GET',firebaseUrl.concat('/destinacije.json'));
      request.send();
}

function deleteAgency (agencijaID) {

    let putRequest = new XMLHttpRequest();

    putRequest.onreadystatechange = function(e){
      if(this.readyState==4){
        if(this.status==200){

          location.reload()
        }else{
          window.location.href = 'error.html';
        }
      }
    }

    putRequest.open('DELETE',firebaseUrl.concat('/agencije/',agencijaID,'.json'));
    putRequest.send();

}