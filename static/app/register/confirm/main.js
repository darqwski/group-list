$('nav').hide()

const render = () => {
    $('#app').empty().append($('<div>',{class:'card green white-text'})
        .append($('<h3>').text(` Gratulacje `))
        .append($('<h5>').text(`Konto zostało utworzone poprawnie. Na twoją pocztę email, został wysłany link aktywujący. `))
        .append($('<h6>').text(`Aby korzystać z TypicalListGrouper musisz aktywować konto`))
        .append($('<h6>').text(`Link będzie aktywny przez 48h, po tym czasie twoje konto zostanie usunięte`))
        .append($('<a>',{href: '../../', class:'btn blue'}).text('Przejdź na stronę logowania'))
    )
}

render();
