const State = {
    groups: [],
    currentGroup: 0
}

const editGroup = ({groupId, groupName}) => () => {
    customModal({
        title:'Edytowanie nazwy grupy',
        content: () => {
            return $('<div>')
                .append(LabeledInput({name:'group-groupName',label:"Zmień nazwę listy", value: groupName}))
        },
        action: ()=> {
            const { groupName } = gatherGroup('group')
            Request
                .put('/API/groups/',{data: {groupName, groupId}})
                .then(refreshApp)
        }
    })
}
const deleteGroup = ({groupId, groupName}) => () => {
    showToastWithAction({
        title:'Usuwanie grupy',
        message: `Czy na pewno chcesz tą  grupę ${groupName}?`,
        action: () => Request
            .delete('/API/groups/',{data: {groupId}})
            .then(refreshApp)
    })
}

const addNewGroup = () => {
    customModal({
        title:'Dodawania nowej grupy',
        content: () => {
            return $('<div>').append(LabeledInput({name:'group-groupName',label:"Podaj nazwę nowej grupy"}))
        },
        action: ()=> {
            const { groupName } = gatherGroup('group')
            Request.post('/API/groups/',{data: {groupName}})
                .then(window.location.href+='../groups')
        }
    })
}

const render = () => {
    const { groups, currentGroup: currentGroupIndex } = State;
    const currentGroup = groups[currentGroupIndex]
    if( groups.length === 0 ){

    }
    const container = $('<div>',{class:'groups-board'})
    const groupList = $('<div>',{class: 'card group-list'})
        .append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje grupy'))
        .append($('<div>').append(groups.map(({groupName}, index)=>(
            $('<button>',{class: 'btn purple darken-4'})
                .text(groupName)
                .click(()=>{
                    State.currentGroup = index;
                    render();
                })
            )
        )))
        .append(IconWithDesc('add','Dodaj nową grupę',addNewGroup))

    const groupDetails = $('<div>',{class: 'card group-details purple lighten-4'})
        .append(
            $('<div>',{class:'group-title purple darken-3 white-text'})
                .append($('<h3>').text(currentGroup.groupName))
                .append($('<i>',{class:'material-icons'}).text('edit').click(editGroup(currentGroup)))
                .append($('<i>',{class:'material-icons'}).text('delete').click(deleteGroup(currentGroup)))
        )
        .append($('<h5>',{ class: 'purple darken-2 white-text'}).text(`Listy w grupie`))
        .append(
            $('<div>')
                .append( currentGroup.lists.length === 0 ? NoListsView() : currentGroup.lists.map(SingleListView))
                .append($('<div>',{class:'card white'}).append(IconWithDesc('add','Dodaj nową listę',createList)))
        )
        .append($('<h5>',{ class: 'purple darken-2 white-text'}).text(`Członkowie w grupie`))
        .append(
            $('<div>')
                .append(currentGroup.groups.map(SingleUserView))
                .append($('<div>',{class:'card white'}).append(IconWithDesc('mail','Zaproś użytkownika',inviteUser)))
        )

    $('#app').empty().append(container.append(groupList).append(groupDetails));
}

const mergeGroupsAndLists = ({groups, lists}) => {
    return groups.map((item,index)=>({ ...groups[index][0],groups: groups[index],lists: lists[index]}));
}

const refreshApp = () => Request.get('/API/groups/details/').then(({groups, lists}) => {
    State.groups = mergeGroupsAndLists({groups, lists});
    render();
})
refreshApp();
