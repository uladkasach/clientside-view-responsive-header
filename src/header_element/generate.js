require("./styles.css");
var create_header_element = require("./index.js");
module.exports = async function(element, structure){
    /*
        normalize options
    */
    // extract style from structure for a specific set of properties
    var style = {};
    var style_properties = ["max_width", "min_width", "background_color"];
    style_properties.forEach((prop)=>{
        if(typeof structure[prop] != "undefined") style[prop] = structure[prop];
    })

    // normalize style
    if(typeof style.min_width != "string") style.min_width = parseInt(style.min_width);
    if(typeof style.max_width != "string") style.max_width = parseInt(style.max_width);

    // normalize structure
    if(typeof structure.elements == "undefined") structure.elements = [];


    /*
        build DOM
    */
    // define element basics based on requests
    if(typeof structure.id == "string") element.id = structure.id; // attach id if defined to element if requeseted
    if(structure.no_hover === true) element.classList.add("header_element_no_hover"); // remove hover if rquested

    // attach src if requested
    var button = element.querySelector("a.header_button");
    if(typeof structure.src == "string"){ // attach src
        button.href = structure.src;
        button.classList.add("header-clickable_button");
    }

    // add content to button if requested
    var content_holder = button.querySelector(".header_element_content_holder");
    if(typeof structure.text == "string") content_holder.textContent = structure.text; // attach text if defined
    if(typeof structure.html == "string") content_holder.innerHTML = structure.html; // insert html if defined

    // build and attach dropdown (recursive);
    var dropdown = element.querySelector(".header_dropdown");
    for(var i = 0; i < structure.elements.length; i++){
        var subelement_structure = structure.elements[i];
        if(typeof subelement_structure == "string") subelement_structure = {text:subelement_structure};
        append_default_style(subelement_structure, style);
        var dropdown_element = await create_header_element(subelement_structure);
        dropdown.appendChild(dropdown_element);
    }


    /*
        Style DOM
    */
    // apply style
    if(typeof style.max_width == "number") element.style.maxWidth = style.max_width + "px";
    if(typeof style.min_width == "number") element.style.minWidth = style.min_width + "px";
    if(typeof style.background_color == "string") dropdown.style.backgroundColor = style.background_color; // note that we color the dropdown

    // return built element
    return element;
}



append_default_style = function(structure, style){
    var structure = Object.assign({}, style, structure); // overlay structure onto style element. structure overwrites style properties. empty object at front to not modify any original data
    return structure;
}
