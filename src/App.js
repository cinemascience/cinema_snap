import React from 'react';
import { DndProvider } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
		selectedData : null, 
		selectedViews : {}
	};

	//Bind the "this" context to the handler functions
	this.updateSelectedViews = this.updateSelectedViews.bind(this);
	this.updateSelectedData = this.updateSelectedData.bind(this);
  }

  updateSelectedViews(views) {
	this.setState({
		selectedViews : views
	});
  }

  updateSelectedData(data) {
  	this.setState({
		selectedData : data
	});
  }

  render () {
	    return ( 
	    <div className="App">
	  	{/* DndProvider specifies what backend the drag and drop code should use*/}
		<DndProvider backend={HTML5Backend}>
		  <ParallelCoordinateView />
		  <GridSelector />
		  <DataViewGrid viewUpdater={this.updateSelectedViews} selectedViews={this.state.selectedViews}/>
		  <GridTemplateButton />
		</DndProvider>
	    </div>
	    );
  };
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
		<DataView type="parallelCoordinate" name="Parallel Coordinates"/>
		<DataView type="xyGraph" name="Intensity VS Angle"/>
		<DataView type="image" name="XRD Image"/>
		<DataView type="pvChart" name="Pressure VS Volume"/>
		<DataView type="latticeVSTime" name="Lattice VS Time"/>
		<DataView type="contourDiagram" name="Contour Diagram"/>
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


function DataViewGrid(props) {
	return (
		<div className="DataViewGrid">
		<GridQuads selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}/>
		</div>
	);
}

function DataView(props) {
	const [{ isDragging }, drag] = useDrag({
		item: { type: props.type },
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
		{props.name}
		</div>
	);
}

function DropView(props) {
	
	const [{ isOver }, drop] = useDrop({
		accept: [ItemTypes.PARALLELCOORD, 
			ItemTypes.XYGRAPH,
			ItemTypes.IMAGE,
			ItemTypes.PVCHART,
			ItemTypes.LATTICEVSTIME,
			ItemTypes.CONTOURDIAGRAM],
		drop: item => dropped(item, props.cls, props.viewUpdater, props.selectedViews),
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

function GridOneAndTwo(props) {
	return (
		<div className="OneAndTwo">
			<DropView cls="one" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="three" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridOneAndOneHorizontal(props) {
	return (
		<div className="OneAndOneHorizontal">
			<DropView cls="one"></DropView>
			<DropView cls="two"></DropView>
		</div>
	);
}

function GridOneAndOneVertical(props) {
	return (
		<div className="OneAndOneVertical">
			<DropView cls="one"></DropView>
			<DropView cls="two"></DropView>
		</div>
	);
}

function GridQuads(props) {
	return (
		<div className="Quads">
			<DropView cls="one" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="three" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="four" selectedViews={props.selectedViews} viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

export default App;
