$("#getPay").click(function(){

    let pay = $("#pay").val()
    let hours = $("#hours").val()
    let finalPrice = 0;

    console.log("Calculating price")
    console.log(pay)
    console.log(hours)
    
    personPrice = (hours * pay)
    
    
    $("#payPerPerson").append(personPrice);

});