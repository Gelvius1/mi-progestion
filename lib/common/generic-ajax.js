function genericAjax(direction, callback, complete, error, ...columnas) {
  let parameters = [];

  for (let columna of columnas) {
    parameters.push(columna);
  }

  var jsonStringify = JSON.stringify(parameters);

  $.ajax({
    method: 'POST',
    dataType: "json",
    url: direction,
    data: { values: jsonStringify },
    success: callback != null ? callback : function(response) {},
    complete: complete != null ? complete : function(response) {},
    error: error != null ? error : function(error) {
      console.error(error);
    }
  });
}
