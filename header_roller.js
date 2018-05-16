
var Header_Roller = function(all_elements, width_per_element, content_holder, menu_element){
    console.log(content_holder);
    this.all_elements = all_elements;
    this.menu_element = menu_element;
    this.width_per_element = width_per_element;
    this.holders = {
        content : content_holder,
        menu_dropdown : menu_element.querySelector(".header_dropdown"),
    };
}
Header_Roller.prototype = {
    unwrap_only_x_elements : function(elements_to_unwrap){
        // recreate positions each update,
        //      first elements_to_unwrap elements go to always_open
        //      last elements_to_unwrap elements go to menu_element_dropdown
        var unwrapped_elements = this.all_elements.slice(0, elements_to_unwrap);
        var wrapped_elements = this.all_elements.slice(elements_to_unwrap);
        unwrapped_elements.forEach((element)=>{
            this.holders.content.appendChild(element);
        })
        wrapped_elements.forEach((element)=>{
            this.holders.menu_dropdown.appendChild(element);
        })
        console.log(unwrapped_elements);
        console.log(wrapped_elements);

        // append menu element to end
        this.holders.content.appendChild(this.menu_element);

        // if unwrapped_elements = 0, then change menu element title to "Menu";
        if(unwrapped_elements.length == 0){
            this.menu_element.querySelector(".header_element_content_holder").textContent = "Menu";
        } else {
            this.menu_element.querySelector(".header_element_content_holder").textContent = "More";
        }

        // if wrapped_elements = 0, then hide menu element
        if(wrapped_elements.length == 0){
            this.menu_element.style.display = "none";
        } else {
            this.menu_element.style.display = "block";
        }
    },
}

module.exports = Header_Roller;
