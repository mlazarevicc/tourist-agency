
let firebaseUrl =
  "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

var agencije = {}

getpodaci()

function getpodaci() {

    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){
            removeTableRows('agencije');
            agencije = JSON.parse(this.responseText);

            for(let id in agencije) {
                let agencija = agencije[id];
                appendagencijaRow('agencije',id,agencija,false);
            }
            let search = document.getElementById('searchInput');
            search.addEventListener('input', searchAgencije);
        } else {
            alert("Greska prilikom ucitavanja agencija");
            window.location.href = 'error.html';
        }
      }
    }

    request.open('GET',firebaseUrl.concat('/agencije.json'));
    request.send();
}

function removeTableRows(tBodyId) {
  let tBody = document.getElementById(tBodyId);

  while(tBody.firstChild){
      tBody.removeChild(tBody.lastChild);
  }
}

function appendagencijaRow(tbodyId,agencijaID,agencija,search){

  let col = document.createElement('div');
  col.id = agencijaID;
  col.classList.add('col');

  let card = document.createElement('div');
  card.classList.add('card','mx-auto','rounded-9');

  let cardImg = document.createElement('div');
  cardImg.classList.add('card-image');

  let image = document.createElement('img');
  image.src = agencija.logo;
  image.alt = agencija.naziv;
  image.width = 374;
  image.height = 249;

  cardImg.appendChild(image); // add 1
  card.appendChild(cardImg);

  let cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  let h5 = document.createElement("h5");
  h5.classList.add('card-title');
  h5.innerHTML = agencija.naziv;

  if(search) {
    h5.innerHTML = agencija.naziv.replace(new RegExp(search, 'gi'), '<span class="highlight">$&</span>');
  }

  cardBody.appendChild(h5);

  let ul = document.createElement('ul');
  let i1 = document.createElement('i');
  i1.classList.add('bx','bx-envelope');
  let li1 = document.createElement('li');
  li1.appendChild(i1);
  let text = document.createTextNode(' ' + agencija.email);
  li1.appendChild(text);
  ul.appendChild(li1);
  let i2 = document.createElement('i');
  i2.classList.add('bx','bx-phone');
  let li2 = document.createElement('li');
  li2.appendChild(i2);
  text = document.createTextNode(' ' + agencija.brojTelefona)
  li2.appendChild(text)
  ul.appendChild(li2);
  cardBody.appendChild(ul);

  let a = document.createElement('a');
  a.classList.add('btn','btn-primary','card-button');
  a.innerText = 'Pročitaj više';
  a.href = 'agencija.html?id='+ agencijaID;
  cardBody.appendChild(a);

  card.appendChild(cardBody);
  col.appendChild(card);

  let tbody = document.getElementById(tbodyId);
  tbody.appendChild(col);
}


function searchAgencije() {

  removeTableRows('agencije')
  var searchTerm = this.value.toLowerCase();

  for (let id in agencije) {
    let agency = agencije[id];
    let agencyData = agency.naziv.toLowerCase();
    
    getDestinacije(searchTerm,id,agency,agencyData)
  }
}

function getDestinacije(searchTerm, id, agencija, agencyData) {
  let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){

            destinacije = JSON.parse(this.responseText);

            let agencyDataDest = ''
            for(let id in destinacije) {
                agencyDataDest += ' ' + destinacije[id].naziv.toLowerCase()
            }
            if(agencyData.includes(searchTerm)) {
              if(searchTerm === '') {
                appendagencijaRow('agencije',id,agencija,false);
              } else {
                appendagencijaRow('agencije',id,agencija,searchTerm);
              }
            } else if (agencyDataDest.includes(searchTerm)) {
              appendagencijaRow('agencije',id,agencija,false);
            }

        } else {
            alert("Greska prilikom ucitavanja destinacija");
            window.location.href = 'error.html';
        }
      }

    }

    request.open('GET',firebaseUrl.concat('/destinacije/',agencija.destinacije,'.json'));
    request.send();
}