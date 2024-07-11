document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = today.toISOString().split('T')[0];
    
    document.getElementById('date').setAttribute('min', yesterday);

    document.getElementById('date').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const dateValue = document.getElementById('date').value;
        console.log(dateValue);
    });

    const formElement = document.getElementById('form');
    formElement.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        display(date, time, guests);
    });
});


const restaurants = document.getElementById('result');

const logos = ['coquette.png', 'lolita.png', 'ruka.png', 'yvonnes.png', 'lolita.png', 'mariel.png'];

async function display (date, time, guests) {

    /* clear restaurant list */
    document.getElementById('result').innerHTML = '';

    /* loading screen */
    const resdiv = document.createElement('div');
    const loading = document.createElement('img');
    loading.src = "loading.gif"
    resdiv.appendChild(loading)
    restaurants.appendChild(resdiv)

    var start = performance.now()
    const response = await fetch('http://localhost:3000/availability?date=' + date + '&time=' + time + '&guests=' + guests);
    const data = await response.json();
    restaurants.removeChild(resdiv)
    console.log((performance.now() - start) / 1000);

    for (let i = 0; i < data.length; i += 1) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'resCol'

        const logoDiv = document.createElement('div');
        logoDiv.className = 'logoContainer'

        const logo = document.createElement('img');
        logo.className = 'logo';
        logo.src = logos[i];


        const link = document.createElement('a');
        // link.textContent = data[i].name + ": ";
        link.href = data[i].link
        // link.style.fontFamily = 'Courier New';
        link.target = '_blank';
        // link.style.textAlign = 'center';
        // link.style.display = 'block'; // or 'inline-block' if appropriate
        // link.style.margin = '0 auto';
        link.appendChild(logo); 
        logoDiv.appendChild(link);
        resultDiv.appendChild(logoDiv);

        const timesDiv = document.createElement('div');
        timesDiv.className = 'timesContainer'

        for (let j = 0; j < data[i].divData.length; ++j) {
            const time = document.createElement('div');
            time.className = 'time'
            time.textContent = '[' + data[i].divData[j] + ']';
            time.style.fontFamily = 'Courier New';
            time.style.textAlign = 'center';
            timesDiv.appendChild(time)
        }

        // resultDiv.appendChild(link);  
        resultDiv.appendChild(timesDiv);
        restaurants.appendChild(resultDiv);
    }
}


