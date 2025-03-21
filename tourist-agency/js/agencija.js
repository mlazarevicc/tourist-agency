let firebaseUrl =
  "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

let agencijaId = getParamValue('id')

let agencija = {}
let destinacije = {}
let getRequest = new XMLHttpRequest();

getRequest.onreadystatechange = function(){

  if(this.readyState==4){
    if(this.status==200){
      agencija = JSON.parse(this.responseText);
      ucitaj()
    }else{
      alert('Greska prilikom ucitavanja agencija');
      window.location.href = 'error.html'
    }
  }
}
getRequest.open('GET',firebaseUrl.concat('/agencije/',agencijaId,'.json'));
//getRequest.open('GET',firebaseUrl +'/cars/' + carId +'.json');
getRequest.send();


function ucitaj() {
  let headerImg = document.getElementById('header-img');
  headerImg.src = agencija.logo;
  headerImg.alt = agencija.naziv;

  let headerH1 = document.getElementById('header-h1');
  headerH1.innerHTML = agencija.naziv;

  let tabela = document.getElementsByTagName('table').item(0);
  let td = tabela.getElementsByTagName('td');
  td[0].innerText = agencija.adresa;
  td[1].innerText = agencija.godina;
  td[2].innerText = agencija.brojTelefona;
  td[3].innerText = agencija.email;

  getpodaci();

  let vrstaPrevoza = document.getElementById('searchVrstaPrevoza');
  let tipPutovanja = document.getElementById('searchTipPutovanja');

  vrstaPrevoza.addEventListener('change', function() {
    searchDest()
    let prevozOptions = document.querySelectorAll('input[name="prevoz"]');
    prevozOptions.forEach(function(radio) {
      radio.addEventListener('change', searchDest)
    })
  })
  tipPutovanja.addEventListener('change', function() {
    searchDest()
    let prevozOptions = document.querySelectorAll('input[name="putovanje"]');
    prevozOptions.forEach(function(radio) {
      radio.addEventListener('change', searchDest)
    })
  })

  let search = document.getElementById('destSearchInput');
  search.addEventListener('input', searchDest)

}

function getpodaci(){

    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

      if(this.readyState==4){
        if(this.status==200){

            removeTableRows('lista_destinacija');

            destinacije = JSON.parse(this.responseText);

            for(let id in destinacije) {
                destinacija = destinacije[id];
                appendDestinacijaCard('lista_destinacija',id,destinacija,false);
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

function appendDestinacijaCard(tbodyId,destinacijaID,destinacija,search) {
  let col = document.createElement('div');
  col.classList.add('col');

  let card = document.createElement('div');
  card.classList.add('card','h-100');

  let image = document.createElement('img');
  image.src = destinacija.slike[0];
  image.alt = destinacija.naziv;

  card.appendChild(image);

  let cardBody = document.createElement('div');
  cardBody.classList.add('card-body','d-flex','flex-column');
  let h5 = document.createElement("h5");
  h5.classList.add('card-title');
  h5.innerHTML = destinacija.naziv;

  if(search) {
    h5.innerHTML = destinacija.naziv.replace(new RegExp(search, 'gi'), '<span class="highlight">$&</span>');
  }

  cardBody.appendChild(h5);

  let cardP = document.createElement('p');
  cardP.classList.add('card-text');
  cardP.innerText = destinacija.opis.substring(0,100).concat('...');

  cardBody.appendChild(cardP);


  let a = document.createElement('a');
  a.classList.add('btn','btn-primary','card-button','w-100','mt-auto');
  a.innerText = 'Izaberi';
  a.href = 'destinacija.html?idGrupe='+ agencija.destinacije + '&idDest=' + destinacijaID;
  cardBody.appendChild(a);

  card.appendChild(cardBody);
  col.appendChild(card);

  let tbody = document.getElementById(tbodyId);
  tbody.appendChild(col);

}

function removeTableRows(tBodyId){
  let tBody = document.getElementById(tBodyId);

  while(tBody.firstChild){
      tBody.removeChild(tBody.lastChild);
  }
}

function getParamValue(name) {
  let location = decodeURI(window.location.toString());
  let index = location.indexOf("?") + 1;
  let subs = location.substring(index, location.length);
  let splitted = subs.split("&");

  for (i = 0; i < splitted.length; i++) {
    let s = splitted[i].split("=");
    let pName = s[0];
    let pValue = s[1];
    if (pName == name) {
      if (pValue.endsWith("#!")) {
        return pValue.slice(0, -2);
      } else {
        return pValue; 
      }
    }
  }
}

function searchDest() {
  var resultsList = document.getElementById('lista_destinacija');
  removeTableRows('lista_destinacija')

  let search = document.getElementById('destSearchInput');
  var searchTerm = search.value.toLowerCase();
  resultsList.innerHTML = '';

  let vrstaPrevoza = document.getElementById('searchVrstaPrevoza');
  let tipPutovanja = document.getElementById('searchTipPutovanja');

  for (let id in destinacije) {
      var dest = destinacije[id];
      var destData = dest.naziv.toLowerCase() + ' ' + dest.tip.toLowerCase() + ' ' + dest.prevoz.toLowerCase();

      let checkedPrevoz = '';
      if(vrstaPrevoza.checked) {
        let prevozOptions = document.querySelectorAll('input[name="prevoz"]');
        prevozOptions.forEach(function(radio) {
          if(radio.checked) {
            checkedPrevoz = radio.value.toLowerCase()
          }
        })
      }
      let checkedTipP = '';
      if(tipPutovanja.checked) {
        let putovanjeOptions = document.querySelectorAll('input[name="putovanje"]');
        putovanjeOptions.forEach(function(radio) {
          if(radio.checked) {
            checkedTipP = radio.value.toLowerCase()
          }
        })
      }

      if(searchTerm === '' && checkedPrevoz === '' && checkedTipP === '') {
        appendDestinacijaCard('lista_destinacija',id,dest,false);
      } else {
        let noNull = []
        if(!(searchTerm==='')) {
          noNull.push(searchTerm)
        }
        if(!(checkedPrevoz === '')) {
          noNull.push(checkedPrevoz)
        }
        if(!(checkedTipP === '')) {
          noNull.push(checkedTipP)
        }

        let ispunjeno = true;
        for(let i=0;i<noNull.length;i++) {
          if(!destData.includes(noNull[i])) {
            ispunjeno = false
          }
        }

        if(ispunjeno) {
          appendDestinacijaCard('lista_destinacija',id,dest,searchTerm);
        }
      }
  }
}