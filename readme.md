# clientside-view-responsive-header

This module utilizes the [clientside-require] and [clientside-view-loader] modules (found on NPM) to make it easy to create a stylish and responsive header.

The header expects a structured JSON object to be passed to it, from which it will build the header. The dom that the module produces automatically listens for the window to resize and updates how many elements can be displayed or must be put in the "menu" dropdown based on the window size.

### short example

the following JSON:
```
{
    "left" : [],
    "right" : [
        {
            "title" : "Blog",
            "src" : "/path/to/blog.html"
        },
        {
            "html" : "<b>Login</b>",
            "src" : "/path/to/loginpage.html"
        },
        {
            "html" : "<img src = '/path/to/cart_icon.png'> Cart",
            "src" : "/path/to/cart.html"
        }
    ]
}
```  
creates this result:

### more examples
please see the `demo` directory for more examples and usage documentation
