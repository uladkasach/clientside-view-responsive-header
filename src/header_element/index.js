var view_loader = require("clientside-view-loader");
module.exports = async function(structure){
    var this_dir = window.script_location.pathname.split("/").slice(0, -1).join("/")+"/";
    var dom = await view_loader.load(this_dir).build(structure);
    return dom;
}
