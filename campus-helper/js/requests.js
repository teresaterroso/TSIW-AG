//
//  Thingspeak API HTTP requests
//

let totalCars = 0; // keep track of total cars
let licensePlates = []; // keep track of license plates

// GET: Get a Channel Feed
function getGarageInfo(callback) {

    let getChannelFeedUrl = `https://api.thingspeak.com/channels/${ thingSpeakHelperChannelId }/feeds.json`;

    $.ajax({
        dataType: "json",
        url: getChannelFeedUrl,
        data: {
            api_key: thingSpeakReadApiKey,
        }
    }).done(function(res) {
        if (res.feeds[0]) { // if there are any cars
            totalCars = res.feeds[res.feeds.length - 1].field1; // string with number of total cars
            updateTotalCars(parseInt(totalCars));
        
            let lastCar = ""; // license plate of last car

            licensePlates = []; // clear license plates array

            for (let i = 0; i < res.feeds.length; i++) {
                let currentCar = res.feeds[i];

                switch (currentCar.field3) { // check current car's entry or exit status
                    case "entry":
                        licensePlates.push(currentCar.field2); // add this license plate to array
                        lastCar = currentCar.field2;
                        updateLastCar(lastCar, "entry"); // if entry, update lastCarInside span
                        break;
                    case "exit":
                        licensePlates.splice(licensePlates.indexOf(currentCar.field2), 1); // remove this license plate from array
                        lastCar = currentCar.field2;
                        updateLastCar(lastCar, "exit"); // if exit, update lastCarOutside span
                        break;
                    default: break;
                }
            }

        } else {
            updateTotalCars(0);
        }
    }).always(function() {
        if (callback) callback();
        console.log(licensePlates);
    });

}

// POST: Update a Channel Feed
function garage(operation, licensePlate) {

    let entryExit;

    if (operation === true) { // if enter
        totalCars++;
        entryExit = "entry";
        updateTotalCars(totalCars);
    } else { // if leave
        totalCars--; 
        entryExit = "exit";
        updateTotalCars(totalCars);
    }

    let updateChannelFeedUrl = "https://api.thingspeak.com/update.json";

    $.ajax({
        dataType: "json",
        type: "POST",
        url: updateChannelFeedUrl,
        data: {
            api_key: thingSpeakWriteApiKey,
            field1: totalCars,
            field2: licensePlate,
            field3: entryExit
        }
    }).done(function(res) {
        getGarageInfo();
        console.log("channel update success");
    });
}

// DELETE: Clear A Channel
function clearGarage(callback) {

    let clearChannelUrl = `https://api.thingspeak.com/channels/${ thingSpeakHelperChannelId }/feeds.json`;

    $.ajax({
        dataType: "json",
        type: "DELETE",
        url: clearChannelUrl,
        data: {
            api_key: thingSpeakProfileApiKey
        }
    }).done(function(res) {
        getGarageInfo();
        console.log("channel cleared");
        callback();
    });

}

// GET: View a Channel
(function getChannelInfo() {

    let viewChannelUrl = `https://api.thingspeak.com/channels/${ thingSpeakHelperChannelId }.json`;

    $.ajax({
        dataType: "json",
        url: viewChannelUrl,
        data: {
            api_key: thingSpeakProfileApiKey
        }
    }).done(function(res) {
        $("#channelName").text(res.name);
        $("#channelId").text(res.id);
        $("#channelCreated").text(res.created_at.substring(0, res.created_at.indexOf("T")));
        $("#channelLastEntryId").text(res.last_entry_id);
    });
})();
