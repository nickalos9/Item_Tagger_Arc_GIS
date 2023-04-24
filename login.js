require([
  "esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager",
  "dojo/dom-style", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/_base/array", "esri/request"] , 
  function (arcgisPortal, OAuthInfo, esriId,
  domStyle, domAttr, dom, on, arrayUtils, esriRequest) {
  var info = new OAuthInfo({
    appId: "sqDjy8KbXCCicMFF",
    popup: false,
    flowType: "authorization-code",
  });
  esriId.registerOAuthInfos([info]);
  esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
    function (){
      displayItems();
    }
  ).otherwise(
    function (){
      // Anonymous view
      domStyle.set("anonymousPanel", "display", "block");
      domStyle.set("personalizedPanel", "display", "none");
      
    }
  );

  on(dom.byId("sign-in"), "click", function (){
    console.log("click", arguments);
    // user will be shown the OAuth Sign In page
    esriId.getCredential(info.portalUrl + "/sharing", {
        oAuthPopupConfirmation: false
      }
    ).then(function (){
        displayItems();
      });
  });

  on(dom.byId("sign-out"), "click", function (){
    esriId.destroyCredentials();
    window.location.reload();
  });
  document.getElementById("submit").addEventListener("click", addTag);

  function displayItems(){
    new arcgisPortal.Portal(info.portalUrl).signIn().then(
      function (portalUser){
        console.log("Signed in to the portal: ", portalUser);

        domAttr.set("userId", "innerHTML", portalUser.username);
        domStyle.set("anonymousPanel", "display", "none");
        domStyle.set("personalizedPanel", "display", "block");

        queryPortal(portalUser);
      }
    ).otherwise(
      function (error){
        console.log("Error occurred while signing in: ", error);
      }
    );
  }

  function queryPortal(portalUser){
    var portal = portalUser.portal;
    var queryParams = {
      q: "owner:" + portalUser.username,
      sortField: "numViews",
      sortOrder: "desc",
      num: 20
    };

    portal.queryItems(queryParams).then(createGallery).then(updateItemSelector);
    
  }

  function createGallery(items){
    var htmlFragment = "";

    arrayUtils.forEach(items.results, function (item){
      htmlFragment += (
      "<div class=\"esri-item-container\">" +
      (
        item.thumbnailUrl ?
        "<div class=\"esri-image\" style=\"background-image:url(" + item.thumbnailUrl + ");\"></div>" :
          "<div class=\"esri-image esri-null-image\">Thumbnail not available</div>"
      ) +
      (
        item.title ?
        "<div class=\"esri-title\">" + (item.title || "") + "</div>" :
          "<div class=\"esri-title esri-null-title\">Title not available</div>"
      ) +
      "</div>"
      );
    });
    dom.byId("itemGallery").innerHTML = htmlFragment;
  }
  function updateItemSelector(){
    // Get all items in the gallery
    var items = document.getElementsByClassName("esri-title");
    
    // Clear the item selector
    document.getElementById("itemSelector").innerHTML = "";
    
    // Add each item in the gallery to the item selector
    for(var i = 0; i < items.length; i++){
      document.getElementById("itemSelector").innerHTML += "<option value='item" + (i+1) + "'>" + items[i].innerHTML + "</option>";
    }
  }

    // Query the portal for the specified item
function addTag(portalUser){
var item_id = document.getElementsByClassName("esri-title");
//var jsonData = JSON.stringify(tagData, portalUser);
var url = portalUser.arcgisPortal + "/sharing/rest/content/users/" + portalUser.username + "/items/" + item_id + "/update";
var tags = esriRequest({
  url: url,
  content: {f: "json"},
  form: url
})
.then(function(){
  console.log(tags);
});

}

}
);

/* var itemTitle = document.getElementById("itemSelector").options[document.getElementById("itemSelector").selectedIndex].text;
  var tag = document.getElementById("tagInput").value;
  var url = info.portalUrl + "/sharing/rest/content/users/" + portalUser.username + "/items/" + itemTitle + "/update";
  console.log(url, tag, itemTitle);*/ 
  /*esriRequest({
    id: itemTitle,
    owner: portalUser.username,
    tags: tag,
    authentication: portalUser.credential
  }).then(function(response){
    console.log(response);
  }
  );
  
  function addTag(portalUser){
var tag = document.getElementById("tagInput").value;
var url = info.portalUrl + "/sharing/rest/content/users/" + portalUser.username + "/items/" + portalUser.items + "/update";
var thisPortal = new arcgisPortal.Portal(url);
thisPortal.signIn().then(function (loggedInUser) {

    var theToken = loggedInUser.credential.token;
    loggedInUser.getItem(item.title).then(function(theItem) {
         var tagsCsv = '';
         for (var i = 0; i < theItem.tags.length; i++) {

             tagsCsv = tagsCsv + theItem.tags + ',';
         }

         var updateUrl = '{portalUrl}sharing/rest/content/users/{userId}/items/{itemId}/update';
         updateUrl = updateUrl.replace('{portalUrl}',url);
         updateUrl = updateUrl.replace('{userId}',loggedInUser.username);
         updateUrl = updateUrl.replace('{itemId}', theItem.id);
         xhr.post(updateUrl, {

            data: {

                tags: tagsCsv,
                clearEmptyFields: 'true',
                id: theItem.id,
                f: 'json',

                token: theToken

            }

         }
         ).then(function(){
             console.log("Success!");
    });
});
});
}
  
  
  
  
  
  
  
  
  
  
  
  
  
  */