class upload {
    #action = ""
    #parameter = ""
    
    constructor(action, param){
        this.#action = action
        this.#parameter = param
    }
    
    toRequest(){
        return {
            action: this.#action,
            parameter: JSON.stringify(this.#parameter)
        }
    }
}

module.exports = upload;
