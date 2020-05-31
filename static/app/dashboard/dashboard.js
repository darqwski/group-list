const State = {
    currentList: 0
}

const SingleGroup = (users,index) => {
    const { groupName } = users[0];
    const title = $('<h5>').text(`${index+1}.${groupName} (${users.length})`)
    const usersContainer = $('<ul>').append(users.map(({login})=>$('<li>').text(login)))
    return Expander({
        top: () => title,
        bottom: () => usersContainer,
    });
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
const addNewList = () => {

}
const confirmInvitation = ({invitationId}) => {
    Request.put('/API/invitations',{data: {invitationId}})
        .then(refreshApp)

}
const rejectInvitation = ({invitationId}) => {
    Request.delete('/API/invitations',{data: {invitationId}})
        .then(refreshApp)
}

const SingleInvitation = ({login, groupName, datetime, invitationId}, index) => {
    const container = $('<div>',{class:'card invitation'})

    container
        .append($('<h6>').text(`Otrzymano zaproszenie do grupy ${groupName}`))
        .append($('<h7>').text(`${login} ${datetime}`))
        .append(
            $('<div>')
                .append($('<button>',{ class: 'btn green'}).text('Przyjmij').click(()=>confirmInvitation({ invitationId})))
                .append($('<button>',{ class: 'btn red'}).text('Odrzuć').click(()=>rejectInvitation({ invitationId})))
        )

    return container
}
const CurrentGroups = ({ groups }) => {
    const container = $('<div>',{class:'card groups-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje grupy'))
    container.append(groups.map(SingleGroup))
//    container.append(IconWithDesc('add','Dodaj nową grupę',addNewGroup))
    return container;
}
const CurrentInvitations = ({ invitations }) => {
    const container = $('<div>',{class:'card groups-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje zaproszenia'))
    container.append(invitations.map(SingleInvitation))
    return container;
}
const CurrentLists = ({ lists }) => {
    const container = $('<div>',{class:'card list-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje listy'))
    container.append(
        lists.map((list, index) => (
                !!list.length && $('<h5>',{class:'single-list'})
                    .text(`${index+1}.${list[0].listName} (${list.length})`)
                    .click(()=>{State.currentList = index;render();})
        )))
  //  container.append(IconWithDesc('add','Dodaj nową listę',addNewList))
    return container;
}

const SingleItemView = ({itemName, status, itemId}, index) => {
    const container = $('<div>',{ class: 'single-item'}).append(
        $('<label>')
            .append(
                $('<input>',{type:'checkbox', checked: +status ? 'checked' : undefined})
                    .click(()=>toggleItem(itemId))
            )
            .append($('<span>').text(`${index+1}. ${itemName}`))
    )

    return container
}

const addNewItem = () => {
   const { item } = gatherGroup('new');
   const { listId } =  State.lists[State.currentList][0]
   Request.post('/API/items/',{data: { itemName: item, listId}})
       .then(refreshApp)
}
const toggleItem= itemId => {
   Request.put('/API/items/',{data: { itemId}})
       .then(refreshApp)
}

const Table = ({ items, list }) => {
    const container = $('<div>',{class:'card table-card'})
    const { listName } = list;
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text(listName))
    container.append($('<form>')
        .append($(LabeledInput({name: 'new-item', label:'Dodaj nową rzecz'})))
        .append($('<i>',{class:'material-icons'}).text('add').click(addNewItem))
    )
    const todo = items.filter(({status, itemId})=>+status === 0 && itemId);
    container.append($('<h5>').text(`Do zrobienia ${todo.length}`))
    container.append($('<div>').append(todo.map(SingleItemView)))
    const done = items.filter(({status, itemId})=>+status === 1 && itemId);
    container.append($('<h5>').text(`Do zrobienia ${done.length}`))
    container.append($('<div>').append(done.map(SingleItemView)))
    return container

}
const render = () => {
    const container = $('<div>',{class:'container'})
    const { groups, lists = [[]], currentList = 0, invitations} = State;

    container.append($('<div>')
        .append(invitations.length === 0 ? undefined :CurrentInvitations({invitations}))
        .append(CurrentLists({lists}))
        .append(CurrentGroups({groups}))
    )
    container.append(Table({items: lists[currentList], list: lists[currentList][0]}))
    container.append()


    $('#app').empty().append(container)
}
const refreshApp = () => Request.get('/API/groups/')
    .then(groups=>{
        State.groups = groups
    })
    .then(() => Request.get('/API/lists/'))
    .then(lists=>State.lists = lists.reduce((memo,item)=>([...memo, ...item]),[]))
    .then(() => Request.get('/API/invitations/?type=receiver'))
    .then(invitations=>State.invitations = invitations)
    .then(render)

refreshApp();
