$(document).ready(function() {
    var articleContainer = $("#articles");

    initPage();

    function initPage() {
        // Empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.getJSON("/articles", function(data) {
            // For each one
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    // Display the apropos information on the page
                    $("#articles").append("<p data-id='" + data[i]._id + "'> " + data[i].title + " <br />" + data[i].link +
                        "<br> <a class='btn btn-danger delete'>Delete From Saved</a> <a class='btn btn-info notes'>Notes</a> <a class='btn btn-danger Navigate'>Goto Article</a><hr>");
                }
            } else {
                // Otherwise render a message explaing we have no articles
                alert("No Article. Press Scrape Button.");
            }
        });
    }


    // Grab the articles as a json
    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append("<p data-id='" + data[i]._id + "'> " + data[i].title + " <br />" + data[i].link +
                "<br> <a class='btn btn-danger delete'>Delete From Saved</a> <a class='btn btn-info notes'>Notes</a> <a class='btn btn-danger Navigate'>Goto Article</a><hr>");
        }
    });


    // Whenever someone clicks a p tag
    $(document).on("click", ".btn.Navigate", function() {

        var articleToDelete = $(this).parents().data();

        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + articleToDelete.id
            })
            // With that done, add the note information to the page
            .done(function(data) {
                console.log(data.link);
                window.location.href = data.link;
            });
    });


    // When you click the savenote button
    $(document).on("click", "#savenote", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
            // With that done
            .done(function(data) {
                // Log the response
                console.log(data.notes);
                // Empty the notes section
                //  $("#notes").empty();
                $("#notes").prepend("Note id: " + data.notes + "<br>");
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });


    $(document).on("click", ".btn.delete", ArticleDelete);

    function ArticleDelete() {

        var articleToDelete = $(this).parents().data();
        console.log($(this).parents(".p"));

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete.id
        }).then(function(data) {
            // If this works out, run initPage again which will rerender our list of saved articles
            initPage();
        });
    }


    $(document).on("click", ".btn.notes", showNotes);

    function showNotes() {
        // Empty the notes from the note section
        $("#notes").empty();
        var articleToDelete = $(this).parents().data();
        $.ajax({
                method: "GET",
                url: "/notes/" + articleToDelete.id
            })
            // With that done, add the note information to the page
            .done(function(data) {
                console.log(data.notes);

                $("#notes").prepend("Note id: " + data.notes + "<br>");

            });


        var articleToDelete = $(this).parents().data();
        $.ajax({
                method: "GET",
                url: "/articles/" + articleToDelete.id
            })
            // With that done, add the note information to the page
            .done(function(data) {
                console.log(data);
                // The title of the article
                $("#notes").append(data.title);
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });


    }
});