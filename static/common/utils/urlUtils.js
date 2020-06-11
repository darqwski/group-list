const getUrlParameters = () => {
    const { search } = window.location;
    if(search.length === 0) return;
    const params = search.substr(1).split('&')

    return params.reduce((memo, item)=>{
        const [key, value] = item.split("=");
        return {...memo, [key]: value || ""}
    },{})
}

const getUrlParameter = key => getUrlParameters()[key]

