$("#getPay").click(function(){

    let pay = $("#pay").val()
    let hours = $("#hours").val()
    let workers = $("#workers").val()
    let roundToNearest = 10;
    

    console.log("Calculating price")
    console.log(pay)
    console.log(hours)
    
    personPrice = (hours * pay)
    
    $("#payPerPerson").text("£"+ personPrice);


    function getfudgeFactor(min, max) {
        return (Math.random() * (max - min + 1)) + min;
    }

    let fudgeFactor = getfudgeFactor(0.5, 1.5)

    totalPrice = ((personPrice * workers) * fudgeFactor)
    totalPriceRounded = Math.round((totalPrice+roundToNearest)/roundToNearest) * roundToNearest

    $("#priceTotal").text("£"+ totalPriceRounded);

});