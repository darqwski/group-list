const IconsState = {
    icons: undefined,
    chosenIcon: undefined,
    currentComponent: undefined
}

const SingleIcon = ({image, iconId})=>(
    $('<img>',{src:image,style:iconId == IconsState.chosenIcon ? 'border:2px solid red;':''})
        .click(()=>{
            IconsState.chosenIcon=iconId;
            IconsRender();
        })
)

const Icons = (iconId) => {
    const container = $('<div>')
    IconsState.chosenIcon = iconId;
    IconsState.currentComponent = container;
    if(!IconsState.icons){
        Request.get('/API/icons/').then(data=>{
            IconsState.icons = data
            IconsRender();
        })
    } else {
        IconsRender();
    }
    return container
}

const IconsRender = () => {
    const {icons} = IconsState;
    IconsState.currentComponent.empty().append(
        $('<div>').append(Object.keys(icons).map(groupName=>(
            $('<div>')
                .append('<h5>').text(groupName)
                .append($('<div>',{class:'icon-container'})
                    .append(icons[groupName].map(SingleIcon)))
        )))
    )
}


