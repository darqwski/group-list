const State = {
    response: 200
}

$('nav').hide();

const render = () => {
    const container=$("<div>",{class:'card activation-card'})
        .append($('<h3>').text('Twoje konto zostało aktywowane'))
        .append($('<p>').append("Możesz się już zalogować na ").append($('<a>',{href:'../'}).text("Stronie głównej")))
    $("#app").empty().append(container)
}
render();
const link = getUrlParameter('link')

 Request.post('/API/activations/',{ data: {link}})

