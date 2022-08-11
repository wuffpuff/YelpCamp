/*--------------------an EJS tool for Layouts-----------------------------

When we build a multiple pages website we will include scripts and style 
sheets and assets on every single page. If you want a Navbar on every page
you'd have to duplicate Navbar code on every page. But it is time repetitive 
and time consuming.

Instead make a reusable piece of code. There is a package called EJS-Mate
It allows you to add in some useful pieces of functionality to EJS including
'layout'.

'Layout' allows you to define some boilerplate where you can have code that
you insert in between some content. What you've seen before was 'partials'
that you save some piece of code, footer for example, in file and reuse it 
in every other pages you want. But the problem with 'partials' is that you
have to define all the pieces, header, body, footer separately and integrate
them into a page one by one. 

However, with EJS-mate you create a one standard boilerplate such as header and 
footer but you leave off the body part to dynamically insert different 'body'
parts of other pages.

How it works:
npm install ejs-mate;
const ejsMate - require('ejs-mate');
app.engine('ejs', ejsMate);

create boilerplate.ejs  - you don't have to name it 'boilerplate'

Syntax might look like this below:
basic boiler plate for every single page

boilerplate.ejs
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boilerplate</title>
</head>

<body>
    <h1>Before</h1>
    <%-body %>
        <!--everything that is to be passed to 'boilerplate' is passed as 'body', it is inserted here-->
        <h1>After</h1>
</body>

</html>

index.ejs
<%layout("layouts/boilerplate") %>     //WARNING!!! if auto formatOnSave is on, path gets broken
    <h1>All Campgrounds</h1>
    <div>
        <a href="/campgrounds/new">Add Campground</a>
    </div>
    <ul>
        <% for (let campground of campgrounds) {%>
            <li>
                <a href="/campgrounds/<%=campground.id %> ">
                    <%=campground.title %>
                </a>
            </li>
            <% } %>
    </ul>


*/