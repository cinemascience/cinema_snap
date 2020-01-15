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
		xyTraces: [],
		pv_traces: [],
		lt_traces: [],
		con_traces: [],
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

	// new stuff as a test to see if pre-loading will fix data display issue
	const xy_promise = new Promise((resolve, reject) => {
		var xy_files = [];
		var xy_traces = [];
		for (const line in this.state.csvData) {
			xy_files.push(this.state.csvData[line]["FILE_spectra_path"])
		}
		for (const file in xy_files){
			var path = xy_files[file]
			Papa.parse("http://" + this.state.connectAddress + "/" + path, {
				download: true,
				complete: function(results) {
					var x_array = []
					var y_array = []
					for (const line in results["data"]) {
						var point = results["data"][line][0]
						var components = point.split("  ");
						x_array.push(Number(components[0]));
						y_array.push(Number(components[1]));
					}
					var trace = {x: x_array, y: y_array, type: 'scatter'}
					xy_traces.push(trace);
				}
			});
		}
		if(Array.isArray(xy_traces) && xy_traces.length){
			resolve(xy_traces);
		}
	});

	let currentComponent = this;
	
	xy_promise.then(function(value) {
		currentComponent.setState({
			xyTraces : value
		});
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
		    		xyTraces={this.state.xyTraces}
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
function ParallelCoordinateView(props) {
	var chi = []
	var chi_increment = []
	var count_cutoff = []
	var detector_distance = []
	var exposure_period = []
	var exposure_time = []
	var number_of_oscillations = []
	var phi = []
	var phi_increment = []
	var start_angle = []
	var tau = []
	var threshold_setting = []
	var wavelength = []
	for (const point in props.csvData){
		chi.push(props.csvData[point][" Chi"])
		chi_increment.push(props.csvData[point][" Chi increment"])
		count_cutoff.push(props.csvData[point][" Count cutoff"])
		detector_distance.push(props.csvData[point][" Detector Distance"])
		exposure_period.push(props.csvData[point][" Exposure period"])
		number_of_oscillations.push(props.csvData[point][" Number of Oscillations"])
		phi.push(props.csvData[point][" Phi"])
		phi_increment.push(props.csvData[point][" Phi increment"])
		start_angle.push(props.csvData[point][" Start Angle"])
		tau.push(props.csvData[point][" Tau"])
		threshold_setting.push(props.csvData[point][" Threshold setting"])
		wavelength.push(props.csvData[point][" Wavelength"])
	}

	let chi_max = Math.max(chi.map(Number))
	let chi_min = Math.min(chi.map(Number))

	var trace = {
		type: 'parcoords',
		line: {
			color: 'blue'
		},

		dimensions: [{
			label: "Chi",
			values: chi
		},
		{
			label: "Chi Increment",
			values: chi_increment
		},
		{
			label: "Detector Distance",
			values: detector_distance
		},
		{
			label: "Exposure Period",
			values: exposure_period
		},
		{
			label: "Exposure Time",
			values: exposure_time
		},
		{
			label: "Number of Oscillations",
			values: number_of_oscillations
		},
		{
			label: "Phi",
			values: phi
		},
		{
			label: "Phi Increment",
			values: phi_increment
		},
		{
			label: "Tau",
			values: tau
		},
		{
			label: "Threshold",
			values: threshold_setting
		},
		{
			label: "Wavelength",
			values: wavelength
		},
		
		]
	};

	return (
		<div className="ParallelCoordinate">
			<Plot
				data={[trace]}
				layout={ {title: 'Parallel Coordinate Plot',
						autosize: true,
						margin: {l: 50, r: 50, b: 30, t: 80, pad: 4},
						y: 0
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
		    			xyTraces={props.xyTraces}
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
		    		xyTraces={props.xyTraces}
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
