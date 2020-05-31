const State = {
    groups: [],
    currentGroup: 0
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

const inviteUser = () => {
    const {groupName, groupId} = State.groups[State.currentGroup]

    customModal({
        title:'Zapraszanie użytkownika',
        content: () => {
            return $('<div>')
                .append($('<p>').text('Użytkownik zostanie dołączona do grupy ' + groupName))
                .append(LabeledInput({name:'invite-email',label:"Podaj email użytkownika którego chcesz dodać"}))
        },
        action: ()=> {
            const { email } = gatherGroup('invite')
            Request.post('/API/invitations/',{data: {email, groupId}})
               // .then(window.location.href+='../groups')
        }
    })
}

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
const SingleListView = ({listName},index) => {
    const container = $('<div>',{class:'card single-list-view clickable'})
    container
        .append($('<i>',{class:'material-icons'}).text('receipt').click(()=>{}))
        .append($('<h5>').text(listName))
        .append($('<i>',{class:'material-icons'}).text('edit').click(()=>{}))
    return container;
}
const SingleUserView = ({login},index) => {
    const container = $('<div>',{class:'card single-list-view'})
    container
        .append($('<i>',{class:'material-icons'}).text('person').click(()=>{}))
        .append($('<h5>').text(login))
        .append(IconWithDesc('delete','Usuń z grupy', ()=>{}))
    return container;
}

const NoListsView = () => {
    const container = $('<div>').append("Na razie nie ma żadnej listy w tej grupie")

    return container;
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
        .append($('<h3>', {class: 'purple darken-3 white-text'}).text(currentGroup.groupName))
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
