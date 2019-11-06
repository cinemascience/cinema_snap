export function dropped(item, cls, viewUpdater, selectedViews) {
	console.log("DETECTED A DROP!");
	var type = item.type
	console.log(type);
	console.log(cls);
	
	//Shallow copy the current selectedViews object
	console.log("OLD Object");
	console.log(selectedViews);
	let newView = Object.assign({}, selectedViews);
	newView[cls] = type;
	console.log("New Object");
	console.log(newView);
	viewUpdater(newView);
}
