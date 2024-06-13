import URI from "urijs"

// /records endpoint
window.path = "http://localhost:3000/records";


function getFullURI(colors, page, itemsPerPage) {

  let offset = Math.max(page - 1, 0) * itemsPerPage;

  let fullURI = URI(window.path)
    // fetching itemsPerPage + 1 bc we want to know if there are results beyond these 10 requested
    .addSearch("limit", itemsPerPage + 1)
    .addSearch("offset", offset)

  if (colors) {
    for (let color of colors) {
      fullURI = URI(fullURI).addSearch("color[]", color)
    }
  }
  //console.log('full uri: '+ fullURI)
  
  return fullURI;
}


function isPrimaryColor(color) {
  const PRIMARY_COLORS = ["red", "blue", "yellow"]
  return PRIMARY_COLORS.includes(color)
}


// Your retrieve function plus any additional functions go here ...
async function retrieve({colors = [], page = 1} = {}) {

  const ITEMS_PER_PAGE = 10
  let newRequest = getFullURI(colors, page, ITEMS_PER_PAGE)
  // console.log(' page', page)
  // console.log('colors: ', colors)

  return fetch(newRequest)
    .then((response) => {
      // console.log('response: ', response)
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((responseJSON) => {
      //console.log("tenth response", responseJSON[10] +" length "+ responseJSON.length);
      let hasNextPage = responseJSON.length > 10
      //console.log('has next page: ' + hasNextPage);
      // now we can trim the results to the length we want 
      responseJSON.length = Math.min(ITEMS_PER_PAGE, responseJSON.length)


      let recordsObject = {
        previousPage: page - 1 ? page - 1 : null,
        nextPage: hasNextPage ? (page + 1) : null,
        ids: responseJSON.map((item) => item.id),
        open: responseJSON
          .filter((item) => item.disposition == "open")
          .map((item) =>
            Object.assign(item, { isPrimary: isPrimaryColor(item.color) })
          ),
        closedPrimaryCount: responseJSON.filter(
          (item) => item.disposition == "closed" && isPrimaryColor(item.color)
        ).length,
      }

      //console.log(JSON.stringify(recordsObject, null, 4));

      return recordsObject
    })

    // try {
    //   const response = await fetch(newRequest) 
    //   return response;
    // }
    // catch (error) {
    //   console.error("new errrorr")
    // }

}

export default retrieve;
