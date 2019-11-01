import React from 'react';
import { DndProvider } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
import logo from './logo.svg';
import './App.css';


function App() {
  return (
	    <div className="App">
	  	{/* DndProvider specifies what backend the drag and drop code should use*/}
		<DndProvider backend={HTML5Backend}>
		  <ParallelCoordinateView />
		  <GridSelector />
		  <DataViewGrid />
		  <GridTemplateButton />
		</DndProvider>
	    </div>
  );
}

{/* The Parallel Coordinate Chart */}
function ParallelCoordinateView() {
	return (
		<div className="ParallelCoordinate">
		ParallelCoordinate
		</div> 
	);
}

{/* The data view selector box */} 
function GridSelector() {
	return (
		<div className="GridSelector">
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		<DataView />
		</div>
	);
}

{/* Drop down button to select different templates */}
function GridTemplateButton() {
	return (
		<div className="TemplateButton">
		TemplateButton
		</div>
	);
}


function DataViewGrid() {
	return (
		<div className="DataViewGrid">
		<GridQuads/>
		</div>
	);
}

function DataView() {
	const [{ isDragging }, drag] = useDrag({
		item: { type: ItemTypes.DATAVIEW },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	})
	return (
		<div className="DataView"
		ref={drag}
		style={{
			opacity: isDragging ? 0.5 : 1,
		}}
		>
		DataView
		</div>
	);
}

function DropView(props) {
	
	const [{ isOver }, drop] = useDrop({
		accept: ItemTypes.DATAVIEW,
		drop: () => dropped(),
		collect: monitor => ({
			isOver: !!monitor.isOver()
		}),
	})

	return (
	<div
	ref={drop}
	style={{
		backgroundColor: isOver ? "green" : "cyan",
	}}
	className={props.cls}
	>

	</div>
	);
	
}

function GridOneAndTwo() {
	return (
		<div className="OneAndTwo">
			<div className="one"></div>
			<div className="two"></div>
			<div className="three"></div>
		</div>
	);
}

function GridOneAndOneHorizontal() {
	return (
		<div className="OneAndOneHorizontal">
			<div className="one"></div>
			<div className="two"></div>
		</div>
	);
}

function GridOneAndOneVertical() {
	return (
		<div className="OneAndOneVertical">
			<div className="one"></div>
			<div className="two"></div>
		</div>
	);
}

function GridQuads() {
	return (
		<div className="Quads">
			<DropView cls="one"></DropView>
			<DropView cls="two"></DropView>
			<DropView cls="three"></DropView>
			<DropView cls="four"></DropView>
		</div>
	);
}

export default App;
