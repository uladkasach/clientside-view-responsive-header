require("./styles.css");
var create_header_element = require("./../header_element/index.js");


/*
    define generator
*/
var generator = {
    generate : async function(dom, options){

        // normalize options
        if(typeof options.structure == "undefined" && typeof options == "object") options = {structure:options}; // assume that if structure is not defined in options that all of options is just structure
        if(typeof options.structure == "undefined") throw new Error("options must be defined");
        if(typeof options.style == "undefined") options.style = {};
        if(typeof options.style.elements == "undefined") options.style.elements = {};

        // define header parts
        var left_part = dom.querySelector(".header_side-left");
        var right_part = dom.querySelector(".header_side-right");

        // append elements to each part
        await this.append_elements(left_part, options.structure.left, options.style.elements);
        await this.append_elements(right_part, options.structure.right, options.style.elements);

        // append the menu element to the right part
        var menu_element = await create_header_element({title:"More", elements:[]});
        menu_element.classList.add('header_menu_element');
        menu_element.querySelector(".header_dropdown").style.right=0; // ensure does not go outside of page bounds, even if overflowing; TODO - find a better solution
        menu_element.hide(); // style.display = "none";
        right_part.appendChild(menu_element);


        // return DOM
        return dom;
    },
    append_elements : async function(parent_node, structures, style){
        for(var i = 0; i < structures.length; i++){
            var structure = structures[i];
            structure = this.append_default_style(structure, style);
            if(typeof structure == "string") structure = {text:structure}; // assume they wanted the "text" property to be the "structure"
            var element = await create_header_element(structure); // create the header element
            parent_node.appendChild(element);
        }
    },

    /*
        updating style based on options
    */
    append_default_style : function(structure, style){
        var structure = Object.assign(style, structure); // overlay structure onto style element. structure overwrites style properties.
        return structure;
    },
    update_root_style : function(dom, style){
        var style_defaults = {
            background_color : { /* https://material.io/design/color/the-color-system.html#tools-for-picking-colors */
                root :  "#424242",
                element : "#616161",
            },
            height : "60px",
        }

        function hex_to_rgb(hex, alpha){ // https://stackoverflow.com/a/28056903/3068233
            var r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16);

            if (alpha) {
                return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
            } else {
                return "rgb(" + r + ", " + g + ", " + b + ")";
            }
        }

        /*
            change style of header_root dom based on select options
        */
        // define the opacity of the background
        if(typeof style.opacity == "number"){
            var rgba_color = hex_to_rgb(style_defaults.background_color.root, style.opacity);
            dom.style.backgroundColor = rgba_color;
        }

        // let user change background color completely
        if(typeof style.background_color == "string") dom.style.backgroundColor = style.background_color;
        if(typeof style.backgroundColor == "string") dom.style.backgroundColor = style.backgroundColor;

        // let user modify height of header
        var header_height = (typeof style.height == "string")? style.height : style_defaults.height;
        dom.style.height = header_height;

        // font
        if(typeof style.font_weight == "string") dom.style.fontWeight = style.font_weight;
        if(typeof style.font_size == "string") dom.style.fontSize = style.font_size;
    },
}


/*
    return the bound generate function
*/
module.exports = generator.generate.bind(generator);
