(function(window){
    let popup = document.getElementById("myModal");
    //popup.modal('show');
    const container = document.createElement("div");
    container.classList.add("modal-container");

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("modal-content");
    container.appendChild(contentContainer);
})(window);

$(window).load(function(){        
    $('#myModal').modal('show');
     }); 