class setup { 
    #route = ""
    #jsonAction = ""
    #jsonParam = ""
    
    constructor(route, action, param){
        this.#route = route
        this.#jsonAction = action
        this.#jsonParam = param
    }
    
    toRequest(){
        return {
            route: this.#route,
            jsonAction: this.#jsonAction,
            jsonParam: JSON.stringify(this.#jsonParam)
        }
    }
}

module.exports = setup;
