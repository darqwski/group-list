const ColorState = {
    colors: undefined,
    colorId: undefined,
    currentComponent: undefined
}

const CircleColor = ({colorHex, colorId})=>(
    $('<div>',{class:'circle-color',style:`background-color:${colorHex};${colorId === ColorState.colorId ? 'border: 2px solid red;': ''}`})
        .click(()=>{
            ColorState.colorId = colorId
            ColorRender();
        })
)
const Colors = (colorId) => {
    const container = $('<div>',{class:'color-container'})
    ColorState.colorId = colorId;
    ColorState.currentComponent = container;
    if(!ColorState.colors){
        Request.get('/API/colors/').then(data=>{
            ColorState.colors = data
            ColorRender();
        })
    } else {
        ColorRender();
    }
    return container
}

const ColorRender = () => {
    const {colors} = ColorState;
    ColorState.currentComponent.empty().append(colors.map(CircleColor))
}


