

$(function(){
    getQuote()
   

    
});

async function getQuote(){
    let recieveQuotes = await fetch('http://localhost:3000/getAllQuotes')
    let JSONQuote = await recieveQuotes.json();
    console.log(JSONQuote)
    console.log(JSONQuote[0].createdBy)

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
        
        quoteTable.append(quoteInfo)
    }
    
}

/* "<tr id='quoteInfo'>
            <td id='workers'> JSONQuote[i].workers </td>
            <td id='hours'> JSONQuote[i].hours </td>
            <td id='hourlyrate'> JSONQuote[i].pay </td>
            <td id='personpay'> JSONQuote[i].payPerPerson </td>
            <td id='totalprice'> JSONQuote[i].priceTotal  </td>
            </tr>" */