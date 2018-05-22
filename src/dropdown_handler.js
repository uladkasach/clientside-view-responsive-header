var Dropdown_Handler = function(dropdown_element, expander_button, hover_down_arrow){
    this.dropdown = dropdown_element;
    this.button = expander_button;
    this.arrow = hover_down_arrow;
}
Dropdown_Handler.prototype = {
    is_dropdown_showing : function(){
        return (this.dropdown.style.display === "block");
    },
    toggle : function(){
        var dropdown_is_showing = this.is_dropdown_showing();
        if(dropdown_is_showing){
            this.hide_dropdown();
        } else {
            this.show_dropdown();
        }
    },
    show_dropdown : function(){
        this.button.querySelector(".dropdown_more").style.display = "none"; // hide "+" if showing
        this.button.querySelector(".dropdown_close").style.display = "block"; // show "x" if showing
        this.dropdown.style.display="block"; // show the dropdown contents
    },
    hide_dropdown : function(){
        this.button.querySelector(".dropdown_more").style.display = "block"; // show "+" if hiding
        this.button.querySelector(".dropdown_close").style.display = "none"; // hide "x" if hiding
        this.dropdown.style.display="none"; // hide the dropdown contents
    },
    update : function(){
        // check how many children the dropdown has now. update is called when this changes.
        // if zero children exist, remove dropdown from parent.
        var child_count = this.dropdown.children.length;
        if(child_count == 0){
            this.dropdown.remove(); // remove dropdown element
            this.button.style.display = "none"; // hide the dropdown button
            this.arrow.style.display = "none"; // hide the dropdown arrow
        }
    }
}

module.exports = Dropdown_Handler;
