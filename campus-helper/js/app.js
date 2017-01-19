//
//  app.js
//

$(document).ready(function() {

    // first, embed chart
    let embedChartUrl = `http://thingspeak.com/channels/${ thingSpeakHelperChannelId }/charts/${ thingSpeakGarageFieldId }`;
    $("#garageChartEmbed").attr("src", embedChartUrl + "?width=" + $(".chart").width() + "&bgcolor=%23ffffff&color=%2365737e&days=7&dynamic=true&results=60&title=carros+na+garagem&type=line&xaxis=data&yaxis=carros&yaxismax=20&yaxismin=0");

    // then get garage info
    getGarageInfo(addEventHandlers);
  
    // then add event handlers, but only after getting total cars
    function addEventHandlers () {

        $(document).on("click", "#enterGarage", function() {
            enterGaragePrompt();
        });
        
        $(document).on("click", "#leaveGarage", function() {
            leaveGaragePrompt();
        });

        $(document).on("click", "#clearGarage", function() {
            clearGaragePrompt();
        });
        
    }

});

//
// helper functions
//

// update #cars span element to show proper number of cars
function updateTotalCars (totalCars) {
    totalCars === 20 ? $("#cars").text(totalCars + " (cheia)") : $("#cars").text(totalCars);
}

// update #lastCarInside and #lastCarOutside span element to show proper license plates
function updateLastCar (lastCar, status) {
    if (status === "entry") {
        $("#lastCarInside").text(lastCar);
    } else if (status === "exit") {
        $("#lastCarOutside").text(lastCar);
    }
}

// check for valid license plate format - regexp to evaluate strings like 11-22-AZ
function checkLicensePlate(input) {
    return new RegExp("^[0-9]{2}-[0-9]{2}-[A-Z]{2}$").test(input);  
}

//
// prompts using sweetalert
//

function enterGaragePrompt() {

    if (totalCars === 20) { // if garage full, then don't open input prompt
        swal("A garagem está cheia.", "Não é possível entrar na garagem de momento.", "error");
    } else {
        swal({
            title: "Entrar na garagem.",
            text: "Indique a matrícula do seu carro:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "(11-22-AB)"
        },
        function(input){
            if (input === false) return false;

            if (input === "") {
                swal.showInputError("Por favor indique uma matrícula.");
                return false;
            } else if (checkLicensePlate(input)) { // if input passes test

                if (licensePlates.indexOf(input) != -1) { // if license plate is already in garage
                    swal.showInputError("Esse carro já se encontra na garagem.");
                    return false;
                } else {
                    console.log("enter");
                    garage(true, input); // POST request
                    swal("Entrou com sucesso.", "O seu carro, de matrícula " + input + ", entrou na garagem.", "success");   
                }
                
            } else {
                swal.showInputError("Essa matrícula não é válida.");
                return false;
            }
        });
    }
}

function leaveGaragePrompt() {

    if (totalCars === 0) { // if garage empty, then don't open input prompt
        swal("A garagem está vazia.", "Não se encontra nenhum carro na garagem.", "error");
    } else {
        swal({
        title: "Sair da garagem.",
        text: "Indique a matrícula do seu carro:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "(11-22-AB)"
        },
        function(input){
            if (input === false) return false;

            if (input === "") {
                swal.showInputError("Por favor indique uma matrícula.");
                return false;
            }

            if (checkLicensePlate(input)) {
                
                if(licensePlates.indexOf(input) != -1) { // if license plate isn't already in the garage
                    console.log("leave");
                    garage(false, input); // POST request
                    swal("Saiu com sucesso.", "Acabou de sair da garagem.", "success");
                } else {
                    swal.showInputError("Esse carro não se encontra na garagem.");
                    return false;
                }

            } else {
                swal.showInputError("Essa matrícula não é válida.");
                return false;
            }
        });
    }
    
}

function clearGaragePrompt() {

    swal({
        title: "Tem a certeza?",
        text: "Vai retirar todos os carros atualmente presentes na garagem.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        closeOnConfirm: false
    },
    function(){
        clearGarage(function() {
            swal("Limpada.", "Os carros foram retirados da garagem.", "success");
            window.location.reload(false);    
        });
    });

}