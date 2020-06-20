const createList = () => {
    const {groupName, groupId} = State.groups[State.currentGroup]

    customModal({
        title:'Dodawania nowej listy',
        content: () => {
            return $('<div>')
                .append($('<p>').text('Lista zostanie dołączona do grupy ' + groupName))
                .append(LabeledInput({name:'list-listName',label:"Podaj nazwę nowej list"}))
                .append(Icons())
        },
        action: ()=> {
            const { listName } = gatherGroup('list')
            Request
                .post('/API/lists/',{data: {listName, groupId, iconId: IconsState.chosenIcon }})
                .then(({message})=>showSnackbar(message))
                .then(refreshApp)
        }
    })
}

const editList = (listId, name, iconId) => () => {
    customModal({
        title:'Edytowanie nowej listy',
        content: () => $('<div>')
                .append(LabeledInput({name:'list-listName',label:"Zmień nazwę listy", value: name}))
                .append(Icons(iconId))
        ,
        action: ()=> {
            const { listName } = gatherGroup('list')
            Request
                .put('/API/lists/',{data: {listName, listId, iconId: IconsState.chosenIcon}})
                .then(refreshApp)
        }
    })
}

const deleteList = (listId, name) => () => {
    showToastWithAction({
        title:'Usuwanie listy',
        message: `Czy na pewno chcesz usunąć listę ${name}?`,
        action: () => Request
            .delete('/API/lists/',{data: {listId}})
            .then(refreshApp)
    })
}

const SingleListView = ({listId, listName, iconId,image},index) => {
    const container = $('<div>',{class:'card single-list-view'})
    container
        .append(image ? $('<img>',{src:image}) : $('<i>',{class:'material-icons'}).text('receipt'))
        .append($('<h5>').text(listName))
        .append($('<i>',{class:'material-icons clickable'}).text('edit').click(editList(listId,listName,iconId)))
        .append($('<i>',{class:'material-icons clickable'}).text('delete').click(deleteList(listId,listName)))
    return container;
}

const NoListsView = () => (
    $('<div>').append("Na razie nie ma żadnej listy w tej grupie")
)
