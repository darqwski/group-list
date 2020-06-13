
const Navbar = () => {
    const container = $('<nav>',).append(
            $('<div>',{class:'nav-wrapper blue darken-4 darken-4'})
                .append($('<a>',{class:'brand-logo'}).text("TypicalListGrouper"))
                .append(
                    $('<ul>', {class:'right hide-on-med-and-down'})
                        .append($('<li>').append($('<a>',{href:'../dashboard'}).text('Strona główna')))
                        .append($('<li>').append($('<a>',{href:'../groups'}).text('Grupy i listy')))
                        .append($('<li>').append($('<a>',{href:'../logout'}).text('Wyloguj')))
                )
                .append(
                    $('<a>',{class:'sidenav-trigger','data-target':"mobile-menu"})
                    .append($('<i>',{class:'material-icons left show-on-med-and-down'}).text('menu'))
                )
                .append(
                    $('<ul>', {class:'sidenav',id:'mobile-menu'})
                        .append($('<li>').append($('<a>',{href:'../dashboard'}).text('Strona główna')))
                        .append($('<li>').append($('<a>',{href:'../groups'}).text('Grupy i listy')))
                        .append($('<li>').append($('<a>',{href:'../logout'}).text('Wyloguj')))
                )
        )

    return container
}
if(!Navbar.hide)
    $('body').prepend(Navbar())
M.AutoInit()
