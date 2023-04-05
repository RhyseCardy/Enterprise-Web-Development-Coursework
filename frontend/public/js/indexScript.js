$("#getPay").click(function(){

    let pay = $("#pay").val()
    let hours = $("#hours").val()
    let workers = $("#workers").val()
    let roundToNearest = 10;
    

    console.log("Calculating price")
    console.log(pay)
    console.log(hours)
    
    personPrice = (hours * pay)
    
    $("#payPerPerson").text(personPrice);


    function getfudgeFactor(min, max) {
        return (Math.random() * (max - min + 1)) + min;
    }

    let fudgeFactor = getfudgeFactor(0.5, 1.5)

    totalPrice = ((personPrice * workers) * fudgeFactor)
    totalPriceRounded = Math.round((totalPrice+roundToNearest)/roundToNearest) * roundToNearest

    $("#priceTotal").text(totalPriceRounded);

});

$("#makeQuoteButton").click(function(){
    //console.log(values);
    let quote = new Object();
    quote.workers = parseInt($('#workers').val());
    quote.hours = parseInt($('#hours').val());
    quote.pay = parseInt($('#pay').val());
    quote.payPerPerson = parseInt($('#payPerPerson').text());
    quote.totalPrice = parseInt($('#priceTotal').text());
    console.log(quote);
    
    $.post('/makeQuote',quote,function(data, status){
        console.log(data, status)
    });

})
    