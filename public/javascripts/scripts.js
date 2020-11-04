$(".delete").click(function() {

	var id = $(this).attr("data-id");
	var name = $(this).attr("data-name");
	if (confirm("Are you sure you want to delete: " + name)) {
		deleteTodo(id);
	}
});


$("#logout").click(function(e) {
	e.preventDefault();

	$.ajax({
		type: 'get',
		url: '/logout',
		success: function(response) {
			location.href = "/";
		},
		error: function(err) {
			console.log(err)
		},
	});
})


function deleteTodo(id) {
	$.ajax({
		type: 'get',
		url: '/delete/' + id,
		success: function(response) {
			alert(response);
			
		},
		error: function(err) {
			console.log(err)
		},
	});
}