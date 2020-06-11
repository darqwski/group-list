$('nav').hide();

const LeftMain = ()=>{
    const container = $('<div>',{class:'card left-card'})
        .append($('<h1>').text("Cześć"))
        .append($('<h5>').text("Aby korzystać z TypicalListGrouper, musisz się zalogować. Jeśli nie masz konta, ").append($('<a>',{href:'register/'}).text('Załóż je')))

    return container
}

const RightMain = ()=>{
    const container = $('<div>',{class:'card right-card'})
        .append($('<h3>').text('Panel logowania'))
        .append(
            $('<form>',{method:'POST'})
                .append(LabeledInput({label:'email',name:'login'}))
                .append(LabeledInput({label:'Hasło',name:'password',type:'password'}))
                .append($('<button>',{class:'btn',type:'submit'}).text('Zaloguj'))
                .append($('<a>',{class:'btn-flat',href: 'register/'}).text('Zarejestruj'))
        )

    return container
}

const render = () => {
    const container = $('<div>',{class: 'landing-page'});
    container.append(LeftMain())
    container.append(RightMain())
    $('#app').empty().append(container)
}
render();

