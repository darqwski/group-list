const CurrentInvitations = ({ invitations }) => {
    const container = $('<div>',{class:'card groups-card'})
    container.append($('<h3>', {class: 'purple darken-3 white-text'}).text('Twoje zaproszenia'))
    container.append(invitations.map(SingleInvitation))
    return container;
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
const confirmInvitation = ({invitationId}) => {
    Request.put('/API/invitations',{data: {invitationId}})
        .then(refreshApp)

}
const rejectInvitation = ({invitationId}) => {
    Request.delete('/API/invitations',{data: {invitationId}})
        .then(refreshApp)
}
