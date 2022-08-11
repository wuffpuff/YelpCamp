module.exports = func =>{ // 'func' refers to whatever you pass in
    return (req,res,next) => { //return a new function that has 'func' executed
        func(req,res,next).catch(next); //catches any error and passes to next
    }
}