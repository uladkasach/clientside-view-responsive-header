var view_loader = require("clientside-view-loader");
var header_structure = require("./header_structure.json");
module.exports = (async function(){
    var dom = await view_loader.load("/_views/global/header_builder").generate(header_structure);
    return dom;
})()
