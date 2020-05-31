const BaseRequest = (address, props) =>  fetch(serverUrl+address,{
        ...props,
        body: props.data ? JSON.stringify(props.data): undefined,
}).then(response=>response.json())


const Request = {
    post: (address, props = {}) => BaseRequest(address,{...props, method:'POST'}),
    get: (address, props= {}) => BaseRequest(address,{...props, method:'GET'}),
    put: (address, props= {}) => BaseRequest(address,{...props, method:'PUT'}),
    delete: (address, props= {}) => BaseRequest(address,{...props, method:'DELETE'}),
}
