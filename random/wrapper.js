/*
Ad Specific WRAPPER - V2.7.2- (package 12351 - https://scdn.pchassets.com/SpectrumMedia/PresentationPackage/12351/2/adUnitSpecificWrapper/js/adSpecificWrapper.js)
OCT 2019-Jan 2021, Markm/VAD 

**Dev Note**
*1/12/22 - Notification.Subscribes have been updated / Mutation Observer to see if the GID was changed after everything(line 191) - VAD
*9/20/21 - commenting out the "window.isConsideredOutOfStock(currOffer) && currOffer.Inventory <= '0'" check as per Carla.... VAD
*8/20/21 - Desktop / No show More like this update - VAD / Spectrum Team 
*7/7/21 addition - Dev Mode post variable has been added - VAD
*5/27 notes - more descriptive consoles have been added - VAD
*5/20 notes - code to remove spaces from the GID - VAD
*5/18 notes - code to see if the product is in stock being tested - VAD
*4/29 notes - adding Notifications.SubscribeActive so that this launches on tab load, not when the page loads..... - VAD
*4/1 notes - Changing image path to look for paths. Creative will have to follow the naming conventions default.gif / m_default.gif
*3/24 notes - Changing this to create groups of tab wrappers... Also if OPS leaves a group id blank, it'll skip and go to the next one...
*2/25 notes - Make this unique so that it can run multiple instances at the same time.
*2021.06.14 - lazy load added to the image tag - VAD/MM

This device takes in 3 attributes. Group ID, Background Color, & Image URL. 
You can put in one or multiple. Just put in a comma delimited list. 
If you put in multiple please make the number of items per attribute match. 
If you put in one image URL, it will display that image for all of the product GID's listed.

Spectrum Location:
Devices > Content > OPS > adUnitSpecificWrapper

it expects 3 inputs from ops:
Group ID (Comma Delimited if multiple)
Background Color 
Product Image URL 

**Dev Note**

*/
// console.log("Ad Specific WRAPPER JS")
$(document).ready(function() {
	//get the default image to size the container properly
	//When the device is presented set it up
	
	//TO DO ("move mobile to tab loop")
	// Notifications.SubscribeActive('onafter-mpload', function(){
	// 	console.log("MpLoad Tab Changed....")
	// 	window.setTimeout(initAdSpecificWrapper,2222);
	// })

	Notifications.SubscribeActive('on-multipage-tab-changed',function(){
		//ACTIVE SUBS - FOR FIRST TAB AND INITAL PAGE LOAD STUFF
		console.log("MpLoad Tab Changed....")
		window.setTimeout(initAdSpecificWrapper,2222);
	})

	Notifications.Subscribe('on-multipage-tab-changed',function(){
		console.log("MpLoad Tab Changed....")
		window.setTimeout(initAdSpecificWrapper,2222);
	})
});

var timeout_initAdSpecificWrapper;
var doOnlyOnce=0;
function initAdSpecificWrapper(){

	if(typeof timeout_initAdSpecificWrapper !== "undefined"){   
		clearTimeout(timeout_initAdSpecificWrapper);
	}

	if(doOnlyOnce==0){
		if($("#adSpecWrapper").length){
			doOnlyOnce++;
			_packageGetUserType().done( function( strUserType ) {
				_packageGetSegment().done( function( strSegment ) {
					// console.log("FOUND!")
					setAdSpecificWrapper(strUserType,strSegment);
					
				}).fail( function( error ) {
					console.log("FAIL ERR DEFAULT!")
					setAdSpecificWrapper(strUserType, "");
				});
			}).fail( function( error ) {
				console.log("FAIL ERR 2 DEFAULT!")
				//console.log( "rejected " + error );
				setAdSpecificWrapper("","");
			});
		}else{
			console.log("tabWrapper Try again!")
			//try again
			timeout_initAdSpecificWrapper = window.setTimeout(initAdSpecificWrapper,111);
		}
	}
}

/*
setAdSpecificWrapper
gets the Buyertype, segment-code, or default 
and will assign the IMG the URL-ROOT, file TYPE and file Name (Buyertype, segment-code, or default )
*/

var tabWrapperBackgroundColor, tabWrapperImgSrc;
// var tabWrapperImgSrc = new Array();
var parentTab, productElementId, currProdEleId, ASW_productSource, currTab, imgRoot, imgType, ASW_productGID, TWMobSet,lastChar, removeMobileTab;
//How many groups setup in the XML?
var wrapperGroupNumber = 10;

function setAdSpecificWrapper(inUserType, inSeg){

	//FIND ALL THE TABS, APPLY TO ALL THE TABS WE FIND SETTINGS FOR
	//arrTwTabs = MultipageFactory.tabContentIds.split(",")
	//console.log("TW TABSSSS",arrTwTabs)

	for(var wrapperCounter=0;wrapperCounter<wrapperGroupNumber;wrapperCounter++){	
		//Get the product Group ID array from the XML...
		ASW_productGID = window.SpectrumPackageFacade.GetContentVariables('#adSpecWrapper', 'Product Group '+(wrapperCounter+1)+' ID');
		ASW_productGID = ASW_productGID["prodGID"+(wrapperCounter+1)]
		ASW_productGID = ASW_productGID.replace(/ /g, '')
		ASW_productGID = ASW_productGID.split(",")
		

		// Image type will now drive wether the tab wrapper shows or not. Choosing the option of "NA" will hide the tab wrapper for that tab.
		imgType = window.SpectrumPackageFacade.GetContentVariables('#adSpecWrapper', 'Group' + (wrapperCounter+1)+' Image Type');		
		imgType = imgType["prodImgType" + (wrapperCounter+1)]	
		// console.log("prodImgType", (wrapperCounter+1), imgType)

		//Declare device type variable. This will change the name of the tab wrapper image is it's on a mobile page.
		var strDeviceType="";
		var devMode = getURLValue('devMode');

		if(ASW_productSource = "spectrum"){
			// console.log("This is a spectrum product..")

			//Every GID Group will get it's own Bkgrnd Clr, and Bkgrnd Image.
			for(var GID_i=0;GID_i<ASW_productGID.length;GID_i++){
				//console.log("Ad Group#"+(wrapperCounter+1)+" |GID length:"+ASW_productGID.length)  //Inventory Stats...						

				//Get the Product image URL
				imgRoot = window.SpectrumPackageFacade.GetContentVariables('#adSpecWrapper', 'Group '+(wrapperCounter+1)+' Image Url');
				imgRoot = imgRoot["prodImgRoot"+(wrapperCounter+1)];
				// imgRoot = imgRoot.split(",");

				// Get the Background Color from the XML.
				tabWrapperBackgroundColor = window.SpectrumPackageFacade.GetContentVariables('#adSpecWrapper', 'Group '+(wrapperCounter+1)+' Background color');
				tabWrapperBackgroundColor = tabWrapperBackgroundColor["BkgrndClr"+(wrapperCounter+1)]
				// tabWrapperBackgroundColor = tabWrapperBackgroundColor.split(",")
				// console.log(tabWrapperBackgroundColor)

				//Is this ProdID empty? if not, then proceed, if so, skip everything...
				if(ASW_productGID[GID_i] !== ''){

					parentTab = document.querySelectorAll("div[data-groupid='"+ASW_productGID[GID_i]+"']");
					// Mobile or not
					if(document.querySelectorAll(".adSpecMobile").length){
						productElementId = document.querySelectorAll("div[data-groupid='"+ASW_productGID[GID_i]+"'].mainAdWrap");
					}else{
						productElementId = document.querySelectorAll("div[data-groupid='"+ASW_productGID[GID_i]+"'] .mainAdWrap");
						//Work with SMLT Off....
                        if (!productElementId || !productElementId.length || productElementId.length <= 0)
                            productElementId = document.querySelectorAll("div[data-groupid='"+ASW_productGID[GID_i]+"'].mainAdWrap");

					}
					
					// console.log('ProdEleID:',productElementId)
					if(productElementId.length>0){
						// console.log("Prod Ele ID here")
						currProdEleId = productElementId[0].getAttribute('productelementid');

						//apply adSpecWrapped class to the parent tab.....
						parentTab[0].classList.add("adSpecWrapped");

						// If mobile, prepend image name with m_...
						if(document.querySelectorAll(".adSpecMobile").length){
							strDeviceType="m_";	
						}

						// If mobile, prepend image name with m_...
						// if(document.querySelectorAll(".adSpecMobile").length){
						// 	strDeviceType="m_";					
						// 	var twImgSrc_lastSlash = imgRoot.lastIndexOf('/');
						// 	var imgName = imgRoot.substring(twImgSrc_lastSlash + 1);
						// 	// var imgName = 'default.gif';
						// 	var imgUrl = imgRoot.replace(imgName,"")
						// 		imgRoot = imgUrl+strDeviceType+imgName;								
						// }

						
						var productForAdWrapper = ProductAdminService.findProductElementByElementId(currProdEleId);
						var currOffer = productForAdWrapper.OfferGroup.Offers[0];
						var adGroupCheck = document.getElementById('adgroup_'+ASW_productGID[GID_i]);

						//Dev Mode - &devMode=1	
						if(devMode === '1'){
							// var parentElement = document.querySelectorAll("div[data-groupid='"+ASW_productGID[GID_i]+"']");
							var parentElement = document.querySelectorAll("div[data-groupid='"+ASW_productGID[GID_i]+"'] div.Header");
							var gidSelectorDiv = document.getElementById(parentElement[0].id);

							console.log("-----------------------------------------------------------------------------")
							console.log("ParentElement:"+parentTab[0].id)  //Position Info...						
							console.log("Ad Group#"+(wrapperCounter+1)+" |GID:"+ASW_productGID[GID_i]+"|ElementID:"+currProdEleId)  //Position Info...						
							console.log("Stock Status: "+window.isConsideredOutOfStock(currOffer)+"|Inventory: "+currOffer.Inventory)  //Inventory Stats...						
							console.log("Wrapper Image src:"+imgRoot)  //Wrapper Img...																				
							if(adGroupCheck==null){
								console.log(parentTab[0].classList+" - Product Out of Stock - Wrapper Removed...")	//wrapperRemoval...
							}

// Mutation Observer to see if the GID was changed after everything...	
								// Options for the observer (which mutations to observe)
								const config = { attributes: true, childList: true, subtree: true };

								// Callback function to execute when mutations are observed
								const adSpecWrap_callback = function(mutationsList, observer) {
									// Use traditional 'for loops' for IE 11
									for(const mutation of mutationsList) {
										console.log(mutation);
										// if (mutation.type === 'childList') {										
										// 	console.log(' - A child node has been added or removed.');
										// }
										// else if (mutation.type === 'attributes') {
										// 	console.log('The ' + mutation.attributeName + ' attribute was modified.');
										// }
										if (mutation.type === 'attributes') {
											console.log('The ' + mutation.attributeName + ' attribute was modified in '+mutation.target.attributes.id+' - remove Ad wrapper');
											// parentTab[0].classList.remove("adSpecWrapped");
										}
									}
								};

								// Create an observer instance linked to the callback function
								const observer = new MutationObserver(adSpecWrap_callback);

								// Start observing the target node for configured mutations
								observer.observe(gidSelectorDiv, config);															
// Mutation Observer to see if the GID was changed after everything...							
						}
							
	
						// If product in not in stock... remove the ad wrapper class....
						if(adGroupCheck==null){
							// && !window.isConsideredOutOfStock(currOffer) && currOffer.Inventory <= '0'
							// console.log(parentTab[0].classList+" Product Out of Stock")
							parentTab[0].classList.remove("adSpecWrapped");
						}else{
							// if(window.isConsideredOutOfStock(currOffer) && currOffer.Inventory <= '0'){
							// 	// console.log("Product Out of Stock")
							// 	parentTab[0].classList.remove("adSpecWrapped");
							// }else{
								// console.log("Product In Stock")

								//Create Img Tag, Assign an ID, Classname, & Src
								var imgTag = document.createElement('img');						
									imgTag.id = "adSpecWrapper_"+ASW_productGID[GID_i];
									imgTag.className = 'adSpecWrapperImg';
									imgTag.src = imgRoot+strDeviceType+"default"+imgType;  
									imgTag.setAttribute('loading','lazy')
									// console.log('GID:',ASW_productGID[GID_i],'imgTag:',imgTag,'Bkgrnd Clr:',tabWrapperBackgroundColor);
								
								// Check to see if Image Exists...
								var imageResult = AdSpecificWrapper_imageExist(imgTag.src);

								//if image doesn't exist don't create the adWrapper, remove the ad wrapper class....
								if(imageResult){									
									// Prepend it
									parentTab[0].insertBefore(imgTag, parentTab[0].firstChild);								
									// Apply the background color to the Tab Wrapper
									parentTab[0].style.backgroundColor = tabWrapperBackgroundColor;
								}else{
									console.log("Image doesn't exist: "+imgRoot)
									parentTab[0].classList.remove("adSpecWrapped");
								}
							// }							
						}						
					}
					// else{
					// 	console.log("Prod Ele ID Not here");
					// }
					
				}
				// else{
				// 	console.log("This prod ID is empty...");
				// }
			}
		}else{
			console.log("This is a fusion product.. No decisions have been made on what we should do here yet....")
		}
	}
	// console.log("TW TAB",99)
}

function AdSpecificWrapper_imageExist(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;

}

function adUnitSpec_RecursiveCheck(){
	//Fresh recursive check to see if adgroup div exists....
	for(recurseCtr=0; recurseCtr<ASW_productGID.length; recurseCtr++){ 
		console.log("GID:"+ASW_productGID[recurseCtr]+" | "+!!document.getElementById("adgroup_"+ASW_productGID[recurseCtr])) 
	}

	setTimeout(adUnitSpec_RecursiveCheck, 2500)
}
