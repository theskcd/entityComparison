var stderr = require('system').stderr;

function out(data) {
    stderr.write(JSON.stringify(data));
}

var page = require('webpage').create();

page.open("https://www.ncbi.nlm.nih.gov/taxonomy", function(status) {
    if (status === "success") {
        console.log("page opened");
        page.evaluate(function() {
            document.querySelector("#term").value = "Lion";
            document.querySelector("#search").submit();
            console.log("Search triggered");
        });
    }
    phantom.exit();
});
