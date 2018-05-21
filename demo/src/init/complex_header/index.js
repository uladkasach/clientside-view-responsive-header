var view_loader = require("clientside-view-loader");
var header_structure = require("./header_structure.json");
module.exports = (async function(){
    var build_options = {
        structure : header_structure,
        style : {
            element_min_width : 180,
            element_min_width : 140
        }
    }
    var dom = await view_loader.load("clientside-view-responsive-header").build(build_options);
    return dom;
})()
