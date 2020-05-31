const SingleGroup = (users,index) => {
    const { groupName } = users[0];
    const title = $('<h5>').text(`${index+1}.${groupName} (${users.length})`)
    const usersContainer = $('<ul>').append(users.map(({login})=>$('<li>').text(login)))
    return Expander({
        top: () => title,
        bottom: () => usersContainer,
        height: users.length * 30
    });
}

const CurrentGroups = ({ groups }) => {
    const container = $('<div>',{class:'card groups-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje grupy'))
    container.append(groups.length ===0 ? noGroupsView() :groups.map(SingleGroup))

    return container;
}
const noGroupsView = () => $('<div>',{class:'card'})
    .append($('<h5>').text('Nie posiadasz żadnej grupy'))
    .append($('<a>',{href:'../groups/',class:'btn blue darken-4'}).text('Załóż własną'))

