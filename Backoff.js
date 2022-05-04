class Backoff{
    constructor(this,base,cap){
        this.base = base
        this.cap =cap
    }
    expo(n) {

        return Math.min(this.cap,Math.pow(2,n)*this.base)
    }
}
class ExpoBackoffFullJitter{
    
    backoff(n){
        var base = new Backoff().expo(n)
        var fulljitter = Math.floor((Math.random()*base)+1)
        return fulljitter
    }
   
}