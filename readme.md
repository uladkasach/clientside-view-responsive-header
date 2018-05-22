# clientside-view-responsive-header

This module utilizes the [clientside-require] and [clientside-view-loader] modules (found on NPM) to make it easy to create a stylish and responsive header.

The header expects a structured JSON object to be passed to it, from which it will build the header. The dom that the module produces automatically listens for the window to resize and updates how many elements can be displayed or must be put in the "menu" dropdown based on the window size.

## visual demo
![clientside-view-responsive-header_demo](https://user-images.githubusercontent.com/10381896/40132891-0fcd49d0-590c-11e8-9dfd-7a46f65e5739.gif)

### short example
the following JSON:
```
{
    "left" : [
        {
            "description" : "go to home page",
            "html" : "<img height='40px' src = '/path/to/logo.png'>",
            "src" : "/path/to/home.html"
        }
    ],
    "right" : [
        {
            "title" : "Blog",
            "src" : "/path/to/blog.html"
        },
        {
            "html" : "<b>Login</b>",
            "src" : "/path/to/loginpage.html"
        }
    ]
}

```  
creates this result:
![screenshot_2018-05-16_13-38-24](https://user-images.githubusercontent.com/10381896/40133676-703cd4fa-590e-11e8-9571-a81ed00d314d.png)


### more examples
please see the `demo` directory for more examples and usage documentation

# Additional Functionality
Each element is provided with a `clean_remove()` function. By retreiving the DOM node of a `.header_element`, you can remove the element from the header dynamically with the `clean_remove()` function. The `clean_remove()` function will automatically consider the amount of children in a dropdown and remove the dropdown if required.

For example:

```
    document.querySelector(".header_element#identifier_for_target_element").clean_remove();
```
