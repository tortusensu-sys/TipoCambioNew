const socket = io.connect();

const details = document.querySelector('#textarea-detail');
const exchangeList = document.querySelector('.card-detail');
const statusName = document.querySelector('#status');
const programming = document.getElementById('programming');

//sockets
socket.on('serverPortals:run', (data) => {
  if(data.status === '1')
    statusName.innerHTML = 'RUNNING';
  else
    statusName.innerHTML = 'STOPPED';
});

socket.on('serverPortals:exchangeRequest', (data) => {
  addExchangeRates(data);
});

socket.on('serverPortals:reload', () => {
  location.reload();
});

socket.on('serverPortals:details', (data) => {
  details.innerHTML += data.detail + '\n';
});

//functions
function addExchangeRates(data){
  if(data.exchange.length > 0){
    const currentData = data.exchange.filter(item => compareDates(item.fecPublica, item.fecPublica));
    let html =  '<table class="table listRates table-responsive-md"> ' +
                  '<thead>' +
                    '<tr>' +
                    '<th scope="col">Portal</th>' +
                    '<th scope="col">Publication date</th>' +
                    '<th scope="col">Exchange rate</th>' +
                    '<th scope="col">Type</th>' +
                  '</thead>' +
                  '<tbody id="tbody-rates">';
    for (let exchange of currentData) {
      html += '<tr>';
      html += `<td>${exchange.portal.name}</td>` +
              `<td>${exchange.fecPublica}</td>` +
              `<td>${exchange.valTipo}</td>` +
              `<td>${exchange.codTipo}</td>`;
      html += '</tr>';
    }

    html += '</tbody></table>';
    
    exchangeList.innerHTML = html;
  } else{
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

  document.getElementById('currentDate').innerHTML = `${hours}:${minutes}:${seconds}`;
  setTimeout("showTime()", 1000);
}

function formatNumber(number) {
  return number < 10 ? `0${number}` : number;
}

function formatDate(date) {
  const parts = date.split('/');
  const day = formatNumber(Number(parts[0]));
  const month = formatNumber(Number(parts[1]));

  return `${day}/${month}/${parts[2]}`;
}

function compareDates(date1, date2) {
  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const currentFormatDate = `${formatNumber(currentDay)}/${formatNumber(currentMonth)}/${currentYear}`;
  const formatDate1 = formatDate(date1);
  const formatDate2 = formatDate(date2);

  return formatDate1 === formatDate2 && formatDate2 === currentFormatDate;
}

window.onload = function(){
  showTime();
}
