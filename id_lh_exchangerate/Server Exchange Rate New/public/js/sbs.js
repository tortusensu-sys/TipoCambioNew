const socket = io.connect();
const details = document.querySelector('#textarea-detail');
const exchangeList = document.querySelector('.card-detail');
const statusName = document.querySelector('#status');
const programming = document.getElementById('programming');

//sockets

socket.on('servidorSBS:scheduleTime', (data) => {
  programming.innerHTML = data.scheduleTime === '0' ? '¡IS OFFLINE!' : data.scheduleTime;
});

socket.on('servidorSBS:exchangeRequest', (data) => {
  addExchangeRates(data);
});

socket.on('servidorSBS:reload', () =>{
  location.reload();
});

socket.on('servidorSBS:details', (data) => {
  details.innerHTML += data.detail + '\n';
});

//functions

function addExchangeRates(data){
  if(data.exchange.length > 0){
      let html =  '<table class="table listRates table-responsive-md"> ' +
                    '<thead>' +
                      '<tr>' +
                      '<th scope="col">Publication date</th>' +
                      '<th scope="col">Exchange rate</th>' +
                      '<th scope="col">Type</th>' +
                    '</thead>' +
                    '<tbody id="tbody-rates">';
    for(let exchange of data.exchange){
      html += '<tr>';
      html += `<td>${exchange.fecPublica}</td>` +
              `<td>${exchange.valTipo}</td>` +
              `<td>${exchange.codTipo}</td>`;
      html += '</tr>';
    }
    html += '</tbody></table>'
    exchangeList.innerHTML = html;
  }else{
    exchangeList.innerHTML = '¡WAITING FOR RESULTS!';
  }
}

function showTime(){
  myDate = new Date();
  hours = myDate.getHours();
  minutes = myDate.getMinutes();
  seconds = myDate.getSeconds();

  if (hours < 10) hours = 0 + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  document.getElementById('currentDate').innerHTML = hours+ ":" +minutes+ ":" +seconds;
  setTimeout("showTime()", 1000);
}

window.onload = function(){
  showTime();
}
