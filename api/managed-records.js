import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function getFullURI(options) {

  // todo - test page is 0, test page is 200
  const ITEMS_PER_PAGE = 10;
  let offset = Math.max((options["page"] - 1) * ITEMS_PER_PAGE , 0);

  let fullURI = URI(window.path)
    .addSearch("limit", ITEMS_PER_PAGE)
    .addSearch("offset", offset);

  // todo test random color strings
  const PERMITTED_COLORS = ["red", "brown", "blue", "yellow", "green"];
  for (color of options["colors"]) {
    PERMITTED_COLORS.includes(color) ? 
      fullURI = URI(fullURI).addSearch("color[]", color) : 
      Log("you requested a color that isn't in the database!");
  };

  console.log("new test request",fullURI);
  return fullURI;
}


// Your retrieve function plus any additional functions go here ...
function retrieve(options = {page: 1, colors: []}) {

  let requestURI = getFullURI(options);
  console.log('request uri', requestURI);

  fetch(requestURI)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseJSON) => {
      console.log('response Json', responseJSON);
    });
}

export default retrieve;
