const gatherInputs = ()=>(
    $('input').toArray().reduce((memo,item)=>{
        const index =$(item).attr("name");
        const value =$(item).val();
        return { ...memo, [index]: value};
    }, {})
)

const gatherInputsGroup = groupName => {
    const allInputs = gatherInputs();
    const properKeys = Object.keys(allInputs).filter((item) => item.includes(groupName))
    return properKeys.reduce((memo, item)=>({...memo, [[item.slice((groupName+"-").length)]]: allInputs[item]}),{})
}

const gatherSelects = ()=> (
    $('select').toArray().reduce((memo,item)=>{
        const index =$(item).attr("name");
        const value =$(item).val();
        return { ...memo, [index]: value};
    }, {})
)

const gatherSelectsGroup = groupName => {
    const allSelects = gatherSelects();
    const properKeys = Object.keys(allSelects).filter((item) => item.includes(groupName))
    return properKeys.reduce((memo, item)=>({...memo, [[item.slice((groupName+"-").length)]]: allSelects[item]}),{})
}

const gatherGroup = groupName => ({
    ...gatherInputsGroup(groupName),
    ...gatherSelectsGroup(groupName)
})