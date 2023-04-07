
//Code to do the calculations for displaying the price to paid per person
//and the total price for the quote based on the price per person and fudge factor
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

    // Fudge factor is calculated with a random number generator ranging from 0.5 to 1.5
    function getfudgeFactor(min, max) {
        return (Math.random() * (max - min + 1)) + min;
    }

    let fudgeFactor = getfudgeFactor(0.5, 1.5)

    totalPrice = ((personPrice * workers) * fudgeFactor)
    // totalPrice figure is rounded so that the number is more reasonable and not a floating number
    totalPriceRounded = Math.round((totalPrice+roundToNearest)/roundToNearest) * roundToNearest

    // priceTotal figure is updated with finished calculation
    $("#priceTotal").text(totalPriceRounded);

});

// When corresponding button clicked, quote data calculated and inputed is
// put as an object to be sent to the 'list' page using the '/makeQuote' function 
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
    