// Helper function for reducers involving any text search of cached tables

export default function searchArray( searchString, searchArray, searchType ) {
  // validate and modify the input for easier searching algo, but it means
  // must also limit the character types in records in sql as well?
  let trimmed = searchString.trim().split("").filter(element, index, array => {
    // if there is a space and have not reached the end of the string
    if(element === " " && index < array.length - 1){
      // If there is no adjacent space ' ' as well
      if(array[index + 1] !== " "){
        return element
      }
    }// otherwise the character is fine
    else{
      return element
    }
  }).join("")
  if(trimmed === ""){
    return []
  }
  function includesTLC(bigString, littleString){
    return bigString.toLowerCase().includes(littleString.toLowerCase())
  }
  // Now that the string has been trimmed, a switch case based on the searchType
  switch(searchType) {
    case "contactName":
      // determine the number of words in the validated search input string
      let results = []
      let isMoreThanOneWord = trimmed.split(" ").length > 1 ? true : false;
      if(isMoreThanOneWord){
        // this particular search has spaces between words, i.e. "Johnny Mnemonic"
        let namesArray = trimmed.split(" ");
        // cross reference all words with all first and last names in the cache
        for(let contact = 0; contact < searchArray.length; contact++){
          // this particular record in the cache
          for(let name = 0; name < namesArray.length; name++){
            // this particular name in the search string provided
            if(includesTLC(searchArray[contact].first_name, namesArray[name])){4
              if(includesTLC(searchArray[contact].last_name, namesArray[name])){
                // both last_name and first_name in this record matches one of the names given
                results.push(contact)
              }else{
                // just the first_name in this record matches one of the names given
                results.push(contact)
              }
            }else if(includesTLC(searchArray[contact].last_name, namesArray[name])){
              // just the last_name in this record matches one of the names 
                results.push(contact)
            }
          }
        }
        return results.filter((element, index, array) => {
          if(index < array.length - 1){
            if(array[index] !== array[index + 1]){
              return element
            }
          }
        })
      }
      break;
      case "contactCompany":
          
      break;
      case "contactLocation":
          
      break;
      case "contactPriority":
          
      break;
      default:
        // return that the search is no good
  }
}