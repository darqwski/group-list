const createList = () => {
    const {groupName, groupId} = State.groups[State.currentGroup]
    console.log(State.groups[State.currentGroup])
    customModal({
        title:'Dodawania nowej listy',
        content: () => {
            return $('<div>')
                .append($('<p>').text('Lista zostanie dołączona do grupy ' + groupName))
                .append(LabeledInput({name:'list-listName',label:"Podaj nazwę nowej list"}))
        },
        action: ()=> {
            const { listName } = gatherGroup('list')
            Request
                .post('/API/lists/',{data: {listName, groupId}})
                .then(refreshApp)
        }
    })
}

const editList = (listId, name) => () => {
    customModal({
        title:'Edytowanie nowej listy',
        content: () => {
            return $('<div>')
                .append(LabeledInput({name:'list-listName',label:"Zmień nazwę listy", value: name}))
        },
        action: ()=> {
            const { listName } = gatherGroup('list')
            Request
                .put('/API/lists/',{data: {listName, listId}})
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

const SingleListView = ({listId, listName},index) => {
    const container = $('<div>',{class:'card single-list-view'})
    container
        .append($('<i>',{class:'material-icons'}).text('receipt'))
        .append($('<h5>').text(listName))
        .append($('<i>',{class:'material-icons'}).text('edit').click(editList(listId,listName)))
        .append($('<i>',{class:'material-icons'}).text('delete').click(deleteList(listId,listName)))
    return container;
}

const NoListsView = () => {
    const container = $('<div>').append("Na razie nie ma żadnej listy w tej grupie")

    return container;
}
