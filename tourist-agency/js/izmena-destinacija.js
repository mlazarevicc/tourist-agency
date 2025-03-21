let firebaseUrl =
  "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

getpodaci()

function getpodaci(){

    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){

            removeTableRows('allDestinacije');

            let podaci = JSON.parse(this.responseText);

            let dests = []
            for(let id in podaci) {
                for(let id_dest in podaci[id]) {
                  if(dests.includes(podaci[id][id_dest].naziv)) {
                    continue
                  }
                  let dest = podaci[id][id_dest];
                  dests.push(podaci[id][id_dest].naziv);
                  appenduserRow('allDestinacije',dest);
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

function removeTableRows(tBodyId){
    let tBody = document.getElementById(tBodyId);

    while(tBody.firstChild){
        tBody.removeChild(tBody.lastChild);
    }
}

function appenduserRow(tbodyId,dest){

    let destTr = document.createElement('tr');
  
    let nazivTd = document.createElement('td');
    nazivTd.innerText = dest.naziv;
    destTr.appendChild(nazivTd);

    let opisTd = document.createElement('td');
    opisTd.innerText = dest.opis;
    destTr.appendChild(opisTd);

    let tipTd = document.createElement('td');
    tipTd.innerText = dest.tip;
    destTr.appendChild(tipTd);
  
    let prevozTd = document.createElement('td');
    prevozTd.innerText = dest.prevoz;
    destTr.appendChild(prevozTd);

    let cenaTd = document.createElement('td');
    cenaTd.innerText = dest.cena;
    destTr.appendChild(cenaTd);

    let maxOsobaTd = document.createElement('td');
    maxOsobaTd.innerText = dest.maxOsoba;
    destTr.appendChild(maxOsobaTd);

    let icon = document.createElement('i');
    icon.classList.add('bx', 'bxs-trash');
    var deleteBtn = document.createElement('button');
    deleteBtn.type ='button';
    deleteBtn.appendChild(icon);
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'rounded-9')

    icon = document.createElement('i');
    icon.classList.add('bx', 'bxs-edit');
    var editBtn = document.createElement('button');
    editBtn.type='button';
    editBtn.appendChild(icon);
    editBtn.classList.add('btn', 'btn-sm', 'btn-success', 'rounded-9','me-md-1', 'mb-1', 'mb-lg-0')
    editBtn.setAttribute('data-bs-toggle',"modal");
    editBtn.setAttribute("data-bs-target","#modalIzmenaDest");

    editBtn.addEventListener('click', function() {
      let form = document.getElementById('modalIzmenaDest')

      let inputs = form.getElementsByTagName('input');
      inputs.item(0).value = dest.naziv;
      inputs.item(1).value = dest.cena;
      inputs.item(2).value = dest.maxOsoba;
      
      let select = form.getElementsByTagName('select')
      select.item(0).value = dest.tip;
      select.item(1).value = dest.prevoz;

      let textarea = form.getElementsByTagName('textarea');
      textarea.item(0).value = dest.opis;
      textarea.item(1).value = dest.slike.join('\n')

    })

    let deleteEditTd = document.createElement('td');
    
    deleteEditTd.classList.add('ps-4', 'deleteEditTd');
    deleteEditTd.appendChild(editBtn);
    deleteEditTd.appendChild(deleteBtn);
    destTr.appendChild(deleteEditTd);
  
    let tbody = document.getElementById(tbodyId);
    tbody.appendChild(destTr);
}