const State = {
    groups: [],
    currentGroup: undefined,
}

const editGroupColor = ({groupId,colorId, groupName}) => () => {
    customModal({
        title:'Zmiana koloru grupy',
        content: () => {
            return $('<div>').append(Colors(colorId))
        },
        action: ()=> {
            Request
                .put('/API/groups/',{data: {colorId: ColorState.colorId || 0, groupId, groupName}})
                .then(({message})=>showSnackbar(message))
                .then(refreshApp)
        }
    })
}

const editGroupName = ({groupId, groupName, colorId}) => () => {
    customModal({
        title:'Edytowanie nazwy grupy',
        content: () => {
            return $('<div>')
                .append(LabeledInput({name:'group-groupName',label:"Zmień nazwę listy", value: groupName}))
        },
        action: ()=> {
            const { groupName } = gatherGroup('group')
            Request
                .put('/API/groups/',{data: {groupName, groupId, colorId}})
                .then(({message})=>showSnackbar(message))
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
            .then(({message})=>showSnackbar(message))
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
            Request
                .post('/API/groups/',{data: {groupName}})
                .then(refreshApp)
        }
    })
}

const SingleGroupView = ({groupName, login: admin, colorHex, image, users, lists}, index) => (
    $('<div>',{class:'card group '+(index !== undefined ? 'clickable': ''),style:'background-color: '+(colorHex || '#FFFFFF')})
        .append($('<div>',{class:'group-title'})
            .append($('<i>',{class:'material-icons'}).text('group'))
            .append($('<div>').append(
                $('<h5>').text(groupName)
            )
                .append(
                    $('<p>').text(`Administrator ${admin}`)
                ))
            .append(index ===undefined && $('<i>',{class:'material-icons clickable'}).text('close').click(()=>{
                State.currentGroup = undefined
                render()
            }))
        )
        .append(
            $('<div>')
                .append(
                    $('<div>',{class:'group-desc'})
                        .append($('<i>',{class:'material-icons'}).text('assignment'))
                        .append($('<span>').text(`${lists.length} list`))
                )
                .append(
                    $('<div>',{class:'group-desc'})
                        .append($('<i>',{class:'material-icons'}).text('group'))
                        .append($('<span>').text(`${users.length} użytkowników w grupie`))
                )
        ).click(()=>{
            if(index !== undefined ){
                State.currentGroup = index;
                render()
            }
    })
)

const ListManager = ({lists}) => {
    const container = $('<div>',{class:'lists-card'})
    container.append($('<h5>',{class:'blue darken-3 white-text'}).text('List w grupie'))
    container.append(lists.length === 0 ? NoListsView() : lists.map(SingleListView))
    container.append($('<div>',{class:'card white single-list-view'}).append(IconWithDesc('add','Dodaj nową listę',createList)))
    return container
}

const UserManager = ({users}) => {
    const container = $('<div>',{class:'lists-card'})
    const {groupName, groupId} = State.groups[State.currentGroup]
    container.append($('<h5>',{class:'blue darken-3 white-text'}).text('Członkowie'))
    container.append(users.length === 0 ? noListsView() : users.map(user=>SingleUserView({...user, groupId})))
    container.append($('<div>',{class:'card white single-list-view'}).append(IconWithDesc('mail',"Zaproś użytkownika",inviteUser)))

    return container
}

const SingleGroupEdit = (group) => {
    const container = $('<div>', {class:'group-edit'})
    container.append(SingleGroupView(group))
    const {groupName, login: admin, colorHex, image, users, lists} = group;
    return container;
}

const render = () => {
    const { groups, currentGroup } = State;

    if(currentGroup === undefined){
        const container = $('<div>',{class:'groups-container'})
        container.append(groups.map(SingleGroupView))
        container.append($('<div>',{class:'card add-group'}).append(IconWithDesc('add','Dodaj nową grupę',addNewGroup)))
        $('#app').empty().append(container);

    } else {
        const container = $('<div>')
        container.append(SingleGroupEdit(groups[currentGroup]))
        container.append($('<div>',{class:'card group-options'})
            .append(IconWithDesc('edit','Zmień nazwę grupy',editGroupName(groups[currentGroup])))
            .append(IconWithDesc('palette','Zmień kolor grupy',editGroupColor(groups[currentGroup])))
            .append(IconWithDesc('delete','Usuń grupę',deleteGroup(groups[currentGroup])))
        )
        container.append(
            $('<div>',{class:'edit-container'})
                .append(ListManager(groups[currentGroup]))
                .append(UserManager(groups[currentGroup]))
        )

        $('#app').empty().append(container);
    }

}

const mergeGroupsAndLists = ({groups, lists}) => {
    return groups.map((item,index)=>({ ...groups[index],lists: lists[index]}));
}

const refreshApp = () => Request.get('/API/groups/details/').then(({groups, lists}) => {
    State.groups = mergeGroupsAndLists({groups, lists});
    render();
})
refreshApp();
