let firebaseUrl =
  "https://veb-projekat-default-rtdb.europe-west1.firebasedatabase.app";

let grupaDest = getParamValue('idGrupe');
let destinacijaId = getParamValue('idDest');

let destinacija = {}
let getRequest = new XMLHttpRequest();

getRequest.onreadystatechange = function(){

  if(this.readyState==4){
    if(this.status==200){
      destinacija = JSON.parse(this.responseText);
      ucitaj()
    }else{
      alert('Greska prilikom ucitavanja destinacija');
      window.location.href = 'error.html'
    }
  }
}
getRequest.open('GET',firebaseUrl.concat('/destinacije/',grupaDest,'/',destinacijaId,'.json'));
//getRequest.open('GET',firebaseUrl +'/cars/' + carId +'.json');
getRequest.send();


function ucitaj() {
  let headerImg = document.getElementById('header-h2');
  headerImg.innerText = destinacija.naziv;

  let tabela = document.getElementsByTagName('table').item(0);
  let td = tabela.getElementsByTagName('td');
  td[0].innerText = destinacija.tip;
  td[1].innerText = destinacija.prevoz;
  td[2].innerText = destinacija.cena;
  td[3].innerText = destinacija.maxOsoba;

  //getpodaci();

  let p = document.getElementById('dest-opis')
  let tekst = p.getElementsByTagName('p').item(0);
  tekst.innerText = destinacija.opis;

  getCarousel();

}

function getCarousel() {
  let carouselId = document.getElementById('carouselExampleCaptions');

  let carouselInner = carouselId.getElementsByClassName('carousel-inner').item(0);
  for(imageLink of destinacija.slike) {
    let imgDiv = document.createElement('div');
    imgDiv.classList.add('carousel-item');

    let image = document.createElement('img');
    image.src = imageLink;
    image.classList.add('d-block','w-100');
    image.alt = destinacija.naziv;

    imgDiv.appendChild(image);
    carouselInner.appendChild(imgDiv);
  }

  carouselInner.getElementsByClassName('carousel-item').item(0).classList.add('active');
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
      
      return pValue;
    }
  }
}