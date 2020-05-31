const IconWithDesc = (icon, desc, func)=>{
    const container = $('<div>',{ class: 'icon-desc'})
    container.append($('<i>',{class:'material-icons'}).text(icon))
    container.append($('<p>').text(desc))
    container.click(func)

    return container;
}