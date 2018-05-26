var Header_Roller = require("./header_roller");
var hydrate = function(dom, options){
    // normalize options
    if(typeof options == "undefined") options = {};
    if(typeof options.style == "undefined") options.style = {};
    if(typeof options.style.element == "undefined") options.style.element = {};
    if(typeof options.style.element.min_width == "undefined") options.style.element.min_width = 160; // default min width

    // append the listener for width changes to update the header
    var menu_element = dom.querySelector(".header_menu_element");
    var left_part = dom.querySelector(".header_side-left");
    var right_part = dom.querySelector(".header_side-right");
    var right_elements = dom.querySelectorAll(".header_side-right > .header_element:not(.header_menu_element)");
    right_elements = Array.from(right_elements); // convert NodeList to array
    var header_roller = new Header_Roller(right_elements, options.style.element_min_width, right_part, menu_element, left_part);
    header_roller.listen();
    dom.header_roller = header_roller;

    // return the hydrated dom
    return dom;
}
module.exports = hydrate;
