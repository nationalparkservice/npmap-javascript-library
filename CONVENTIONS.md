<div class="alert-box" style="margin-bottom:15px;">
    These coding conventions are a work-in-progress, and should be considered "DRAFT."
</div>

Most of these coding conventions are taken from others, including:

- [http://javascript.crockford.com/code.html](http://javascript.crockford.com/code.html)
- [http://code.google.com/p/google-maps-utility-library-v3/wiki/JSCodingConventions](http://code.google.com/p/google-maps-utility-library-v3/wiki/JSCodingConventions)

## Files

- JavaScript files should be stored in and delivered as .js files

## Language rules

- Variable declarations must start with <code>var</code>
- All variable declarations should be the first statements in a function body
- The use of global variables should be avoided
- If global variables are absolutely necessary, they should be added to the <code>NPMap</code> namespace
- All JavaScript expressions must end with a semi-colon
- When a function is to be invoked immediately, the entire invocation expression should be wrapped in parens so that it is clear that the value being produced is the result of the function and not the function itself (see [Example 1](#example-one) below)

## Style rules

### Naming conventions

<ul>
  <li>
    Case: <code>functionNamesLikeThis</code>, <code>variableNamesLikeThis</code>, <code>ClassNamesLikeThis</code>, and <code>CONSTANTS_LIKE_THIS</code>
  </li>
  <li>
    Be as descriptive as possible
  </li>
  <li>
    Private variables or functions should begin with underscores (_privateFunction, _privateVariable)
  </li>
  <li>
    Optional arguments should start with opt_
  </li>
</ul>

### Strings

- Use single quotes, not double ('i am a string')

### Formatting

- Do not use tabs anywhere. Use 2 spaces indent for each level of scope
- Wrapped lines should be indented 4 spaces

### Comments

- Should follow [JSDoc](http://code.google.com/p/jsdoc-toolkit/w/list) conventions
- Each function must be commented (purpose, @param, @return) - see Example 2 below
- Copyright, author, license, and short description of the file should be at the top of the code - see Example 3 below

### Examples

<span id="example-one">1</span>:
<pre><code>
var aString = (function() {
  return 'i am a string';  
});
</code></pre>

2:
<pre><code>
/**
 * A description of this function
 * @param {ClassOptions} [opts]
 * @return {String}
 */
</code></pre>

3:
<pre><code>
/**
 * @name NameOfClass
 * @version 1.1
 * @author Nate Irwin
 * @copyright (c) 2011 U.S. National Park Service
 * @fileoverview A description of this class.
 */

/*
 * The code license goes here.
 */
</code></pre>