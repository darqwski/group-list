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

const SingleUserView = ({login,groupId, groupName, userId},index) => {
    const container = $('<div>',{class:'card single-list-view'})
    container
        .append($('<i>',{class:'material-icons'}).text('person').click(()=>{}))
        .append($('<h5>').text(login))
        .append(IconWithDesc('delete','Usuń z grupy', ()=>showToastWithAction({
            title: 'Usuwanie użytkownika',
            message: `Czy na pewno chcesz usunąć ${login} z grupy ${groupName}?`,
            action: () => Request.delete('/API/groups/details/',{data: {groupId, userId}}).then(refreshApp)
        })))
    return container;
}
