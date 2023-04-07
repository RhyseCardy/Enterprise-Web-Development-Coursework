
//Code that is run when the page is loaded
$(function(){
    getQuote()
   

    
});

// Function to recieve the quote information that was sent as JSON and use
// that info to build a dynamic table and fill with quote info  
async function getQuote(){
    // Recieving the sent data using fetch
    let recieveQuotes = await fetch('http://localhost:3000/getAllQuotes')
    let JSONQuote = await recieveQuotes.json();
    console.log(JSONQuote)
    console.log(JSONQuote[0].createdBy)

    // Building the quote table
    let quoteTable = $('#quotesTable');
    for (let i = 0; i < JSONQuote.length; i++){
        let quoteInfo = $('<tr></tr>')
        let workers = JSONQuote[i].workers;
        let hours = JSONQuote[i].hours;
        let pay = JSONQuote[i].pay;
        let payPerPerson = JSONQuote[i].payPerPerson;
        let priceTotal = JSONQuote[i].priceTotal;
        quoteInfo.append('<td id=workers'+'>' + workers + '</td>')
        quoteInfo.append('<td>' + hours + '</td>')
        quoteInfo.append('<td>' + pay + '</td>')
        quoteInfo.append('<td>' + payPerPerson + '</td>')
        quoteInfo.append('<td>' + priceTotal + '</td>')
        
        // Data has to be appended to table for it to display
        quoteTable.append(quoteInfo)
    }
    
}

// Function to delete the quotes when the corresponding button is clicked
function DeleteTable(){
    // Removes quotes from table on the front end (not in the database)
    $('#quotesTable').remove();
    //Ajax request to navigate to the page that functions as quote deletion in the database
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/deleteAllQuotes",
        success: function (result){ alert("success"); },
        error: function (result) { alert("no success"); }
      })

    alert("quotes deleted")
}