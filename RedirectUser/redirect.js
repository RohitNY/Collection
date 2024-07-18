setTimeout(function () {
  const urlParams = new URLSearchParams(location.search);
  if (!urlParams) return;
  if (!urlParams.has("rdt")) return;
  const url = decodeURI(urlParams.get("rdt"));
  const redirect = new Redirect(10);
  redirect.render();
  redirect.triggerRedirect(url);
}, 500);
