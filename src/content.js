console.log("content");

function cleanHtml(str){
    myString = str.replace(/\D/g,'');
    return myString;
}

function getAskedPrice(){
    console.log("getAskedPrice()");
    var price = 0;
    document.querySelectorAll('p').forEach(function(node) {
        if("property-info__price qa-property-price" === node.className) {
            price = cleanHtml(node.innerHTML);
        }
    });
    return price;
}

// function getMapCoordingates(){
//     document.querySelectorAll('div').forEach(function(node) {
//         if("js-react-listing-map" === node.className) {
//             console.log("MAP");
//             console.log(node);
//         }
//     });        
//     return 0;
// }


function getElements(){
    console.log("getElements()");
    var elements = {};
    // getMapCoordingates();
    document.querySelectorAll('div').forEach(function(node) {
        if("property-attributes-table__row" === node.className.substring(0, "property-attributes-table__row".length)) {
            const descriptorNode = node.getElementsByClassName("property-attributes-table__label");
            const valueNode = node.getElementsByClassName("property-attributes-table__value");
            elements[descriptorNode[0].innerHTML] = cleanHtml(valueNode[0].innerHTML);
        }
    });        
    return elements;
}

function getPayloadFromHemnet(){
    // Antal rum: "4"
    // Biarea: "89"
    // Boarea: "90"
    // Bostadstyp: ""
    // Byggår: "1926"
    // Driftkostnad: "31266"
    // Tomtarea: "438"
    // Upplåtelseform: ""
    // askedPrice: "1995000"
    var elements = getElements();
    elements["askedPrice"] = getAskedPrice();
    console.log(elements);
    return elements;
}

function payloadToArray(elements) {
    var dataset = [4.00000000e+00, 0.00000000e+00, 9.30000000e+01, 9.00000000e+01, 4.49500000e+06, 4.49500000e+06, 2.68700000e+03, 5.94619399e+01, 1.83605113e+01, 2.02100000e+03, 3.00000000e+00, 1.20000000e+01, 0.00000000e+00];
    dataset[0] = elements.hasOwnProperty("Antal rum") ? parseFloat(elements["Antal rum"]) : 0;
    dataset[1] = elements.hasOwnProperty("Driftkostnad") ? parseFloat(elements["Driftkostnad"]) : 0;
    dataset[2] = elements.hasOwnProperty("Boarea") ? parseFloat(elements["Boarea"]) : 0;
    dataset[3] = elements.hasOwnProperty("Biarea") ? parseFloat(elements["Biarea"]) : 0;
    // dataset[4] = elements.hasOwnProperty("askedPrice") ? parseFloat(elements["askedPrice"]) : 0;
    dataset[5] = elements.hasOwnProperty("askedPrice") ? parseFloat(elements["askedPrice"]) : 0;
    return dataset;
}

function cleanPrice(str) {
    var hemnetData = getPayloadFromHemnet();
    console.log("cleanPrice ", str, hemnetData["Boarea"]);
    var amount = parseInt(parseFloat(str) * parseFloat(hemnetData["Boarea"]));
    amount = String(amount).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return amount + " kr";
}

//content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request.action);
    console.log(request);
    switch(request.action) {
        case "readyToPredict":
            // code block
            var hemnetData = getPayloadFromHemnet();
            payload = {
                data: [payloadToArray(hemnetData)],
            }
            sendResponse(payload);        
            break;
        case "updatePrice":
            // Set predicted price in the HTML
            const predictedPrice = request.predictedPrice; 
            document.querySelectorAll('div').forEach(function(node) {
                if (node.className === "property-info__price-container" ) {
                    node.innerHTML = node.innerHTML + '<b style="color:orange">' + cleanPrice(predictedPrice) + '</b>';            
                }
            });        
            payload = {
                result: "ok",
            }
            sendResponse(payload);        
            break;
        default:
            console.error("Error");
    }
});
