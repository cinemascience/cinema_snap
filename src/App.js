import React from 'react';
import { DndProvider } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { dropped } from './DropLogic'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FileReader from './FileReader';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import DropView from './DropView.js';
import './App.css';


class App extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
		selectedData : 1, 
		selectedViews : {},
		selectedLayout : undefined,
		csvData: undefined,
		connectAddress: undefined,
		dataRevision: 0,
	};

	//Bind the "this" context to the handler functions
	this.updateSelectedViews = this.updateSelectedViews.bind(this);
	this.updateSelectedData = this.updateSelectedData.bind(this);
	this.updateSelectedCSV = this.updateSelectedCSV.bind(this);
	this.updateAddress = this.updateAddress.bind(this);
	this.updateSelectedLayout = this.updateSelectedLayout.bind(this);
	this.connectToAddress = this.connectToAddress.bind(this);
  }

  //Handler function for the currently selected views
  updateSelectedViews(views) {
	this.setState({
		selectedViews : views,
		dataRevision : this.state.dataRevision + 1
	});
  }

  //Handler function for the currently selected data point
  updateSelectedData(data) {
  	this.setState({
		selectedData : data
	});
  }


  //Handler function for the currently selected Layout
  updateSelectedLayout(event) {
  	this.setState({
		selectedLayout : event.target.name
	});
  }

  //Handler function for the currently selected data.csv file
  updateSelectedCSV(result) {
	this.setState({
		csvData : result.data
	});
  }

  //Handler function for the currently selected address
  updateAddress(event) {
	this.setState({
		connectAddress : event.target.value,
	});
  }

  //Callback to activate the connection
  connectToAddress(event) {
	Papa.parse("http://" + this.state.connectAddress + "/data.csv", {
		download: true,
		header: true,
		complete: this.updateSelectedCSV
	});
	
  }

  //This is the primary rendering function for the entire app, everything else cascades from here.
  render () {
	    return ( 
	    <div className="App">
	  	{/* DndProvider specifies what backend the drag and drop code should use*/}
		<DndProvider backend={HTML5Backend}>
		  <ParallelCoordinateView csvData={this.state.csvData}/>
	          <div class="Address">
		    <InputGroup className="mb-3">
	    		<Form.Control size="sm" type="text" placeholder="Enter Database Serving Address"
		    		onChange={this.updateAddress}/>
		    	<InputGroup.Append>
			    <Button variant="primary" size="sm" type="button" onClick={this.connectToAddress}>
				Connect
			    </Button>
		        </InputGroup.Append>
		    </InputGroup>
	         </div>

		  <GridSelector />
		  <DataViewGrid viewUpdater={this.updateSelectedViews}
		    		selectedViews={this.state.selectedViews}
		    		csvData={this.state.csvData}
		    		selectedLayout={this.state.selectedLayout}
		    		connectAddress={this.state.connectAddress}
		    		dataRevision={this.state.dataRevision}
		    		selectedData={this.state.selectedData}/>
		  <GridTemplateButton layoutUpdater={this.updateSelectedLayout}/>
		</DndProvider>
	    </div>
	    );
  };
}

{/* The Parallel Coordinate Chart */}
function ParallelCoordinateView() {
	var trace = {
		type: 'parcords',
		line: {
			color: 'blue'
		},

		dimensions: []
	}
	return (
		<div className="ParallelCoordinate">
			<Plot
				data={{}}
				layout={ {title: 'Parallel Coordinate Plot',
						autosize: true,
						margin: {l: 50, r: 50, b: 50, t: 70, pad: 4}		
				} }
				useResizeHandler={true}
				style={ {height:"100%",width:"100%"} }
			/>
		</div> 
	);
}

{/* The data view selector box */} 
function GridSelector() {
	return (
		<div className="GridSelector">
		<DataView type="xyGraph" name="Intensity VS Angle"/>
		<DataView type="image" name="XRD Image"/>
		<DataView type="pvChart" name="Pressure VS Volume"/>
		<DataView type="latticeVSTime" name="Lattice VS Time"/>
		<DataView type="contourDiagram" name="Contour Diagram"/>
		</div>
	);
}

{/* Drop down button to select different templates */}
function GridTemplateButton(props) {
	return (
		<DropdownButton id="dropdown-basic-button" title="View Selector" size="sm">
  			<Dropdown.Item name="One and Two" onClick={props.layoutUpdater}>One and Two</Dropdown.Item>
  			<Dropdown.Item name="One and One Horizontal" onClick={props.layoutUpdater}>One and One Horizontal</Dropdown.Item>
  			<Dropdown.Item name="One and One Vertical" onClick={props.layoutUpdater}>One and One Vertical</Dropdown.Item>
  			<Dropdown.Item name="Quads" onClick={props.layoutUpdater}>Quads</Dropdown.Item>
		</DropdownButton>
	);
}


function DataViewGrid(props) {
	switch(props.selectedLayout) {
		case 'One and Two':
			return (
				<div className="DataViewGrid">
				<GridOneAndTwo 
					selectedViews={props.selectedViews} 
					viewUpdater={props.viewUpdater} 
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
		case 'One and One Horizontal':
			return (
				<div className="DataViewGrid">
				<GridOneAndOneHorizontal
					selectedViews={props.selectedViews} 
					viewUpdater={props.viewUpdater} 
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
		case 'One and One Vertical':
			return (
				<div className="DataViewGrid">
				<GridOneAndOneVertical
					selectedViews={props.selectedViews} 
					viewUpdater={props.viewUpdater} 
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
		case 'Quads':
		default:
			return (
				<div className="DataViewGrid">
				<GridQuads 
					selectedViews={props.selectedViews} 
					viewUpdater={props.viewUpdater} 
					selectedData={props.selectedData}
					connectAddress={props.connectAddress}
		    			dataRevision={props.dataRevision}
					csvData={props.csvData}/>
				</div>
			);
	}
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

function GridOneAndTwo(props) {
	return (
		<div className="OneAndTwo">
			<DropView cls="one" 
				selectedViews={props.selectedViews}
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="three" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridOneAndOneHorizontal(props) {
	return (
		<div className="OneAndOneHorizontal">
			<DropView cls="one" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
		    		dataRevision={props.dataRevision}
				connectAddress={props.connectAddress}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
		    		dataRevision={props.dataRevision}
				connectAddress={props.connectAddress}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridOneAndOneVertical(props) {
	return (
		<div className="OneAndOneVertical">
			<DropView cls="one" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
		    		dataRevision={props.dataRevision}
				connectAddress={props.connectAddress}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

function GridQuads(props) {
	return (
		<div className="Quads">
			<DropView cls="one" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="two" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="three" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
			<DropView cls="four" 
				selectedViews={props.selectedViews} 
				csvData={props.csvData}
				selectedData={props.selectedData}
				connectAddress={props.connectAddress}
		    		dataRevision={props.dataRevision}
				viewUpdater={props.viewUpdater}></DropView>
		</div>
	);
}

export default App;
