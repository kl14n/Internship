class param {
    #action = ""
    #parameter = ""
    
    constructor(act, param){
        this.#action = act
        this.#parameter = param
    }
    
    toRequest(){
        return {
            action: this.#action,
            parameter: JSON.stringify(this.#parameter)
        }
    }
}

module.exports = param, route;
