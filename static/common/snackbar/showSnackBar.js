const showSnackbar = (message) => {
    $("body").append($("<div>",{class:"snackbar"})
        .append($("<div>",{class:"snackbar-text"}).append(message))
        .click(()=>$(".snackbar").remove())
    )

    setTimeout(()=>$(".snackbar").remove(),5000);
}