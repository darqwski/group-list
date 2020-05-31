$('nav').hide();

const State = {
    names : {}
}

const onSubmit = e => {
    e.preventDefault();
    const { login, email, password, repeat} = gatherGroup('register')
    const fields = {login, email, password, repeat};
    const names = Object.keys(fields).reduce((memo,key)=>({...memo, [key]: {value: fields[key], error: fields[key] === ''}}),{})
    if(repeat !== password){
        names.repeat.error = true;
        names.repeat.errorMessage = "Hasła muszą być indentyczne";
        names.password.error = true;
        names.password.errorMessage = "Hasła muszą być indentyczne";
    }
    State.names = names;

    if(Object.entries(names).find(([key, item])=> item.error)){
        render();
        return;
    }

    Request.post('/API/register/',{data: {login, email, password}}).then(()=>window.location.href = 'confirm/')
}

const onChange = () => {

}
const render = () => {
    const container = $('<form>',{class:'card main-card'}).submit(onSubmit)
    const { names } = State;
    const {login, email, password, repeat} = names;
    container
        .append($('<h2>').text('Panel rejestracji'))
        .append(LabeledInput({label:'Podaj login', name:'register-login',onChange, ...login}))
        .append(LabeledInput({label:'Podaj email', name:'register-email',onChange,...email}))
        .append(LabeledInput({label:'Podaj hasło', name:'register-password', type: 'password',onChange,...password}))
        .append(LabeledInput({label:'Powtórz hasło', name:'register-repeat',type: 'password',onChange,...repeat}))
        .append($('<button>',{type:'submit',class:'btn purple darken-4'}).text('Zarejestruj',onChange))

    $('#app').empty().append(container);
}

render();
