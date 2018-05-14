require("./styles.css");
var template = {};

module.exports = {
    generate : function(dom, options){
        // header parts
        var right_part = dom.querySelector(".header_side-right");
        var left_part = dom.querySelector(".header_side-left");

        // template elements
        template.header_element = {
            basic : dom.querySelector("template-holder div.header_element"),
            anchor : dom.querySelector("template-holder a.header_element")
        };

        // append elements to each part
        console.log(options); // expect options to be json of header
        this.append_elements(right_part, options.right);
        this.append_elements(left_part, options.left);

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
        // genereate basic element
        var header_element = (typeof structure.src == "string")? template.header_element.anchor : template.header_element.basic; // if src is defined, use anchor element
        var this_element = header_element.cloneNode(true);

        // attach title if defined
        if(typeof structure.title == "string") this_element.textContent = structure.title;

        // insert html if defined
        if(typeof structure.html == "string") this_element.innerHTML = structure.html;

        // attach src
        if(typeof structure.src == "string") this_element.href = structure.src;

        // TODO - append dropdown

        // return built element
        return this_element;
    }
}
