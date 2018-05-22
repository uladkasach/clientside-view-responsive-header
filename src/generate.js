require("./styles.css");
var template = {};
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
    define generator
*/
var generator = {
    generate : async function(dom, options){
        // normalize options
        if(typeof options.structure == "undefined" && typeof options == "object") options = {structure:options}; // assume that if structure is not defined in options that all of options is just structure
        if(typeof options.structure == "undefined") throw new Error("options must be defined");
        if(typeof options.style == "undefined") options.style = {};

        // header parts
        var left_part = dom.querySelector(".header_side-left");
        var right_part = dom.querySelector(".header_side-right");

        // template elements
        var template_dom = dom.querySelector("template-holder");
        template = {
            header_element : template_dom.querySelector(".header_element"),
            header_components : {
                button : template_dom.querySelector(".header_button"),
                dropdown : template_dom.querySelector(".header_dropdown"),
            },
            basic_structures : {
                line : template_dom.querySelector(".header_dividing_line_element"),
            },
        }


        /*
            change style of template elements based on user options globally
        */
        if(typeof options.style.element_max_width == "string") options.style.element_max_width = parseInt(options.style.element_max_width);
        if(typeof options.style.element_min_width == "string") options.style.element_min_width = parseInt(options.style.element_min_width);
        if(typeof options.style.element_max_width == "number") template.header_element.style.maxWidth = options.style.element_max_width + "px";
        if(typeof options.style.element_min_width == "number") template.header_element.style.minWidth = options.style.element_min_width + "px";
        // note that if we change backgroudn color of header_element we must also consider the hover color change.

        /*
            change style of header_root dom based on select options
        */
        // define the opacity of the background
        if(typeof options.style.opacity == "number"){
            var rgba_color = hex_to_rgb(style_defaults.background_color.root, options.style.opacity);
            dom.style.backgroundColor = rgba_color;
        }

        // let user change background color completely
        if(typeof options.style.background_color == "string") dom.style.backgroundColor = options.style.background_color;
        if(typeof options.style.backgroundColor == "string") dom.style.backgroundColor = options.style.backgroundColor;

        // let user modify height of header
        var header_height = (typeof options.style.height == "string")? options.style.height : style_defaults.height;
        dom.style.height = header_height;

        // font
        if(typeof options.style.font_weight == "string") dom.style.fontWeight = options.style.font_weight;
        if(typeof options.style.font_size == "string") dom.style.fontSize = options.style.font_size;


        /*
            render elements
        */
        // append elements to each part
        this.append_elements(left_part, options.structure.left);
        this.append_elements(right_part, options.structure.right);

        // append the menu element to the right part
        var menu_element = this.convert_element_structure({title:"More", elements:[]});
        menu_element.classList.add('header_menu_element');
        menu_element.querySelector(".header_dropdown").style.right=0; // ensure does not go outside of page bounds, even if overflowing
        right_part.appendChild(menu_element);

        // return DOM
        return dom;
    },
    append_elements : function(parent_node, elements_outline){
        elements_outline.forEach(element_structure=>{
            var element = this.convert_structure_to_element(element_structure);
            parent_node.appendChild(element);
        })
    },
    convert_structure_to_element : function(structure){

        if(typeof structure == "object") return this.convert_element_structure(structure);
        if(typeof structure == "string") return this.convert_basic_structure(structure);
    },
    convert_basic_structure : function(identifier){
        /*
            if it is a valid basic structure, generate it
        */
        var valid_basic_structures = Object.keys(template.basic_structures);
        if(valid_basic_structures.includes(identifier)) return template.basic_structures[identifier].cloneNode(true);

        /*
            otherwise, asume they just wanted the "text" property to be the identifier
        */
        return this.convert_element_structure({text:identifier});
    },
    convert_element_structure : function(structure){
        // evaluate structure
        var dropdown_requested = Array.isArray(structure.elements);

        // define elements in template
        var element = template.header_element.cloneNode(true);
        if(typeof structure.id == "string") element.id = structure.id; // attach id if defined to element

        // determine whether to hover
        if(structure.no_hover === true) element.classList.add("header_element_no_hover");

        /*
            build button
        */
        var button = template.header_components.button.cloneNode(true);
        element.appendChild(button); // append to DOM
        var content_holder = button.querySelector(".header_element_content_holder");
        var dropdown_arrow = button.querySelector(".header_element_dropdown_arrow");
        var dropdown_expander = button.querySelector(".header_element_dropdown_expand");
        if(typeof structure.src == "string"){ // attach src
            button.href = structure.src;
            button.classList.add("header-clickable_button");
        }
        if(typeof structure.text == "string") content_holder.textContent = structure.text; // attach text if defined
        if(typeof structure.html == "string") content_holder.innerHTML = structure.html; // insert html if defined
        if(dropdown_requested){
            dropdown_arrow.style.display="flex"; // display dropdown arrow if dropdown requested (hidden by styles.css depending on nesting)
            dropdown_expander.style.display="flex"; // display dropdown expander if dropdown is requested (hidden by styles.css depending on nesting)
        }

        /*
            build and attach dropdown if requested (recursive);
                - note, that whether the elements are drop down or offset depends on whether they are nested already or not
                - this is controlled in the styles.css sheet
        */
        if(dropdown_requested){
            var dropdown = template.header_components.dropdown.cloneNode(true);
            element.appendChild(dropdown); // attach the element to the dom
            structure.elements.forEach((element_structure)=>{
                var dropdown_element = this.convert_structure_to_element(element_structure);
                dropdown.appendChild(dropdown_element);
            })
        }


        /*
            manipulate style based on structure specific style options
        */
        if(typeof structure.max_width == "string") structure.max_width = parseInt(structure.max_width);
        if(typeof structure.min_width == "string") structure.min_width = parseInt(structure.min_width);
        if(typeof structure.max_width == "number") element.style.maxWidth = structure.max_width + "px";
        if(typeof structure.min_width == "number") element.style.minWidth = structure.min_width + "px";


        // return built element
        return element;
    },
}


/*
    return the bound generate function
*/
module.exports = generator.generate.bind(generator);
