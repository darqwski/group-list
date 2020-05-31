const State = {
    currentList: 0
}

const CurrentLists = ({ lists }) => {
    const container = $('<div>',{class:'card list-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje listy'))
    container.append(lists.length === 0 ?
        noListsView() :
        lists.map((list, index) => (
                !!list.length && $('<h5>',{class:'single-list'})
                    .text(`${index+1}.${list[0].listName} (${list.length})`)
                    .click(()=>{State.currentList = index;render();})
        )))
    return container;
}

const noListsView = () => $('<h5>').text("Aktualnie nie posiadasz żadnej listy")

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

const emptyView = () => {
    const container = $('<div>',{class:'card table-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text("Tutaj będzie twoja lista zadań"))
    container.append(
        $('<div>',{class:'empty-card'})
            .append($('<p>')
                .append(`Aplikacja służy do notatek grupowych, więc aby z niej korzystać `)
                .append($('<a>',{href:'../groups/'}).text('Stwórz Własną!')))
            .append($('<p>').append('Dalej należy utworzyć listę a potem można korzystać z aplikacji'))
    )

    return container
}

const Table = ({ lists, currentList }) => {
    if(lists.length === 0) {
        return emptyView();
    }
    const items = lists[currentList];
    const list = lists[currentList][0]
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
    container.append(Table({lists, currentList}))
    container.append()


    $('#app').empty().append(container)
}
const refreshApp = () => Request.get('/API/groups/')
    .then(groups=>{State.groups = groups})
    .then(() => Request.get('/API/lists/'))
    .then(lists=>State.lists = lists.reduce((memo,item)=>([...memo, ...item]),[]))
    .then(() => Request.get('/API/invitations/?type=receiver'))
    .then(invitations=>State.invitations = invitations)
    .then(render)

refreshApp();
