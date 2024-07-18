(function (win) {

    var CONFIG = {
      groupNumbersToInsertAfter: [2],
      desktopImageUrl: "http://media.qa.pchassets.com/SpectrumMedia/UploadedAssets/100892-desktop-ContestBanner_22-04-21_FromMockup_Desktop.png",
      // To use the same image in Desktop and Mobile: set `mobileImageUrl` to "" (empty string)
      mobileImageUrl: "http://media.qa.pchassets.com/SpectrumMedia/UploadedAssets/100892-mobile-ContestBanner_22-04-21_FromMockup_Mobile.png",
      // To hide the header: set `headerMessage` to "" (empty string)
      headerMessage: "",
      classes: {
        affiliateGroups: "group-container",
        container: "contest-promotion-container",
        header: "contest-promotion-header",
        imageContainer: "contest-promotion-image-container",
        image: "contest-promotion-image",
      },
    };
  
    console.warn("Initializing Dynamic Script for Affiliate-Device Contest-Promotion Images.");
  
    win.Notifications.Subscribe("on-affiliate-device-ready", function (sender, args) {
      try {
        renderContestPromotions(CONFIG);
      } catch (err) {
        win.SpectrumUtils.ConsoleError("Failed to render contest promotional image after group: " + CONFIG.groupNumbersToInsertAfter, err);
      }
    });
  
    function renderContestPromotions(config) {
      var allGroups = $(`.${config.classes.affiliateGroups}`);
  
      config.groupNumbersToInsertAfter.forEach(function (groupNumber) {
        renderContestPromotionElement(groupNumber, config, allGroups);
      });
    }
  
    function renderContestPromotionElement(groupNumber, config, allGroups) {
      var groupElementToInsertAfter = allGroups[groupNumber - 1];
  
      var shouldHideHeader = !config.headerMessage;
  
      var imageUrl = 
        config.mobileImageUrl && window.spectrumDeviceType && window.spectrumDeviceType.toLocaleLowerCase() === "mobile"
          ? config.mobileImageUrl
          : config.desktopImageUrl;
  
      var markup = getMarkup(imageUrl, config.headerMessage, config.classes.container, config.classes.header, config.classes.imageContainer, config.classes.image, shouldHideHeader);
  
      $(groupElementToInsertAfter).after(markup);
    }
  
    function getMarkup(imageUrl, message, containerClass, headerClass, imageContainerClass, imageClass, shouldHideHeader) {
      return `
        <style>
          .${containerClass} {
            font-family: Helvetica, sans-serif;
          }
  
          .${headerClass} {
            background-color: black;
            color: white;
            font-size: 1.5em;
            font-weight: bold;
            text-align: center;
          }
  
          .${imageContainerClass} {
            width: 100%;
            text-align: center;
          }
  
          .${imageClass} {
            width: 100%;
          }
        </style>
  
        <div class="${containerClass}">
          <div class="${headerClass}" "${shouldHideHeader ? 'hidden' : ''}">
            ${message}
          </div>
          <div class="${imageContainerClass}">
            <img class="${imageClass}" src="${imageUrl}" />
          </div>
        </div>
      `;
    }
  }(window));
  