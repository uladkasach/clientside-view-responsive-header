var view_loader = require("clientside-view-loader");
module.exports = async function(structure){
    var this_dir = window.script_location.origin + window.script_location.pathdir;
    var dom = await view_loader.load(this_dir).build(structure);
    return dom;
}
