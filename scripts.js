
/*
https://api.openweathermap.org/data/2.5/weather?q=Koeln&appid=ffc8c2d29b7cb59e569c05aac004ba30&units=metric&lang=de
*/

function getWeatherWithInterval() {
    if (typeof myInterval !== 'undefined') { //undefined & number
        clearInterval(myInterval);
    }
    getWeather(); //erste manuelle Ausführung vor Timer
    myInterval = setInterval(function() {getWeather()}, 15 * 1000);
}

function getWeather() {
    //const apiKey = "ffc8c2d29b7cb59e569c05aac004ba30";
    const apiKey = "4d8fb5b93d4af21d66a2948710284366";
    const inputVal = document.getElementById("inputBox").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=de`;

    fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            let temp = data.main.temp;
            let city = data.name;
            let country = data.sys.country;
            let description = data.weather[0].description;
            let main = data.weather[0].main;
            let datetime = new Date(data.dt * 1000);
            let datetimeactual = new Date();
            document.getElementById("outputText").innerHTML=`In ${city} (${country}) sind es aktuell ${temp}°C.
                                                            <br> Status: ${description}
                                                            <br> Letzte Anfrage: ${datetimeactual.toLocaleString()}
                                                            <br> Letzte Messung: ${datetime.toLocaleString()}`; //<br> Main: ${main}
            console.log(data);
            //alert ('Success');
            $('#collapseOutputText').collapse('show');

            //Clear Error-Message
            document.getElementById("error").innerHTML="";

            //Überprüfe Trigger
            if (typeof trigger !== 'undefined') {
                // Rename Drizzle to Rain
                if (main == 'Drizzle') {
                    main = 'Rain';
                }
                // Eventhandling Status
                if (trigger == main) {
                    console.log(`Fall eingetreten (${trigger})`)

                    //Modal-Text
                    //Select Row Text with jQuery
                    selectedText = $("#selectMenu option:selected").text();

                    document.getElementById("modal-body").innerHTML=`Das festgelegte Wetterereignis (${selectedText}) ist eingetreten.`;
                    $('#staticBackdrop').modal('show');
                }
                // Eventhandling Temperatur
                if (trigger == 'TempUp' && temp >= tempValue || trigger == 'TempDown' && temp <= tempValue) {
                    console.log(`Fall eingetreten (${trigger})`)

                    //Modal-Text
                    //Select Row Text with jQuery
                    selectedText = $("#selectMenu option:selected").text();

                    document.getElementById("modal-body").innerHTML=`Das festgelegte Wetterereignis (${selectedText}) ist eingetreten.
                                                                    <br> Der Schwellenwert ${tempValue}°C wurde erreicht.
                                                                    <br> Die Temperatur beträgt aktuell ${temp}°C.`;
                    $('#staticBackdrop').modal('show');
                }
            }
        })
        .catch(function(error) {
            console.log(error);
            $('#collapseOutputText').collapse('hide');
            document.getElementById("error").innerHTML="Bitte gültige Stadt eingeben";
        });
}

function setTrigger() {
    trigger = document.getElementById("selectMenu").value;
    tempValue = document.getElementById("inputBoxTemp").value;
    selectedText = $("#selectMenu option:selected").text();
    if (trigger == 'TempUp' && tempValue.length == 0 || trigger == 'TempDown' && tempValue.length == 0) {
        document.getElementById("setError").innerHTML="Bitte Temperatur-Schwelle eingeben";
        trigger = null;
        console.log('keine Temp')
        return
    }
    console.log(`Trigger setted (${trigger})`);
    console.log(`TempValue = ${tempValue}`);
    document.getElementById("setText").innerHTML=`Trigger (${selectedText}) erfolgreich gesetzt.`;
    document.getElementById("setError").innerHTML="";
    if (tempValue != 0) {
        document.getElementById("setText").innerHTML=`Trigger (${selectedText} bei ${tempValue}°C) erfolgreich gesetzt.`;
    }
}

function tempCollapseControl() {
    trigger = document.getElementById("selectMenu").value;
    if (trigger == 'TempUp' || trigger == 'TempDown') { //open collapse if temp is selected
        $('#collapseTempValue').collapse('show');
    }
    else {
        $('#collapseTempValue').collapse('hide'); //hide if other option
    }
    trigger = null;
}