(function (window) {
    class Redirect {
      constructor(count) {
        this.count = count || 5;
      }
  
      render() {
        const mainTemplate = $("script#redirectModalTemplate");
        const main = mainTemplate.render({"count": this.count });
        $("body").append(main);
      }
  
      triggerRedirect(url) {
        let that = this;  
        const x = setInterval(function () {
          document.getElementById("seconds").innerHTML = that.count--;
          if (that.count < 0) {
            clearInterval(x);
            window.location.assign(url);
          }
        }, 1000);
      }
    }
  // setTimeout(function(){
  //   const redirect = new Redirect(9);
  //   redirect.render();
  //   redirect.triggerRedirect("https://www.pch.com")
  // },3000);
    
  })(window);