const Expander = ({top, bottom, isOpen = false, transition = 0.5, height= 100}) => {
    const topComponent = top();
    const bottomComponent = $('<div>',{class: `bottom ${isOpen ? '' : 'hidden'}`, style: `transition:${transition}s;height:${height}px;`}).append(bottom());
    topComponent.click(()=>{
        if(bottomComponent.hasClass('hidden')){
            bottomComponent.removeClass('hidden')
        } else {
            bottomComponent.addClass('hidden')
        }
    })
    const container = $('<div>',{class:'expander'}).append(topComponent).append(bottomComponent)

    return container;
}
