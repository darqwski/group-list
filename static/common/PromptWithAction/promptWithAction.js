const ModalState = {
    counter: 0
}

const showToastWithAction = ({message, action = () => {}, title}) => {
    const id = 'modal'+ModalState.counter
    ModalState.counter++;
    const container = $('<div>', { class: 'modal', id})
        .append(
            $('<div>',{class:'modal-content'})
                .append($('<h4>').text(title))
                .append($('<p>').append(message))
        )
        .append(
            $('<div>',{class:'modal-footer'})
                .append(
                    $('<a>',{class:'modal-close waves-effect waves-green btn-flat'})
                        .text('Zatwiedź')
                        .click(()=>{
                            action();
                            setTimeout(()=> $('#'+id).remove(),1500)
                        })
                ).append(
                    $('<a>',{class:'modal-close waves-effect waves-green btn-flat'})
                        .text('Anuluj')
                        .click(()=>setTimeout(()=> $('#'+id).remove(),1500))
                )
        )
    $('#app').append(container);
    $('#'+id).modal();
    $('#'+id).modal('open')
    return id;
}

const customModal = ({title,content, action})=>{
    const id = 'modal'+ModalState.counter
    ModalState.counter++;
    const container = $('<div>', { class: 'modal', id})
        .append(
            $('<div>',{class:'modal-content'})
                .append($('<h4>').text(title))
                .append($('<div>',{id:'modal-content'}).append(content()))
        )
        .append(
            $('<div>',{class:'modal-footer'})
                .append(
                    $('<a>',{class:'modal-close waves-effect waves-green btn-flat'})
                        .text('Zatwiedź')
                        .click(()=>{
                            action()
                            $('#'+id).modal('destroy');
                        })
                ).append(
                $('<a>',{class:'modal-close waves-effect waves-green btn-flat'})
                    .text('Anuluj')
                    .click(()=>{
                        setTimeout(()=> $('#'+id).remove(),1500)
                    })
            )
        )
    $('#app').append(container);
    $('#'+id).modal();
    console.log($('#'+id).modal('open'))
    $('#'+id).modal('open')
    return id;
}
