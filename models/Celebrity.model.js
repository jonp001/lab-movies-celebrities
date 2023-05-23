const mongoose= require('mongoose');
const Schema= mongoose.Schema;

let celebritySchema= new Schema({
    name: {type: String, required: true},
    occupation: String,
    catchPhrase: String
})

let Celebrity= mongoose.model("Celebrity", celebritySchema);

module.exports= Celebrity;