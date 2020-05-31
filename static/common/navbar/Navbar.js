const NavbarState = {

}

const Navbar = () => {
    const container = $('<nav>',).append(
            $('<div>',{class:'nav-wrapper blue darken-4 darken-4'})
                .append($('<a>',{class:'brand-logo'}).text("TypicalListGrouper"))
                .append(
                    $('<ul>', {class:'right hide-on-med-and-down'})
                        .append($('<li>').append($('<a>',{href:'../dashboard'}).text('Strona główna')))
                        .append($('<li>').append($('<a>',{href:'../groups'}).text('Grupy i listy')))
                        .append($('<li>').append($('<a>',{href:'../?logout'}).text('Wyloguj')))
                )
        )

    return container
}
if(!Navbar.hide)
    $('body').prepend(Navbar())
