var create_header_element = require("./index.js");
module.exports = async function(dom, structure){
    // normalize structure
    if(typeof structure.elements == "undefined") structure.elements = [];

    // define element basics based on requests
    if(typeof structure.id == "string") dom.id = structure.id; // attach id if defined to element if requeseted
    if(structure.no_hover === true) dom.classList.add("header_element_no_hover"); // remove hover if rquested

    // attach src if requested
    var button = dom.querySelector("a.header_button");
    if(typeof structure.src == "string"){ // attach src
        button.href = structure.src;
        button.classList.add("header-clickable_button");
    }

    // add content to button if requested
    var content_holder = button.querySelector(".header_element_content_holder");
    if(typeof structure.text == "string") content_holder.textContent = structure.text; // attach text if defined
    if(typeof structure.html == "string") content_holder.innerHTML = structure.html; // insert html if defined

    /*
        build and attach dropdown (recursive);
    */
    var dropdown_content_holder = dom.querySelector(".header_dropdown_content");
    structure.elements.forEach((subelement_structure)=>{
        var dropdown_element = create_header_element(subelement_structure);
        dropdown_content_holder.appendChild(dropdown_element);
    })

    /*
        manipulate style based on structure specific style options
    */
    if(typeof structure.max_width == "number") dom.style.maxWidth = structure.max_width + "px";
    if(typeof structure.min_width == "number") dom.style.minWidth = structure.min_width + "px";

    // return built element
    return dom;
}
