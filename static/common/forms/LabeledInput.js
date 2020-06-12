const LabeledInput = ({ label, name, error, errorMessage, onChange = ()=>{},...rest}) => {
    const inputId = 'inputid'+ name;
    return $('<div>', {class: 'white labeled-input'+(error ? ' error': '')})
        .append(error ? $('<p>',{class:'error-message'}).text(errorMessage):$('<p>'))
        .append($('<input>',{id:inputId, name, ...rest}).change(onChange))
        .append($('<label>',{for:inputId}).text(label))
}
